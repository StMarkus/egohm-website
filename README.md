# eGohm – Promo-Website

Statische Marketing-Website zur App **eGohm** (eϪⲱⲙ), der Gebets- und
Liturgie-App der Koptisch-Orthodoxen Kirche. **Kein Build-Schritt**, kein
JavaScript-Framework: reines HTML/CSS + ein kleines Skript für das Einblenden
beim Scrollen. Alle Schriften und Bilder liegen im Repo; die einzigen externen
Requests sind Grafik und Zählpixel des PayPal-Knopfes auf der Spendenseite.

Herausgeber ist die **St. Markus Koptisch-Orthodoxe Kirche Frankfurt**, die
eGohm für die Koptisch-Orthodoxe Diözese Süddeutschland erstellt — diese
Formulierung steht in jedem Footer und muss bei Änderungen überall gleich
gepflegt werden.

## Verhältnis zur App

Dieses Repo enthält **nur die Website**. Der Flutter-Code der App und die
liturgischen Inhalte liegen in einem separaten, privaten Repository
(`egohm_app_flutter_new`) — es muss privat bleiben, weil dort lizenzierte
Bibeltexte liegen. Deshalb ist die Website ausgelagert: GitHub Pages setzt für
private Repos einen bezahlten Plan voraus.

Es gibt keine technische Abhängigkeit in Richtung App-Repo: die Schriften sind
eigene woff2-Subsets, die Screenshots werden von der laufenden Web-App
(`https://app.egohm.de`) aufgenommen. Änderungen an der App wirken also nur
dann auf die Website, wenn hier Texte oder Screenshots nachgezogen werden.

## Struktur

Jede Unterseite liegt als `<pfad>/index.html`, damit die URLs ohne
`.html`-Endung funktionieren (GitHub Pages liefert `foo/index.html` unter
`/foo/`).

```
.
├── index.html                 # deutsche Startseite
├── spenden/index.html         # Spendenseite mit PayPal-Knopf
├── danke/index.html           # Bestätigung nach der Spende (noindex)
├── impressum/index.html       # Platzhalter-Entwurf
├── datenschutz/index.html     # Platzhalter-Entwurf
├── en/
│   ├── index.html             # englische Startseite
│   ├── donate/index.html
│   ├── thanks/index.html      # noindex
│   ├── imprint/index.html
│   └── privacy/index.html
├── robots.txt
├── .nojekyll                  # Pages soll den Inhalt nicht durch Jekyll schicken
└── assets/
    ├── css/style.css          # komplettes Styling, Palette = EgohmPalette der App
    ├── js/main.js
    ├── fonts/                 # woff2-Subsets der App-Schriften (SIL OFL)
    └── img/                   # App-Screenshots (webp), Icon, OG-Bild
```

Sprachpaare sind über `<link rel="alternate" hreflang>` und den DE/EN-Umschalter
im Kopf verknüpft: `spenden/` ↔ `en/donate/`, `danke/` ↔ `en/thanks/`,
`impressum/` ↔ `en/imprint/`, `datenschutz/` ↔ `en/privacy/`. Kommt eine Seite
dazu, beide Richtungen setzen.

## Store-Links

Die App ist veröffentlicht; die Links stehen in beiden Startseiten (Download-
Sektion + Footer) und in den Footern aller Unterseiten:

- Google Play: `https://play.google.com/store/apps/details?id=de.kopten.app`
- App Store: `https://apps.apple.com/us/app/egohm/id6444137697`
- Web-App: `https://app.egohm.de`

Offizielle Store-Badges sind bewusst **nicht** eingebunden — sie würden Grafiken
von Google/Apple nachladen. Stattdessen Text-Knöpfe im Website-Stil.

## Spenden und PayPal

`spenden/index.html` (und `en/donate/index.html`) enthalten den offiziellen
PayPal-Spenden-Knopf mit `hosted_button_id` **LHN5HBKSBUD42**. Die
Zweckbindung — ausschließlich Hardware und KI-Abonnements — steht auf der Seite
und sollte nur zusammen mit der tatsächlichen Verwendung geändert werden.

Die Dankesseite ist **nicht** im Formular hinterlegt: die Return-URL
`https://egohm.de/danke/` (bzw. die künftige Domain) wird in den Einstellungen
des Buttons im PayPal-Konto eingetragen — sonst landen Spender nach der Zahlung
weiter bei PayPal.

## Farben und Schriften

Die Palette in `assets/css/style.css` (`:root`) spiegelt die Klasse
`EgohmPalette` aus dem App-Theme (`app/lib/core/theme/flutter_flex_theme.dart`
im App-Repo): Braun `#483C30`, Tinte `#29263F`, Gold `#DEB98E`, Akzent
`#A0522D`. Ein Dark Mode greift automatisch über `prefers-color-scheme`.

Schriften sind Subsets der in der App gebündelten Fonts (Quelle: `assets/fonts/`
im App-Repo):

| Datei hier | Quelle im App-Repo | Verwendung |
| --- | --- | --- |
| `assets/fonts/cormorantgaramond-latin.woff2` | `cormorantgaramond.ttf` | Überschriften |
| `assets/fonts/archivonarrow-latin.woff2` | `archivonarrow-regular.ttf` | Lauftext |
| `assets/fonts/egohm-coptic.woff2` | `eGohmCopticUnicode-Regular.ttf` | Wortmarke, koptische Beispiele |

Neu erzeugen (benötigt `fonttools` + `brotli`), aus dem App-Repo heraus:

```bash
pyftsubset assets/fonts/cormorantgaramond.ttf --output-file=../egohm-website/assets/fonts/cormorantgaramond-latin.woff2 --flavor=woff2 --unicodes="U+0000-00FF,U+2018-201E,U+2026" --layout-features="kern,liga"
```

Die koptische Schrift wird nicht gesubsettet, sondern nur nach woff2 komprimiert
(`TTFont(...); f.flavor='woff2'; f.save(...)`).

## Screenshots aktualisieren

Die Screenshots sind Aufnahmen der Web-App (`https://app.egohm.de`) mit
Headless-Chrome, 500 × 1010 CSS-Pixel bei Device-Pixel-Ratio 2 (Chrome
erzwingt im Headless-Modus mindestens 500 px Breite):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  --headless=new --disable-gpu --hide-scrollbars \
  --force-device-scale-factor=2 --window-size=500,1010 \
  --virtual-time-budget=28000 --screenshot=home.png https://app.egohm.de
```

Danach unten den leeren Bereich abschneiden und als webp speichern
(`Image.save(..., quality=86)`). Aufgenommene Pfade: `/`, `/calendar`,
`/reading/liturgy`, `/prayerlist/stbasil`, `/library/euchologion`.

## Lokal ansehen

```bash
python3 -m http.server 8087
```

Danach `http://localhost:8087/` öffnen. Achtung beim Prüfen mit
Headless-Chrome: Blöcke mit der Klasse `reveal` werden erst beim Scrollen
eingeblendet — nach 2,5 s entfernt `main.js` die Klasse `js` und alles ist
sichtbar. Ohne JavaScript ist ohnehin alles sichtbar.

## Deployment

`.github/workflows/deploy-website.yml` lädt das Repo-Wurzelverzeichnis bei jedem
Push auf `main` als Pages-Artefakt hoch (`actions/upload-pages-artifact` →
`actions/deploy-pages`). Einmalig muss in den Repository-Einstellungen unter
*Pages* als Quelle **GitHub Actions** gewählt werden.

**Solange dieses Repo privat ist, funktioniert GitHub Pages nicht** — Pages für
private Repositories setzt einen bezahlten Plan voraus (bei Organisationen
GitHub Team). Erst nach dem Umschalten auf *public* (oder mit Team-Plan) läuft
der Deploy durch.

Ohne eigene Domain liegt die Seite unter
`https://stmarkus.github.io/egohm-website/` — darauf zeigen derzeit die
`canonical`-Angaben der beiden Startseiten.

Für eine eigene Domain: `CNAME` im Wurzelverzeichnis mit der Domain anlegen
(eine Zeile, z. B. `www.egohm.de`) und den DNS-Eintrag beim Provider setzen —
für eine `www`-Domain ein CNAME auf `stmarkus.github.io`, für die Apex-Domain
die vier A-Records von GitHub Pages. Die App selbst bleibt unter `app.egohm.de`
(Firebase Hosting, Workflow im App-Repo).

## Offen

- **Impressum und Datenschutz** sind vorbereitete Entwürfe: alle noch zu
  füllenden Felder stehen als `…` im Text, oben auf der Seite weist ein
  `.placeholder`-Kasten darauf hin. Nach dem Ausfüllen den Kasten entfernen und
  den Text rechtlich prüfen lassen. Die englischen Fassungen verweisen bewusst
  auf die deutschen als maßgeblich.
- Spendenbescheinigung / steuerliche Abzugsfähigkeit: Platzhalter in
  `spenden/` und `en/donate/`.
- Return-URL des PayPal-Knopfes im PayPal-Konto auf `/danke/` setzen
  (siehe oben).
- Repo auf *public* schalten, damit Pages deployen kann.
- Der Footer-Link „Website auf GitHub“ zeigt auf dieses Repo und greift erst,
  wenn es öffentlich ist.
- `canonical`-Angaben nach dem Domain-Umzug anpassen.
