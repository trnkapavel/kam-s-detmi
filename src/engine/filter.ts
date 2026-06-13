import type { Activity, CheckIn } from "@/types";

function isAllowedInRain(activity: Activity): boolean {
  return (
    activity.tags.weather.includes("indoor_only") ||
    activity.tags.weather.includes("rain_ok")
  );
}

function fitsChildrenAges(activity: Activity, checkIn: CheckIn): boolean {
  return checkIn.children.every(
    (child) => child.age >= activity.tags.ageMin && child.age <= activity.tags.ageMax,
  );
}

export function filterActivities(activities: Activity[], checkIn: CheckIn): Activity[] {
  return activities.filter((activity) => {
    if (activity.region.kraj !== checkIn.location.kraj) {
      return false;
    }

    if (!fitsChildrenAges(activity, checkIn)) {
      return false;
    }

    if (checkIn.weather.condition === "rain" && !isAllowedInRain(activity)) {
      return false;
    }

    return true;
  });
}
