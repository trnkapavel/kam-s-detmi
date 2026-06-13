import type {
  Activity,
  ActivityType,
  CheckIn,
  ConflictResolver,
  Recommendation,
  ScoredActivity,
} from "@/types";
import { getSharedWants } from "@/lib/children";
import { scoreActivity } from "./score";

const MAX_SEQUENTIAL_DISTANCE_KM = 15;

export function hasConflict(checkIn: CheckIn): boolean {
  if (checkIn.children.length <= 1) {
    return false;
  }
  return getSharedWants(checkIn.children).length === 0;
}

function matchesWants(activity: Activity, wants: ActivityType[]): boolean {
  const types = new Set(activity.tags.type);
  return wants.some((want) => types.has(want));
}

function isOverlapActivity(activity: Activity, checkIn: CheckIn): boolean {
  return checkIn.children.every((child) => matchesWants(activity, child.wants));
}

function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;

  return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

function findOverlap(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation | null {
  const candidate = scored.find(({ activity }) => isOverlapActivity(activity, checkIn));
  if (!candidate) {
    return null;
  }

  const childLabel =
    checkIn.children.length === 2
      ? "obou dětí"
      : `všech ${checkIn.children.length} dětí`;

  return {
    type: "overlap",
    activities: [candidate.activity],
    reason: `${candidate.activity.name} spojuje přání ${childLabel} v jednom výletu.`,
    score: candidate.score,
  };
}

function findSequentialPair(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation | null {
  const child1Activities = scored.filter(({ activity }) =>
    matchesWants(activity, checkIn.children[0].wants),
  );
  const child2Activities = scored.filter(({ activity }) =>
    matchesWants(activity, checkIn.children[1].wants),
  );

  let bestPair: { a: Activity; b: Activity; score: number } | null = null;

  for (const first of child1Activities) {
    for (const second of child2Activities) {
      if (first.activity.id === second.activity.id) {
        continue;
      }

      const coordsA = first.activity.coordinates;
      const coordsB = second.activity.coordinates;
      if (!coordsA || !coordsB) {
        continue;
      }

      const distance = haversineKm(coordsA, coordsB);
      if (distance > MAX_SEQUENTIAL_DISTANCE_KM) {
        continue;
      }

      const pairScore = first.score + second.score;
      if (!bestPair || pairScore > bestPair.score) {
        bestPair = {
          a: first.activity,
          b: second.activity,
          score: pairScore,
        };
      }
    }
  }

  if (!bestPair) {
    return null;
  }

  return {
    type: "sequential",
    activities: [bestPair.a, bestPair.b],
    reason: `Sekvenční plán: dopoledne ${bestPair.a.name}, odpoledne ${bestPair.b.name} (do ${MAX_SEQUENTIAL_DISTANCE_KM} km).`,
    score: bestPair.score,
  };
}

function findSequentialChain(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation | null {
  const chain: Activity[] = [];
  let lastCoords: { lat: number; lng: number } | null = null;
  let totalScore = 0;

  for (const child of checkIn.children) {
    const candidates = scored.filter(
      ({ activity }) =>
        matchesWants(activity, child.wants) && !chain.some((item) => item.id === activity.id),
    );

    let best: ScoredActivity | null = null;

    for (const candidate of candidates) {
      const coords = candidate.activity.coordinates;
      if (lastCoords && coords) {
        const distance = haversineKm(lastCoords, coords);
        if (distance > MAX_SEQUENTIAL_DISTANCE_KM) {
          continue;
        }
      }

      if (!best || candidate.score > best.score) {
        best = candidate;
      }
    }

    if (!best) {
      return null;
    }

    chain.push(best.activity);
    totalScore += best.score;
    lastCoords = best.activity.coordinates ?? lastCoords;
  }

  if (chain.length < 2) {
    return null;
  }

  const parts = chain.map((activity) => activity.name).join(" → ");

  return {
    type: "sequential",
    activities: chain,
    reason: `Sekvenční plán pro ${checkIn.children.length} dětí: ${parts}.`,
    score: totalScore,
  };
}

function findSequential(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation | null {
  if (checkIn.parent.energy === "tired" || checkIn.children.length < 2) {
    return null;
  }

  if (checkIn.children.length === 2) {
    return findSequentialPair(scored, checkIn);
  }

  return findSequentialChain(scored, checkIn);
}

function findCompromise(
  scored: ScoredActivity[],
): Recommendation | null {
  const candidate = scored.find(({ activity }) =>
    activity.conflictResolvers.includes("compromise"),
  );
  if (!candidate) {
    return null;
  }

  return {
    type: "compromise",
    activities: [candidate.activity],
    reason: `${candidate.activity.name} je rozumný kompromis, který částečně uspokojí všechny.`,
    score: candidate.score,
  };
}

function findRotation(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation {
  const picks = checkIn.children.map((child) =>
    scored.find(({ activity }) => matchesWants(activity, child.wants)),
  );

  const activities = picks
    .map((pick) => pick?.activity)
    .filter((activity, index, arr): activity is Activity => {
      return Boolean(activity && arr.indexOf(activity) === index);
    });

  const fallback = scored.slice(0, checkIn.children.length).map(({ activity }) => activity);
  const finalActivities = activities.length > 0 ? activities : fallback;

  const today = finalActivities[0];
  const nextTime = finalActivities[1] ?? finalActivities[0];

  return {
    type: "rotation",
    activities: finalActivities.slice(0, Math.max(2, Math.min(finalActivities.length, checkIn.children.length))),
    reason:
      checkIn.children.length === 2
        ? `Rotace: dnes ${today?.name ?? "první volba"}, příště ${nextTime?.name ?? "druhá volba"}.`
        : `Rotace: střídejte tipy podle přání — dnes ${today?.name ?? "první volba"}.`,
    score: picks.reduce((sum, pick) => sum + (pick?.score ?? 0), 0),
  };
}

function findSingleMatches(scored: ScoredActivity[]): Recommendation[] {
  return scored.slice(0, 5).map(({ activity, score }) => ({
    type: "single" as const,
    activities: [activity],
    reason: `${activity.name} sedí aktuální situaci a přáním dětí.`,
    score,
  }));
}

export function resolveConflict(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation[] {
  const resolvers: Array<(s: ScoredActivity[], c: CheckIn) => Recommendation | null> = [
    findOverlap,
    findSequential,
    () => findCompromise(scored),
  ];

  const results: Recommendation[] = [];
  const usedTypes = new Set<ConflictResolver | "single">();

  for (const resolver of resolvers) {
    const result = resolver(scored, checkIn);
    if (result && !usedTypes.has(result.type)) {
      results.push(result);
      usedTypes.add(result.type);
    }
  }

  const rotation = findRotation(scored, checkIn);
  if (!usedTypes.has("rotation")) {
    results.push(rotation);
    usedTypes.add("rotation");
  }

  return results.sort((a, b) => b.score - a.score).slice(0, 5);
}

export function buildRecommendations(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation[] {
  if (!hasConflict(checkIn)) {
    return findSingleMatches(scored);
  }

  return resolveConflict(scored, checkIn);
}

export function topActivityForChild(
  activities: Activity[],
  checkIn: CheckIn,
  childIndex: number,
): Activity | undefined {
  const child = checkIn.children[childIndex];
  if (!child) {
    return undefined;
  }

  return activities
    .map((activity) => ({ activity, score: scoreActivity(activity, checkIn) }))
    .filter(({ activity }) => matchesWants(activity, child.wants))
    .sort((a, b) => b.score - a.score)[0]?.activity;
}
