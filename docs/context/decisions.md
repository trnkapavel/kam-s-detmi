# Zamčená rozhodnutí

**Pravidlo:** Tato rozhodnutí neměnit bez explicitního souhlasu v konverzaci nebo Change Request v docs.

**Poslední aktualizace:** 2026-06-13

---

## Produkt

| # | Rozhodnutí | Důvod |
|---|------------|-------|
| P1 | Web first, mobilní appka fáze 2 | Rychlejší validace, nižší náklady |
| P2 | Engine = přístup A (pravidla + skórování) | Transparentní, testovatelné, bez LLM nákladů v MVP |
| P3 | LLM až po dogfoodingu | Halucinace, GDPR, náklady |
| P4 | Bez uživatelských účtů v MVP | YAGNI, méně security surface |
| P5 | Věk dětí ručně při každém check-inu | Mění se, méně GDPR, žádný profil |
| P6 | Žádná jména dětí | Privacy by design |
| P7 | Check-in data jen v session | Neukládat na server v MVP |

---

## Regiony

| # | Rozhodnutí | Důvod |
|---|------------|-------|
| R1 | Cíl: celá ČR | Produktový záměr |
| R2 | MVP start: Praha + Střední Čechy | Realistický seed pro solo |
| R3 | Tagování kraj + okres + mesto od začátku | Rozšíření bez refactoru |
| R4 | ~40–50 aktivit ve vlně 1 | Kvalita > kvantita |

---

## Technické

| # | Rozhodnutí | Důvod |
|---|------------|-------|
| T1 | Next.js + TypeScript + Tailwind | Solo-friendly, rychlý deploy |
| T2 | Aktivity v JSON souborech | Bez DB, snadná editace |
| T3 | Open-Meteo pro počasí | Zdarma, bez API klíče |
| T4 | Vitest pro testy engine | Unit testy score/conflict povinné |
| T5 | Deploy: Vercel + GitHub auto-deploy | Push na `main` → produkce |
| T6 | Jazyk UI: čeština, kód: angličtina | Konvence |

---

## Plánování

| # | Rozhodnutí | Důvod |
|---|------------|-------|
| L1 | Day-based tempo (deep/shallow/review) | Flexibilita pro rodiče-solo |
| L2 | 12-týdenní první cyklus | 12-Week Year princip |
| L3 | Max 3 priority A | Focus |
| L4 | Planning skill v `.cursor/skills/planning/` | Opakovatelné plánování |

---

## Out of Scope (explicitně zamítnuto pro MVP)

- Mobilní nativní appka
- Uživatelské účty
- LLM chat
- Komunitní tipy
- Monetizace
- Pokrytí celé ČR
- Trvalé profily dětí
- GPS geolokace (volitelně později)

---

## Historie změn

| Datum | Změna |
|-------|-------|
| 2026-06-13 | Počáteční rozhodnutí z plánovací session |

---

## Change Request šablona

Při změně rozhodnutí přidej záznam:

```markdown
### CR-XXX: [Název]
**Datum:** YYYY-MM-DD
**Request:** Co se mění
**Důvod:** Proč
**Impact:** Co to ovlivní
**Rozhodnutí:** ✅ Přijato / ❌ Odmítnuto
```
