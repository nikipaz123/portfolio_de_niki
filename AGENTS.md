# portfolio_de_niki — AGENTS.md

Static art portfolio site. Vanilla HTML/CSS/JS, no build tools, no frameworks, no tests, no CI.

## Run

No build step needed. Open `src/index.html` directly or serve with any static server:

```sh
python3 -m http.server -d src
```

## Architecture

- **Entry**: `src/index.html`
- **Flipbook**: CSS checkbox hack — hidden `<input type="checkbox">` + `:checked` + `~` sibling selectors control page turns. No JS involved in flips.
- **Carousel**: `src/scripts/carousel.js` (ES module, `type="module"`). Infinite scroll with 3x year repetition.
- **Styles**: `style.css` (layout + carousel + flipbook), `trinkets.css` (decorative overlays).
- **`carousel.css`** is **not linked** in `index.html` — probable dead code.

## Adding a new year

Requires changes in 4+ places:

1. `src/views/{year}.html` — flipbook page structure
2. `src/assets/{year}/{year}_{1..9}.jpg` — page images
3. `src/assets/covers/bg{year}.png` — cover background
4. `src/scripts/carousel.js` — append year to `baseYears` array (line 10)
5. `src/styles/style.css` — add both `.carousel-item.book-{year}` and `.book-{year} .cover::before` rules

View templates are inconsistent: some use text+image (`2018.html`, `2025.html`), others image-only (`2023.html`). Check existing year views for the pattern you need.

## Git

- Remote: `origin/main` (push), also `origin/master` (stale)
- Both `main` and `master` branches exist at same commit

## Language

All content in Spanish — HTML `lang="es"`, copy, comments, alt text.
