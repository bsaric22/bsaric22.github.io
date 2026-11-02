# Boris Šarić — osobna stranica

Statična, responzivna osobna stranica na hrvatskom. HTML, CSS i JavaScript, bez vanjskih biblioteka ili build ovisnosti. Navigacija koristi Outfit Medium (500), uvod Fira Code putem Google Fonts, a naslov Clash Display putem Fontsharea. Svi imaju zamjenske fontove ako preuzimanje nije dostupno.

Pozadinom prevladava `#233C52` uz diskretne naglaske `#004F8F`, a footer koristi `#020C38`. Fiksirana navigacija ima zaobljenje od 20 px, mobilni izbornik i automatsko označavanje aktivne sekcije plavom bojom `#23A9F2`. Sekcije su `#o-meni`, `#portfolio` i `#kontakt`; uvodni ekran nema aktivnu stavku, a interaktivno igralište pripada Portfoliju.

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
- `assets/main.js`: statični geometrijski prikazi, intenzitet oblika i navigacija.
- `assets/favicon.svg`: ikona stranice.

Naslovna sekcija `#naslovna` ostavlja prostor za fotografiju lijevo i prikazuje ime i uvodni tekst desno. Na mobitelu tekst dolazi prije fotografije. Za dodavanje fotografije zamijeni `.portrait-placeholder` slikom klase `portrait-image`; primjer je u komentaru u HTML-u.

Samo naslovna sekcija ima jednokratnu animaciju: prvo se pojavljuje ime, zatim se ispisuje uvod. Uz `prefers-reduced-motion: reduce` sve je odmah vidljivo. Geometrijski prikazi ostaju statični i ponovno se crtaju samo pri promjeni veličine ili ručnom odabiru oblika i intenziteta. Navigacija nema kontrolu animacija. Osnovni sadržaj i navigacija rade i bez JavaScripta.
