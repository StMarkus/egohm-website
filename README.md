# eGohm – Promo-Website

Statische Marketing-Website zur App (`app/`). **Kein Build-Schritt**, kein
JavaScript-Framework: reines HTML/CSS + ein kleines Skript für das Einblenden
beim Scrollen. Alle Schriften und Bilder liegen im Ordner; die einzigen externen
Requests sind Grafik und Zählpixel des PayPal-Knopfes auf der Spendenseite.

Herausgeber ist die **St. Markus Koptisch-Orthodoxe Kirche Frankfurt**, die
eGohm für die Koptisch-Orthodoxe Diözese Süddeutschland erstellt — diese
Formulierung steht in jedem Footer und muss bei Änderungen überall gleich
gepflegt werden.

## Struktur

Jede Unterseite liegt als `<pfad>/index.html`, damit die URLs ohne
`.html`-Endung funktionieren (GitHub Pages liefert `foo/index.html` unter
`/foo/`).

```
website/
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
├── .nojekyll                  # Pages soll den Ordner nicht durch Jekyll schicken
└── assets/
    ├── css/style.css          # komplettes Styling, Palette = EgohmPalette der App
    ├── js/main.js
    ├── fonts/                 # woff2-Subsets aus assets/fonts (SIL OFL)
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
  (`applicationId` aus `app/android/app/build.gradle.kts`)
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

Die Palette in `assets/css/style.css` (`:root`) spiegelt
`app/lib/core/theme/flutter_flex_theme.dart` (`EgohmPalette`):
Braun `#483C30`, Tinte `#29263F`, Gold `#DEB98E`, Akzent `#A0522D`.
Ein Dark Mode greift automatisch über `prefers-color-scheme`.

Schriften sind Subsets der in der App gebündelten Fonts:

| Datei | Herkunft | Verwendung |
| --- | --- | --- |
| `cormorantgaramond-latin.woff2` | `assets/fonts/cormorantgaramond.ttf` | Überschriften |
| `archivonarrow-latin.woff2` | `assets/fonts/archivonarrow-regular.ttf` | Lauftext |
| `egohm-coptic.woff2` | `assets/fonts/eGohmCopticUnicode-Regular.ttf` | Wortmarke, koptische Beispiele |

Neu erzeugen (benötigt `fonttools` + `brotli`):

```bash
pyftsubset assets/fonts/cormorantgaramond.ttf --output-file=website/assets/fonts/cormorantgaramond-latin.woff2 --flavor=woff2 --unicodes="U+0000-00FF,U+2018-201E,U+2026" --layout-features="kern,liga"
```

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
python3 -m http.server 8080 --directory website
```

## Deployment

`.github/workflows/deploy-website.yml` lädt den Ordner bei jedem Push auf
`main`, der `website/**` berührt, als Pages-Artefakt hoch
(`actions/upload-pages-artifact` → `actions/deploy-pages`). Einmalig muss in
den Repository-Einstellungen unter *Pages* als Quelle **GitHub Actions**
gewählt werden.

Für eine eigene Domain: `website/CNAME` mit der Domain anlegen (eine Zeile,
z. B. `www.egohm.de`) und den DNS-Eintrag beim Provider setzen — für eine
`www`-Domain ein CNAME auf `mamitry.github.io`, für die Apex-Domain die vier
A-Records von GitHub Pages. Die App selbst bleibt unter `app.egohm.de`
(Firebase Hosting, eigener Workflow).

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
- `link rel="canonical"` in beiden Startseiten zeigt auf die github.io-Adresse;
  nach dem Domain-Umzug anpassen.
