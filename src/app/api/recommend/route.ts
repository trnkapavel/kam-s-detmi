import { loadActivitiesByKraj } from "@/lib/activities";
import { recommend } from "@/engine";
import { MAX_CHILDREN, MIN_CHILDREN } from "@/lib/constants";
import type { CheckIn } from "@/types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const checkIn = (await request.json()) as CheckIn;

    const childCount = checkIn.children?.length ?? 0;
    if (
      !checkIn.location?.kraj ||
      childCount < MIN_CHILDREN ||
      childCount > MAX_CHILDREN ||
      !checkIn.children.every((child) => child.age && child.wants?.length && child.mood)
    ) {
      return NextResponse.json({ error: "Neplatný check-in" }, { status: 400 });
    }

    const activities = loadActivitiesByKraj(checkIn.location.kraj);
    const result = recommend({ activities, checkIn });

    return NextResponse.json(result);
  } catch {
    return NextResponse.json({ error: "Nepodařilo se vygenerovat tipy" }, { status: 500 });
  }
}
