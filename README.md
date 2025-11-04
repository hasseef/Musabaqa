# Musabaqa – GitHub Pages Bundle

This folder contains a ready-to-publish GitHub Pages demo:
- `index.html` – self-contained demo using React UMD + Babel (no build step required).
- `.nojekyll` – disables Jekyll processing to avoid asset/routing issues on Pages.

## How to publish
1) Create or open your repo (e.g., hasseef/Musabaqa) on GitHub.
2) Upload *both* files to the repository root (`index.html` and `.nojekyll`).
3) Go to **Settings → Pages**:
   - Source: **Deploy from a branch**
   - Branch: **main** / **root**
4) Open: `https://<your-username>.github.io/<repo-name>/`

## Notes
- This demo runs fully client-side and is meant for showcasing flows to partners/investors.
- For production, consider a Next.js app with a proper build & deployment pipeline.
