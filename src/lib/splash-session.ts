const SPLASH_SEEN_KEY = "kam-s-detmi-splash-seen";

export function markSplashSeen(): void {
  localStorage.setItem(SPLASH_SEEN_KEY, "1");
}

export function hasSeenSplash(): boolean {
  return localStorage.getItem(SPLASH_SEEN_KEY) === "1";
}
