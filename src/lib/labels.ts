import type {
  ActivityType,
  ChildMood,
  Duration,
  ParentEnergy,
  TimeAvailable,
  WeatherCondition,
  WeatherTag,
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

export function durationLabel(duration: Duration): string {
  const labels: Record<Duration, string> = {
    few_hours: "Pár hodin",
    half_day: "Půl dne",
    full_day: "Celý den",
  };
  return labels[duration];
}

export function ageRangeLabel(min: number, max: number): string {
  if (max >= 99) {
    return `${min}+ let`;
  }
  return `${min}–${max} let`;
}

export function weatherFitLabel(tags: WeatherTag[]): string {
  if (tags.includes("indoor_only")) {
    return "Indoor";
  }
  if (tags.includes("rain_ok")) {
    return "I v dešti";
  }
  if (tags.includes("sunny")) {
    return "Nejlépe za hezka";
  }
  return "Celoročně";
}

export function formatReviewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(".0", "")} tis.`;
  }
  return String(count);
}
