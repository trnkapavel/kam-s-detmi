# Project Charter — Kam s dětmi

**Datum startu:** 2026-06-13  
**Deadline / Target:** 12-týdenní cyklus → funkční MVP web  
**Owner:** Solo (Pavel)  
**Stakeholders:** Rodiče s více dětmi (primárně dogfooding na vlastní rodině)

---

## Problem Statement

Rodič dvou (nebo více) dětí s různými přáními neví, kam jet. Je unavený, závisí na počasí, a situace typu „jeden chce bazén, druhý les" nemá jednoduchou odpověď. Existující tipy na výlety neřeší **kontext rodiče** ani **konflikt preferencí dětí**.

---

## Desired Outcome

Za 2 minuty popíšu situaci → dostanu 3–5 tipů včetně **řešení konfliktu** (společná aktivita, sekvenční plán, kompromis, rotace) s vysvětlením proč každý tip dává smysl.

**Jak vypadá svět AFTER:**
- Rodič nemusí 30 minut googlit a vyjednávat
- Aplikace chápe, že dvě děti = dva různé inputy + rozhodovací strom
- Tipy jsou relevantní pro věk (doplněný při check-inu), počasí a energii rodiče

---

## Out of Scope (MVP)

- Mobilní nativní appka
- Uživatelské účty a trvalé profily dětí
- LLM-first chat interface
- Pokrytí celé ČR (start: Praha + Střední Čechy)
- Komunitní přidávání tipů
- Monetizace

---

## Success Metrics

1. **10 reálných víkendových scénářů** — tip je použitelný bez ručního hledání
2. **Konfliktní scénář vyřešen** — u „bazén vs. les" vždy ≥2 typy řešení (overlap / sequential / compromise / rotation)
3. **Check-in do 2 minut** — od otevření stránky po zobrazení výsledků

---

## Constraints

| Constraint | Hodnota |
|------------|---------|
| Tým | Solo |
| Tempo | Day-based (deep / shallow / review dny) |
| Platforma | Web first, mobilní appka fáze 2 |
| Region MVP | Praha + Střední Čechy |
| Engine | Deterministický (pravidla + skórování), ne LLM |
| Data o dětech | Věk ručně při check-inu, bez jmen, bez persistence |

---

## Projektové fáze

| Fáze | Podíl | Výstup |
|------|-------|--------|
| Discovery | 20 % | Charter, spec, user flow ✅ |
| Definition | 15 % | Datový model, engine spec, wireframes |
| Build | 50 % | MVP web + seed data |
| QA & Hardening | 10 % | Test scénáře, bugfix, security checklist |
| Launch & Monitor | 5 % | Deploy, dogfooding, iterace |

---

## Scope Creep ochrana

Cokoli mimo původní scope = Change Request. Viz šablona v [plan.md](plan.md).

**Pravidlo:** Mobilka, LLM, účty, celá ČR = explicitní rozhodnutí po review týdne 12.

---

## Související dokumenty

- [plan.md](plan.md)
- [context/decisions.md](context/decisions.md)
- [spec/implementation-spec.md](spec/implementation-spec.md)
