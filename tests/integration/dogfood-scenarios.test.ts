import { describe, expect, it } from "vitest";
import { recommend } from "@/engine";
import { loadActivitiesByKraj } from "@/lib/activities";
import type { CheckIn } from "@/types";

function runScenario(name: string, checkIn: CheckIn) {
  const activities = loadActivitiesByKraj(checkIn.location.kraj);
  return { name, ...recommend({ activities, checkIn }) };
}

describe("Dogfood scénáře — simulace víkendového použití", () => {
  it("D1: unavený rodič, déšť, bazén vs. les (Praha)", () => {
    const result = runScenario("D1", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "tired", timeAvailable: "half_day" },
      children: [
        { age: 5, wants: ["bazen"], mood: "active" },
        { age: 8, wants: ["les"], mood: "calm" },
      ],
      weather: { condition: "rain", temp: 11, source: "manual" },
    });

    expect(result.conflict).toBe(true);
    expect(result.filteredCount).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);

    const types = result.recommendations.map((r) => r.type);
    expect(types).not.toContain("sequential");

    const names = result.recommendations.flatMap((r) => r.activities.map((a) => a.name));
    expect(names.some((n) => n.includes("Aquapalace") || n.includes("Podolí"))).toBe(true);
  });

  it("D2: energický rodič, slunečno, bazén vs. les (Praha)", () => {
    const result = runScenario("D2", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "energetic", timeAvailable: "full_day" },
      children: [
        { age: 5, wants: ["bazen"], mood: "active" },
        { age: 8, wants: ["les"], mood: "active" },
      ],
      weather: { condition: "sunny", temp: 27, source: "api" },
    });

    const types = new Set(result.recommendations.map((r) => r.type));
    expect(types.has("overlap")).toBe(true);
    expect(types.has("sequential")).toBe(true);
  });

  it("D3: obě děti chtějí zoo (Praha)", () => {
    const result = runScenario("D3", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "ok", timeAvailable: "full_day" },
      children: [
        { age: 4, wants: ["zoo"], mood: "active" },
        { age: 7, wants: ["zoo"], mood: "calm" },
      ],
      weather: { condition: "cloudy", temp: 20, source: "manual" },
    });

    expect(result.conflict).toBe(false);
    expect(result.recommendations[0]?.activities[0]?.id).toBe("praha-zoo");
    expect(result.recommendations.every((r) => r.type === "single")).toBe(true);
  });

  it("D4: hrad vs. park, Střední Čechy Beroun", () => {
    const result = runScenario("D4", {
      location: { mesto: "Beroun", kraj: "Stredocesky" },
      parent: { energy: "ok", timeAvailable: "half_day" },
      children: [
        { age: 6, wants: ["hrad"], mood: "active" },
        { age: 9, wants: ["park"], mood: "calm" },
      ],
      weather: { condition: "sunny", temp: 22, source: "manual" },
    });

    expect(result.filteredCount).toBeGreaterThan(0);
    expect(result.recommendations.length).toBeGreaterThan(0);
  });

  it("D5: muzeum indoor, déšť, obě děti shoda (Praha)", () => {
    const result = runScenario("D5", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "tired", timeAvailable: "few_hours" },
      children: [
        { age: 8, wants: ["muzeum"], mood: "calm" },
        { age: 10, wants: ["muzeum"], mood: "calm" },
      ],
      weather: { condition: "rain", temp: 10, source: "manual" },
    });

    expect(result.recommendations.length).toBeGreaterThan(0);
    const first = result.recommendations[0]?.activities[0];
    expect(first?.tags.weather).toContain("indoor_only");
  });

  it("D6: sport vs. priroda, cloudy, Praha", () => {
    const result = runScenario("D6", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "energetic", timeAvailable: "half_day" },
      children: [
        { age: 7, wants: ["sport"], mood: "active" },
        { age: 5, wants: ["priroda"], mood: "active" },
      ],
      weather: { condition: "cloudy", temp: 18, source: "manual" },
    });

    expect(result.conflict).toBe(true);
    expect(result.recommendations.length).toBeGreaterThanOrEqual(2);
  });

  it("D7: věk 2 roky — filtruje nemožné aktivity", () => {
    const result = runScenario("D7", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "ok", timeAvailable: "few_hours" },
      children: [
        { age: 2, wants: ["park"], mood: "calm" },
        { age: 2, wants: ["park"], mood: "calm" },
      ],
      weather: { condition: "sunny", temp: 24, source: "manual" },
    });

    expect(result.filteredCount).toBeGreaterThan(0);
    for (const rec of result.recommendations) {
      for (const activity of rec.activities) {
        expect(activity.tags.ageMin).toBeLessThanOrEqual(2);
      }
    }
  });

  it("D8: Kladno, koupaliště vs. muzeum", () => {
    const result = runScenario("D8", {
      location: { mesto: "Kladno", kraj: "Stredocesky" },
      parent: { energy: "ok", timeAvailable: "half_day" },
      children: [
        { age: 6, wants: ["bazen"], mood: "active" },
        { age: 9, wants: ["muzeum"], mood: "calm" },
      ],
      weather: { condition: "sunny", temp: 28, source: "manual" },
    });

    expect(result.filteredCount).toBeGreaterThan(0);
  });

  it("D9: sníh, indoor preference (Praha)", () => {
    const result = runScenario("D9", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "tired", timeAvailable: "few_hours" },
      children: [
        { age: 5, wants: ["bazen"], mood: "active" },
        { age: 7, wants: ["sport"], mood: "active" },
      ],
      weather: { condition: "snow", temp: -2, source: "manual" },
    });

    for (const rec of result.recommendations) {
      for (const activity of rec.activities) {
        const ok =
          activity.tags.weather.includes("indoor_only") ||
          activity.tags.weather.includes("any");
        expect(ok).toBe(true);
      }
    }
  });

  it("D10: pár hodin, unavený, shoda na park (Praha)", () => {
    const result = runScenario("D10", {
      location: { mesto: "Praha", kraj: "Praha" },
      parent: { energy: "tired", timeAvailable: "few_hours" },
      children: [
        { age: 4, wants: ["park"], mood: "calm" },
        { age: 6, wants: ["park"], mood: "calm" },
      ],
      weather: { condition: "cloudy", temp: 16, source: "manual" },
    });

    expect(result.recommendations.length).toBeLessThanOrEqual(5);
    expect(result.recommendations[0]?.activities[0]?.tags.type).toContain("park");
  });

  it("D11: déšť, Jindřichův Hradec — zámek nebo bazén", () => {
    const result = runScenario("D11", {
      location: { mesto: "Jindřichův Hradec", kraj: "Jihocesky" },
      parent: { energy: "ok", timeAvailable: "half_day" },
      children: [{ age: 7, wants: ["hrad"], mood: "active" }],
      weather: { condition: "rain", temp: 12, source: "manual" },
    });

    expect(result.recommendations.length).toBeGreaterThan(0);
    const first = result.recommendations[0]?.activities[0];
    expect(first?.region.kraj).toBe("Jihocesky");
  });
});
