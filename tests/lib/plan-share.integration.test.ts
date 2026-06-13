import { describe, expect, it } from "vitest";
import { recommend } from "@/engine";
import { loadActivitiesByKraj } from "@/lib/activities";
import { buildPlanSharePayload } from "@/lib/plan-share";
import type { CheckIn } from "@/types";

const scenarios: CheckIn[] = [
  {
    location: { mesto: "Praha", kraj: "Praha" },
    parent: { energy: "tired", timeAvailable: "half_day" },
    children: [
      { age: 5, wants: ["bazen"], mood: "active" },
      { age: 8, wants: ["les"], mood: "calm" },
    ],
    weather: { condition: "rain", temp: 11, source: "manual" },
  },
  {
    location: { mesto: "České Budějovice", kraj: "Jihocesky" },
    parent: { energy: "ok", timeAvailable: "few_hours" },
    children: [{ age: 4, wants: ["zoo"], mood: "cranky" }],
    weather: { condition: "cloudy", temp: 15, source: "api" },
  },
];

describe("buildPlanSharePayload with real recommendations", () => {
  for (const checkIn of scenarios) {
    it(`builds share payload for ${checkIn.location.mesto}`, () => {
      const activities = loadActivitiesByKraj(checkIn.location.kraj);
      const result = recommend({ activities, checkIn });

      const payload = buildPlanSharePayload({
        checkIn,
        recommendations: result.recommendations,
        origin: "https://example.com",
      });

      expect(payload.url).toContain("https://example.com/vysledky?s=");
      expect(payload.text.length).toBeGreaterThan(20);
      expect(payload.shortText).toContain(checkIn.location.mesto);
      expect(payload.text).toContain(payload.url);
    });
  }
});
