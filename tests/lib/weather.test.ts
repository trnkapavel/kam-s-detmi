import { describe, expect, it } from "vitest";
import { buildHourlyForecast, isCurrentlyDay, mapWeatherCode } from "@/lib/weather";

describe("mapWeatherCode", () => {
  it("mapuje jasno", () => {
    expect(mapWeatherCode(0)).toBe("sunny");
  });

  it("mapuje déšť", () => {
    expect(mapWeatherCode(61)).toBe("rain");
  });

  it("mapuje sníh", () => {
    expect(mapWeatherCode(71)).toBe("snow");
  });
});

describe("buildHourlyForecast", () => {
  it("vrátí budoucí hodiny s teplotou a stavem", () => {
    const future = new Date();
    future.setHours(future.getHours() + 1, 0, 0, 0);

    const later = new Date(future);
    later.setHours(later.getHours() + 1);

    const forecast = buildHourlyForecast(
      [future.toISOString(), later.toISOString()],
      [22, 20],
      [0, 61],
      2,
    );

    expect(forecast).toHaveLength(2);
    expect(forecast[0].temp).toBe(22);
    expect(forecast[0].condition).toBe("sunny");
    expect(forecast[1].condition).toBe("rain");
    expect(forecast[0].label).toMatch(/\d/);
  });

  it("přeskočí minulé sloty", () => {
    const past = new Date();
    past.setHours(past.getHours() - 2, 0, 0, 0);

    const future = new Date();
    future.setHours(future.getHours() + 2, 0, 0, 0);

    const forecast = buildHourlyForecast(
      [past.toISOString(), future.toISOString()],
      [18, 24],
      [3, 0],
      2,
    );

    expect(forecast).toHaveLength(1);
    expect(forecast[0].temp).toBe(24);
    expect(forecast[0].condition).toBe("sunny");
  });
});

describe("isCurrentlyDay", () => {
  it("vrátí true pro poledne v Praze", () => {
    const noon = new Date("2026-06-13T12:00:00+02:00");
    expect(isCurrentlyDay(noon)).toBe(true);
  });

  it("vrátí false pro půlnoc v Praze", () => {
    const midnight = new Date("2026-06-13T00:00:00+02:00");
    expect(isCurrentlyDay(midnight)).toBe(false);
  });
});
