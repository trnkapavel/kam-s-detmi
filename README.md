# Kam s dětmi

Chytrá webová aplikace pro rodiče — popíšeš situaci (jak se cítíš, co chtějí děti, počasí) a dostaneš tipy na aktivity včetně řešení konfliktů preferencí.

## Stav projektu

**Fáze:** MVP web hotový, deploy přes Vercel  
**Region MVP:** Praha + Střední Čechy (31 aktivit)  
**Repozitář:** [github.com/trnkapavel/kam-s-detmi](https://github.com/trnkapavel/kam-s-detmi)  
**Deploy:** push na `main` → automatický Vercel deploy

## Dokumentace

| Dokument | Popis |
|----------|-------|
| [docs/plan.md](docs/plan.md) | Hlavní plán projektu |
| [docs/project-charter.md](docs/project-charter.md) | Project charter — problém, cíl, metriky |
| [docs/spec/implementation-spec.md](docs/spec/implementation-spec.md) | Technická specifikace MVP |
| [docs/spec/user-flow.md](docs/spec/user-flow.md) | User flow check-inu |
| [docs/context/decisions.md](docs/context/decisions.md) | Zamčená rozhodnutí |
| [docs/roadmap/milestones.md](docs/roadmap/milestones.md) | Milestony a regionální vlny |
| [docs/security/plan-audit.md](docs/security/plan-audit.md) | Security audit plánu |
| [docs/data/activity-schema.md](docs/data/activity-schema.md) | Schéma dat aktivit |
| [docs/design/ui-notion-adaptation.md](docs/design/ui-notion-adaptation.md) | Notion UI design spec |
| [docs/deploy.md](docs/deploy.md) | Návod na deploy (Vercel) |

## Tech stack (MVP)

- **Next.js** + TypeScript + Tailwind
- **Aktivity:** JSON soubory v `data/activities/`
- **Počasí:** Open-Meteo (zdarma, bez API klíče)
- **Engine:** Deterministické pravidla + skórování (přístup A)
- **Deploy:** Vercel

## Pro AI agenty

Před prací na projektu načti [AGENTS.md](AGENTS.md) a [docs/context/decisions.md](docs/context/decisions.md).

## Licence

TBD
