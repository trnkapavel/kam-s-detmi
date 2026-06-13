import type { Activity, ActivityType, CheckIn, RecommendationType } from "@/types";
import { activityLabel } from "@/lib/labels";

function formatWants(wants: ActivityType[]): string {
  return wants.map(activityLabel).join(", ");
}

function childWantsLine(childIndex: number, wants: ActivityType[]): string {
  return `Dítě ${childIndex + 1}: ${formatWants(wants)}`;
}

function matchedWants(activity: Activity, wants: ActivityType[]): ActivityType[] {
  return wants.filter((want) => activity.tags.type.includes(want));
}

export function buildChildNotes(
  type: RecommendationType,
  activities: Activity[],
  checkIn: CheckIn,
): string[] {
  if (checkIn.children.length === 0) {
    return [];
  }

  if (type === "single") {
    const activity = activities[0];
    if (!activity) {
      return [];
    }

    return checkIn.children.map((child, index) => {
      const matched = matchedWants(activity, child.wants);
      const displayWants = matched.length > 0 ? matched : child.wants.slice(0, 1);
      return `${childWantsLine(index, displayWants)} ✓`;
    });
  }

  if (type === "overlap" || type === "compromise") {
    const activity = activities[0];
    if (!activity) {
      return [];
    }

    return checkIn.children.map((child, index) => {
      const matched = matchedWants(activity, child.wants);
      const displayWants = matched.length > 0 ? matched : child.wants.slice(0, 1);
      const suffix = matched.length > 0 ? " ✓" : " ~";
      return `${childWantsLine(index, displayWants)}${suffix}`;
    });
  }

  if (type === "sequential") {
    return checkIn.children.map((child, index) => {
      const activity = activities[index];
      const name = activity?.name ?? "tip";
      const wants = activity ? matchedWants(activity, child.wants) : child.wants.slice(0, 1);
      const wantsText = formatWants(wants.length > 0 ? wants : child.wants.slice(0, 1));
      return `Dítě ${index + 1} (${wantsText}) → ${name}`;
    });
  }

  if (type === "rotation") {
    const today = activities[0]?.name ?? "první volba";
    const next = activities[1]?.name ?? "druhá volba";

    if (checkIn.children.length === 2) {
      return [
        `Dnes: ${today} (priorita dítěte 1)`,
        `Příště: ${next} (priorita dítěte 2)`,
      ];
    }

    return [`Dnes: ${today}`, "Příště střídejte další tipy"];
  }

  return [];
}
