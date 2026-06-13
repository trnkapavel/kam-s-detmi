import { CloudSun, ImageIcon, Users } from "lucide-react";

export type SplashHero = {
  image: string;
  alt: string;
  label: string;
  objectPosition?: string;
};

/** Kurátorovaný výběr míst z aplikace — vhodné pro úvodní splash. */
export const SPLASH_HERO_POOL: SplashHero[] = [
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Prague_07-2016_Zoo_img12_Acinonyx_jubatus.jpg/1280px-Prague_07-2016_Zoo_img12_Acinonyx_jubatus.jpg",
    alt: "Gepard v Zoo Praha",
    label: "Zoo Praha",
    objectPosition: "center 40%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/Stromovka%2C_piknikov%C3%A1_louka%2C_ko%C4%8D%C3%A1r.jpg/1280px-Stromovka%2C_piknikov%C3%A1_louka%2C_ko%C4%8D%C3%A1r.jpg",
    alt: "Pikniková louka ve Stromovce, Praha",
    label: "Stromovka",
    objectPosition: "center 42%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pet%C5%99%C3%ADn_tower_05_2018.jpg/1280px-Pet%C5%99%C3%ADn_tower_05_2018.jpg",
    alt: "Petřínská rozhledna, Praha",
    label: "Petřín",
    objectPosition: "center 35%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PragueCathedral03.jpg/1280px-PragueCathedral03.jpg",
    alt: "Katedrála sv. Víta na Pražském hradě",
    label: "Hradčany",
    objectPosition: "center 30%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hrad_Karl%C5%A1tejn_00.jpg/1280px-Hrad_Karl%C5%A1tejn_00.jpg",
    alt: "Hrad Karlštejn",
    label: "Karlštejn",
    objectPosition: "center 40%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Konopi%C5%A1t%C4%9B_ch%C3%A2teau_near_Bene%C5%A1ov%2C_Czech_Republic.JPG/1280px-Konopi%C5%A1t%C4%9B_ch%C3%A2teau_near_Bene%C5%A1ov%2C_Czech_Republic.JPG",
    alt: "Zámek Konopiště",
    label: "Konopiště",
    objectPosition: "center 45%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Botanic_Garden3%2C_Prague_Troja.jpg/1280px-Botanic_Garden3%2C_Prague_Troja.jpg",
    alt: "Botanická zahrada Troja, Praha",
    label: "Botanická zahrada",
    objectPosition: "center 50%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Detsky_ostrov_1.jpg/1280px-Detsky_ostrov_1.jpg",
    alt: "Dětský ostrov, Praha",
    label: "Dětský ostrov",
    objectPosition: "center 45%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/Hostiva%C5%99_Dam%2C_Prague_Hostiva%C5%99.jpg/1280px-Hostiva%C5%99_Dam%2C_Prague_Hostiva%C5%99.jpg",
    alt: "Hostivařská přehrada, Praha",
    label: "Hostivařská přehrada",
    objectPosition: "center 50%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0c/Cervena_Lhota_%28z%C3%A1mek%29.jpg/1280px-Cervena_Lhota_%28z%C3%A1mek%29.jpg",
    alt: "Zámek Červená Lhota",
    label: "Červená Lhota",
    objectPosition: "center 45%",
  },
  {
    image:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Cesky_Krumlov_%28Czech_Republic%29.jpg/1280px-Cesky_Krumlov_%28Czech_Republic%29.jpg",
    alt: "Český Krumlov, historické centrum",
    label: "Český Krumlov",
    objectPosition: "center 40%",
  },
];

export const SPLASH_CHIPS = [
  { label: "Počasí", icon: CloudSun },
  { label: "Fotky míst", icon: ImageIcon },
  { label: "2+ děti", icon: Users },
] as const;

const SPLASH_HERO_SESSION_KEY = "kam-s-detmi-splash-hero-index";

export function pickSplashHero(pool: SplashHero[] = SPLASH_HERO_POOL): SplashHero {
  if (pool.length === 0) {
    throw new Error("Splash hero pool is empty");
  }

  if (typeof window === "undefined") {
    return pool[0];
  }

  const stored = sessionStorage.getItem(SPLASH_HERO_SESSION_KEY);
  if (stored !== null) {
    const index = Number.parseInt(stored, 10);
    if (Number.isInteger(index) && index >= 0 && index < pool.length) {
      return pool[index];
    }
  }

  const index = Math.floor(Math.random() * pool.length);
  sessionStorage.setItem(SPLASH_HERO_SESSION_KEY, String(index));
  return pool[index];
}
