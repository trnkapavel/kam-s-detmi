import type { Activity } from "@/types";

export function isAppleDevice(): boolean {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function appleMapsLink(activity: Activity): string | null {
  if (!activity.coordinates) {
    return null;
  }

  const { lat, lng } = activity.coordinates;
  return `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(activity.name)}`;
}

export function googleMapsLink(activity: Activity, placeMapsUrl?: string): string {
  if (placeMapsUrl) {
    return placeMapsUrl;
  }

  if (activity.coordinates) {
    const { lat, lng } = activity.coordinates;
    return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${activity.name} ${activity.region.mesto}`)}`;
}

export function mapsLinkForActivity(activity: Activity, placeMapsUrl?: string): string {
  const appleLink = appleMapsLink(activity);
  if (isAppleDevice() && appleLink) {
    return appleLink;
  }

  return googleMapsLink(activity, placeMapsUrl);
}
