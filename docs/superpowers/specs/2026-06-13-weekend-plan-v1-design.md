# Víkendový plán v1 — Design Spec

**Datum:** 2026-06-13  
**Status:** Schváleno  
**Cíl:** A (praktičnost o víkendu) + B (chytřejší engine) v jedné vlně práce

---

## Problem

Rodič projde check-in a dostane tipy, ale v reálném víkendu chybí:

1. **Akce** — sdílení plánu partnerovi, rychlá navigace
2. **Pochopení** — proč konkrétní tip řeší konflikt dětí
3. **Opakování** — zbytečné vyplňování stejných údajů každý týden
4. **Zpětná vazba** — žádný loop pro dogfooding (`docs/feedback.md` má 0/4 víkendů)

Engine už umí overlap / sequential / compromise / rotation, ale sekvenční plán je jen text a konflikt není rozložený po dětech.

---

## Goals

| # | Cíl | Metrika |
|---|-----|---------|
| G1 | Sdílet plán jedním tapem | Nativní systémový share sheet (libovolná appka) nebo clipboard fallback |
| G2 | Sekvenční plán jako timeline | Časové sloty + navigace per zastávka |
| G3 | Konflikt vysvětlený per dítě | `childNotes` u overlap/compromise/sequential/rotation |
| G4 | Rychlejší opakovaný check-in | „Použít minulý týden?“ < 30 s |
| G5 | Lokální víkendový feedback | Uložení + export bez backendu |

---

## Non-Goals (YAGNI)

- Sdílitelný URL odkaz s uloženým plánem (backend)
- API endpoint pro feedback
- GPS „jsem tady“
- LLM generované texty
- Live opening hours API
- Sloučení kroků wizardu (samostatná vlna)

---

## Architecture

### Data model rozšíření

```ts
type ScheduleSlot = {
  label: string;       // "Dopoledne", "Odpoledne", …
  timeHint: string;    // "9:00–12:00"
  activityId: string;
};

type Recommendation = {
  type: RecommendationType;
  activities: Activity[];
  reason: string;
  score: number;
  schedule?: ScheduleSlot[];      // sequential only
  childNotes?: string[];          // one line per child
  alternativeId?: string;         // second-best same resolver type
};
```

### Nové moduly

| Modul | Odpovědnost |
|-------|-------------|
| `src/engine/schedule.ts` | Generování `schedule` z `timeAvailable` + pořadí aktivit |
| `src/engine/child-notes.ts` | Deterministické `childNotes` šablony |
| `src/engine/distance-score.ts` | Bonus/penalizace vzdálenosti od `CITY_COORDS` |
| `src/lib/check-in-prefs.ts` | `localStorage` paměť posledního check-inu |
| `src/lib/plan-share.ts` | Text pro sdílení + Web Share API |
| `src/lib/weekend-feedback.ts` | Lokální feedback store + export |
| `src/lib/maps-links.ts` | Apple Maps vs Google Maps podle platformy |
| `src/components/results/PlanTimeline.tsx` | Timeline UI pro sequential |
| `src/components/results/SharePlanButton.tsx` | Sdílení v hlavičce výsledků |
| `src/components/results/WeekendFeedback.tsx` | 👍/👎 panel |
| `src/components/check-in/PrefsRestoreBanner.tsx` | „Použít minulý týden?“ |

### Flow

```
CheckInWizard
  └─ PrefsRestoreBanner (localStorage prefs)
       └─ prefill state

POST /api/recommend
  └─ recommend()
       ├─ scoreActivities() + distance bonus
       ├─ buildRecommendations() + schedule + childNotes + alternativeId
       └─ JSON response

/vysledky
  ├─ SharePlanButton
  ├─ RecommendationCard
  │    ├─ childNotes
  │    ├─ PlanTimeline (if sequential)
  │    └─ alternative link
  └─ WeekendFeedback
```

---

## Feature Spec

### A1 — Sdílení plánu (univerzální)

Jedno tlačítko **„Sdílet“** — žádná vazba na konkrétní appku (WhatsApp, Telegram…). Rodič si vybere cíl v systémovém share sheetu.

**Primární cesta — Web Share API (`navigator.share`)**

- Podporováno na iOS Safari, Android Chrome, některých desktop Safari
- Otevře nativní panel s volbou: WhatsApp, iMessage, Mail, Poznámky, AirDrop, Slack, …
- Payload:
  ```ts
  navigator.share({
    title: "Kam s dětmi — tipy na výlet",
    text: "<formátovaný plán>",
    url: "<origin appky>",  // zvyšuje kompatibilitu s appkami, které berou jen url
  })
  ```
- Text obsahuje: město, počasí, každá karta (typ + názvy aktivit), sekvenční plán jako očíslovaný seznam s časy
- `url` je i na konci `text` pro appky, které ignorují pole `url`

**Fallback řetězec (když `navigator.share` není k dispozici)**

1. `navigator.clipboard.writeText(text)` + toast „Zkopírováno — vlož kam potřebuješ“
2. Pokud clipboard selže: zobrazit modal s readonly textarea + tlačítko „Kopírovat“

**UX detaily**

- Zrušení share sheetu uživatelem (`AbortError`) → žádná chyba, žádný toast
- Po úspěchu: krátký toast „Sdíleno“ (ne „Sdíleno na WhatsApp“)
- Ikona: obecné „share“ (ne logo WhatsApp)
- Tlačítko v hlavičce výsledků, dostupné i na mobilu i desktopu

### A2 — Navigace

- Existující tlačítko „Mapy“ zůstává, ale u sequential timeline je Mapy u každého slotu
- `maps-links.ts`: na iOS `maps.apple.com`, jinde Google Maps
- Primární vizuální váha: navigace jako hlavní akce u každého tipu

### A3 — Paměť check-inu

- Klíč `kam-s-detmi-check-in-prefs` v `localStorage`
- Ukládá: `kraj`, `mesto`, `energy`, `timeAvailable`, `children[]` (age, wants, mood — bez jmen)
- Ukládá se po úspěšném odeslání check-inu (ne při každém kroku)
- Banner na začátku wizardu: „Použít nastavení z minulého týdne?“ [Ano] [Ne]
- Po „Ne“ banner zmizí do konce session (`sessionStorage`)

### A4 — Víkendový feedback

- Panel na konci `/vysledky`: „Použili jste něco z tipů?“
- Odpovědi: `used` | `not_used` | `skipped`
- Volitelně: index doporučení (0-based) pokud `used`
- Uložení do `localStorage` klíč `kam-s-detmi-weekend-feedback[]`
- Tlačítko „Exportovat feedback“ → stáhne `.txt` nebo zkopíruje markdown pro `feedback.md`
- Zobrazit max jednou per výsledkovou session (`sessionStorage` flag)

### B1 — Timeline (sequential)

- `schedule.ts` mapuje `timeAvailable`:
  - `few_hours` → 1 slot „Teď“
  - `half_day` → „Dopoledne 9:00–12:00“, „Odpoledne 13:00–16:00“
  - `full_day` → „Dopoledne“, „Odpoledne“, „Večer“ (3+ aktivit)
- `PlanTimeline.tsx`: svislá čára, čas, název, tlačítko Mapy

### B2 — Child notes

- `child-notes.ts` generuje řádky typu:
  - overlap: „Dítě 1: bazén ✓ · Dítě 2: les ✓“
  - sequential: „Dítě 1 → Aquapalace · Dítě 2 → Stromovka“
  - compromise: „Částečně všem — méně ideální, ale jednoduché“
  - rotation: „Dnes priorita dítěte 1, příště dítě 2“
- Zobrazit pod nadpisem karty jako `childNotes` list

### B3 — Alternativa B

- Po sestavení doporučení: pro každou kartu najít 2. aktivitu stejného resolver typu ze `scored` (jiné `id`, score > 0)
- Uložit `alternativeId` na `Recommendation`
- UI: textový link „Nebo zkus: {name}“ — klik scrollne na kartu nebo expandne inline preview (YAGNI: jen text link na maps/web)

### B4 — Vzdálenost ve skóre

- `distance-score.ts`: haversine od `CITY_COORDS[mesto]`
- Bonus: ≤10 km → +10, ≤25 km → +5
- Penalizace: >25 km → −15, >50 km → −30
- `tired` rodič: penalizace ×1.5
- Pouze pokud aktivita má `coordinates`
- Unit testy v `tests/engine/distance-score.test.ts`

---

## UI Changes

### `/vysledky` header

```
[ Tvoje tipy ]                    [ Sdílet ]
3 tipy · Jindřichův Hradec
```

### Recommendation card (sequential)

```
┌─ Sekvenční plán ──────────────────────┐
│  Dítě 1 → Aquapalace · Dítě 2 → Les   │
│                                        │
│  9:00  Dopoledne                       │
│  │     Aquapalace Praha    [ Mapy ]    │
│  13:00 Odpoledne                       │
│  │     Stromovka           [ Mapy ]    │
│                                        │
│  Proč: …                               │
│  Nebo zkus: …                          │
└────────────────────────────────────────┘
```

---

## Testing

| Oblast | Soubor | Co testovat |
|--------|--------|-------------|
| Schedule | `tests/engine/schedule.test.ts` | half_day → 2 sloty, few_hours → 1 |
| Child notes | `tests/engine/child-notes.test.ts` | overlap 2 děti, sequential chain |
| Distance | `tests/engine/distance-score.test.ts` | bonus blízko, penalizace daleko + tired |
| Conflict integration | `tests/engine/conflict.test.ts` | schedule + childNotes přítomné |
| Share text | `tests/lib/plan-share.test.ts` | formát textu, sequential číslování |
| Prefs | `tests/lib/check-in-prefs.test.ts` | save/load roundtrip |
| Feedback | `tests/lib/weekend-feedback.test.ts` | append + export markdown |

Existující `dogfood-scenarios.test.ts` musí projít beze změny chování (jen nová volitelná pole).

---

## Success Criteria

- [ ] Sdílení otevře systémový share sheet na iOS/Android (libovolná cílová appka)
- [ ] Desktop bez Web Share API nabídne clipboard / ruční kopírování
- [ ] Sequential karta zobrazuje timeline s časy
- [ ] Konfliktní scénář má `childNotes` u ≥1 karty
- [ ] „Použít minulý týden?“ předvyplní wizard
- [ ] Feedback uložen lokálně a exportovatelný
- [ ] Všechny testy projdou (`npm test`)

---

## Decisions Log

| Rozhodnutí | Volba | Důvod |
|------------|-------|-------|
| Feedback storage | localStorage + export | Schváleno — bez backendu |
| Sdílení | Web Share API → clipboard → modal | Univerzální, ne jen WhatsApp; bez URL state plánu |
| Maps | Apple na iOS, Google jinde | Nativní UX |
| Alternativa B | Text link, ne druhá karta | YAGNI |

---

## Related Docs

- [docs/project-charter.md](../../project-charter.md)
- [docs/feedback.md](../../feedback.md)
- [docs/spec/user-flow.md](../../spec/user-flow.md)
- Implementation plan: [docs/superpowers/plans/2026-06-13-weekend-plan-v1.md](../plans/2026-06-13-weekend-plan-v1.md)
