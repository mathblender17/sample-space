# Law of Large Numbers — article + interactive demos (design)

Date: 2026-10-21 · Time budget: 30 minutes

## Goal
1. The author understands the LLN before writing (8-min chat walkthrough of sections 1–4 first).
2. A single public page (GitHub Pages) with a 0→1(→5) article and playable demos.

## Deliverables
- `index.html` — article + all demos. Vanilla JS + `<canvas>`, no dependencies, no build.
- `README.md` — what it is + 3 steps to publish on GitHub Pages.

## Page structure
0. **Hook** — a paradox, before any definition: *"Every night, someone walks out of a casino richer. Yet no well-run casino loses money over a year. Both are true, and the reason is one theorem."*
1. **Intuition** — 10 flips can give 70% heads; 10,000 flips land near 50%. Averages settle.
2. **Statement** — X̄ₙ → μ. Weak (in probability) vs strong (almost surely). Chebyshev proof of the weak law: Var(X̄ₙ) = σ²/n → 0.
3. **Speed** — error ~ σ/√n: 100× data buys 10× precision.
4. **What it does not say** — no gambler's fallacy (averages settle by dilution, not correction). Fails without a finite mean (Cauchy) or with dependent samples.
5. **Why it's so hard to escape, especially now** — insurance, casinos, polls, A/B tests; ML: empirical risk minimization, mini-batch SGD, benchmark scores, Monte Carlo in RL/diffusion.
6. **Demos A–E** (each placed beside the section it illustrates).
7. **Closing premonition** — see below.

## Demos
Shared helper: one function that draws running-mean lines against a dashed true-value line. Each demo has an n / speed control and Run/Reset.

| Demo | What you see | Controls |
|---|---|---|
| A. Coin flip (toy) | 5 running-mean paths + ±1/√n band around 0.5 | n, **Cauchy toggle** (paths never settle) |
| B. Monte Carlo π | darts in a unit square; π estimate converging | number of darts |
| C. SGD batch size | 1-D linear regression; mini-batch gradient vs true gradient | batch size |
| D. Casino edge | one player's bankroll swings; house average per bet locks onto −2.7% | bets |
| E. A/B test | two conversion-rate estimates (10% vs 11%) crossing then separating | visitors |

## Closing premonition (prelude to tomorrow)
A final small demo, **not named**: "Run the coin experiment 1,000 times. Stack up where each run's average ended." A histogram builds into a bell shape. Closing line, roughly:
> *The averages always arrive. But look at **how** they miss — every time, the same shape, no matter what we averaged. Coins, darts, gradients, roulette. Why that shape? That's tomorrow.*

This hints at the Central Limit Theorem (the natural next topic) without naming it.

## Out of scope
Frameworks, build tooling, analytics, comments, mobile-specific polish beyond a responsive single column.

## Testing
Open `index.html` in the browser: every demo runs, converges to its true value (Cauchy does not), the histogram forms a bell, no console errors, readable at phone width.
