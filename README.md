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
assets/img/           photos (from the studio's Fresha and Instagram)
assets/favicon.svg
```

## Updating content

- **Prices** are in the `#prices` section of `index.html`. They match the Fresha menu as of September 2026.
- **Opening hours** are in the `#visit` table. If they change, also update `OPEN_DAYS`, `OPEN` and `CLOSE` in `assets/js/main.js` so the open/closed badge stays correct.
- **Booking links** all point to the studio's Fresha booking page.
