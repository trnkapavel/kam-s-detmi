import type { Activity, CheckIn, Recommendation } from "@/types";
import { RECOMMENDATION_TYPE_LABELS } from "@/lib/constants";
import { weatherLabel } from "@/lib/labels";
import { googleMapsLink } from "@/lib/maps-links";
import { buildSharedPlanUrl } from "@/lib/plan-share-link";

export type SharePlanPayload = {
  title: string;
  text: string;
  url: string;
};

export type SharePlanResult = "shared" | "copied" | "cancelled";

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function formatActivityLines(activity: Activity): string[] {
  const lines = [activity.name];

  if (activity.place?.address) {
    lines.push(`📍 ${activity.place.address}`);
  }

  lines.push(`🗺 ${googleMapsLink(activity, activity.place?.mapsUrl)}`);

  return lines;
}

export function buildPlanShareText(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  appUrl: string;
}): string {
  const { checkIn, recommendations, appUrl } = options;
  const lines = [
    `Kam s dětmi · ${checkIn.location.mesto}`,
    `${weatherLabel(checkIn.weather.condition)} (${checkIn.weather.temp} °C)`,
    "",
  ];

  for (const recommendation of recommendations) {
    const label = RECOMMENDATION_TYPE_LABELS[recommendation.type] ?? recommendation.type;
    lines.push(`▸ ${label}`);

    if (recommendation.childNotes && recommendation.childNotes.length > 0) {
      recommendation.childNotes.forEach((note) => lines.push(`  ${note}`));
    }

    if (recommendation.schedule && recommendation.schedule.length > 0) {
      recommendation.schedule.forEach((slot, index) => {
        const activity = recommendation.activities.find((item) => item.id === slot.activityId);
        if (!activity) {
          return;
        }

        lines.push(`  ${index + 1}. ${slot.timeHint} · ${activity.name}`);
        lines.push(`     🗺 ${googleMapsLink(activity, activity.place?.mapsUrl)}`);
      });
    } else {
      recommendation.activities.forEach((activity) => {
        formatActivityLines(activity).forEach((line) => lines.push(`  ${line}`));
      });
    }

    if (recommendation.reason) {
      lines.push(`  Proč: ${recommendation.reason}`);
    }

    lines.push("");
  }

  lines.push("→ Otevři plán v aplikaci:", appUrl);
  return lines.join("\n").trim();
}

export function buildPlanSharePayload(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  origin: string;
}): SharePlanPayload {
  const url = buildSharedPlanUrl(options.origin, options.checkIn);
  const text = buildPlanShareText({
    checkIn: options.checkIn,
    recommendations: options.recommendations,
    appUrl: url,
  });

  return {
    title: "Kam s dětmi — tipy na výlet",
    text,
    url,
  };
}

export async function sharePlan(payload: SharePlanPayload): Promise<SharePlanResult> {
  if (canUseNativeShare()) {
    try {
      await navigator.share({
        title: payload.title,
        text: payload.text,
        url: payload.url,
      });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
      throw error;
    }
  }

  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(payload.text);
    return "copied";
  }

  throw new Error("Sdílení není v tomto prohlížeči podporováno");
}
