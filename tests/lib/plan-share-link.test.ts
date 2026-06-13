import { describe, expect, it } from "vitest";
import {
  buildSharedPlanUrl,
  decodeCheckInShare,
  encodeCheckInShare,
} from "@/lib/plan-share-link";
import type { CheckIn } from "@/types";

const checkIn: CheckIn = {
  location: { mesto: "Jindřichův Hradec", kraj: "Jihocesky" },
  parent: { energy: "ok", timeAvailable: "half_day" },
  children: [{ age: 5, wants: ["hrad"], mood: "active" }],
  weather: { condition: "cloudy", temp: 15, source: "manual" },
};

describe("plan-share-link", () => {
  it("roundtrips check-in with unicode city name", () => {
    const token = encodeCheckInShare(checkIn);
    expect(decodeCheckInShare(token)).toEqual(checkIn);
  });

  it("returns null for invalid token", () => {
    expect(decodeCheckInShare("not-valid")).toBeNull();
  });

  it("builds shareable results url", () => {
    const url = buildSharedPlanUrl("https://example.com", checkIn);
    expect(url).toMatch(/^https:\/\/example\.com\/vysledky\?s=/);

    const token = new URL(url).searchParams.get("s");
    expect(decodeCheckInShare(token!)).toEqual(checkIn);
  });

  it("roundtrips using browser-style base64 without Buffer", () => {
    const originalBuffer = globalThis.Buffer;
    // @ts-expect-error test-only
    delete globalThis.Buffer;

    const token = encodeCheckInShare(checkIn);
    expect(decodeCheckInShare(token)).toEqual(checkIn);

    globalThis.Buffer = originalBuffer;
  });
});
