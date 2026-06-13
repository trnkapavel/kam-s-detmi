#!/usr/bin/env node
/**
 * Naplní data/places/places.json pouze fotkami z Wikimedia Commons.
 * Kde není zdroj, image/images zůstanou prázdné → v UI ilustrace.
 */
const fs = require("fs");
const path = require("path");
const https = require("https");

const ROOT = path.join(__dirname, "..");
const PLACES_PATH = path.join(ROOT, "data", "places", "places.json");
const UA = "KamSDetmi/1.0 (https://github.com/kam-s-detmi)";
const DELAY_MS = 1500;

const CURATED = {
  "praha-zoo": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Prague_07-2016_Zoo_img12_Acinonyx_jubatus.jpg/1280px-Prague_07-2016_Zoo_img12_Acinonyx_jubatus.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Prague_07-2016_Zoo_img10_chairlift.jpg/1280px-Prague_07-2016_Zoo_img10_chairlift.jpg",
  ],
  "praha-hradcany": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/PragueCathedral03.jpg/1280px-PragueCathedral03.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Guard_at_the_Prague_castle%2C_Prague_-_7620_%28cropped%29.jpg/1280px-Guard_at_the_Prague_castle%2C_Prague_-_7620_%28cropped%29.jpg",
  ],
  "praha-petrin": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Pet%C5%99%C3%ADn_tower_05_2018.jpg/1280px-Pet%C5%99%C3%ADn_tower_05_2018.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Prague_07-2016_View_from_Petrinska_Tower_img2.jpg/1280px-Prague_07-2016_View_from_Petrinska_Tower_img2.jpg",
  ],
  "stredocesky-karlstejn": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Hrad_Karl%C5%A1tejn_00.jpg/1280px-Hrad_Karl%C5%A1tejn_00.jpg",
  ],
  "stredocesky-konopiste": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Konopi%C5%A1t%C4%9B_ch%C3%A2teau_near_Bene%C5%A1ov%2C_Czech_Republic.JPG/1280px-Konopi%C5%A1t%C4%9B_ch%C3%A2teau_near_Bene%C5%A1ov%2C_Czech_Republic.JPG",
    "https://upload.wikimedia.org/wikipedia/commons/2/2d/Konopiste_CZ_02.jpg",
  ],
};

const WIKI_SEARCH = {
  "praha-aquapalace": "Aquapalace Praha Čestlice",
  "praha-stromovka": "Stromovka park Prague",
  "praha-podoli-bazen": "Podolí swimming stadium Prague",
  "praha-hostivarska-prehrada": "Hostivař reservoir Prague",
  "praha-kunraticky-les": "Kunratice Prague forest",
  "praha-ntm": "National Technical Museum Prague",
  "praha-divoka-sarka": "Divoká Šárka Prague",
  "praha-motol-koupaliste": "Motol swimming pool Prague",
  "praha-planetarium": "Planetarium Prague Stromovka",
  "praha-botanicka-zahrada": "Prague Botanic Garden Troja",
  "praha-prokopske-udoli": "Prokopské údolí Prague",
  "praha-staromestske-namesti": "Old Town Square Prague",
  "praha-narodni-muzeum": "National Museum Prague Wenceslas Square",
  "praha-vysehrad": "Vyšehrad Prague castle",
  "praha-detsky-ostrov": "Children Island Prague",
  "praha-hamr-zbraslav": "Zbraslav swimming pool Prague",
  "praha-letna": "Letná Park Prague",
  "praha-modranska-rokle": "Modřanská rokle Prague",
  "praha-hamr-bulovka": "Bulovka swimming pool Prague",
  "praha-kralovstvi-ziraf": "Kingdom of Giraffes Prague",
  "stredocesky-kladno-koupaliste": "Kladno swimming pool",
  "stredocesky-skoda-museum": "Škoda Museum Mladá Boleslav",
  "stredocesky-brdy": "Brdy forest Czech Republic",
  "stredocesky-kokorinsko": "Kokořín castle Czech Republic",
  "stredocesky-krivoklat": "Křivoklát castle",
  "stredocesky-svatý-jan": "Svatý Jan pod Skalou",
  "stredocesky-melnik-zamek": "Mělník castle",
  "stredocesky-kolin-namesti": "Kolín main square",
  "stredocesky-lidice": "Lidice memorial",
  "stredocesky-sternberk": "Šternberk castle Czech Republic",
  "stredocesky-svata-hora": "Svatá Hora Příbram",
  "stredocesky-beroun-koupaliste": "Beroun swimming pool",
  "stredocesky-boleslav-park": "Mladá Boleslav park",
};

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadActivities() {
  const praha = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/activities/praha.json"), "utf8"),
  ).activities;
  const stred = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/activities/stredocesky.json"), "utf8"),
  ).activities;
  return [...praha, ...stred];
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { "User-Agent": UA } }, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve({ status: res.statusCode, data }));
      })
      .on("error", reject);
  });
}

function dedupeKey(url) {
  const decoded = decodeURIComponent(url);
  const file = decoded.match(/\/([^/?]+)(?:\?|$)/)?.[1] ?? decoded;
  return file.replace(/^\d+px-/, "");
}

function dedupe(images) {
  const seen = new Set();
  return images.filter((url) => {
    const key = dedupeKey(url);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
}

async function wikiImages(query, limit = 4) {
  const params = new URLSearchParams({
    action: "query",
    generator: "search",
    gsrsearch: query,
    gsrnamespace: "6",
    gsrlimit: String(limit),
    prop: "imageinfo",
    iiprop: "url",
    iiurlwidth: "1280",
    format: "json",
  });
  const { status, data } = await fetchText(
    `https://commons.wikimedia.org/w/api.php?${params.toString()}`,
  );
  if (status !== 200 || data.startsWith("You are")) {
    return [];
  }
  const json = JSON.parse(data);
  return Object.values(json.query?.pages ?? {})
    .map((page) => page.imageinfo?.[0]?.thumburl)
    .filter((url) => url && url.includes("wikimedia.org"));
}

async function resolveImages(activity) {
  if (CURATED[activity.id]?.length) {
    return dedupe(CURATED[activity.id]);
  }

  const query = WIKI_SEARCH[activity.id] ?? activity.name;
  await sleep(DELAY_MS);
  const found = await wikiImages(query);
  return dedupe(found).slice(0, 3);
}

async function main() {
  const activities = loadActivities();
  const places = JSON.parse(fs.readFileSync(PLACES_PATH, "utf8"));
  const withPhoto = [];
  const withoutPhoto = [];

  for (const activity of activities) {
    const images = await resolveImages(activity);
    places[activity.id] = {
      ...(places[activity.id] ?? {}),
      image: images[0] ?? "",
      images,
    };
    if (images.length) {
      withPhoto.push(activity.id);
    } else {
      withoutPhoto.push(activity.id);
    }
    process.stdout.write(images.length ? "+" : ".");
  }

  fs.writeFileSync(PLACES_PATH, `${JSON.stringify(places, null, 2)}\n`);
  console.log(`\nWikimedia: ${withPhoto.length} / ${activities.length}`);
  if (withoutPhoto.length) {
    console.log("Ilustrace:", withoutPhoto.join(", "));
  }
}

main().catch(console.error);
