import { describe, expect, it } from "vitest";
import { filterActivities } from "@/engine/filter";
import { recommend } from "@/engine/index";
import { scoreActivity } from "@/engine/score";
import { loadActivitiesByKraj } from "@/lib/activities";
import type { Activity, CheckIn } from "@/types";

const BASE_CHECK_IN: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: { energy: "ok", timeAvailable: "half_day" },
  children: [
    { age: 6, wants: ["zoo"], mood: "active" },
    { age: 6, wants: ["zoo"], mood: "active" },
  ],
  weather: { condition: "sunny", temp: 22, source: "manual" },
};

const sampleActivity: Activity = {
  id: "test-zoo",
  name: "Test Zoo",
  description: "Test",
  region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
  tags: {
    type: ["zoo"],
    ageMin: 2,
    ageMax: 12,
    energyParent: ["medium"],
    weather: ["any"],
    duration: "half_day",
  },
  conflictResolvers: ["overlap"],
};

describe("filterActivities", () => {
  it("vyřadí aktivity mimo věkový rozsah", () => {
    const checkIn: CheckIn = {
      ...BASE_CHECK_IN,
      children: [
        { age: 1, wants: ["zoo"], mood: "calm" },
        { age: 1, wants: ["zoo"], mood: "calm" },
      ],
    };

    const filtered = filterActivities([sampleActivity], checkIn);
    expect(filtered).toHaveLength(0);
  });

  it("vyřadí outdoor aktivity v dešti bez rain_ok", () => {
    const outdoor: Activity = {
      ...sampleActivity,
      id: "outdoor",
      tags: {
        ...sampleActivity.tags,
        type: ["les"],
        weather: ["sunny"],
      },
    };

    const checkIn: CheckIn = {
      ...BASE_CHECK_IN,
      weather: { condition: "rain", temp: 10, source: "manual" },
      children: [
        { age: 6, wants: ["les"], mood: "active" },
        { age: 6, wants: ["les"], mood: "active" },
      ],
    };

    expect(filterActivities([outdoor], checkIn)).toHaveLength(0);
  });
});

describe("scoreActivity", () => {
  it("přidá body za shodu s přáním dítěte", () => {
    const score = scoreActivity(sampleActivity, BASE_CHECK_IN);
    expect(score).toBeGreaterThanOrEqual(30);
  });

  it("sníží skóre outdoor aktivity v dešti", () => {
    const outdoor: Activity = {
      ...sampleActivity,
      tags: {
        ...sampleActivity.tags,
        weather: ["rain_ok"],
        type: ["park"],
      },
    };

    const rainyCheckIn: CheckIn = {
      ...BASE_CHECK_IN,
      weather: { condition: "rain", temp: 10, source: "manual" },
      children: [
        { age: 6, wants: ["park"], mood: "active" },
        { age: 6, wants: ["park"], mood: "active" },
      ],
    };

    const score = scoreActivity(outdoor, rainyCheckIn);
    expect(score).toBeLessThan(scoreActivity(outdoor, BASE_CHECK_IN));
  });
});

describe("T4: věkový filtr", () => {
  it("vyřadí aktivitu s ageMin 6 pro tříleté dítě", () => {
    const activity: Activity = {
      ...sampleActivity,
      id: "age-restricted",
      tags: { ...sampleActivity.tags, ageMin: 6, ageMax: 99 },
    };

    const checkIn: CheckIn = {
      ...BASE_CHECK_IN,
      children: [
        { age: 3, wants: ["zoo"], mood: "calm" },
        { age: 5, wants: ["zoo"], mood: "calm" },
      ],
    };

    expect(filterActivities([activity], checkIn)).toHaveLength(0);
  });
});

describe("T5: Praha, půl dne, oblačno", () => {
  it("vrátí max 5 doporučení seřazených dle skóre", () => {
    const activities = loadActivitiesByKraj("Praha");
    const checkIn: CheckIn = {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "ok", timeAvailable: "half_day" },
      children: [
        { age: 6, wants: ["park"], mood: "active" },
        { age: 8, wants: ["park"], mood: "calm" },
      ],
      weather: { condition: "cloudy", temp: 18, source: "manual" },
    };

    const result = recommend({ activities, checkIn });

    expect(result.recommendations.length).toBeLessThanOrEqual(5);
    expect(result.recommendations.every((rec) => rec.type === "single")).toBe(true);

    const scores = result.recommendations.map((rec) => rec.score);
    expect(scores).toEqual([...scores].sort((a, b) => b - a));
    expect(result.recommendations[0]?.activities[0]?.tags.type).toContain("park");
  });
});
