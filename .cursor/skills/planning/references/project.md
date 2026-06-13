# Projektové plánování

## Struktura projektu: Outcome-first approach

### Projekt Charter (vždy první krok)

```markdown
## [Název projektu]
**Datum startu:** 
**Deadline / Target:**
**Owner:**
**Stakeholders:**

### Problem Statement
[Co je broken / co chybí / co zákazník potřebuje?]

### Desired Outcome
[Jak vypadá svět AFTER — ne co uděláme, ale co se změní]

### Out of Scope
[Co NENÍ součástí projektu — explicitně]

### Success Metrics
1. [Měřitelný indikátor úspěchu]
2. [Druhý indikátor]

### Constraints
- Deadline: 
- Budget:
- Team:
- Tech stack:
```

---

## Projektové fáze

### Discovery (20% času)
- Výzkum, stakeholder interviews, competitive analysis
- Výstup: Brief, user research insights, technical feasibility

### Definition (15% času)
- Scope finalization, architecture decision, design system alignment
- Výstup: Specifikace, wireframes/mockups, approved tech approach

### Build (50% času)
- Iterativní build v 1–2 týdenních sprintech
- Daily async standup: Co jsem udělal / co dělám / co blokuje?

### QA & Hardening (10% času)
- Testing, security review, performance audit
- Výstup: Bug list seřazený dle severity, fixed critical issues

### Launch & Monitor (5% času)
- Release, komunikace stakeholders, monitoring
- Výstup: Launch checklist, rollback plán, first-week monitoring

---

## Dependency mapa

Každý projekt potřebuje explicitní dependency tracking:

| Závislost | Kdo vlastní | Nutné do | Fallback |
|-----------|-------------|----------|---------|
| Design approvals | [stakeholder] | [datum] | async email approval |
| API credentials | [DevOps/Backend] | [datum] | použij sandbox |
| Legal review | [legal team] | [datum] | launch s disclaimer |

---

## Project Security Checklist

**Před startem:**
- [ ] Je scope zdokumentován a odsouhlašen písemně?
- [ ] Jsou přístupy k produkčním systémům omezeny (least privilege)?
- [ ] Je definováno kdo může approve změny v production?
- [ ] Jsou citlivá klientská data identifikována a ošetřena GDPR-compliant?
- [ ] Existuje rollback plán pro launch?

**Průběžně:**
- [ ] Jsou API klíče a credentials v secret manageru (ne v kódu / doc)?
- [ ] Jsou dependency packages pravidelně auditovány (npm audit, pip check)?
- [ ] Jsou change rozhodnutí logována (git commit messages, Jira/Linear tickets)?
- [ ] Je access k projektu revokován pro lidi kteří odešli z projektu?

**Před launch:**
- [ ] Security review finálního kódu (aspoň diff review senior devem)?
- [ ] Privacy checklist (GDPR, consent, data retention)?
- [ ] Monitoring a alerting nastaven?
- [ ] Incident response plán existuje?

---

## Scope creep ochrana

Dokumentuj každý request mimo původní scope:

```markdown
### Change Request Log
| Datum | Request | Requester | Impact (čas/náklad) | Rozhodnutí |
|-------|---------|-----------|---------------------|------------|
| ...   | ...     | ...       | ...                 | ✅ Přijat / ❌ Odmítnut / 🔄 Next sprint |
```

**Pravidlo:** Cokoli co není v původním scope = nový Change Request, ne "rychlá úprava".
