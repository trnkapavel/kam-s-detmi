import type {
  ActivityType,
  ChildMood,
  Kraj,
  ParentEnergy,
  TimeAvailable,
  WeatherCondition,
} from "@/types";

export const SESSION_KEY = "kam-s-detmi-check-in";

export const KRAJE: { value: Kraj; label: string }[] = [
  { value: "Praha", label: "Praha" },
  { value: "Stredocesky", label: "Střední Čechy" },
];

export const MESTA: Record<Kraj, string[]> = {
  Praha: ["Praha"],
  Stredocesky: [
    "Kladno",
    "Mladá Boleslav",
    "Benešov",
    "Beroun",
    "Kolín",
    "Mělník",
    "Příbram",
  ],
};

export const CITY_COORDS: Record<string, { lat: number; lng: number }> = {
  Praha: { lat: 50.0755, lng: 14.4378 },
  Kladno: { lat: 50.1475, lng: 14.1028 },
  "Mladá Boleslav": { lat: 50.4114, lng: 14.9032 },
  Benešov: { lat: 49.7816, lng: 14.6869 },
  Beroun: { lat: 49.9579, lng: 14.0722 },
  Kolín: { lat: 50.0274, lng: 15.2009 },
  Mělník: { lat: 50.3505, lng: 14.4743 },
  Příbram: { lat: 49.6899, lng: 14.0104 },
};

export const ACTIVITY_OPTIONS: { value: ActivityType; label: string; emoji: string }[] = [
  { value: "bazen", label: "Bazén", emoji: "🏊" },
  { value: "les", label: "Les", emoji: "🌲" },
  { value: "park", label: "Park", emoji: "🌳" },
  { value: "zoo", label: "Zoo", emoji: "🦁" },
  { value: "muzeum", label: "Muzeum", emoji: "🏛️" },
  { value: "hrad", label: "Hrad", emoji: "🏰" },
  { value: "sport", label: "Sport", emoji: "⚽" },
  { value: "mesto", label: "Město", emoji: "🏙️" },
  { value: "priroda", label: "Příroda", emoji: "🌿" },
];

export const ENERGY_OPTIONS: { value: ParentEnergy; label: string; emoji: string }[] = [
  { value: "tired", label: "Unavený", emoji: "😴" },
  { value: "ok", label: "OK", emoji: "😊" },
  { value: "energetic", label: "Plný energie", emoji: "⚡" },
];

export const TIME_OPTIONS: { value: TimeAvailable; label: string }[] = [
  { value: "few_hours", label: "Pár hodin" },
  { value: "half_day", label: "Půl dne" },
  { value: "full_day", label: "Celý den" },
];

export const MOOD_OPTIONS: { value: ChildMood; label: string; emoji: string }[] = [
  { value: "calm", label: "Klidné", emoji: "😌" },
  { value: "active", label: "Aktivní", emoji: "🤸" },
  { value: "cranky", label: "Nervózní", emoji: "😤" },
];

export const WEATHER_OPTIONS: {
  value: WeatherCondition;
  label: string;
  emoji: string;
}[] = [
  { value: "sunny", label: "Slunečno", emoji: "☀️" },
  { value: "cloudy", label: "Oblačno", emoji: "☁️" },
  { value: "rain", label: "Déšť", emoji: "🌧️" },
  { value: "snow", label: "Sníh", emoji: "❄️" },
];

export const RECOMMENDATION_TYPE_LABELS: Record<string, string> = {
  single: "Doporučení",
  overlap: "Společně",
  sequential: "Sekvenčně",
  compromise: "Kompromis",
  rotation: "Rotace",
};

export const MAX_WANTS = 3;
export const MAX_WANTS_MULTI_CHILD = 2;
export const MAX_CHILDREN = 4;
export const MIN_CHILDREN = 1;
export const AGE_MIN = 1;
export const AGE_MAX = 17;
export const QUICK_AGE_CHIPS = [3, 5, 7, 10, 13] as const;
export const WIZARD_STEPS = 4;
