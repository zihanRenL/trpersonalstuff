# trpersonalstuff

Personal site for **Zihan (Terianno) Ren** — portfolio, experience records, and original
character illustration. Plain HTML, CSS, and JavaScript; no build step, no dependencies.

## Add the artwork files

The three illustration files are not in the repo yet. Drop them into `assets/art/`
using exactly these names and the gallery picks them up automatically:

| File | Piece |
| --- | --- |
| `assets/art/in-the-garden.png` | inTheGarden — 2024.1 |
| `assets/art/kaito-2025.png` | KAITO 2025 birth anniversary — 2025.2.14 |
| `assets/art/untitled-2023.png` | untitled — 2023.10 |

`.jpg`, `.jpeg`, and `.webp` also work — each page tries `.png` first and falls back
through the rest. Until a file exists, the gallery shows a labelled empty slot instead
of a broken image.

## Structure

```
index.html        landing page — profile, education, skills, folders
work.html         experience directory, filterable by category
entry.html?id=…   one experience record (built from data.js)
gallery.html      illustration gallery
art.html?id=…     one illustration, with the notes behind it
assets/js/data.js ← ALL TEXT LIVES HERE
assets/css/style.css
assets/art/       illustration files
fridge/           冰箱食材过期提醒 — a self-contained PWA (see fridge/README.md)
```

## 冰箱食材过期提醒 (fridge/)

A separate little app living under `fridge/`, unrelated to the portfolio pages:
it tracks how many days are left on everything in the fridge and colour-codes it
red / orange / green so nothing quietly goes off. Responsive, installable to the
home screen, and works out of the box storing data in the browser; fill in
`fridge/config.js` with Supabase credentials to get a login and live sync between
phone and laptop. Setup notes are in [`fridge/README.md`](fridge/README.md).

It shares this repo's palette but has its own stylesheet and no dependency on
`assets/`, so the two can be edited independently.

## Editing content

Everything readable on the experience and gallery pages comes from
`assets/js/data.js`. Add an object to `ENTRIES` and it appears in the directory with its
own detail page; add one to `ARTWORKS` and it appears in the gallery with its own plate
page. Nothing else needs to change.

## Running it

Open `index.html` in a browser, or serve the folder:

```bash
npx http-server -p 8080
```

## Deploying

Any static host works. For GitHub Pages: Settings → Pages → deploy from this branch,
root folder.

## Design notes

Blue and white throughout, sampled from a dual-screen poster: `#2a6ee0` for the field,
`#45cbf5` for the bright accents and arrows, `#e9e8e2` for the paper panels. Pixel type
(Silkscreen) is reserved for large headings only; all body copy is Arial, white.
