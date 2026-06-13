# Security Audit — Plán projektu

**Datum auditu:** 2026-06-13  
**Scope:** MVP webová aplikace Kam s dětmi

---

## Identifikace aktiv plánu

| Aktivum | Kritičnost |
|---------|------------|
| Data o dětech (věk, preference) | Vysoká |
| Lokace uživatele (město) | Střední |
| API klíče (pokud přidáme) | Vysoká |
| Seed data aktivit | Nízká (veřejné informace) |
| Decision engine logika | Střední (produktová IP) |

---

## STRIDE-lite analýza

| Kategorie | Hrozba | Dopad | Pravděpodobnost | Skóre | Mitigace |
|-----------|--------|-------|-----------------|-------|----------|
| Spoofing | Falešná lokace → špatné tipy | 2 | Možná | 4 | MVP: výběr z listu, ne free text |
| Tampering | Změna JSON aktivit v repu | 2 | Nepravděpodobná | 2 | Git history, code review |
| Repudiation | Spor o doporučení | 1 | Nepravděpodobná | 1 | Disclaimer „orientační tipy" |
| Info Disclosure | Únik věku/preferencí dětí | 4 | Možná | 8 | **Session only, bez jmen, bez server storage** |
| DoS | Výpadek Open-Meteo | 2 | Pravděpodobná | 6 | Ruční override počasí |
| Elevation / Scope creep | Mobilka/LLM předčasně | 3 | Pravděpodobná | 9 | **Zamčená rozhodnutí v decisions.md** |

---

## Mitigace dle skóre

### Skóre 8–16 (MUST resolve)

**Info Disclosure (8):**
- [x] Rozhodnutí: žádná jména dětí
- [x] Rozhodnutí: věk jen v session
- [ ] Implementace: žádný POST na server s check-in daty
- [ ] Privacy policy před veřejným launchi

**Scope creep (9):**
- [x] Out of scope dokumentováno
- [x] Change Request proces

### Skóre 4–6 (Mitigovat)

**DoS počasí API (6):**
- [ ] Ruční fallback v UI
- [ ] Graceful error message

---

## Security checklist

### Před startem vývoje ✅

- [x] Scope zdokumentován a odsouhlašen
- [x] Citlivá data identifikována (věk, preference — bez jmen)
- [x] Rozhodnutí: bez účtů v MVP
- [ ] `.env` v `.gitignore`
- [ ] `.env.example` bez reálných hodnot

### Před launchi

- [ ] Žádné API klíče v kódu / gitu
- [ ] Privacy policy (GDPR — i bez účtů, pokud cookies/analytics)
- [ ] Disclaimer u tipů (ověř si otevírací dobu)
- [ ] npm audit bez critical vulnerabilities
- [ ] HTTPS (Vercel default)

### Průběžně

- [ ] Dependency audit (npm audit)
- [ ] Git commit messages pro change trail
- [ ] Neposílat data o dětech do LLM promptů (až LLM fáze)

---

## AI-asistovaný vývoj — pravidla

- Neposílat API klíče, hesla do AI promptů
- Anonymizovat při sdílení logů (žádná jména dětí)
- Reviewovat AI-generované aktivity před merge
- LLM není finální approval — jen input

---

## Incident response (MVP)

1. Pokud únik dat → okamžitě odstranit endpoint/storage
2. Pokud špatné tipy → opravit JSON + engine test
3. Pokud API kompromitace → rotace klíče v `.env`

---

## Související dokumenty

- [../context/decisions.md](../context/decisions.md)
- [../spec/implementation-spec.md](../spec/implementation-spec.md)
