# Vamika Menon — portfolio

A digital fashion exhibition / teenage visual diary / artist's sketchbook / interactive
fashion studio.

## Run it

```bash
npm install
npm run build      # writes ./app.js and ./styles.css
python3 -m http.server 8080
```

Then open http://localhost:8080. There is a static shell folder for every route
(`/about`, `/mind`, `/project`, `/process`, `/moodboards`, `/archive`, `/dress-me`,
`/atelier`, `/contact`) so deep links work behind a plain static server.

`npm run dev` starts Vite with hot reload if you'd rather not rebuild by hand.

## Layout

- `src/` — the real source. Edit here.
- `index.html` + route folders — document shells, all loading the same two files.
- `app.js`, `styles.css` — build output, committed so the folder stays servable as-is.
- `SITE_AUDIT.md` — route-by-route content and motion audit.
- `source/` — read-only snapshot of the pre-rebuild site's components, kept for reference.
  Nothing imports it; `src/` supersedes it.

## The three signature experiences

- **01 — Enter my mind** (`/mind`): thoughts, memories, inspirations, and the
  *what are you feeling today?* selector that answers a visitor's emotion with the
  garment or artwork it produced.
- **02 — Dress me** (`/dress-me`): six sequential decisions — silhouette, fabric, colour,
  print, detail, accessory — ending in a **LOOK CREATED** editorial fashion card signed
  *designed in vamika's world.*
- **03 — Moodboards** (`/moodboards`): six research walls that open into full spreads of
  references, swatches and what each board became.

Everything between them is deliberately quiet editorial layout — the interactions are
meant to feel special because they are surrounded by stillness.

## Palette

| token | value | role |
| --- | --- | --- |
| `cream` / `ivory` / `paper` | `#F7F5F0` `#FCFAF4` `#F2EFEB` | warm ivory canvas |
| `ink` / `charcoal` / `smoke` | `#1A1A1A` `#2E2C2A` `#595959` | typography |
| `burgundy` / `oxblood` / `wine` / `burgundy-light` | `#6B1226` `#4A0C1B` `#9E4751` `#B04A5C` | statement colour — headings, buttons, selected states, the occasional large block |
| `pink` / `pink-soft` / `blush` | `#F3A8BF` `#FADDE4` `#D9A5B3` | signature accent — small interactive details, rules, highlights |
| `stone` / `sand` | `#B8B0A4` `#E7E1D6` | muted neutrals |

Pink and burgundy are used selectively and never at the same weight in one view.

## Backend

The archive, contact links and `/admin` studio call the original preview API
(`src/lib/api.js`). That host currently answers 404, so those views fall back to their
empty states by design.
# vamikas-website
