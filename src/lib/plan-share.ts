import type { Activity, CheckIn, Recommendation } from "@/types";
import { RECOMMENDATION_TYPE_LABELS } from "@/lib/constants";
import { copyTextToClipboard } from "@/lib/clipboard";
import { weatherLabel } from "@/lib/labels";
import { googleMapsLink } from "@/lib/maps-links";
import { buildSharedPlanUrl } from "@/lib/plan-share-link";

export type SharePlanPayload = {
  title: string;
  text: string;
  shortText: string;
  url: string;
};

export type SharePlanResult = "shared" | "copied" | "cancelled" | "failed";

export function canUseNativeShare(): boolean {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

function canShareData(data: ShareData): boolean {
  if (typeof navigator === "undefined" || !navigator.canShare) {
    return true;
  }

  try {
    return navigator.canShare(data);
  } catch {
    return false;
  }
}

export function buildShareAttempts(payload: SharePlanPayload): ShareData[] {
  return [
    { title: payload.title, url: payload.url },
    { title: payload.title, text: payload.shortText },
    { title: payload.title, text: payload.text },
    { text: payload.shortText },
    { url: payload.url },
  ];
}

function safeActivityName(activity: Activity | undefined): string {
  return activity?.name?.trim() || "Tip";
}

function formatActivityLines(activity: Activity): string[] {
  const lines = [safeActivityName(activity)];

  if (activity.place?.address) {
    lines.push(`📍 ${activity.place.address}`);
  }

  try {
    lines.push(`🗺 ${googleMapsLink(activity, activity.place?.mapsUrl)}`);
  } catch {
    lines.push("🗺 Mapy");
  }

  return lines;
}

function safeWeatherLine(checkIn: CheckIn): string {
  const condition = checkIn.weather?.condition;
  const temp = checkIn.weather?.temp;

  if (!condition) {
    return "Počasí neuvedeno";
  }

  if (typeof temp === "number") {
    return `${weatherLabel(condition)} (${temp} °C)`;
  }

  return weatherLabel(condition);
}

export function buildPlanShareText(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  appUrl: string;
}): string {
  const { checkIn, recommendations, appUrl } = options;
  const city = checkIn.location?.mesto?.trim() || "tvoje okolí";
  const lines = [`Kam s dětmi · ${city}`, safeWeatherLine(checkIn), ""];

  for (const recommendation of recommendations) {
    const label = RECOMMENDATION_TYPE_LABELS[recommendation.type] ?? recommendation.type;
    lines.push(`▸ ${label}`);

    if (Array.isArray(recommendation.childNotes)) {
      recommendation.childNotes.forEach((note) => {
        if (typeof note === "string" && note.trim()) {
          lines.push(`  ${note}`);
        }
      });
    }

    if (recommendation.schedule && recommendation.schedule.length > 0) {
      recommendation.schedule.forEach((slot, index) => {
        const activity = recommendation.activities.find((item) => item.id === slot.activityId);
        if (!activity) {
          return;
        }

        lines.push(`  ${index + 1}. ${slot.timeHint} · ${safeActivityName(activity)}`);
        try {
          lines.push(`     🗺 ${googleMapsLink(activity, activity.place?.mapsUrl)}`);
        } catch {
          lines.push("     🗺 Mapy");
        }
      });
    } else if (Array.isArray(recommendation.activities)) {
      recommendation.activities.forEach((activity) => {
        if (!activity) {
          return;
        }

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

export function buildPlanShareShortText(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  appUrl: string;
}): string {
  const city = options.checkIn.location?.mesto?.trim() || "tvoje okolí";
  const topNames = options.recommendations
    .flatMap((recommendation) => recommendation.activities.map((activity) => safeActivityName(activity)))
    .filter((name, index, names) => names.indexOf(name) === index)
    .slice(0, 3);

  const summary =
    topNames.length > 0 ? topNames.join(", ") : "tipy na výlet s dětmi";

  return [
    `Kam s dětmi · ${city}`,
    safeWeatherLine(options.checkIn),
    summary,
    "",
    "Otevři plán v aplikaci:",
    options.appUrl,
  ].join("\n");
}

export function buildPlanSharePayload(options: {
  checkIn: CheckIn;
  recommendations: Recommendation[];
  origin: string;
}): SharePlanPayload {
  const origin = options.origin?.trim() || "https://kam-s-detmi.vercel.app";
  const url = buildSharedPlanUrl(origin, options.checkIn);
  const text = buildPlanShareText({
    checkIn: options.checkIn,
    recommendations: options.recommendations,
    appUrl: url,
  });
  const shortText = buildPlanShareShortText({
    checkIn: options.checkIn,
    recommendations: options.recommendations,
    appUrl: url,
  });

  return {
    title: "Kam s dětmi — tipy na výlet",
    text,
    shortText,
    url,
  };
}

export async function sharePlan(payload: SharePlanPayload): Promise<SharePlanResult> {
  try {
    if (canUseNativeShare()) {
      for (const data of buildShareAttempts(payload)) {
        if (!canShareData(data)) {
          continue;
        }

        try {
          await navigator.share(data);
          return "shared";
        } catch (error) {
          if (error instanceof DOMException && error.name === "AbortError") {
            return "cancelled";
          }
        }
      }
    }

    if (await copyTextToClipboard(payload.text)) {
      return "copied";
    }

    return "failed";
  } catch {
    return "failed";
  }
}
