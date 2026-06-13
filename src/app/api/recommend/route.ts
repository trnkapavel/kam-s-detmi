import { loadActivitiesByKraj } from "@/lib/activities";
import { recommend } from "@/engine";
import type { CheckIn } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const checkIn = (await request.json()) as CheckIn;

    if (!checkIn.location?.kraj || !checkIn.children?.[0] || !checkIn.children?.[1]) {
      return NextResponse.json({ error: "Neplatný check-in" }, { status: 400 });
    }

    const activities = loadActivitiesByKraj(checkIn.location.kraj);
    const result = recommend({ activities, checkIn });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Nepodařilo se vygenerovat tipy" }, { status: 500 });
  }
}
