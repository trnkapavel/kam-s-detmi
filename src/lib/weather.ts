import type { WeatherCondition } from "@/types";
import { CITY_COORDS } from "./constants";

export type HourlyForecast = {
  label: string;
  temp: number;
  condition: WeatherCondition;
};

export type WeatherResult = {
  condition: WeatherCondition;
  temp: number;
  hourly: HourlyForecast[];
  isDay: boolean;
};

const PRAGUE_TIMEZONE = "Europe/Prague";

export function isCurrentlyDay(
  date = new Date(),
  timezone: string = PRAGUE_TIMEZONE,
): boolean {
  const hour = Number(
    new Intl.DateTimeFormat("cs-CZ", {
      hour: "numeric",
      hour12: false,
      timeZone: timezone,
    }).format(date),
  );

  return hour >= 6 && hour < 20;
}

export function mapWeatherCode(code: number): WeatherCondition {
  if (code === 0) {
    return "sunny";
  }
  if (code <= 3 || code === 45 || code === 48) {
    return "cloudy";
  }
  if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    return "rain";
  }
  if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    return "snow";
  }
  return "cloudy";
}

function formatHourLabel(isoTime: string): string {
  const date = new Date(isoTime);
  return date.toLocaleTimeString("cs-CZ", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  });
}

export function buildHourlyForecast(
  times: string[],
  temperatures: number[],
  codes: number[],
  count = 6,
): HourlyForecast[] {
  const now = Date.now();

  const slots = times
    .map((time, index) => ({
      time,
      temp: Math.round(temperatures[index]),
      condition: mapWeatherCode(codes[index]),
      timestamp: new Date(time).getTime(),
    }))
    .filter((slot) => slot.timestamp >= now)
    .slice(0, count);

  return slots.map((slot) => ({
    label: formatHourLabel(slot.time),
    temp: slot.temp,
    condition: slot.condition,
  }));
}

export async function fetchWeather(mesto: string): Promise<WeatherResult> {
  const coords = CITY_COORDS[mesto] ?? CITY_COORDS.Praha;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(coords.lat));
  url.searchParams.set("longitude", String(coords.lng));
  url.searchParams.set("current", "temperature_2m,weather_code,is_day");
  url.searchParams.set("hourly", "temperature_2m,weather_code");
  url.searchParams.set("forecast_hours", "12");
  url.searchParams.set("timezone", "Europe/Prague");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Weather API unavailable");
  }

  const data = (await response.json()) as {
    current: { temperature_2m: number; weather_code: number; is_day: number };
    hourly: {
      time: string[];
      temperature_2m: number[];
      weather_code: number[];
    };
  };

  return {
    condition: mapWeatherCode(data.current.weather_code),
    temp: Math.round(data.current.temperature_2m),
    hourly: buildHourlyForecast(
      data.hourly.time,
      data.hourly.temperature_2m,
      data.hourly.weather_code,
    ),
    isDay: data.current.is_day === 1,
  };
}
