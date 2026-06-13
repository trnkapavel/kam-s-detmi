import type { CSSProperties } from "react";
import type { WeatherCondition } from "@/types";

type WeatherSceneProps = {
  condition: WeatherCondition;
  isDay: boolean;
};

const STAR_POSITIONS = [
  { x: "12%", y: "10%", delay: "0s", size: 2 },
  { x: "28%", y: "6%", delay: "0.4s", size: 3 },
  { x: "45%", y: "14%", delay: "0.8s", size: 2 },
  { x: "62%", y: "8%", delay: "1.2s", size: 2 },
  { x: "78%", y: "12%", delay: "0.2s", size: 3 },
  { x: "88%", y: "5%", delay: "1.6s", size: 2 },
  { x: "18%", y: "18%", delay: "1s", size: 2 },
  { x: "52%", y: "4%", delay: "0.6s", size: 2 },
  { x: "70%", y: "16%", delay: "1.4s", size: 2 },
  { x: "36%", y: "11%", delay: "0.3s", size: 3 },
  { x: "8%", y: "15%", delay: "1.8s", size: 2 },
  { x: "92%", y: "17%", delay: "0.9s", size: 2 },
] as const;

function Clouds({ variant }: { variant: "default" | "dark" | "light" }) {
  const modifier =
    variant === "dark"
      ? "weather-cloud--dark"
      : variant === "light"
        ? "weather-cloud--light"
        : "";

  return (
    <>
      <div className={`weather-cloud weather-cloud--1 ${modifier}`} />
      <div className={`weather-cloud weather-cloud--2 ${modifier}`} />
    </>
  );
}

export function WeatherScene({ condition, isDay }: WeatherSceneProps) {
  return (
    <div
      className={`weather-scene weather-scene--${condition} ${isDay ? "weather-scene--day" : "weather-scene--night"}`}
      aria-hidden="true"
    >
      {!isDay && (
        <div className="weather-stars">
          {STAR_POSITIONS.map((star, index) => (
            <span
              key={index}
              className="weather-star"
              style={
                {
                  left: star.x,
                  top: star.y,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  "--star-delay": star.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {isDay && condition === "sunny" && (
        <>
          <div className="weather-sun-glow" />
          <div className="weather-sun" />
        </>
      )}

      {!isDay && condition === "sunny" && <div className="weather-moon" />}

      {condition === "cloudy" && <Clouds variant="default" />}

      {condition === "rain" && (
        <>
          <Clouds variant="dark" />
          <div className="weather-rain">
            {Array.from({ length: 18 }).map((_, index) => (
              <span
                key={index}
                className="weather-rain-drop"
                style={
                  {
                    "--drop-delay": `${index * 0.12}s`,
                    left: `${(index * 5.4 + 2) % 96}%`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      )}

      {condition === "snow" && (
        <>
          <Clouds variant="light" />
          <div className="weather-snow">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="weather-snowflake"
                style={
                  {
                    "--flake-delay": `${index * 0.25}s`,
                    "--flake-x": `${(index * 17) % 100}%`,
                  } as CSSProperties
                }
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
