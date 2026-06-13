import type { CheckIn } from "@/types";

const SHARE_VERSION = 1;

type SharePayload = {
  v: number;
  c: CheckIn;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(token: string): Uint8Array {
  const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function toBase64Url(value: string): string {
  if (typeof Buffer !== "undefined") {
    try {
      return Buffer.from(value, "utf-8").toString("base64url");
    } catch {
      // Some browser polyfills lack base64url — use TextEncoder below.
    }
  }

  return bytesToBase64Url(new TextEncoder().encode(value));
}

function fromBase64Url(token: string): string {
  if (typeof Buffer !== "undefined") {
    try {
      const base64 = token.replace(/-/g, "+").replace(/_/g, "/");
      const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
      return Buffer.from(padded, "base64").toString("utf-8");
    } catch {
      // Fall through to browser decoding.
    }
  }

  return new TextDecoder().decode(base64UrlToBytes(token));
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
