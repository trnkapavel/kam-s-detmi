import { describe, expect, it } from "vitest";
import {
  buildPlanSharePayload,
  buildPlanShareText,
  canUseNativeShare,
} from "@/lib/plan-share";
import type { CheckIn, Recommendation } from "@/types";

const checkIn: CheckIn = {
  location: { mesto: "Praha", kraj: "Praha" },
  parent: { energy: "ok", timeAvailable: "half_day" },
  children: [
    { age: 5, wants: ["bazen"], mood: "active" },
    { age: 8, wants: ["les"], mood: "calm" },
  ],
  weather: { condition: "cloudy", temp: 15, source: "manual" },
};

const recommendations: Recommendation[] = [
  {
    type: "overlap",
    activities: [
      {
        id: "zoo",
        name: "Zoo Praha",
        region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
      } as Recommendation["activities"][number],
    ],
    reason: "test",
    score: 90,
  },
  {
    type: "sequential",
    activities: [
      {
        id: "a",
        name: "Aquapalace",
        region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
      } as Recommendation["activities"][number],
      {
        id: "b",
        name: "Stromovka",
        region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
      } as Recommendation["activities"][number],
    ],
    reason: "test",
    score: 80,
    schedule: [
      { label: "Dopoledne", timeHint: "9:00–12:00", activityId: "a" },
      { label: "Odpoledne", timeHint: "13:00–16:00", activityId: "b" },
    ],
  },
];

describe("buildPlanShareText", () => {
  it("includes city, activities, weather label, maps links, and app url", () => {
    const text = buildPlanShareText({
      checkIn,
      recommendations: [
        {
          ...recommendations[0],
          activities: [
            {
              id: "zoo",
              name: "Zoo Praha",
              region: { kraj: "Praha", okres: "Praha", mesto: "Praha" },
              place: { address: "Praha 7", mapsUrl: "https://maps.example/zoo" },
            } as Recommendation["activities"][number],
          ],
          reason: "Obě děti chtějí zoo",
        },
      ],
      appUrl: "https://example.com/vysledky?s=abc",
    });

    expect(text).toContain("Praha");
    expect(text).toContain("Oblačno");
    expect(text).toContain("Zoo Praha");
    expect(text).toContain("📍 Praha 7");
    expect(text).toContain("🗺");
    expect(text).toContain("Proč: Obě děti chtějí zoo");
    expect(text).toContain("https://example.com/vysledky?s=abc");
  });

  it("formats sequential schedule with maps links", () => {
    const text = buildPlanShareText({
      checkIn,
      recommendations: [recommendations[1]],
      appUrl: "https://example.com",
    });

    expect(text).toContain("1. 9:00–12:00 · Aquapalace");
    expect(text).toContain("2. 13:00–16:00 · Stromovka");
    expect(text).toContain("🗺");
  });
});

describe("buildPlanSharePayload", () => {
  it("includes encoded share url with check-in", () => {
    const payload = buildPlanSharePayload({
      checkIn,
      recommendations,
      origin: "https://example.com",
    });

    expect(payload.title).toContain("Kam s dětmi");
    expect(payload.url).toContain("https://example.com/vysledky?s=");
    expect(payload.text).toContain("Společně");
    expect(payload.text).toContain(payload.url);
  });
});

describe("canUseNativeShare", () => {
  it("returns false in node test env", () => {
    expect(canUseNativeShare()).toBe(false);
  });
});
