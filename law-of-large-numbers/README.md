# The Law of Large Numbers · Sample Space

An interactive article on the Law of Large Numbers, from coin flips to mini-batch SGD. It's the first issue of *Sample Space*, a series that explains one idea from maths, statistics or ML per issue, with simulations you can play with.

**What's inside:** a coin-flip toy (with a Cauchy toggle that breaks the law), the statement and a four-line proof of the weak law, why precision costs 1/√n, where the law breaks, four real-world demos (Monte Carlo π, mini-batch SGD, a casino's house edge, an A/B test), and a closing hint at the next issue.

## Files
- `index.html`: the article, plus the styles specific to this page
- `theme.css`: the series theme (tokens, the pixel motif, buttons, screens). Reuse it in every issue.
- `demos.js`: all the simulations, in plain canvas with no dependencies
- `assets/`: public-domain pictures from Wikimedia Commons (credited in the footer; `credits.json` has the sources)
- `docs/THEME.md`: the series design philosophy. Read it before starting the next issue.

## Run locally
```bash
python -m http.server 8000
```
Then open http://localhost:8000.

## Publish on GitHub Pages
1. Create a repo and push this folder to its `main` branch.
2. In the repo, go to **Settings → Pages**, set the source to **Deploy from a branch**, then choose `main` and `/ (root)`.
3. The site appears at `https://<your-username>.github.io/<repo-name>/` after a minute or so.
