import type { Activity, ScheduleSlot, TimeAvailable } from "@/types";

const SLOT_TEMPLATES: Record<
  TimeAvailable,
  Array<{ label: string; timeHint: string }>
> = {
  few_hours: [{ label: "Teď", timeHint: "nejbližší volno" }],
  half_day: [
    { label: "Dopoledne", timeHint: "9:00–12:00" },
    { label: "Odpoledne", timeHint: "13:00–16:00" },
  ],
  full_day: [
    { label: "Dopoledne", timeHint: "9:00–12:00" },
    { label: "Odpoledne", timeHint: "13:00–16:00" },
    { label: "Večer", timeHint: "17:00–19:00" },
  ],
};

export function buildSchedule(
  timeAvailable: TimeAvailable,
  activities: Activity[],
): ScheduleSlot[] {
  const templates = SLOT_TEMPLATES[timeAvailable];
  const count = Math.min(templates.length, activities.length);

  return templates.slice(0, count).map((template, index) => ({
    ...template,
    activityId: activities[index].id,
  }));
}
