# User Flow — Check-in MVP

**Verze:** 1.0  
**Cíl:** Check-in do 2 minut, 6 kroků

---

## Přehled

```
[Lokace] → [Rodič] → [Dítě 1] → [Dítě 2] → [Počasí] → [Výsledky]
```

Progress bar nahoře. Zpět na předchozí krok vždy možné. Data jen v session (React state).

---

## Krok 1: Lokace

**Otázka:** „Kde jsi?"

| Input | Typ | Povinné |
|-------|-----|---------|
| Kraj | Select (MVP: Praha, Střední Čechy) | Ano |
| Město | Select nebo text | Ano |

**Poznámka:** GPS geolokace volitelně ve fázi 2. MVP = výběr z listu.

**Preset města MVP:**
- Praha: Praha
- Střední Čechy: Kladno, Mladá Boleslav, Benešov, Beroun, Kolín, Mělník, Příbram

---

## Krok 2: Rodič

**Otázka:** „Jak se dnes cítíš?"

| Input | Typ | Možnosti |
|-------|-----|----------|
| Energie | Single select | 😴 Unavený / 😊 OK / ⚡ Plný energie |
| Čas | Single select | Pár hodin / Půl dne / Celý den |

---

## Krok 3: Dítě 1

**Otázka:** „První dítě"

| Input | Typ | Možnosti |
|-------|-----|----------|
| Věk | Number (1–17) | Ruční zadání |
| Co chce | Multi select (max 3) | Bazén, Les, Park, Zoo, Muzeum, Hrad, Sport, Město, Příroda |
| Nálada | Single select | Klidné / Aktivní / Nervózní |

**Pravidlo:** Věk se neukládá trvale — jen pro aktuální session.

---

## Krok 4: Dítě 2

Stejná struktura jako Krok 3.

**UX hint:** Pokud obě děti chtějí totéž → zobrazit „Super, shodujete se! 🎉"

---

## Krok 5: Počasí

**Otázka:** „Jaké je počasí?"

| Input | Typ | Možnosti |
|-------|-----|----------|
| Auto | Toggle | Zapnuto = fetch z Open-Meteo pro vybrané město |
| Ruční override | Single select | ☀️ Slunečno / ☁️ Oblačno / 🌧️ Déšť / ❄️ Sníh |
| Teplota | Number (volitelné) | Z API nebo ručně |

Pokud API selže → automaticky přepnout na ruční výběr s informací.

---

## Krok 6: Výsledky

**URL:** `/vysledky` (state přes React context nebo sessionStorage)

### Layout výsledků

```
┌─────────────────────────────────────┐
│  Tvoje situace (shrnutí)            │
│  📍 Praha · 😴 Unavený · 🌧️ Déšť   │
│  👧 5 let: bazén · 👦 8 let: les   │
└─────────────────────────────────────┘

┌─ Společně (overlap) ────────────────┐
│  🏊 Aquapalace Praha               │
│  Proč: Splňuje bazén i zábavu...   │
└─────────────────────────────────────┘

┌─ Kompromis ────────────────────────┐
│  🌳 Park Stromovka + fontána       │
│  Proč: Venku, voda, méně energie..│
└─────────────────────────────────────┘

┌─ Rotace ───────────────────────────┐
│  Dnes bazén, příště les            │
│  Proč: Fairness mezi dětmi...      │
└─────────────────────────────────────┘

[ 🔄 Nový check-in ]  [ ⚠️ Ověř si otevírací dobu ]
```

### Pravidla zobrazení

- Max 5 karet doporučení
- Každá karta: název, typ resolveru, důvod (reason), odkaz (pokud url)
- Pokud konflikt: min 2 různé typy resolverů
- Disclaimer dole: „Tipy jsou orientační — ověř si aktuální otevírací dobu a ceny."

---

## Edge cases

| Situace | Chování |
|---------|---------|
| Obě děti stejné wants | Sekce konfliktu skryta, jen single matches |
| 0 aktivit po filtru | „V tvém okolí zatím nemáme tipy. Zkus jiné město." |
| API počasí down | Ruční výběr, info banner |
| Věk mimo rozsah všech aktivit | Upozornění + nejbližší match s varováním |

---

## Wireframe poznámky (pro implementaci)

- Mobile-first (rodič používá telefon)
- Velké touch targety (min 44px)
- Emoji pro rychlou orientaci, ne jako jediný nositel informace
- Progress: 6 teček nebo „Krok 3/6"

---

## Související dokumenty

- [implementation-spec.md](implementation-spec.md)
- [../project-charter.md](../project-charter.md)
