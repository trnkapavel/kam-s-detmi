---
name: planning
description: >
  Komplexní plánovací asistent kombinující GTD, Time Blocking, Deep Work a threat modeling.
  Spusť tento skill vždy, kdy uživatel chce naplánovat projekt, sprint, týden, meeting, strategii
  nebo úkol s více kroky. Triggers: "naplánuj", "pomoz mi s plánem", "jak to rozvrhnout",
  "co dělat první", "mám moc věcí", "udělej plán na", "naplánuj mi", "sprint planning",
  "weekly review", "project plan", "jak si to rozložit", nebo kdykoliv uživatel popisuje
  komplexní cíl nebo projekt bez jasné struktury. Tento skill se stará o EFEKTIVITU (správné
  priority, deep work bloky, realistický rozsah) i SECURITY (threat modeling plánu — co může
  selhat, dependencies, fallbacky, citlivá data).
---

# Planning Skill

## Co tento skill dělá

Transformuje vágní záměry, projekty a úkoly do **akčního, bezpečného a realistického plánu**.
Kombinuje ověřené metodologie s moderním threat modelingem — takže plan nezkolabuje na prvním
překážce a neohrozí citlivé informace nebo kritické závislosti.

---

## Rychlá orientace — typ plánování

Před tím, než začneš, identifikuj typ plánu a načti příslušný referenční soubor:

| Typ | Horizont | Načti |
|-----|----------|-------|
| **Strategický** | Kvartál / rok | `references/strategic.md` |
| **Projektový** | Týdny | `references/project.md` |
| **Týdenní / daily** | 1–7 dní | `references/weekly.md` |
| **Sprint / iterace** | 1–2 týdny | `references/sprint.md` |
| **Meeting / workshop** | Jednorázové | `references/meeting.md` |

Pokud není typ jasný → použij **Fázi 0: Intake** níže a pak typ urči.

---

## Hlavní workflow

### Fáze 0 — INTAKE (vždy první krok)

Pokud kontext nestačí, polož maximálně **2 otázky** najednou:

1. **Co chceš dosáhnout?** (cíl, ne úkoly)
2. **Jaký je horizont a kontext?** (deadline, tým / solo, dostupné zdroje)

> Tip: Nečekej na perfektní vstup. Pokud máš dost kontextu, přejdi rovnou na Fázi 1.

---

### Fáze 1 — CAPTURE & CLARIFY

**Cíl:** Externalizovat vše z hlavy, žádný "open loop".

1. Vyzvi uživatele (nebo z kontextu extrahuj) **brain dump** — vše co s plánem souvisí
2. Kategorizuj raw vstupy:
   - 🎯 **Outcomes** — co musí nastat (ne jak)
   - 📋 **Tasks** — konkrétní akce
   - 🔗 **Dependencies** — co potřebuješ od jiných (lidé, nástroje, data, approvals)
   - ❓ **Unknowns** — co ještě nevíš, ale musíš zjistit
   - 💭 **Nice-to-have** — nízká priorita, nepřidávej do core plánu

**Výstup:** Strukturovaný seznam ve výše uvedených kategoriích.

---

### Fáze 2 — PRIORITIZACE

Aplikuj **Eisenhower Matrix + Impact/Effort**:

```
             URGENTNÍ        NEURGENTNÍ
DŮLEŽITÉ   │ DO NOW         │ SCHEDULE (deep work)
           │ (deadline/blok)│ (strategic work)
───────────┼────────────────┼──────────────────
NEDŮL.     │ DELEGATE/BATCH │ ELIMINATE / LATER
           │ (meetings,     │ (nice-to-have)
           │  quick replies)│
```

**Pravidla prioritizace:**
- Max **3 priority A** na horizont (den / týden / sprint)
- Deep work bloky = priority A, naplánuj jako první
- Batch podobné B/C úkoly do bloků (emailové, admin, reviews)
- Vše co trvá < 2 min → udělat ihned (GTD 2-minute rule)

---

### Fáze 3 — TIME BLOCKING

**Základní princip:** Každá hodina má účel, ne jen úkoly.

**Blok typy:**
- 🔴 **Deep Work** (90–120 min) — soustředěná práce na priority A, bez notifikací
- 🟡 **Shallow Work** (30–60 min) — emailový, meetingy, review
- 🟢 **Buffer** (15–30 min) — mezi bloky, vždy přidej 20% buffer na neplánované
- 🔵 **Energy Management** — naplánuj deep work na svůj peak (ráno / dopoledne pro většinu)

**Template denního plánu:**
```
08:00–09:30  🔴 Deep Work #1 (Priority A)
09:30–09:45  🟢 Buffer / přesun
09:45–11:15  🔴 Deep Work #2 (Priority A)
11:15–12:00  🟡 Shallow: Email / Slack / Reviews
12:00–13:00  Oběd / recharge
13:00–14:30  🔴 Deep Work #3 nebo meetingy
14:30–16:30  🟡 Shallow: admin, dokumentace, 1:1
16:30–17:00  🟢 Daily review + příprava na zítřek
```

---

### Fáze 4 — SECURITY AUDIT PLÁNU ⚠️

**Toto je klíčová část.** Každý plán projde threat modelingem.

#### 4a. Identifikace aktiv plánu

Co je v plánu kritické / cenné?
- Deadliny a milestony
- Citlivá data (klientská data, API klíče, přihlašovací údaje, obchodní informace)
- Single points of failure (je na něčem celý plán závislý jen z jednoho místa?)
- Klíčové závislosti (lidé, nástroje, přístupy)

#### 4b. Threat Modeling — STRIDE-lite pro plány

Projdi tyto kategorie hrozeb:

| Kategorie | Otázka | Příklady |
|-----------|--------|----------|
| **Spoofing / záměna** | Může dojít k záměně identity nebo kontextu? | Špatný brief, miscommunication se zákazníkem |
| **Tampering / narušení** | Může někdo (nebo chyba) změnit plán nebo data? | Přepsaná verze souboru, changed requirements |
| **Repudiation / odmítnutí** | Kdo může popřít dohodu nebo zodpovědnost? | Chybějící written approval, nezdokumentované rozhodnutí |
| **Info Disclosure / únik** | Jaká citlivá data jsou součástí plánu? | API klíče v kódu, client data ve veřejném doc |
| **DoS / blokace** | Co může plán zastavit / zpomalit? | Nemoc, výpadek nástroje, chybějící přístupy |
| **Elevation / scope creep** | Co může plán neřízeně rozrůst? | Feature creep, přidané stakeholders |

#### 4c. Risk Matrix

Pro každou identifikovanou hrozbu:

```
Dopad:     Nízký (1) / Střední (2) / Vysoký (3) / Kritický (4)
Pravděpodobnost: Nepravděpodobná / Možná / Pravděpodobná / Jistá

Risk Score = Dopad × Pravděpodobnost
```

**Mitigace dle skóre:**
- Score 1–3: Přijmout / monitorovat
- Score 4–6: Mitigovat (fallback plán)
- Score 8–16: Blokující — MUST resolve před startem

#### 4d. Security checklist pro plán

Projdi před finalizací:

- [ ] Jsou přihlašovací údaje a API klíče uloženy bezpečně (ne v plainu / sdíleném doc)?
- [ ] Je dokumentace/brief uložena na místě s kontrolou přístupu (ne public link)?
- [ ] Jsou citlivá klientská data anonymizována nebo segmentována?
- [ ] Existuje backup / fallback pro single point of failure?
- [ ] Jsou rozhodnutí zdokumentována písemně (async approval trail)?
- [ ] Je definovaný owner každého kritického milestonu?
- [ ] Jsou dependency na třetí strany explicitně ošetřeny (SLA, alternativa)?

---

### Fáze 5 — OUTPUT: FINÁLNÍ PLÁN

Výstup vždy obsahuje:

```markdown
## Plán: [Název]
**Horizont:** [datum/rozsah]
**Cíl:** [1–2 věty co musí nastat]
**Owner:** [kdo za plán zodpovídá]

### Priority (max 3)
1. [Priority A #1]
2. [Priority A #2]
3. [Priority A #3]

### Milestony
| Datum | Milestone | Owner | Status |
|-------|-----------|-------|--------|
| ...   | ...       | ...   | 🟡 pending |

### Time Blocks (týden / sprint)
[Rozpis bloků dle Fáze 3]

### Závislosti
| Závislost | Typ | Owner | Fallback |
|-----------|-----|-------|---------|
| ...       | ... | ...   | ...     |

### Security Notes
[Výsledky z Fáze 4 — jen rizika medium+ a jejich mitigace]

### Open Questions
- [ ] [Co musím zjistit / rozhodnutí čeká]

### Weekly Review Trigger
Příští review: [datum] — projdi: Co jsem splnil? Co se změnilo? Co blokuje?
```

---

### Fáze 6 — WEEKLY REVIEW PROTOKOL

Spusť každý pátek nebo před novým plánováním (trvá 20–30 min):

1. **Capture sweep** — co zůstalo v hlavě / inboxu / poznámkách?
2. **Review kalendáře** minulého týdne — co se stalo?
3. **Review open tasks** — co je hotové, co přepadává, co zahodit?
4. **Security check** — došlo k bezpečnostnímu incidentu nebo úniku?
5. **Reset priority** — co jsou 3 priority pro příští týden?
6. **Time block next week** — naplánuj deep work bloky první
7. **Close loops** — odeslat čekající zprávy, dokumentovat rozhodnutí

---

## AI-asistované plánovací vzory

Při práci s AI (Claude, GPT) v rámci plánování:

**Promptovací vzory:**
```
# Projekt brief generace
"Mám [projekt X]. Pomoz mi rozepsat outcomes, tasks, dependencies a unknowns
ve formátu Fáze 1 plánovacího skilu."

# Security audit plánu  
"Projdi tento plán přes STRIDE-lite a identifikuj top 3 rizika s mitigací."

# Time blocking
"Mám tyto priority na tento týden: [seznam]. Navrhni time blocking layout
s deep work bloky, shallow bloky a bufferem. Moje energy peak je ráno."

# Weekly review
"Projdi mé dokončené a nedokončené úkoly z minulého týdne: [seznam].
Co bych měl zachovat, zahodit nebo přesunout? Navrhni 3 priority pro příští týden."
```

**Security při práci s AI:**
- Neposílej API klíče, hesla ani citlivá klientská data do AI promptů
- Anonymizuj jména klientů a interní codenames
- Reviewuj AI výstupy před sdílením — hallucinated milestones nebo přístupy jsou reálné riziko
- Nepoužívej AI pro finální approval rozhodnutí — jen jako input

---

## Rychlé reference

Pro detailní guidance k jednotlivým typům plánů:

- **Strategické plánování (kvartál/rok)** → načti `references/strategic.md`
- **Projektové plánování** → načti `references/project.md`
- **Týdenní / daily plánování** → načti `references/weekly.md`
- **Sprint planning (agile/scrum)** → načti `references/sprint.md`
- **Meeting / workshop planning** → načti `references/meeting.md`
- **Šablony výstupů** → `templates/` složka

---

## Klíčové principy (vždy platí)

1. **Outcomes před tasks** — nejdřív CO, pak JAK
2. **Max 3 priority A** — cokoliv víc je iluze prioritizace  
3. **Buffer je povinný** — 20% kapacity nechej volné
4. **Single points of failure jsou nepřátelé** — vždy fallback
5. **Citlivá data patří do bezpečného úložiště** — ne do sdílených dokumentů
6. **Rozhodnutí musí být zdokumentována** — async trail = záchrana při sporech
7. **Weekly review je nenegotiable** — bez review se plán rozpadá do 2 týdnů
