# CLAUDE.md

Guidance for Claude Code working in this repository.

## What this is

The personal site of **Zihan (Terianno) Ren** — portfolio, experience records, and
original character illustration. Plain HTML, CSS, and vanilla JS. **No build step, no
package manager, no dependencies.** Do not introduce a bundler, framework, or npm
install unless explicitly asked.

`README.md` covers setup, deployment, and the artwork file naming convention. Read it
before touching the gallery.

## Structure

```
index.html          landing page — profile, education, skills, folders
work.html           experience directory, filterable by category
entry.html?id=…     one experience record, rendered from data.js
gallery.html        illustration gallery
art.html?id=…       one illustration plus the notes behind it
assets/js/data.js   ← ALL TEXT CONTENT LIVES HERE
assets/js/main.js   rendering and filtering
assets/css/style.css
assets/art/         illustration files
fridge/             冰箱食材过期提醒 — self-contained PWA,independent of the portfolio pages
```

## The one rule that matters most

**Content changes go in `assets/js/data.js`, not in the HTML.** Add an object to
`ENTRIES` and it appears in the experience directory with its own detail page; add one
to `ARTWORKS` and it appears in the gallery with its own plate page. The HTML files are
shells — editing copy directly into them breaks the single-source-of-truth pattern.

## Design system

Sampled from a dual-screen poster; keep to it.

| Token | Value | Use |
| --- | --- | --- |
| Field blue | `#2a6ee0` | backgrounds, the main field |
| Bright accent | `#45cbf5` | arrows, highlights |
| Paper | `#e9e8e2` | panels |

- **Silkscreen** (pixel type) is for large headings **only**.
- All body copy is Arial, white.
- The statusbar / nav chrome is deliberate retro-terminal styling — match it, don't
  modernize it.

## fridge/

A separate little app under `fridge/`. Tracks days remaining on食材 and colour-codes
red / orange / green. Shares the palette but has **its own stylesheet and no dependency
on `assets/`** — edit the two independently. Optional Supabase sync is configured in
`fridge/config.js` (never commit real credentials). See `fridge/README.md`.

## About the owner

Useful context, since each Claude Code session starts fresh:

- **B.S. Psychology, University of Washington** → **M.S. Industrial & Operations
  Engineering, University of Michigan** (started Fall 2026, graduating Dec 2027 or
  Apr 2028).
- Coursework interest is on the **data science / analytics** side of IOE rather than
  human factors — the psych background already covers that ground, and the goal is to
  build quantitative and engineering depth on top of it.
- Considering job markets in the **US, Hong Kong, and Germany**, not the US alone.
- Writes and reads Chinese and English; mixed-language replies are fine and welcome.

## Working style

- Plain language over jargon. If a term needs a paragraph of setup, find a simpler way
  to say it.
- Short and concrete beats comprehensive. Lead with the actionable part.
