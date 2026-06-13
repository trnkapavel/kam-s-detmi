# Roadmap — Milestony a regionální vlny

**Horizont:** 12 týdnů (cyklus 1)  
**Start:** 2026-06-13

---

## Regionální vlny

### Vlna 1 — MVP (týdny 1–12)

**Region:** Praha + Střední Čechy  
**Cíl:** 40–50 kurátorovaných aktivit

| Okres / oblast | Příklad aktivit | Počet cíl |
|----------------|-----------------|-----------|
| Praha | Zoo, Aquapalace, Stromovka, muzea | ~25 |
| Kladno | Koupaliště, parky | ~5 |
| Benešov / Beroun | Hrad Karlštejn, lesy | ~5 |
| Mladá Boleslav | Muzeum, koupaliště | ~3 |
| Kolín / Mělník / Příbram | Regionální tipy | ~5–10 |

### Vlna 2 (po review cyklu 1)

**Region:** + Jihočeský, Plzeňský  
**Cíl:** ~100 aktivit celkem

### Vlna 3

**Region:** Zbývající kraje ČR  
**Postup:** Po jednom kraji, kvalita > rychlost

---

## Milestony — 12 týdnů

### Týdny 1–2: Discovery ✅

- [x] Project charter
- [x] Implementační spec
- [x] User flow
- [x] Zamčená rozhodnutí
- [x] Dokumentace v repu
- [ ] Wireframe check-inu (volitelně)

### Týden 3: Datový model + Scoring ✅ (Deep day 1)

- [x] Next.js scaffold
- [x] TypeScript typy (`src/types/`)
- [x] `score.ts` + unit testy
- [x] `filter.ts` + unit testy
- [x] 5 ukázkových aktivit v `praha.json`

### Týden 4: Decision Tree ✅ (Deep day 2)

- [x] `conflict.ts` — overlap, sequential, compromise, rotation
- [x] Test T1: bazén vs. les, unavený, déšť
- [x] Test T2: bazén vs. les, energický, slunečno
- [x] Test T3: obě děti chtějí zoo
- [x] Test T4 + T5 ze spec
- [x] `engine/index.ts` orchestrace

### Týdny 5–6: Web UI ✅ (Deep day 3–4)

- [x] Check-in wizard (5 kroků + výsledky)
- [x] Progress bar, mobile-first
- [x] Výsledková stránka `/vysledky`
- [x] Shrnutí situace + karty doporučení

### Týden 7: Počasí + Lokace ✅ (Deep day 5)

- [x] Open-Meteo integrace v check-inu
- [x] Ruční override + fallback při API chybě
- [x] Preview načteného počasí před odesláním

### Týden 8: Seed Data (částečně)

- [x] `praha.json` — 16 aktivit
- [x] `stredocesky.json` — 8 aktivit
- [ ] 10 manuálních test scénářů prošlo
- [ ] Cíl 40+ aktivit celkem

### Týdny 9–10: Polish + Deploy

- [ ] Responzivní design
- [ ] Loading states, error states
- [ ] Deploy Vercel
- [ ] Privacy disclaimer

### Týden 11: Dogfooding

- [ ] 4 víkendy reálného použití
- [ ] Feedback log (docs/feedback.md)
- [ ] Iterace dle zkušenosti

### Týden 12: Review

- [ ] Score success metrics
- [ ] Retrospektiva
- [ ] Rozhodnutí: mobilka? LLM? vlna 2?
- [ ] Plán cyklu 2

---

## Day-based plán (flexibilní)

| Deep day | Týden | Úkol |
|----------|-------|------|
| DD-1 | 3 | Scaffold + score + filter |
| DD-2 | 4 | Conflict engine + testy |
| DD-3 | 5 | Check-in UI kroky 1–3 |
| DD-4 | 6 | Check-in 4–6 + výsledky |
| DD-5 | 7 | Počasí API |
| DD-6 | 9 | Polish + deploy |
| DD-7 | 11 | Iterace po dogfoodingu |

| Shallow day | Mezi | Úkol |
|-------------|------|------|
| SD-* | průběžně | Seed data (5 aktivit / session) |
| SD-* | průběžně | Manuální test scénáře |
| SD-* | průběžně | Bugfix, docs update |

---

## Success Metrics (konec cyklu 1)

| Metrika | Target |
|---------|--------|
| Reálné víkendové scénáře | ≥ 10 |
| Konflikt bazén vs. les | ≥ 2 resolver typy vždy |
| Check-in čas | ≤ 2 min |
| Aktivity ve vlně 1 | ≥ 40 |
| Engine test coverage | 100 % kritických paths |

---

## Související dokumenty

- [../plan.md](../plan.md)
- [../project-charter.md](../project-charter.md)
