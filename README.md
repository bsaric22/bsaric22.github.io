# Boris Šarić — osobna stranica

Statična, responzivna osobna stranica na hrvatskom. HTML, CSS i JavaScript, bez vanjskih biblioteka ili build ovisnosti. Navigacija koristi Outfit Medium (500), uvod Fira Code, a glavni naslov Yeseva One putem Google Fonts. Naslov „O meni” koristi Clash Display putem Fontsharea. Svi imaju zamjenske fontove ako preuzimanje nije dostupno.

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

Naslovna sekcija `#naslovna` prikazuje ime iznad prezimena, s prezimenom pomaknutim udesno. Naslov koristi Yeseva One, uz Georgiju kao zamjenu. Pozadinski SVG motivi kreću se neovisnim nasumičnim putanjama. Stilovi su u `assets/hero.css`.

Naslovna sekcija na desktopu i mobitelu prvo animira ime i prezime iz zajedničke linije, zatim postupno ispisuje uvod. Pokretanje je izričito omogućeno na oba tipa uređaja. Pozadina se može pauzirati gumbom ispod uvoda i miruje izvan vidljivog dijela stranice.

Sekcija O meni koristi tamnu podlogu #1E1E1E, točkastu teksturu i geometrijske nacrte. Lijevo je fotografija u `.about-portrait`, a desno naslov i `.about-biography` u Fira Codeu.

Na dnu je tamnija traka s 19 alata i lokalnim SVG logotipima u sivoj boji. Popis uređuj samo jednom u `index.html`, unutar `.skills-list`; JavaScript automatski stvara vizualnu kopiju za neprimjetan prijelaz. Datoteke, izvori i licence logotipa nalaze se u `assets/logos/`. Siva boja definirana je CSS filtrom na `.skill-logo img`, a nazivi koriste približne sistemske i postojeće fontove. Traka se pomiče ulijevo, krug traje 140 sekundi i može se pauzirati gumbom. Trajanje je u pravilu `.skills-ready .skills-track` u `assets/hero.css`. Bez JavaScripta popis se može vodoravno pomicati ručno.
