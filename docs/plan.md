# Plán: Kam s dětmi — Web MVP

**Horizont:** 12 týdnů (1. cyklus)  
**Cíl:** Funkční web, který z kontextu rodiče, dvou dětí a počasí navrhne 3–5 aktivit včetně řešení konfliktu preferencí  
**Owner:** Solo (Pavel)  
**Poslední aktualizace:** 2026-06-13

---

## Shrnutí produktu

Rodič dvou dětí s různými přáními popíše situaci (energie, čas, věk a přání dětí, počasí). Aplikace vrátí tipy na aktivity a při konfliktu (např. bazén vs. les) nabídne overlap, sekvenční plán, kompromis nebo rotaci — vždy s vysvětlením proč.

**Fáze 1:** Webová aplikace  
**Fáze 2:** Mobilní appka (až po ověřeném webu)

---

## Priority A (max 3)

1. **Decision engine + datový model** — bez toho není produkt
2. **Check-in UX + výsledková obrazovka** — musí fungovat každý víkend
3. **Kurátorovaná databáze aktivit** — Praha + Střední Čechy (~40–50 aktivit)

---

## Regionální strategie

| Vlna | Region | Počet aktivit |
|------|--------|---------------|
| 1 (MVP) | Praha + Střední Čechy | ~40–50 |
| 2 | + Jihočeský, Plzeňský | ~100 |
| 3 | Zbývající kraje | postupně |

Aktivity tagujeme `kraj` + `okres` + `mesto` od začátku — rozšíření = nové JSON soubory.

---

## Tempo práce (day-based)

Ne pevné hodiny, ale typy dnů:

| Typ dne | Kapacita | Aktivity |
|---------|----------|----------|
| 🔴 Deep day | 3+ h souvisle | Engine, UI, větší feature |
| 🟡 Shallow day | 1–2 h | Seed data, test scénáře, bugfix |
| 🟢 Review day | 20–30 min | Milestone check, plán dalšího období |

**Rytmus:** 1 deep day / 1–2 týdny, shallow mezi tím, review měsíčně.  
**12 týdnů ≈ 6–8 deep days + 6–8 shallow days.**

---

## Milestony

| Týden | Milestone | Výstup |
|-------|-----------|--------|
| 1–2 | Discovery + charter | Spec, user flow ✅ |
| 3 | Datový model + scoring | Aktivity, tagy, skórovací funkce |
| 4 | Decision tree | Konfliktní scénáře (bazén vs. les) |
| 5–6 | Web UI | Check-in → výsledky |
| 7 | Počasí + lokace | Auto počasí, filtr indoor/outdoor |
| 8 | Seed data | 40+ aktivit, 10 test scénářů |
| 9–10 | Polish + deploy | Produkční URL, responzivní web |
| 11 | Dogfooding | 4 víkendy reálného použití |
| 12 | Review + roadmap | Rozhodnutí o mobilní appce |

Detailní roadmapa: [roadmap/milestones.md](roadmap/milestones.md)

---

## Out of Scope — MVP

- Mobilní nativní appka
- Uživatelské účty / sociální funkce
- Pokrytí celé ČR (jen Praha + Střední Čechy)
- LLM chat
- Komunitní tipy od rodičů
- Monetizace

---

## Závislosti a fallbacky

| Závislost | Fallback |
|-----------|----------|
| Počasí API výpadek | Ruční přepínač déšť / slunečno |
| Málo aktivit v DB | MVP jen Praha + Střední Čechy, kvalita > rozsah |
| Příliš složitý engine | 5 pevných konfliktních šablon |
| Solo čas nestačí | Prodloužit cyklus na 16 týdnů |

---

## Open Questions

- [ ] Konkrétní seed lokality ve Středních Čechách (priorita okresů)
- [ ] Finální seznam tagů aktivit (viz [data/activity-schema.md](data/activity-schema.md))

---

## Weekly Review Trigger

**Příští review:** pátek 20. 6. 2026

Agenda:
1. Co jsem splnil?
2. Co se změnilo?
3. Co blokuje?
4. Pořád 3 priority A?

---

## Související dokumenty

- [project-charter.md](project-charter.md)
- [spec/implementation-spec.md](spec/implementation-spec.md)
- [context/decisions.md](context/decisions.md)
- [security/plan-audit.md](security/plan-audit.md)
- [next-steps.md](next-steps.md)
