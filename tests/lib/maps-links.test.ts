import { describe, expect, it } from "vitest";
import { appleMapsLink, googleMapsLink } from "@/lib/maps-links";
import type { Activity } from "@/types";

const activity: Activity = {
  id: "test",
  name: "Zoo Praha",
  description: "",
  region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
  tags: {
    type: ["zoo"],
    ageMin: 0,
    ageMax: 17,
    energyParent: ["medium"],
    weather: ["any"],
    duration: "half_day",
  },
  conflictResolvers: ["overlap"],
  coordinates: { lat: 50.1165, lng: 14.4063 },
};

describe("appleMapsLink", () => {
  it("builds Apple Maps URL from coordinates", () => {
    const url = appleMapsLink(activity);

    expect(url).toContain("maps.apple.com");
    expect(url).toContain("50.1165");
    expect(url).toContain(encodeURIComponent("Zoo Praha"));
  });

  it("returns null without coordinates", () => {
    expect(appleMapsLink({ ...activity, coordinates: undefined })).toBeNull();
  });
});

describe("googleMapsLink", () => {
  it("prefers provided place maps URL", () => {
    const url = googleMapsLink(activity, "https://maps.google.com/custom");
    expect(url).toBe("https://maps.google.com/custom");
  });

  it("builds coordinate search URL", () => {
    const url = googleMapsLink(activity);
    expect(url).toContain("google.com/maps");
    expect(url).toContain("50.1165");
  });
});
