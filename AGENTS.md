# AGENTS.md — Kontext pro AI agenty

## Co je tento projekt

**Kam s dětmi** — webová aplikace pro rodiče (solo projekt). Rodič popíše kontext (energie, čas, věk a přání dvou dětí, počasí) a dostane 3–5 tipů na aktivity včetně řešení konfliktu, když jedno dítě chce bazén a druhé les.

## Zamčená rozhodnutí (neměnit bez explicitního souhlasu)

Viz [docs/context/decisions.md](docs/context/decisions.md). Klíčové:

- **Engine:** Přístup A — pravidla + skórování + decision tree (NE LLM-first v MVP)
- **Věk dětí:** Ručně při každém check-inu, žádný trvalý profil
- **Účty:** Bez registrace v MVP
- **Region:** Start Praha + Střední Čechy, architektura připravená na celou ČR
- **Mobilka:** Fáze 2, až po dogfoodingu webu

## Dokumentace — pořadí čtení

1. [docs/context/decisions.md](docs/context/decisions.md)
2. [docs/project-charter.md](docs/project-charter.md)
3. [docs/spec/implementation-spec.md](docs/spec/implementation-spec.md)
4. [docs/spec/user-flow.md](docs/spec/user-flow.md)
5. [docs/data/activity-schema.md](docs/data/activity-schema.md)

## Konvence

- Jazyk UI a docs: **čeština**
- Kód, typy, názvy souborů: **angličtina**
- Aktivity v JSON: tagy a metadata anglicky, `name`/`description` česky
- YAGNI — MVP first, žádné účty, LLM, komunita, monetizace
- Testy pro engine (`score`, `conflict`) jsou povinné před rozšiřováním UI

## Struktura repozitáře (cílová)

```
data/activities/          # JSON soubory po krajích
src/engine/               # score, filter, conflict
src/components/           # CheckInForm, ResultsList
src/app/                  # Next.js App Router
tests/engine/             # Unit testy engine
docs/                     # Veškerá dokumentace
```

## Security

- Žádná jména dětí, žádné ukládání věku na server
- Check-in data jen v session
- API klíče do `.env`, nikdy do gitu
- Viz [docs/security/plan-audit.md](docs/security/plan-audit.md)

## Plánovací skill

Projekt používá `.cursor/skills/planning/` pro plánovací workflow (GTD, time blocking, threat modeling).

## První implementační kroky

Viz [docs/next-steps.md](docs/next-steps.md).
