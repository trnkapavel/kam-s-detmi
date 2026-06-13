import type {
  ActivityType,
  ChildMood,
  ParentEnergy,
  TimeAvailable,
  WeatherCondition,
} from "@/types";
import { ACTIVITY_OPTIONS, ENERGY_OPTIONS, WEATHER_OPTIONS } from "./constants";
import { wantsToIntentSummary } from "./intents";

export function activityLabel(type: ActivityType): string {
  return ACTIVITY_OPTIONS.find((option) => option.value === type)?.label ?? type;
}

export function energyLabel(energy: ParentEnergy): string {
  return ENERGY_OPTIONS.find((option) => option.value === energy)?.label ?? energy;
}

export function weatherLabel(condition: WeatherCondition): string {
  return WEATHER_OPTIONS.find((option) => option.value === condition)?.label ?? condition;
}

export function timeLabel(time: TimeAvailable): string {
  const labels: Record<TimeAvailable, string> = {
    few_hours: "Pár hodin",
    half_day: "Půl dne",
    full_day: "Celý den",
  };
  return labels[time];
}

export function moodLabel(mood: ChildMood): string {
  const labels: Record<ChildMood, string> = {
    calm: "Klidné",
    active: "Aktivní",
    cranky: "Nervózní",
  };
  return labels[mood];
}

export function wantsSummary(wants: ActivityType[]): string {
  return wantsToIntentSummary(wants);
}
