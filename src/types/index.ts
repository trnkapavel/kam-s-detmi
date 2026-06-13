export type ActivityType =
  | "bazen"
  | "les"
  | "park"
  | "muzeum"
  | "zoo"
  | "hrad"
  | "aquapark"
  | "koupaliste"
  | "indoor"
  | "kino"
  | "sport"
  | "priroda"
  | "mesto";

export type Kraj = "Praha" | "Stredocesky";

export type WeatherTag = "any" | "sunny" | "rain_ok" | "indoor_only";
export type EnergyLevel = "low" | "medium" | "high";
export type Duration = "few_hours" | "half_day" | "full_day";
export type ConflictResolver = "overlap" | "sequential" | "compromise" | "rotation";

export type Activity = {
  id: string;
  name: string;
  description: string;
  region: {
    kraj: Kraj;
    okres: string;
    mesto: string;
  };
  tags: {
    type: ActivityType[];
    ageMin: number;
    ageMax: number;
    energyParent: EnergyLevel[];
    weather: WeatherTag[];
    duration: Duration;
  };
  conflictResolvers: ConflictResolver[];
  coordinates?: { lat: number; lng: number };
  url?: string;
};

export type ChildMood = "calm" | "active" | "cranky";
export type ParentEnergy = "tired" | "ok" | "energetic";
export type TimeAvailable = "few_hours" | "half_day" | "full_day";
export type WeatherCondition = "sunny" | "cloudy" | "rain" | "snow";

export type ChildInput = {
  age: number;
  wants: ActivityType[];
  mood: ChildMood;
};

export type CheckIn = {
  location: { mesto: string; kraj: Kraj };
  parent: {
    energy: ParentEnergy;
    timeAvailable: TimeAvailable;
  };
  children: ChildInput[];
  weather: {
    condition: WeatherCondition;
    temp: number;
    source: "api" | "manual";
  };
};

export type RecommendationType = ConflictResolver | "single";

export type Recommendation = {
  type: RecommendationType;
  activities: Activity[];
  reason: string;
  score: number;
};

export type ActivitiesFile = {
  meta: {
    kraj: string;
    version: string;
    updated: string;
    count: number;
  };
  activities: Activity[];
};

export type ScoredActivity = {
  activity: Activity;
  score: number;
};
