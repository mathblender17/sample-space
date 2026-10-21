# Sample Space — series theme

The house style for every article + demo in this series. Copy `theme.css` into each new issue and follow this sheet.

## The idea
**One pixel is one sample.** Probability, statistics and ML are all about piling up individual observations until a shape appears. So the series' only motif is the square cell: data is drawn as pixels, corners are cut in pixel steps, and the small pixel-art sprites are built from the same grid. If a new shape shows up that isn't made of square cells, it doesn't belong.

Vibe: a 1980s computer lab seen from the future. Putty-grey case plastic, a dark phosphor screen, one signal-orange light.

## Palette (tokens in `theme.css`)
| Role | Token | Value | Use |
|---|---|---|---|
| Ground | `--bg` | `#d8dad3` | putty paper, most of the page |
| Step | `--surface` | `#c9ccc3` | a tone step instead of a line |
| Ink | `--ink` | `#121417` | all running text |
| Soft ink | `--muted` | `#454a50` | secondary notes only |
| Signal | `--accent` | `#ff4d00` | the action, the "true value" line, the motif at large scale. Never for body text on light ground. |
| Screen | `--screen` | `#0e1211` | demo panels, the hero, the closing section |
| Phosphor | `--phosphor` | `#8dffa8` | sample paths and pixels on the screen |
| Screen ink | `--screen-ink` | `#d3e6da` | text on the screen |

One accent only. No gradients, glows, shadows, violet or cream.

## Type
One family: **Space Grotesk** (Google Fonts, 400/500/700). Its slightly mechanical shapes give the retro-tech feel; pixel type is kept for the footer mark only, so it never takes over. Tabular figures (`font-variant-numeric: tabular-nums`) for any readout. Five size steps max (`--step-*` in `theme.css`). Headlines two lines or fewer at every width.

## The motif in practice
- **Pixel-step corners:** `--px-cut` clip-path on folders, buttons, picture frames and tiles. Never rounded corners.
- **Sprites:** 8×8 or 12×12 pixel drawings (inline SVG `<rect>`s, `shape-rendering: crispEdges`) as list bullets and small accents. At most one sprite per list item. Never as a hero illustration.
- **Screens:** every interactive demo sits on a `--screen` panel with phosphor marks and an orange true-value line. The controls are plain buttons/sliders under the screen.
- **The mark:** the series name built from pixel blocks, large, in the footer.
- **Pictures:** real historical images (open collections, credited in the footer), shown in pixel-cut frames, desaturated.

## Issue structure (keep for every topic)
1. **Hook:** a paradox in one sentence, before any definition.
2. **Intuition + the toy:** the live demo you can play with first.
3. **The statement:** the precise version, plus the people and the year it came from.
4. **The cost or speed:** how much data/time it takes, as growing tiles.
5. **Limits:** what it does *not* say and where it breaks.
6. **In the wild:** 3–4 real uses, each a small demo on the same screen.
7. **Premonition:** an unnamed hint at the next issue. Show it, don't name it.
8. **Footer:** the pixel mark, sources, credits.

## Motion
Section parts rise 24px and fade in, staggered 70ms, once. The "in the wild" list swaps its demo with a 240ms crossfade. Transform/opacity only; everything honours `prefers-reduced-motion`.
