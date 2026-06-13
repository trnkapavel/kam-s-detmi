import type {
  Activity,
  ActivityType,
  CheckIn,
  ConflictResolver,
  Recommendation,
  ScoredActivity,
} from "@/types";
import { scoreActivity } from "./score";

const MAX_SEQUENTIAL_DISTANCE_KM = 15;

export function hasConflict(checkIn: CheckIn): boolean {
  const wants1 = new Set(checkIn.children[0].wants);
  const wants2 = new Set(checkIn.children[1].wants);
  return !checkIn.children[0].wants.some((want) => wants2.has(want));
}

function matchesWants(activity: Activity, wants: ActivityType[]): boolean {
  const types = new Set(activity.tags.type);
  return wants.some((want) => types.has(want));
}

function isOverlapActivity(activity: Activity, checkIn: CheckIn): boolean {
  const child1Match = matchesWants(activity, checkIn.children[0].wants);
  const child2Match = matchesWants(activity, checkIn.children[1].wants);
  return child1Match && child2Match;
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

  return {
    type: "overlap",
    activities: [candidate.activity],
    reason: `${candidate.activity.name} spojuje přání obou dětí v jednom výletu.`,
    score: candidate.score,
  };
}

function findSequential(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation | null {
  if (checkIn.parent.energy === "tired") {
    return null;
  }

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
    reason: `${candidate.activity.name} je rozumný kompromis, který částečně uspokojí obě děti.`,
    score: candidate.score,
  };
}

function findRotation(
  scored: ScoredActivity[],
  checkIn: CheckIn,
): Recommendation {
  const forChild1 = scored.find(({ activity }) =>
    matchesWants(activity, checkIn.children[0].wants),
  );
  const forChild2 = scored.find(({ activity }) =>
    matchesWants(activity, checkIn.children[1].wants),
  );

  const today = forChild1?.activity ?? scored[0]?.activity;
  const nextTime = forChild2?.activity ?? scored[1]?.activity ?? today;

  const activities = [today, nextTime].filter(
    (activity, index, arr) => activity && arr.indexOf(activity) === index,
  ) as Activity[];

  return {
    type: "rotation",
    activities,
    reason: `Rotace: dnes ${today?.name ?? "první volba"}, příště ${nextTime?.name ?? "druhá volba"}.`,
    score: (forChild1?.score ?? 0) + (forChild2?.score ?? 0),
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
  childIndex: 0 | 1,
): Activity | undefined {
  const wants = checkIn.children[childIndex].wants;
  return activities
    .map((activity) => ({ activity, score: scoreActivity(activity, checkIn) }))
    .filter(({ activity }) => matchesWants(activity, wants))
    .sort((a, b) => b.score - a.score)[0]?.activity;
}
