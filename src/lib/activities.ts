import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { enrichActivities } from "@/lib/activity-places";
import type { ActivitiesFile, Activity, Kraj } from "@/types";

const DATA_DIR = join(process.cwd(), "data", "activities");

export function loadActivitiesFile(filename: string): ActivitiesFile {
  const raw = readFileSync(join(DATA_DIR, filename), "utf-8");
  return JSON.parse(raw) as ActivitiesFile;
}

export function loadAllActivities(): Activity[] {
  const files = readdirSync(DATA_DIR).filter(
    (file) => file.endsWith(".json") && !file.endsWith(".example"),
  );

  const activities = files.flatMap((file) => loadActivitiesFile(file).activities);
  return enrichActivities(activities);
}

export function loadActivitiesByKraj(kraj: Kraj): Activity[] {
  return loadAllActivities().filter((activity) => activity.region.kraj === kraj);
}
