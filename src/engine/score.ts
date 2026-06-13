import type {
  Activity,
  CheckIn,
  EnergyLevel,
  ParentEnergy,
  ScoredActivity,
  TimeAvailable,
  WeatherCondition,
  WeatherTag,
} from "@/types";

const ENERGY_MAP: Record<ParentEnergy, EnergyLevel[]> = {
  tired: ["low"],
  ok: ["low", "medium"],
  energetic: ["medium", "high"],
};

const WEATHER_ALLOWED: Record<WeatherCondition, WeatherTag[]> = {
  sunny: ["any", "sunny", "rain_ok"],
  cloudy: ["any", "sunny", "rain_ok"],
  rain: ["indoor_only", "rain_ok"],
  snow: ["indoor_only", "any"],
};

const DURATION_COMPAT: Record<TimeAvailable, Set<TimeAvailable>> = {
  few_hours: new Set(["few_hours"]),
  half_day: new Set(["few_hours", "half_day"]),
  full_day: new Set(["few_hours", "half_day", "full_day"]),
};

function isWeatherCompatible(activity: Activity, condition: WeatherCondition): boolean {
  const allowed = WEATHER_ALLOWED[condition];
  return activity.tags.weather.some((tag) => allowed.includes(tag));
}

function isOutdoor(activity: Activity): boolean {
  return !activity.tags.weather.includes("indoor_only");
}

function matchesChildWants(activity: Activity, checkIn: CheckIn): boolean {
  const types = new Set(activity.tags.type);
  return checkIn.children.some((child) => child.wants.some((want) => types.has(want)));
}

export function scoreActivity(activity: Activity, checkIn: CheckIn): number {
  let score = 0;

  if (matchesChildWants(activity, checkIn)) {
    score += 30;
  }

  const agesOk = checkIn.children.every(
    (child) => child.age >= activity.tags.ageMin && child.age <= activity.tags.ageMax,
  );
  if (agesOk) {
    score += 20;
  }

  if (isWeatherCompatible(activity, checkIn.weather.condition)) {
    score += 20;
  }

  const preferredEnergy = ENERGY_MAP[checkIn.parent.energy];
  if (activity.tags.energyParent.some((level) => preferredEnergy.includes(level))) {
    score += 15;
  }

  if (DURATION_COMPAT[checkIn.parent.timeAvailable].has(activity.tags.duration)) {
    score += 15;
  }

  if (checkIn.weather.condition === "rain" && isOutdoor(activity)) {
    score -= 50;
  }

  if (checkIn.weather.condition === "snow" && isOutdoor(activity)) {
    score -= 20;
  }

  return score;
}

export function scoreActivities(activities: Activity[], checkIn: CheckIn): ScoredActivity[] {
  return activities
    .map((activity) => ({
      activity,
      score: scoreActivity(activity, checkIn),
    }))
    .sort((a, b) => b.score - a.score);
}
