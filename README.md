# GM Studio website

Single-page website for **GM Studio**, Georgia Wright's lash and brow studio at 13A Lyndhurst Terrace, Swalwell.

Plain HTML, CSS and JavaScript. No build step and no dependencies.

## View it locally

Double-click `index.html`, or serve the folder:

```bash
python -m http.server 5173
```

then open http://localhost:5173.

## Structure

```
index.html            page content
assets/css/styles.css all styling (colour tokens at the top)
assets/js/main.js     mobile menu, scroll reveals, live open/closed status
assets/img/           photos (Fresha, Instagram) + hero-paper.jpg (paper from the logo artwork)
assets/logo.svg       full logo, vector-traced from the client-supplied logo artwork
assets/monogram.svg   GM monogram only (header, footer)
assets/favicon.svg
```

## Updating content

- **Prices** are in the `#prices` section of `index.html`. They match the Fresha menu as of September 2026.
- **Opening days** are in the `#visit` list. If they change, also update `OPEN_DAYS` in `assets/js/main.js` so the "Open today" note stays correct.
- **Booking links** all point to the studio's Fresha booking page.
- After editing CSS/JS, bump the `?v=` number on the links in `index.html` so browsers fetch the new version.
