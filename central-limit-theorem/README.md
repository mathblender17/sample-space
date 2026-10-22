# The Central Limit Theorem · Sample Space

An interactive article on the Central Limit Theorem: why 1,000 voters can speak for a whole country. It's the second issue of *Sample Space*, a series that explains one idea from maths, statistics or ML per issue, with simulations you can play with.

**What's inside:**
- an election-poll hook
- a coin-pile toy
- a sum machine that turns any shape into a bell (including one you draw), except the "torch" (Cauchy) source
- the one formula behind every margin of error, and why precision costs √n
- where the theorem breaks
- a "Build it" section whose code the page itself runs
- three real-world demos: polls, AI benchmark error bars, training noise
- a closing hint at the next issue

## Files
- `index.html`: the article, plus the styles specific to this page
- `theme.css`: the series theme, unchanged from issue #1
- `demos.js`: all the simulations, in plain canvas with no dependencies
- `docs/THEME.md`: the series design and voice. Read it before starting the next issue.
- `docs/superpowers/specs/`: this issue's design spec

## Run locally
```bash
python -m http.server 8000
```
Then open http://localhost:8000.
