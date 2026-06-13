# Feedback log — Dogfooding

**Účel:** Zaznamenat reálné použití aplikace o víkendech.

---

## Scénáře ověřené engine testem (Deep day 7)

Tyto 4 scénáře prošly automatickým testem `tests/integration/dogfood-scenarios.test.ts`.  
Po reálném víkendu doplň sekci **Reálné víkendy** níže.

### D1 — 2026-06-13 — Praha (simulace)

**Situace:**
- Rodič: unavený, půl dne
- Dítě 1: 5 let, chce bazén
- Dítě 2: 8 let, chce les
- Počasí: déšť, 11 °C

**Co appka doporučila:**
- Indoor tipy (Aquapalace, Podolí)
- Kompromis / rotace
- Bez sequential plánu (unavený rodič)

**Použili jsme:** Simulace — čeká na reálný víkend

**Co fungovalo:**
- Konflikt detekován
- Venkovní les vyřazen v dešti
- Sequential správně potlačen

**Nápad na zlepšení:**
- Po reálném použití: ověřit, jestli tipy sedí na aktuální otevírací dobu

---

### D2 — 2026-06-13 — Praha (simulace)

**Situace:**
- Rodič: plný energie, celý den
- Dítě 1: 5 let, bazén
- Dítě 2: 8 let, les
- Počasí: slunečno, 27 °C

**Co appka doporučila:**
- Overlap (Hostivařská přehrada)
- Sequential plán (bazén + les blízko sebe)

**Použili jsme:** Simulace

**Co fungovalo:**
- Oba resolver typy přítomny
- Sekvenční plán pro energického rodiče

---

### D3 — 2026-06-13 — Praha (simulace)

**Situace:**
- Rodič: OK, celý den
- Obě děti: 4 a 7 let, chtějí zoo
- Počasí: oblačno

**Co appka doporučila:**
- Zoo Praha na prvním místě
- Bez conflict resolverů (shoda)

**Použili jsme:** Simulace

**Co fungovalo:**
- Hint „Super, shodujete se!" v UI
- Single match flow

---

### D4 — 2026-06-13 — Beroun (simulace)

**Situace:**
- Rodič: OK, půl dne
- Dítě 1: 6 let, hrad
- Dítě 2: 9 let, park
- Počasí: slunečno
- Region: Střední Čechy

**Co appka doporučila:**
- Karlštejn, Konopiště, Svatý Jan pod Skalou…

**Použili jsme:** Simulace

**Co fungovalo:**
- Střední Čechy vrací tipy (15 aktivit)
- Konflikt hrad vs. park řešen

---

## Reálné víkendy

*(Doplň po použití na produkci — cíl 4 víkendy)*

### Šablona

```markdown
### YYYY-MM-DD — [Město]

**Situace:** ...
**Co appka doporučila:** ...
**Použili jsme:** Ano / Ne — ...
**Co fungovalo:** ...
**Co nefungovalo:** ...
**Nápad na zlepšení:** ...
```

---

## Souhrn metrik (cyklus 1)

| Metrika | Target | Stav |
|---------|--------|------|
| Engine scénáře (D1–D10) | 10 | ✅ 10/10 |
| Reálné víkendy | 4 | ⏳ 0/4 |
| Aktivity celkem | 40+ | ✅ 40 |
| Konflikt bazén vs. les | ≥2 resolvery | ✅ |
