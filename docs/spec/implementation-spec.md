# Implementační specifikace — MVP

**Verze:** 1.0  
**Datum:** 2026-06-13  
**Status:** Schváleno k implementaci

---

## Tech stack

| Vrstva | Volba | Důvod |
|--------|-------|-------|
| Framework | Next.js 15 (App Router) | Rychlý start, SSR/SSG, deploy |
| Jazyk | TypeScript | Typy pro engine a data |
| Styling | Tailwind CSS | Solo-friendly, rychlé UI |
| Aktivity | JSON v `data/activities/` | Bez DB, snadná editace |
| Počasí | Open-Meteo API | Zdarma, bez API klíče |
| Engine | TypeScript moduly | Deterministický, unit-testovatelný |
| Testy | Vitest | Rychlé unit testy engine |
| Deploy | Vercel | Free tier, CI/CD |

---

## Datové modely

### Activity

```typescript
type ActivityType =
  | "bazen"
  | "les"
  | "park"
  | "muzeum"
  | "zoo"
  | "hrad"
  | "aquapark"
  | "koupaliste"
  | "indoor"
  | "kino"
  | "sport"
  | "priroda"
  | "mesto"

type Kraj =
  | "Praha"
  | "Stredocesky"
  // rozšíření ve vlně 2+

type WeatherTag = "any" | "sunny" | "rain_ok" | "indoor_only"
type EnergyLevel = "low" | "medium" | "high"
type Duration = "few_hours" | "half_day" | "full_day"
type ConflictResolver = "overlap" | "sequential" | "compromise" | "rotation"

type Activity = {
  id: string
  name: string
  description: string
  region: {
    kraj: Kraj
    okres: string
    mesto: string
  }
  tags: {
    type: ActivityType[]
    ageMin: number
    ageMax: number
    energyParent: EnergyLevel[]
    weather: WeatherTag[]
    duration: Duration
  }
  conflictResolvers: ConflictResolver[]
  coordinates?: { lat: number; lng: number }
  url?: string
}
```

### CheckIn (session only — neukládat na server)

```typescript
type ChildMood = "calm" | "active" | "cranky"
type ParentEnergy = "tired" | "ok" | "energetic"
type TimeAvailable = "few_hours" | "half_day" | "full_day"
type WeatherCondition = "sunny" | "cloudy" | "rain" | "snow"

type ChildInput = {
  age: number
  wants: ActivityType[]
  mood: ChildMood
}

type CheckIn = {
  location: { mesto: string; kraj: Kraj }
  parent: {
    energy: ParentEnergy
    timeAvailable: TimeAvailable
  }
  children: [ChildInput, ChildInput]
  weather: {
    condition: WeatherCondition
    temp: number
    source: "api" | "manual"
  }
}
```

### Recommendation (výstup engine)

```typescript
type RecommendationType = ConflictResolver | "single"

type Recommendation = {
  type: RecommendationType
  activities: Activity[]
  reason: string
  score: number
}
```

---

## Scoring engine

Soubor: `src/engine/score.ts`

```
skóre aktivity =
  + 30  pokud tags.type matchuje wants dítěte 1 NEBO 2
  + 20  pokud věk obou dětí spadá do ageMin–ageMax
  + 20  pokud weather kompatibilní
  + 15  pokud energyParent sedí k parent.energy
  + 15  pokud duration sedí k timeAvailable
  - 50  pokud outdoor aktivita a prší (kromě rain_ok / indoor_only)
```

### Mapování parent.energy → energyParent

| parent.energy | Preferované energyParent |
|---------------|-------------------------|
| tired | low |
| ok | low, medium |
| energetic | medium, high |

### Mapování weather

| condition | Povolené weather tagy |
|-----------|----------------------|
| sunny, cloudy | any, sunny, rain_ok |
| rain | indoor_only, rain_ok |
| snow | indoor_only, any (outdoor se sníženým skóre -20) |

---

## Filter engine

Soubor: `src/engine/filter.ts`

1. Filtruj aktivity podle `location.kraj` (a volitelně `mesto` / radius)
2. Hard filter: věk dětí mimo rozsah → vyřadit
3. Hard filter: déšť + outdoor bez `rain_ok` → vyřadit
4. Předej zbylé na scoring

---

## Conflict engine

Soubor: `src/engine/conflict.ts`

### Detekce konfliktu

```typescript
function hasConflict(children: [ChildInput, ChildInput]): boolean {
  const wants1 = new Set(children[0].wants)
  const wants2 = new Set(children[1].wants)
  return !children[0].wants.some(w => wants2.has(w))
}
```

### Resolvery (v pořadí priority)

#### 1. OVERLAP
Aktivita, jejíž `tags.type` obsahuje typy z obou dětí.
Příklad: `{ bazen, park }` → aquapark, koupaliště s hřištěm.

#### 2. SEQUENTIAL
Dvojice aktivit blízko sebe (pokud `parent.energy !== "tired"`).
Max vzdálenost: 15 km (haversine z coordinates).
Každá aktivita matchuje wants jednoho dítěte.

#### 3. COMPROMISE
Aktivita s `conflictResolvers` obsahujícím `"compromise"`.
Částečný match — park s vodní fontánou místo bazénu.

#### 4. ROTATION
Vždy dostupné jako fallback.
Text: „Dnes [aktivita pro dítě 1], příště [aktivita pro dítě 2]."

### Výstup

Max **5 doporučení**, seřazených dle skóre. Minimálně 1 z každého dostupného resolver typu při konfliktu.

Každé doporučení obsahuje `reason` string v češtině.

---

## Počasí integrace

Soubor: `src/lib/weather.ts`

- API: `https://api.open-meteo.com/v1/forecast`
- Parametry: lat/lng z lokace nebo preset pro město
- Fallback: ruční override v check-in formuláři
- Cache: 30 min (session / memory)

---

## Struktura souborů

```
kam-s-detmi/
├── data/
│   └── activities/
│       ├── praha.json
│       └── stredocesky.json
├── docs/                          # dokumentace
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx               # check-in wizard
│   │   └── vysledky/
│   │       └── page.tsx           # výsledky
│   ├── components/
│   │   ├── CheckInForm.tsx
│   │   ├── ChildStep.tsx
│   │   ├── LocationStep.tsx
│   │   ├── ParentStep.tsx
│   │   ├── WeatherStep.tsx
│   │   └── ResultsList.tsx
│   ├── engine/
│   │   ├── index.ts               # orchestrace
│   │   ├── score.ts
│   │   ├── filter.ts
│   │   └── conflict.ts
│   ├── lib/
│   │   ├── activities.ts          # načtení JSON
│   │   └── weather.ts
│   └── types/
│       └── index.ts               # sdílené typy
├── tests/
│   └── engine/
│       ├── score.test.ts
│       ├── filter.test.ts
│       └── conflict.test.ts
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── vitest.config.ts
```

---

## Test scénáře (povinné)

| ID | Scénář | Očekávaný výstup |
|----|--------|------------------|
| T1 | Unavený rodič, déšť, bazén vs. les | Indoor / overlap tipy, žádný sequential |
| T2 | Energický rodič, slunečno, bazén vs. les | Overlap + sequential |
| T3 | Obě děti chtějí zoo | Single match, vysoké skóre |
| T4 | Dítě 3 roky vs. aktivita 6+ | Vyřazeno filtrem věku |
| T5 | Praha, půl dne, cloudy | Top 5 dle skóre, max 2h cesta |

---

## API / Server

MVP nepotřebuje backend databázi. Volitelně:
- Server Action pro načtení počasí (skrýt CORS)
- Statické JSON aktivity načtené at build time nebo import

Check-in state: React state → URL search params pro sdílení (volitelně, fáze 2).

---

## Související dokumenty

- [user-flow.md](user-flow.md)
- [../data/activity-schema.md](../data/activity-schema.md)
- [../context/decisions.md](../context/decisions.md)
