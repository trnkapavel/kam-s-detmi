import { describe, expect, it } from "vitest";
import { hasConflict, resolveConflict } from "@/engine/conflict";
import { filterActivities } from "@/engine/filter";
import { recommend } from "@/engine/index";
import { loadActivitiesByKraj } from "@/lib/activities";
import type { Activity, CheckIn } from "@/types";

const T1_CHECK_IN: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: {
    energy: "tired",
    timeAvailable: "half_day",
  },
  children: [
    { age: 5, wants: ["bazen"], mood: "active" },
    { age: 8, wants: ["les"], mood: "calm" },
  ],
  weather: {
    condition: "rain",
    temp: 12,
    source: "manual",
  },
};

const T2_CHECK_IN: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: {
    energy: "energetic",
    timeAvailable: "full_day",
  },
  children: [
    { age: 5, wants: ["bazen"], mood: "active" },
    { age: 8, wants: ["les"], mood: "calm" },
  ],
  weather: {
    condition: "sunny",
    temp: 26,
    source: "manual",
  },
};

const T3_CHECK_IN: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: {
    energy: "ok",
    timeAvailable: "full_day",
  },
  children: [
    { age: 6, wants: ["zoo"], mood: "active" },
    { age: 4, wants: ["zoo"], mood: "calm" },
  ],
  weather: {
    condition: "sunny",
    temp: 22,
    source: "manual",
  },
};

function makeActivity(overrides: Partial<Activity> & Pick<Activity, "id" | "name">): Activity {
  return {
    description: "Test activity",
    region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
    tags: {
      type: ["bazen"],
      ageMin: 1,
      ageMax: 99,
      energyParent: ["low"],
      weather: ["indoor_only"],
      duration: "few_hours",
    },
    conflictResolvers: ["compromise"],
    ...overrides,
  };
}

describe("T1: bazén vs. les, unavený rodič, déšť", () => {
  const activities = loadActivitiesByKraj("Praha");

  it("detekuje konflikt preferencí dětí", () => {
    expect(hasConflict(T1_CHECK_IN)).toBe(true);
  });

  it("vyřadí venkovní les bez rain_ok při dešti", () => {
    const filtered = filterActivities(activities, T1_CHECK_IN);
    const ids = filtered.map((activity) => activity.id);

    expect(ids).not.toContain("praha-kunraticky-les");
    expect(ids).not.toContain("praha-hostivarska-prehrada");
    expect(ids).toContain("praha-aquapalace");
    expect(ids).toContain("praha-podoli-bazen");
  });

  it("nabídne indoor / overlap tipy", () => {
    const result = recommend({ activities, checkIn: T1_CHECK_IN });
    const names = result.recommendations.flatMap((rec) =>
      rec.activities.map((activity) => activity.name),
    );

    expect(names.some((name) => name.includes("Aquapalace") || name.includes("Podolí"))).toBe(
      true,
    );
    expect(result.filteredCount).toBeGreaterThan(0);
  });

  it("nepoužije sequential plán pro unaveného rodiče", () => {
    const result = recommend({ activities, checkIn: T1_CHECK_IN });
    const types = result.recommendations.map((rec) => rec.type);

    expect(types).not.toContain("sequential");
  });

  it("obsahuje alespoň dva typy resolverů při konfliktu", () => {
    const result = recommend({ activities, checkIn: T1_CHECK_IN });
    const types = new Set(result.recommendations.map((rec) => rec.type));

    expect(types.size).toBeGreaterThanOrEqual(2);
    expect(types.has("rotation")).toBe(true);
  });
});

describe("T2: bazén vs. les, energický rodič, slunečno", () => {
  const activities = loadActivitiesByKraj("Praha");

  it("detekuje konflikt preferencí dětí", () => {
    expect(hasConflict(T2_CHECK_IN)).toBe(true);
  });

  it("nechá venkovní les a přehradu ve filtru", () => {
    const filtered = filterActivities(activities, T2_CHECK_IN);
    const ids = filtered.map((activity) => activity.id);

    expect(ids).toContain("praha-kunraticky-les");
    expect(ids).toContain("praha-hostivarska-prehrada");
    expect(ids).toContain("praha-podoli-bazen");
  });

  it("nabídne overlap aktivitu spojující bazén a les", () => {
    const result = recommend({ activities, checkIn: T2_CHECK_IN });
    const overlap = result.recommendations.find((rec) => rec.type === "overlap");

    expect(overlap).toBeDefined();
    expect(overlap?.activities[0]?.id).toBe("praha-hostivarska-prehrada");
    expect(overlap?.childNotes?.length).toBe(2);
  });

  it("nabídne sequential plán pro energického rodiče", () => {
    const result = recommend({ activities, checkIn: T2_CHECK_IN });
    const sequential = result.recommendations.find((rec) => rec.type === "sequential");

    expect(sequential).toBeDefined();
    expect(sequential?.activities).toHaveLength(2);
    expect(sequential?.schedule?.length).toBeGreaterThanOrEqual(2);
    expect(sequential?.childNotes?.length).toBeGreaterThanOrEqual(2);

    const [first, second] = sequential!.activities;
    const child1Types = new Set(first.tags.type);
    const child2Types = new Set(second.tags.type);

    expect(T2_CHECK_IN.children[0].wants.some((want) => child1Types.has(want))).toBe(true);
    expect(T2_CHECK_IN.children[1].wants.some((want) => child2Types.has(want))).toBe(true);
  });

  it("obsahuje overlap i sequential mezi typy doporučení", () => {
    const result = recommend({ activities, checkIn: T2_CHECK_IN });
    const types = new Set(result.recommendations.map((rec) => rec.type));

    expect(types.has("overlap")).toBe(true);
    expect(types.has("sequential")).toBe(true);
  });
});

describe("T3: obě děti chtějí zoo", () => {
  const activities = loadActivitiesByKraj("Praha");

  it("nedetekuje konflikt", () => {
    expect(hasConflict(T3_CHECK_IN)).toBe(false);
  });

  it("vrátí jen single match doporučení", () => {
    const result = recommend({ activities, checkIn: T3_CHECK_IN });

    expect(result.conflict).toBe(false);
    expect(result.recommendations.length).toBeGreaterThan(0);
    expect(result.recommendations.every((rec) => rec.type === "single")).toBe(true);
  });

  it("dá zoo na první místo", () => {
    const result = recommend({ activities, checkIn: T3_CHECK_IN });

    expect(result.recommendations[0]?.activities[0]?.id).toBe("praha-zoo");
    expect(result.recommendations[0]?.score).toBeGreaterThan(0);
    expect(result.recommendations[0]?.childNotes?.length).toBe(2);
  });

  it("nepoužije conflict resolvery", () => {
    const result = recommend({ activities, checkIn: T3_CHECK_IN });
    const types = result.recommendations.map((rec) => rec.type);

    expect(types).not.toContain("overlap");
    expect(types).not.toContain("sequential");
    expect(types).not.toContain("rotation");
    expect(types).not.toContain("compromise");
  });
});

describe("resolveConflict", () => {
  it("nepřidá sequential pro unaveného rodiče", () => {
    const activities = [
      makeActivity({
        id: "a",
        name: "Bazén A",
        tags: {
          type: ["bazen"],
          ageMin: 1,
          ageMax: 99,
          energyParent: ["low"],
          weather: ["indoor_only"],
          duration: "few_hours",
        },
        coordinates: { lat: 50.08, lng: 14.42 },
      }),
      makeActivity({
        id: "b",
        name: "Les B",
        tags: {
          type: ["les"],
          ageMin: 1,
          ageMax: 99,
          energyParent: ["low"],
          weather: ["rain_ok"],
          duration: "few_hours",
        },
        coordinates: { lat: 50.09, lng: 14.43 },
      }),
    ];

    const scored = activities.map((activity) => ({ activity, score: 80 }));
    const results = resolveConflict(scored, T1_CHECK_IN);

    expect(results.map((rec) => rec.type)).not.toContain("sequential");
  });
});

describe("variable child count", () => {
  it("jedno dítě nemá konflikt", () => {
    const checkIn: CheckIn = {
      ...T3_CHECK_IN,
      children: [{ age: 5, wants: ["park", "bazen"], mood: "active" }],
    };

    expect(hasConflict(checkIn)).toBe(false);
  });

  it("tři děti bez společného přání mají konflikt", () => {
    const checkIn: CheckIn = {
      ...T1_CHECK_IN,
      children: [
        { age: 5, wants: ["bazen"], mood: "active" },
        { age: 7, wants: ["les"], mood: "calm" },
        { age: 9, wants: ["zoo"], mood: "active" },
      ],
    };

    expect(hasConflict(checkIn)).toBe(true);
  });
});
