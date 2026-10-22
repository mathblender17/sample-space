# Central Limit Theorem: article + interactive demos (design)

Date: 2026-10-22 · Time budget: 30 minutes · Series: Sample Space, issue #2 (Act I of the roadmap)

## Goal
1. I understand the CLT before writing: a short chat walkthrough of sections 0–5 comes first.
2. One public page, at the same three levels as every issue from now on:
   - **fundamental**: what it says and why
   - **implementation**: code the page shows and also runs
   - **application**: where it runs today

## Voice
I'm writing this to understand the CLT myself, by learning to teach it. Every section has to work for three readers:
1. **A 7-year-old.** No jargon at all; the explanation rests on things they can see and count (coins, piles of blocks).
2. **A curious 16-year-old.** Answer their likely "but why?" questions directly, in plain words.
3. **A parent who doesn't care yet.** Open with a real-life case they've met but never wondered about.

Rules:
- Explain the idea before naming it.
- Any unavoidable term gets a one-sentence plain meaning the first time it appears, e.g. "Cauchy (koh-SHEE): a kind of randomness where averaging never calms down".
- No convolution, moments, characteristic functions or "converges in distribution" in the body text. Formulas appear only after the plain-words version, and a reader can skip them.
- One-sentence version of the whole issue: *When you average many random things, the results pile up in a hill around the truth. The hill always has the same shape, and you can predict how wide it is.*

## Deliverables
- `index.html`: the article and all demos. Vanilla JS + `<canvas>`, no dependencies, no build step.
- `demos.js`: the demo code, as in the LLN issue.
- `theme.css`: an unchanged copy from the LLN issue.
- `docs/THEME.md`: copied from the LLN issue, with "Build it" added to the issue structure.
- `README.md`: what the issue is, plus publishing steps.

## Page structure
0. **Hook: the election poll.** *"Party A: 42%, margin of error ±3%."* The poll asked about 1,000 people in a country of 90 crore voters. How can 1,000 people speak for 90 crore, and why is it ±3% whatever the country's size? Analogy: one spoonful of well-stirred dal tells you the salt of the whole pot, small or huge. What matters is the size of the spoon, not the pot. Ends with a short callback to the LLN issue: last time, every experiment missed the truth in the same hill shape; this issue explains why.
1. **Toy: a handful of coins.** Throw 10 coins, count heads, and add a block to that pile. The middle grows tall because there's 1 way to get 10 heads but 252 ways to get 5: the middle has many ways to happen, the edges very few. → Demo A, then Demo B for "it works for dice and wait times too".
2. **Statement.** Plain words first: averages of many random things pile up in the same hill around the truth, and 4× the samples gives half the wobble. Then the skippable formula: (X̄ₙ − μ) / (σ/√n) → N(0,1). Conditions in plain words: samples don't copy each other, all come from the same source, and there are no crazy outliers that keep showing up.
3. **History.** Tiles: de Moivre (coins, 1733) → Laplace → Lyapunov's proof (1901) → Pólya names it "central" (1920), plus Galton's quincunx. Check every date against a source while building. Images only if public domain, credited in `assets/credits.json`.
4. **Speed.** How large n has to be depends on how lopsided the source is. A symmetric die needs about 5; a skewed wait-time needs far more. Uses Demo B with a skewed source.
5. **Small print.** Crazy outliers break it. Show this with the torch-on-a-long-wall picture: the spot sometimes lands a kilometre away, so its average never settles. Only after that picture, name it "Cauchy (koh-SHEE)". The approximation is worst in the tails (rare events, crashes). **Needs independence**, which sets up the next issue. Uses Demo B with the Cauchy source.
6. **Build it (new section).** About 15 lines of JS shown in a code block. It is the same function the page runs: simulate means, then build a 95% confidence interval x̄ ± 1.96·s/√n. → Demo C.
7. **Where it runs today.** Poll margins of error (±3% at n≈1,000), A/B test significance, error bars on ML benchmark scores, SGD gradient noise behaving like a Gaussian, measurement error. → Demo D.
8. **End hook (unnamed).** A frog hops between lily pads, and where it goes next depends on where it is now. Its running average still settles, but the bell of its averages comes out wider. Closing line, roughly: *"These samples remember. Does the bell survive?"* This hints at Markov chains, the next issue, without naming them.
9. **Footer.**

## Demos
Shared helper: one function that draws a histogram on a dark screen panel, with an optional normal-curve overlay. Each demo has its own controls plus Run/Reset.

| Demo | What you see | Controls |
|---|---|---|
| A. Galton board | balls bounce left or right through pegs and pile up into a bell | ball count, speed |
| B. Sum machine | source histogram (top); histogram of standardized means with an N(0,1) overlay (bottom) | source: die / coin / skewed (exponential) / **draw your own** / Cauchy; n; repetitions |
| C. Interval coverage | 100 confidence intervals as horizontal bars against the true mean. Misses are drawn in orange; about 95 hit. | n, confidence level (90/95/99) |
| D. Benchmark error bars | a model with true accuracy 80% scored on a test set of size n, with its ±1.96·√(p(1−p)/n) bar | test-set size |
| Frog (end hook) | 3 lily pads with sticky transition probabilities; running average + histogram of averages vs the independent case | Run |

## Out of scope
Frameworks, build tooling, analytics, comments, formal proofs (characteristic functions get one mention at most), multivariate CLT (that belongs to the multivariate Gaussian issue).

## Testing
Open `index.html` in a browser and check:
- every demo runs
- every source in B turns into a bell except Cauchy
- C's hit rate sits near the chosen confidence level
- D's bars shrink like 1/√n
- the frog's histogram is wider than the independent one
- no console errors, and the page reads well at phone width

## Publishing
Use `publish.sh` into `sample-space/central-limit-theorem/`, then add a homepage card and a README row. Ask before pushing.
