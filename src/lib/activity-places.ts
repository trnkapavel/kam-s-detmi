import { readFileSync } from "fs";
import { join } from "path";
import type { Activity, ActivityPlace } from "@/types";

type PlaceSeed = Partial<Omit<ActivityPlace, "mapsUrl">> & {
  mapsUrl?: string;
};

const PLACES_PATH = join(process.cwd(), "data", "places", "places.json");

let placeSeeds: Record<string, PlaceSeed> | null = null;

function loadPlaceSeeds(): Record<string, PlaceSeed> {
  if (placeSeeds) {
    return placeSeeds;
  }
  try {
    const raw = readFileSync(PLACES_PATH, "utf-8");
    placeSeeds = JSON.parse(raw) as Record<string, PlaceSeed>;
    return placeSeeds;
  } catch {
    placeSeeds = {};
    return placeSeeds;
  }
}

export function isWikimediaUrl(url: string | undefined): url is string {
  return Boolean(url && url.includes("wikimedia.org"));
}

export function mapsUrlForActivity(activity: Activity): string {
  if (activity.coordinates) {
    const { lat, lng } = activity.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.name} ${activity.region.mesto}`)}`;
}

function imageDedupeKey(url: string): string {
  try {
    const decoded = decodeURIComponent(url);
    const file = decoded.match(/\/([^/?]+)(?:\?|$)/)?.[1] ?? decoded;
    return file.replace(/^\d+px-/, "");
  } catch {
    return url;
  }
}

function imageResolution(url: string): number {
  const match = url.match(/(\d+)px-/);
  return match ? Number.parseInt(match[1], 10) : 0;
}

export function dedupeImages(images: string[]): string[] {
  const byKey = new Map<string, string>();

  for (const image of images) {
    if (!isWikimediaUrl(image)) {
      continue;
    }
    const key = imageDedupeKey(image);
    const existing = byKey.get(key);
    if (!existing || imageResolution(image) > imageResolution(existing)) {
      byKey.set(key, image);
    }
  }

  return [...byKey.values()];
}

function defaultHighlights(activity: Activity): string[] {
  const highlights: string[] = [];
  if (activity.tags.weather.includes("indoor_only")) {
    highlights.push("Indoor");
  }
  if (activity.tags.weather.includes("rain_ok")) {
    highlights.push("OK i v dešti");
  }
  if (activity.tags.ageMin <= 3) {
    highlights.push("Vhodné pro malé děti");
  }
  if (activity.tags.energyParent.includes("low")) {
    highlights.push("Méně chození");
  }
  return highlights.slice(0, 4);
}

export function buildPlaceMeta(activity: Activity): ActivityPlace {
  const seed = loadPlaceSeeds()[activity.id] ?? {};
  const images = dedupeImages(
    (seed.images ?? []).filter(isWikimediaUrl).concat(
      seed.image && isWikimediaUrl(seed.image) ? [seed.image] : [],
    ),
  );
  const image = images[0] ?? "";

  return {
    image,
    images,
    rating: seed.rating ?? 4.4,
    reviewCount: seed.reviewCount ?? 320,
    address: seed.address ?? `${activity.region.mesto}`,
    priceHint: seed.priceHint ?? "Ceník na webu",
    openingHours: seed.openingHours ?? "Ověř aktuální otevírací dobu",
    highlights: seed.highlights?.length ? seed.highlights : defaultHighlights(activity),
    mapsUrl: seed.mapsUrl ?? mapsUrlForActivity(activity),
  };
}

export function enrichActivity(activity: Activity): Activity {
  return {
    ...activity,
    place: buildPlaceMeta(activity),
  };
}

export function enrichActivities(activities: Activity[]): Activity[] {
  return activities.map(enrichActivity);
}
