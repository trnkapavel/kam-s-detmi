import { describe, expect, it } from "vitest";
import { pickSplashHero, type SplashHero } from "@/lib/splash-content";

const POOL: SplashHero[] = [
  {
    image: "https://example.com/a.jpg",
    alt: "A",
    label: "Místo A",
  },
  {
    image: "https://example.com/b.jpg",
    alt: "B",
    label: "Místo B",
  },
];

describe("pickSplashHero", () => {
  it("vrátí první položku na serveru", () => {
    expect(pickSplashHero(POOL)).toEqual(POOL[0]);
  });
});
