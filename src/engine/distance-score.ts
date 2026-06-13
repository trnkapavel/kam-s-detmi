import { CITY_COORDS } from "@/lib/constants";
import type { Activity, CheckIn } from "@/types";
import { haversineKm } from "./geo";

export function distanceScoreAdjustment(activity: Activity, checkIn: CheckIn): number {
  if (!activity.coordinates) {
    return 0;
  }

  const origin = CITY_COORDS[checkIn.location.mesto];
  if (!origin) {
    return 0;
  }

  const km = haversineKm(origin, activity.coordinates);
  let adjustment = 0;

  if (km <= 10) {
    adjustment = 10;
  } else if (km <= 25) {
    adjustment = 5;
  } else if (km <= 50) {
    adjustment = -15;
  } else {
    adjustment = -30;
  }

  if (checkIn.parent.energy === "tired" && adjustment < 0) {
    adjustment = Math.round(adjustment * 1.5);
  }

  return adjustment;
}
