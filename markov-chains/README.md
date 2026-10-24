# Markov Chains · Sample Space

An interactive article on Markov chains: randomness that remembers one step. It's the third issue of *Sample Space*, a series that explains one idea from maths, statistics or ML per issue, with simulations you can play with.

**What's inside:**
- a phone-keyboard hook, and the lazy frog from issue #2
- Snakes and Ladders, and a pond builder where you set how sticky each lily pad is
- the long-run share, and why the law of large numbers survives memory
- 1,000 frogs forgetting where they started, and why the frog's hill in issue #2 was 2.3× wider
- where chains break: traps, endless loops, cut-off ponds
- a "Build it" section whose text-babbling code the page itself runs
- four real-world demos: web search, your keyboard, GPS snapping, image generators
- a closing hint at the next issue

## Files
- `index.html`: the article, plus the styles specific to this page
- `theme.css`: the series theme, unchanged
- `demos.js`: all the simulations, in plain canvas with no dependencies
- `docs/THEME.md`: the series design and voice
- `docs/superpowers/specs/`: this issue's design spec

## Run locally
```bash
python -m http.server 8000
```
Then open http://localhost:8000.
