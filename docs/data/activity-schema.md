# Schéma dat — Aktivity

**Verze:** 1.0  
**Formát:** JSON  
**Umístění:** `data/activities/{kraj}.json`

---

## Struktura souboru

Každý soubor obsahuje pole aktivit:

```json
{
  "meta": {
    "kraj": "Praha",
    "version": "1.0",
    "updated": "2026-06-13",
    "count": 0
  },
  "activities": []
}
```

---

## Schéma jedné aktivity

```json
{
  "id": "praha-zoo",
  "name": "Zoologická zahrada Praha",
  "description": "Celodenní výlet s exponáty pro všechny věkové kategorie. V dešti kryté pavilony.",
  "region": {
    "kraj": "Praha",
    "okres": "Praha",
    "mesto": "Praha"
  },
  "tags": {
    "type": ["zoo", "park", "priroda"],
    "ageMin": 2,
    "ageMax": 99,
    "energyParent": ["medium", "high"],
    "weather": ["any", "rain_ok"],
    "duration": "full_day"
  },
  "conflictResolvers": ["overlap", "compromise"],
  "coordinates": {
    "lat": 50.1165,
    "lng": 14.4063
  },
  "url": "https://www.zoopraha.cz"
}
```

---

## Povolené hodnoty tagů

### type (ActivityType)

| Hodnota | Popis | Příklad |
|---------|-------|---------|
| `bazen` | Plavecký bazén | Plavecký stadion |
| `koupaliste` | Venkovní koupaliště | Motol |
| `aquapark` | Aquapark / wellness | Aquapalace |
| `les` | Les, houpačky v lese | Kunratický les |
| `park` | Městský park | Stromovka |
| `priroda` | Přírodní oblast | Divoká Šárka |
| `zoo` | Zoologická zahrada | Zoo Praha |
| `muzeum` | Muzeum, galerie | NTM |
| `hrad` | Hrad, zámek | Karlštejn |
| `indoor` | Vnitřní aktivita obecně | Herna |
| `kino` | Kino | Cinema City |
| `sport` | Sportoviště | Lezecká stěna |
| `mesto` | Procházka městem | Staré Město |

### energyParent

| Hodnota | Kdy použít |
|---------|------------|
| `low` | Minimum chůze, blízko, krátké |
| `medium` | Střední náročnost |
| `high` | Celodenní, hodně chůze, přesuny |

### weather

| Hodnota | Kdy použít |
|---------|------------|
| `any` | Funguje za každého počasí |
| `sunny` | Ideální za slunečna |
| `rain_ok` | Funguje i v dešti (částečně kryté) |
| `indoor_only` | Jen indoor |

### duration

| Hodnota | Odhadovaný čas |
|---------|----------------|
| `few_hours` | 1–3 hodiny |
| `half_day` | 3–5 hodin |
| `full_day` | 5+ hodin |

### conflictResolvers

| Hodnota | Význam |
|---------|--------|
| `overlap` | Spojuje preference obou dětí |
| `sequential` | Vhodná jako část sekvenčního plánu |
| `compromise` | Kompromisní alternativa |
| `rotation` | Férová rotace „dnes/příště" |

---

## Pravidla pro kurátorování

1. **id** = `{mesto}-{slug}` lowercase, bez diakritiky (např. `praha-aquapalace`)
2. **name** a **description** v češtině
3. **ageMin/ageMax** — realisticky, ne vše 0–99
4. Každá aktivita min 1 `type`, min 1 `conflictResolvers`
5. Aquapark / koupaliště s hřištěm → taguj `overlap` + více typů
6. Ověř URL před přidáním
7. Souřadnice povinné pro sequential resolver (vzdálenost)

---

## Příklad overlap aktivity (bazén + park)

```json
{
  "id": "praha-aquapalace",
  "name": "Aquapalace Praha",
  "description": "Aquapark s tobogány pro starší děti a dětským bazénem. Vnitřní i venkovní část.",
  "region": {
    "kraj": "Praha",
    "okres": "Praha",
    "mesto": "Praha"
  },
  "tags": {
    "type": ["aquapark", "bazen", "indoor"],
    "ageMin": 3,
    "ageMax": 99,
    "energyParent": ["medium", "high"],
    "weather": ["indoor_only", "any"],
    "duration": "half_day"
  },
  "conflictResolvers": ["overlap", "compromise"],
  "coordinates": { "lat": 49.9903, "lng": 14.5958 },
  "url": "https://www.aquapalace.cz"
}
```

---

## Seed data checklist (vlna 1)

Pro každou aktivitu ověř:

- [ ] id unikátní
- [ ] ageMin/ageMax realistické
- [ ] weather tag správný
- [ ] conflictResolvers vyplněné
- [ ] coordinates pro sequential
- [ ] url funguje

**Cíl:** 40–50 aktivit v `praha.json` + `stredocesky.json`

---

## Související dokumenty

- [../spec/implementation-spec.md](../spec/implementation-spec.md)
- [../../data/activities/praha.json.example](../../data/activities/praha.json.example)
