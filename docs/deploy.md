# Deploy — Vercel + GitHub

**Repozitář:** [github.com/trnkapavel/kam-s-detmi](https://github.com/trnkapavel/kam-s-detmi)  
**Deploy:** Vercel propojený s GitHubem — **push na `main` = automatický deploy**

---

## Workflow (primární)

```
lokální změny → git commit → git push origin main → Vercel build & deploy
```

1. Udělej změny v kódu
2. Commit a push na `main`
3. Vercel automaticky spustí build (`npm run build`)
4. Po ~1–2 minutách je nová verze live

Stav deploye sleduj v [Vercel Dashboard](https://vercel.com/dashboard) u projektu `kam-s-detmi`.

---

## První propojení lokálního repa (jednorázově)

Pokud lokální složka ještě nemá `.git`:

```bash
cd kam-s-detmi
git init
git remote add origin https://github.com/trnkapavel/kam-s-detmi.git
git add .
git commit -m "feat: MVP web app with check-in wizard and recommendation engine"
git branch -M main
git push -u origin main
```

> Pokud je GitHub repo už neprázdné (README z webu), nejdřív `git pull origin main --rebase` nebo merge.

---

## Vercel nastavení (už hotovo u tebe)

- **Framework:** Next.js (auto-detect)
- **Build Command:** `npm run build`
- **Production branch:** `main`
- **Env variables:** žádné povinné pro MVP

---

## Environment variables

MVP nepotřebuje API klíče. Open-Meteo běží z prohlížeče bez autentizace.

---

## Ověření po deployi

- [ ] Check-in wizard na `/`
- [ ] Počasí se načte (Open-Meteo)
- [ ] `/vysledky` vrátí tipy pro Prahu
- [ ] Střední Čechy → Beroun → Karlštejn / Křivoklát
- [ ] Mobilní zobrazení OK

---

## Lokální produkční test

```bash
npm run build
npm run start
# http://localhost:3000
```

---

## CLI deploy (volitelný fallback)

Pouze když potřebuješ deploy bez pushu:

```bash
npx vercel login
npx vercel --prod
```

---

## Poznámky

- Aktivity (`data/activities/*.json`) se načítají na serveru v `/api/recommend`
- Check-in data jen v `sessionStorage` — neukládají se na server
- Privacy disclaimer na stránce výsledků
