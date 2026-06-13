import type { Activity, ActivityType } from "@/types";

export function primaryActivityType(activity: Activity): ActivityType {
  return activity.tags.type[0] ?? "park";
}

export const ACTIVITY_HERO_BACKGROUNDS: Record<ActivityType, string> = {
  bazen: "bg-card-sky",
  aquapark: "bg-card-sky",
  koupaliste: "bg-card-sky",
  les: "bg-card-mint",
  park: "bg-card-mint",
  priroda: "bg-card-mint",
  zoo: "bg-card-peach",
  hrad: "bg-card-lavender",
  mesto: "bg-card-lavender",
  muzeum: "bg-card-cream",
  indoor: "bg-card-cream",
  kino: "bg-card-rose",
  sport: "bg-card-peach",
};
