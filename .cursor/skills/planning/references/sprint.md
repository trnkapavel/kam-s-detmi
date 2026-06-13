# Sprint Planning (1–2 týdny)

## Sprint struktura

**Délka:** 1 týden (doporučeno pro solo/small team) nebo 2 týdny (pro větší týmy)

---

## Sprint Ceremony Cadence

### Sprint Planning (pondělí ráno, 60–90 min)
1. Review Sprint Goal z minulého sprintu — splněno?
2. Retrospektiva minulého sprintu (3 otázky):
   - Co šlo dobře?
   - Co nešlo dobře?
   - Co zkusíme jinak?
3. Prioritizace backlogu — co jde do tohoto sprintu?
4. Sprint Goal formulace: jedna věta co sprint řeší
5. Task breakdown a estimace

### Daily Standup (async nebo sync, max 15 min)
```
1. Co jsem dokončil od posledního standupu?
2. Co budu dělat dnes?
3. Co mě blokuje?
```

### Sprint Review (pátek nebo poslední den, 30 min)
- Demo dokončených stories
- Co je "Done" vs. "Done Done" (testováno, deployed)?
- Stakeholder feedback

### Sprint Retrospektiva (hned po review, 30–45 min)
- Start / Stop / Continue formát
- Max 2 action items pro příští sprint

---

## Sprint Backlog formát

```markdown
## Sprint [číslo] — [datum od] do [datum do]
**Sprint Goal:** [Jedna věta — co sprint řeší]

### Sprint Backlog
| ID | Story / Task | Priority | Estimate | Owner | Status |
|----|-------------|----------|----------|-------|--------|
| S1 | [User story] | 🔴 High | 3h | [jméno] | 🟡 In Progress |
| S2 | [Task] | 🟡 Medium | 1h | [jméno] | ✅ Done |
| S3 | [Task] | 🟢 Low | 2h | [jméno] | 📋 Todo |

### Sprint Capacity
- Celková kapacita: [X] hodin
- Deep Work: [Y] hodin
- Buffer (20%): [Z] hodin
- Committed: [W] hodin

### Blokery & Závislosti
| Bloker | Owner | Severity | Eskalace do |
|--------|-------|----------|-------------|
| ...    | ...   | 🔴 High  | [jméno] |
```

---

## Definition of Done (DoD)

Každý sprint item musí splňovat:
- [ ] Kód je napsán a self-reviewed
- [ ] Unit testy napsány (kde relevantní)
- [ ] Code review proběhl
- [ ] Funkce testována ručně
- [ ] Dokumentace aktualizována (kde relevantní)
- [ ] Deployed do staging/preview prostředí
- [ ] Product Owner nebo stakeholder schválil

**Security DoD:**
- [ ] Žádné API klíče v kódu
- [ ] Žádné console.log s citlivými daty
- [ ] Inputs jsou validovány a sanitizovány
- [ ] Závislosti bez known kritických CVE (`npm audit`, `pip-audit`)

---

## Velocity tracking

Po každém sprintu zaznamenej:
- Committed points/hours
- Completed points/hours
- Velocity = Completed / Committed × 100%

**Cíl:** 70–80% velocity je zdravá. 100% = podestimujete. <60% = přecenění nebo blokery.

Po 3–4 sprintech máš spolehlivý průměr pro plánování kapacity.

---

## Sprint Security Checklist

**Před sprintem:**
- [ ] Jsou stories které se dotýkají user data flagovány pro security review?
- [ ] Jsou API endpoints v backlogu se security requirements?
- [ ] Jsou nové integrace s third-party services risk-assessed?

**Během sprintu:**
- [ ] Jsou nové environment variables přidány do secret manageru (ne do .env v repu)?
- [ ] Je branch protection aktivní (no direct push to main)?

**Před release:**
- [ ] Proběhl security diff review pro high-risk changes?
- [ ] Je rollback strategie definována?
