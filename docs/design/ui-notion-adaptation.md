# UI Design — Notion adaptace (Kam s dětmi)

**Verze:** 1.0  
**Datum:** 2026-06-13  
**Status:** Schváleno, implementováno  
**Zdroj tokenů:** [notion/DESIGN.md](../../notion/DESIGN.md)

---

## Cíl

Plná adaptace Notion design tokenů pro mobilní check-in aplikaci — fialové CTA, charcoal typography, hairline borders, pastel karty. **Bez** navy marketing hero (rodič jde rovnou do wizardu).

---

## 1. Design tokens (CSS variables)

Soubor: `src/app/globals.css` + volitelně `src/lib/design-tokens.ts`

### Barvy — core

| Token | Hodnota | Použití |
|-------|---------|---------|
| `--primary` | `#5645d4` | Primární CTA |
| `--primary-pressed` | `#4534b3` | Active stav tlačítka |
| `--canvas` | `#ffffff` | Pozadí stránky, karty |
| `--surface` | `#f6f5f4` | Sekce, sticky footer, weather preview |
| `--hairline` | `#e5e3df` | Borders karet |
| `--hairline-strong` | `#c8c4be` | Input borders, unselected options |
| `--ink` | `#1a1a1a` | Nadpisy |
| `--charcoal` | `#37352f` | Body text (Notion signature) |
| `--slate` | `#5d5b54` | Sekundární text |
| `--steel` | `#787671` | Captions, disclaimer |
| `--link` | `#0075de` | „Více informací" odkazy |

### Pastel karty — typ doporučení

| Typ | Token pozadí | Token badge text |
|-----|--------------|------------------|
| `single` | `card-tint-cream` `#f8f5e8` | `charcoal` |
| `overlap` | `card-tint-mint` `#d9f3e1` | `brand-green` `#1aae39` |
| `sequential` | `card-tint-sky` `#dcecfa` | `link-blue` `#0075de` |
| `compromise` | `card-tint-peach` `#ffe8d4` | `brand-orange-deep` `#793400` |
| `rotation` | `card-tint-lavender` `#e6e0f5` | `brand-purple-800` `#391c57` |

### Shrnutí situace

- Pozadí: `--surface` (`#f6f5f4`)
- Border: `1px solid --hairline`
- Radius: `12px` (`rounded-lg`)

---

## 2. Typografie

**Font:** Inter (Google Fonts) — fallback Notion Sans stack z DESIGN.md

| Element | Token | Tailwind approx |
|---------|-------|-----------------|
| App title | heading-4 (22px/600) | `text-[22px] font-semibold` |
| Step title | heading-5 (18px/600) | `text-lg font-semibold` |
| Body | body-md (16px/400) | `text-base` |
| Labels | body-sm-medium (14px/500) | `text-sm font-medium` |
| Caption | caption (13px/400) | `text-[13px]` |
| Button | button-md (14px/500) | `text-sm font-medium` |

**Barvy textu:** nadpisy `--ink`, body `--charcoal`, labels `--slate`, muted `--steel`

---

## 3. Komponenty

### Button Primary (`button-primary`)

- BG: `#5645d4`, text white
- Padding: `10px 18px`, min-height 44px
- Radius: **8px** (`rounded-md`) — NOT pill
- Stavy: pressed `#4534b3`, disabled `hairline` + `muted` text

**Použití:** „Pokračovat", „Najít tipy", „Nový check-in"

### Button Secondary (`button-secondary`)

- Transparent, border `hairline-strong`, text `ink`
- **Použití:** „Zpět"

### Option tile (nahradí OptionButton)

Místo sky-blue pill:

**Unselected:**
- BG `canvas`, border `1px hairline-strong`
- Text `charcoal`, radius `8px`, padding `12px 16px`, min-height 44px

**Selected:**
- BG `card-tint-lavender`, border `2px primary`
- Text `ink`, font-medium

Grid: 2 sloupce pro aktivity, 1 sloupec pro energii/čas

### Text input (věk, teplota)

- Height 44px, border `hairline-strong`, radius `8px`
- Focus: `2px solid primary`
- Typography body-md

### Progress bar

Segmented underline styl (Notion `segmented-tab`):

- 5 segmentů = 5 kroků
- Active/done: spodní border `2px ink`
- Pending: border `hairline-soft`

### Badge typu tipu

- `badge-tag-*` podle pastel karty (viz tabulka výše)
- Radius `6px` (`rounded-sm`), caption-bold 13px

### Link

- `link-blue` `#0075de`, body-sm-medium, **bez** fialové (Notion pravidlo)

---

## 4. Obrazovky

### 4.1 Check-in wizard (společný layout)

```
┌─────────────────────────────┐
│ Kam s dětmi          (H4)   │  ← ink
│ Check-in trvá do 2 min      │  ← steel caption
├─────────────────────────────┤
│ Krok 2/5  ████░░░░░         │  ← segmented progress
├─────────────────────────────┤
│                             │
│  [Obsah kroku]              │
│                             │
├─────────────────────────────┤
│ surface sticky footer       │
│ [Zpět secondary] [Primary]  │
└─────────────────────────────┘
```

- Page BG: `canvas` white
- Content max-width: `512px` (mobile-first)
- Footer: `surface` + top border `hairline` + safe-area

### 4.2 Krok — Lokace

- Label „Kraj" / „Město" — body-sm-medium slate
- Kraj: 2 option tiles (full width)
- Město: 2-col grid option tiles

### 4.3 Krok — Rodič

- Energie: 3 tiles s emoji + label (1 col)
- Čas: 3 tiles (1 col)

### 4.4 Krok — Dítě

- Věk: text-input
- Aktivity: 2-col option tiles, max 3 výběry
- Nálada: 3 tiles
- Shoda hint: `card-tint-mint` banner, text brand-green

### 4.5 Krok — Počasí

- Preview card: `card-tint-sky`, border hairline, radius lg
- Loading: spinner v primary barvě
- Manual override: option tiles jako ostatní kroky
- Link „Upravit ručně" / „Znovu načíst" — button-link style

### 4.6 Výsledky `/vysledky`

```
┌─────────────────────────────┐
│ Tvoje tipy           (H4)   │
│ 5 tipů pro Praha     (cap)  │
├─────────────────────────────┤
│ ┌ surface summary card ───┐ │
│ │ Tvoje situace           │ │
│ │ 📍 Praha · 😴 · 🌧️     │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ ┌ mint card ──────────────┐ │
│ │ [Společně]              │ │
│ │ Aquapalace Praha        │ │
│ │ Proč: ...               │ │
│ │ Více informací →        │ │
│ └─────────────────────────┘ │
│ ┌ peach card ─────────────┐ │
│ │ [Kompromis]             │ │
│ ...                         │
├─────────────────────────────┤
│ disclaimer (steel micro)    │
│ [button-primary full width] │
└─────────────────────────────┘
```

- Karty: pastel BG podle typu, border `hairline`, radius `12px`, padding `24px`
- Shadow: **žádný** na karty (Notion flat cards) — jen border
- Název aktivity: heading-5 ink
- Popis: body-sm charcoal

### 4.7 Empty / error stavy

- Error: `card-tint-rose` nebo border semantic-error
- Empty region: `surface` card + secondary CTA

---

## 5. Implementační pořadí (po schválení)

1. `globals.css` — CSS variables + Inter font
2. `src/components/ui/Button.tsx` — primary, secondary
3. Refactor `OptionButton` → Notion option tile
4. `ProgressBar` → segmented style
5. `ResultsView` — pastel karty + badge mapping
6. `CheckInWizard` + `WeatherStep` — layout tokens
7. `layout.tsx` — Inter via `next/font/google`

**Odhad:** 1 deep day (bez Figma, přímo v kódu)

---

## 6. Co z Notion NEPOUŽÍVÁME

- Navy hero band (`brand-navy`) — marketing, ne app
- 80px hero-display typography
- Workspace mockup shadow level 3
- Pricing cards, footer 6-column
- Pill-shaped buttons (`rounded-full`) pro CTA

---

## 7. Schválení

- [x] Tokeny a barvy OK
- [x] Komponenty OK
- [x] Obrazovky OK
- [x] Pastel mapping pro tipy OK

Po schválení → implementace podle sekce 5.
