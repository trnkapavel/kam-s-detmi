import type { ActivityType } from "@/types";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Building2,
  Heart,
  PawPrint,
  TreePine,
  Waves,
} from "lucide-react";

export type IntentType = "voda" | "pohyb" | "priroda" | "zvirata" | "klid" | "mesto";

export const MAX_FAMILY_INTENTS = 2;
export const MAX_SINGLE_CHILD_INTENTS = 2;
export const MAX_CUSTOM_INTENTS = 1;

export const INTENT_TO_ACTIVITIES: Record<IntentType, ActivityType[]> = {
  voda: ["bazen", "aquapark", "koupaliste"],
  pohyb: ["sport", "park"],
  priroda: ["les", "priroda", "park"],
  zvirata: ["zoo"],
  klid: ["muzeum", "indoor"],
  mesto: ["mesto", "muzeum", "hrad"],
};

export const INTENT_OPTIONS: { value: IntentType; label: string; hint: string }[] = [
  { value: "voda", label: "Voda", hint: "bazén, koupání" },
  { value: "pohyb", label: "Pohyb", hint: "sport, park" },
  { value: "priroda", label: "Příroda", hint: "les, venkov" },
  { value: "zvirata", label: "Zvířata", hint: "zoo" },
  { value: "klid", label: "Klid", hint: "muzeum, indoor" },
  { value: "mesto", label: "Město", hint: "centrum, hrad" },
];

export const INTENT_ICONS: Record<IntentType, LucideIcon> = {
  voda: Waves,
  pohyb: Activity,
  priroda: TreePine,
  zvirata: PawPrint,
  klid: Heart,
  mesto: Building2,
};

export function intentLabel(intent: IntentType): string {
  return INTENT_OPTIONS.find((option) => option.value === intent)?.label ?? intent;
}

export function intentsToWants(intents: IntentType[]): ActivityType[] {
  const wants = new Set<ActivityType>();
  for (const intent of intents) {
    for (const activity of INTENT_TO_ACTIVITIES[intent]) {
      wants.add(activity);
    }
  }
  return [...wants];
}

export function wantsToIntentSummary(wants: ActivityType[]): string {
  const matched = INTENT_OPTIONS.filter((option) =>
    INTENT_TO_ACTIVITIES[option.value].some((activity) => wants.includes(activity)),
  ).map((option) => option.label);

  if (matched.length > 0) {
    return matched.join(", ");
  }

  return wants.join(", ");
}

export function toggleIntent(
  intents: IntentType[],
  intent: IntentType,
  max: number,
): IntentType[] {
  if (intents.includes(intent)) {
    return intents.filter((item) => item !== intent);
  }
  if (intents.length >= max) {
    return intents;
  }
  return [...intents, intent];
}
