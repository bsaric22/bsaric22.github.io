# bsaric22 — osobna stranica

Statična, responzivna osobna stranica na hrvatskom. HTML, CSS i JavaScript, bez vanjskih biblioteka, fontova ili build ovisnosti.

## Lokalni pregled

Uz Node.js 20+ pokreni `npm run dev` i otvori http://localhost:4173. Zaustavi server s Ctrl+C. `npm run check` provjerava JavaScript sintaksu.

## GitHub Pages

Workflow `.github/workflows/pages.yml` objavljuje stranicu nakon pusha na `master` ili `main`, a može se pokrenuti i ručno.

1. U repozitoriju otvori **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Commitaj i pushaj datoteke na `master` (trenutna glavna grana).
3. Prati workflow **Deploy GitHub Pages** u kartici Actions.

Adresa nakon uspješne objave: https://bsaric22.github.io/

Workflow priprema mapu samo s javnim datotekama. `.nojekyll` isključuje Jekyll. Konfiguracija prati [službene GitHub upute](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Personalizacija

- `index.html`: ime, uvod, tekst o meni, poveznice i metapodaci. Tekst je početni prijedlog; eksperimenti su interaktivni demo primjeri, a ne tvrdnje o ranijim projektima.
- `assets/styles.css`: boje, tipografija, raspored i animacije.
- `assets/main.js`: interaktivni oblici, intenzitet animacije, pauza i navigacija.
- `assets/favicon.svg`: ikona stranice.

Animacije poštuju `prefers-reduced-motion`, mogu se pauzirati i automatski staju kada kartica ili platno nisu vidljivi. Osnovni sadržaj i navigacija rade i bez JavaScripta.
