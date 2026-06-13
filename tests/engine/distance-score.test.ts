import { describe, expect, it } from "vitest";
import { distanceScoreAdjustment } from "@/engine/distance-score";
import { haversineKm } from "@/engine/geo";
import type { Activity, CheckIn } from "@/types";

const checkIn: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: { energy: "tired", timeAvailable: "half_day" },
  children: [{ age: 5, wants: ["park"], mood: "calm" }],
  weather: { condition: "cloudy", temp: 15, source: "manual" },
};

function activity(coords: { lat: number; lng: number }): Activity {
  return {
    id: "test",
    name: "Test",
    description: "",
    region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
    tags: {
      type: ["park"],
      ageMin: 0,
      ageMax: 17,
      energyParent: ["low"],
      weather: ["any"],
      duration: "half_day",
    },
    conflictResolvers: ["overlap"],
    coordinates: coords,
  };
}

describe("haversineKm", () => {
  it("returns zero for identical points", () => {
    const point = { lat: 50.0755, lng: 14.4378 };
    expect(haversineKm(point, point)).toBe(0);
  });
});

describe("distanceScoreAdjustment", () => {
  it("bonuses nearby activities", () => {
    const near = activity({ lat: 50.08, lng: 14.44 });
    expect(distanceScoreAdjustment(near, checkIn)).toBe(10);
  });

  it("penalizes far activities more for tired parent", () => {
    const far = activity({ lat: 48.81, lng: 14.32 });
    const penalty = distanceScoreAdjustment(far, checkIn);
    expect(penalty).toBeLessThan(-15);
  });

  it("returns zero without coordinates", () => {
    const noCoords = { ...activity({ lat: 50.08, lng: 14.44 }), coordinates: undefined };
    expect(distanceScoreAdjustment(noCoords, checkIn)).toBe(0);
  });

  it("returns zero for unknown city", () => {
    const unknownCity: CheckIn = {
      ...checkIn,
      location: { mesto: "Neznámé město", kraj: "Praha" },
    };
    expect(distanceScoreAdjustment(activity({ lat: 50.08, lng: 14.44 }), unknownCity)).toBe(0);
  });
});
