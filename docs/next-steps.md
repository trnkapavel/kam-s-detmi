# Další kroky

**Aktualizováno:** 2026-06-13

---

## Deep day 1 ✅ (2026-06-13)

### 1. Inicializace projektu ✅

Next.js scaffold ručně (create-next-app nešel kvůli existujícím docs).

```bash
npm run dev    # spustit dev server
npm test       # 10 testů engine
npm run build  # produkční build
```

### 2. Vitest setup ✅

- `vitest.config.ts` s alias `@/*`

### 3. Typy a engine ✅

- [x] `src/types/index.ts`
- [x] `src/engine/score.ts`
- [x] `src/engine/filter.ts`
- [x] `src/engine/conflict.ts`
- [x] `src/engine/index.ts`
- [x] `src/lib/activities.ts`

### 4. Testy ✅

- [x] `tests/engine/conflict.test.ts` — T1: bazén vs. les, unavený, déšť
- [x] `tests/engine/score.test.ts` — filter + scoring

### 5. Ukázková data ✅

- [x] `data/activities/praha.json` — 5 aktivit

---

## Deep day 2 ✅ (2026-06-13)

### Conflict engine — test scénáře ze spec

- [x] Test T2: bazén vs. les, energický rodič, slunečno → overlap + sequential
- [x] Test T3: obě děti chtějí zoo → single match
- [x] Test T4: věkový filtr (3 roky vs. ageMin 6)
- [x] Test T5: Praha, půl dne, oblačno → top 5 dle skóre
- [x] Seed data: Hostivařská přehrada (overlap bazén + les)

**Výsledek:** 21 testů, engine kompletní pro MVP.

---

## Deep day 3–4 ✅ (2026-06-13)

### Check-in wizard + výsledky

- [x] 5-krokový check-in wizard (mobile-first)
- [x] Stránka `/vysledky` s kartami doporučení
- [x] Session state (`sessionStorage`)
- [x] API route `POST /api/recommend`
- [x] Open-Meteo integrace v check-inu (auto počasí)
- [x] Shrnutí situace, disclaimer, prázdný stav

```bash
npm run dev   # http://localhost:3000
```

---

## Deep day 5 ✅ (2026-06-13)

### Počasí polish + seed data

- [x] Preview auto počasí při vstupu na krok 5 (Open-Meteo)
- [x] Ruční override s tlačítkem „Upravit ručně" / „Znovu načíst automaticky"
- [x] Seed data: 16 aktivit v `praha.json` (+10)
- [x] `stredocesky.json` — 8 aktivit (Karlštejn, Kladno, Mladá Boleslav…)
- [x] Testy načítání dat (`tests/lib/activities.test.ts`)

**Celkem:** 24 aktivit ve vlně 1 (částečně)

---

## Deep day 6 ✅ (2026-06-13)

### Polish + deploy prep

- [x] Loading spinner, sticky footer, retry, safe-area
- [x] `stredocesky.json` — 15 aktivit
- [x] `docs/deploy.md`
- [x] GitHub: [trnkapavel/kam-s-detmi](https://github.com/trnkapavel/kam-s-detmi)
- [x] Vercel propojený s GitHubem — auto deploy on push

**Workflow:** `git push origin main` → Vercel deploy

---

## Deep day 7 (další)

### Dogfooding + iterace

- [ ] 4 víkendové scénáře v `docs/feedback.md`
- [ ] Doplnit Praha seed na ~25 aktivit
- [ ] Deploy na Vercel (pokud ještě není)

---

## Shallow day úkoly (průběžně)

- [ ] Seed data: +5 aktivit do JSON
- [ ] Manuální test scénář z tabulky v spec
- [ ] Aktualizovat `meta.count` v JSON souborech

---

## Před prvním deployem

- [ ] `.env.example` vytvořen
- [ ] Privacy disclaimer v UI
- [ ] npm audit
- [ ] 10 test scénářů prošlo
- [ ] Security checklist v [security/plan-audit.md](security/plan-audit.md)

---

## Po MVP (týden 12 review)

- [ ] Rozhodnutí: mobilní appka (React Native / PWA?)
- [ ] Rozhodnutí: LLM pro volný text input
- [ ] Vlna 2 regionů
- [ ] Feedback z [feedback.md](feedback.md)

---

## Dokumentace — co je hotové

| Dokument | Status |
|----------|--------|
| README.md | ✅ |
| AGENTS.md | ✅ |
| docs/plan.md | ✅ |
| docs/project-charter.md | ✅ |
| docs/spec/implementation-spec.md | ✅ |
| docs/spec/user-flow.md | ✅ |
| docs/context/decisions.md | ✅ |
| docs/roadmap/milestones.md | ✅ |
| docs/security/plan-audit.md | ✅ |
| docs/data/activity-schema.md | ✅ |
| docs/next-steps.md | ✅ |
| .cursor/skills/planning/ | ✅ |
| data/activities/praha.json.example | ✅ |
| docs/feedback.md | ✅ (šablona) |

---

## Git (až budeš chtít commitnout)

```bash
git init
git add .
git commit -m "docs: initial project planning and specification"
```

Commit neprovádím automaticky — řekni až budeš chtít.
