# R Vidhya Raj – Developer Portfolio

Static portfolio site (HTML, CSS, vanilla JavaScript). No build step or dependencies.

## Run locally
```bash
# Option 1: open index.html in a browser
# Option 2 (recommended): serve the folder
python -m http.server 8000     # then visit http://localhost:8000
```

## Deploy to GitHub Pages
1. Copy these files into your repository root (replace the old files; delete the old `assets/images/projects/*.svg` and `assets/images/achievements/HackToFuture.jpg`).
2. Commit and push to `main`.
3. Repository **Settings → Pages → Build and deployment → Deploy from a branch → `main` / `(root)`**.
4. Open https://vidhya0497.github.io/Vidhya-raj-portfolio/ (allow a minute or two; hard-refresh with Ctrl+Shift+R to clear cached assets).

## Structure
- `index.html` – all sections · `css/style.css` · `js/script.js`
- `assets/resume/R_Vidhya_Raj_Resume.pdf` – file used by every Resume / Download Resume button (replace it to update)
- `assets/images/` – profile, projects, patents, achievements, certificates
- `assets/icons/` – skill, certification and coding-profile icons

## Updating content
- **Resume:** overwrite `assets/resume/R_Vidhya_Raj_Resume.pdf` keeping the same filename.
- **Smart Food demo:** add a button in the Smart Food project card in `index.html` once you have the link.
- **Contact form:** uses EmailJS (keys in `js/script.js`); restrict allowed origins to `vidhya0497.github.io` in the EmailJS dashboard.
