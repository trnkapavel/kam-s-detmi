import type { WeatherCondition } from "@/types";
import { CITY_COORDS } from "./constants";

type WeatherResult = {
  condition: WeatherCondition;
  temp: number;
};

function mapWeatherCode(code: number): WeatherCondition {
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

export async function fetchWeather(mesto: string): Promise<WeatherResult> {
  const coords = CITY_COORDS[mesto] ?? CITY_COORDS.Praha;

  const url = new URL("https://api.open-meteo.com/v1/forecast");
  url.searchParams.set("latitude", String(coords.lat));
  url.searchParams.set("longitude", String(coords.lng));
  url.searchParams.set("current", "temperature_2m,weather_code");
  url.searchParams.set("timezone", "Europe/Prague");

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Weather API unavailable");
  }

  const data = (await response.json()) as {
    current: { temperature_2m: number; weather_code: number };
  };

  return {
    condition: mapWeatherCode(data.current.weather_code),
    temp: Math.round(data.current.temperature_2m),
  };
}
