import type { CheckIn } from "@/types";

const SHARE_VERSION = 1;

type SharePayload = {
  v: number;
  c: CheckIn;
};

function toBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    return Buffer.from(value, "utf-8").toString("base64url");
  }

  const base64 = btoa(
    encodeURIComponent(value).replace(/%([0-9A-F]{2})/g, (_, hex: string) =>
      String.fromCharCode(Number.parseInt(hex, 16)),
    ),
  );

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(token: string): string {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf-8");
  }

  return decodeURIComponent(
    atob(padded)
      .split("")
      .map((char) => `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`)
      .join(""),
  );
}

export function encodeCheckInShare(checkIn: CheckIn): string {
  const payload: SharePayload = { v: SHARE_VERSION, c: checkIn };
  return toBase64Url(JSON.stringify(payload));
}

export function decodeCheckInShare(token: string): CheckIn | null {
  try {
    const parsed = JSON.parse(fromBase64Url(token)) as SharePayload;
    if (parsed.v !== SHARE_VERSION || !parsed.c) {
      return null;
    }

    return parsed.c;
  } catch {
    return null;
  }
}

export function buildSharedPlanUrl(origin: string, checkIn: CheckIn): string {
  const token = encodeCheckInShare(checkIn);
  return `${origin}/vysledky?s=${encodeURIComponent(token)}`;
}
