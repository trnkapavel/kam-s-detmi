import { describe, expect, it } from "vitest";
import { buildSchedule } from "@/engine/schedule";
import type { Activity } from "@/types";

function activity(id: string): Activity {
  return {
    id,
    name: id,
    description: "",
    region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
    tags: {
      type: ["park"],
      ageMin: 0,
      ageMax: 17,
      energyParent: ["low", "medium", "high"],
      weather: ["any"],
      duration: "half_day",
    },
    conflictResolvers: ["overlap"],
  };
}

describe("buildSchedule", () => {
  it("returns one slot for few_hours", () => {
    const slots = buildSchedule("few_hours", [activity("a"), activity("b")]);

    expect(slots).toHaveLength(1);
    expect(slots[0].activityId).toBe("a");
    expect(slots[0].label).toBe("Teď");
    expect(slots[0].timeHint).toBeTruthy();
  });

  it("returns two slots for half_day with two activities", () => {
    const slots = buildSchedule("half_day", [activity("a"), activity("b")]);

    expect(slots).toHaveLength(2);
    expect(slots[0].label).toMatch(/Dopoledne/i);
    expect(slots[0].timeHint).toBe("9:00–12:00");
    expect(slots[1].label).toMatch(/Odpoledne/i);
    expect(slots[1].activityId).toBe("b");
  });

  it("caps slots when there are fewer activities than templates", () => {
    const slots = buildSchedule("full_day", [activity("only")]);

    expect(slots).toHaveLength(1);
    expect(slots[0].activityId).toBe("only");
  });

  it("returns empty array for no activities", () => {
    expect(buildSchedule("half_day", [])).toEqual([]);
  });
});
