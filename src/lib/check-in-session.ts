import type { CheckIn } from "@/types";
import { SESSION_KEY } from "./constants";

export function saveCheckIn(checkIn: CheckIn): void {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(checkIn));
}

export function loadCheckIn(): CheckIn | null {
  const raw = sessionStorage.getItem(SESSION_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as CheckIn;
  } catch {
    return null;
  }
}

export function clearCheckIn(): void {
  sessionStorage.removeItem(SESSION_KEY);
}
