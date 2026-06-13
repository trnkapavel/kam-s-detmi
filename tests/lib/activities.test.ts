import { describe, expect, it } from "vitest";
import { loadActivitiesByKraj, loadAllActivities } from "@/lib/activities";

describe("loadAllActivities", () => {
  it("načte aktivity z Prahy", () => {
    const activities = loadActivitiesByKraj("Praha");
    expect(activities.length).toBe(25);
  });

  it("načte aktivity ze Středních Čech", () => {
    const activities = loadActivitiesByKraj("Stredocesky");
    expect(activities.length).toBe(15);
  });

  it("celkem má 40 aktivit", () => {
    expect(loadAllActivities().length).toBe(40);
  });
});
