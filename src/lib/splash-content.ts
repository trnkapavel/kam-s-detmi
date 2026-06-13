import { CloudSun, ImageIcon, Users } from "lucide-react";

/** Úvodní fotka — Stromovka, rodina s kočárkem (Wikimedia Commons) */
export const SPLASH_HERO_IMAGE =
  "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Stromovka%2C_piknikov%C3%A1_louka%2C_ko%C4%8D%C3%A1r.jpg/1280px-Stromovka%2C_piknikov%C3%A1_louka%2C_ko%C4%8D%C3%A1r.jpg";

export const SPLASH_HERO_ALT = "Rodina na piknikové louce ve Stromovce, Praha";

export const SPLASH_CHIPS = [
  { label: "Počasí", icon: CloudSun },
  { label: "Fotky míst", icon: ImageIcon },
  { label: "2+ děti", icon: Users },
] as const;
