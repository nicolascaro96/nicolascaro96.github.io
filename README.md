# Portfolio site

Static bilingual (EN/ES) CV portfolio for GitHub Pages. No build step.

## Structure
```
index.html          page layout (rarely needs edits)
content.js          ALL text content: edit this to update the CV
assets/style.css    styles (light/dark)
assets/main.js      rendering + language/theme toggles
assets/img/         profile.jpg + project images
assets/cv/          CV PDF for the "Download CV" button
demos/valencia-od/  standalone OD dashboard (open data: MITMA + GTFS), linked from "Interactive examples"
```

## Preview locally
Open `index.html` in a browser (double-click), or run `python -m http.server` in this folder and go to http://localhost:8000.

## Publish on GitHub Pages
1. Create a **public** repo named exactly `<your-username>.github.io` on github.com (no README).
2. In this folder:
   ```
   git init
   git add .
   git commit -m "Initial portfolio"
   git branch -M main
   git remote add origin https://github.com/<your-username>/<your-username>.github.io.git
   git push -u origin main
   ```
3. On GitHub, go to repo **Settings → Pages**. Set Source to "Deploy from a branch", branch `main`, folder `/ (root)`.
4. After about a minute the site is live at `https://<your-username>.github.io`.

To update later: edit `content.js`, then `git add . && git commit -m "Update" && git push`.
