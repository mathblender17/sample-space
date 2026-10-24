# Markov Chains: article + interactive demos (design)

Date: 2026-10-24 · Series: Sample Space, issue #3 (an Act I gap issue, reached through the CLT's "needs independence" point)

## Goal
1. I understand Markov chains before writing: a short chat walkthrough of sections 0–5 comes first.
2. One public page, at the same three levels as every issue:
   - **fundamental**: what it says and why
   - **implementation**: code the page shows and also runs
   - **application**: where it runs today

## Voice
Same rules as the CLT issue. Every section has to work for three readers:
1. **A 7-year-old.** No jargon; the explanation rests on things they can see and play (a frog on lily pads, Snakes and Ladders).
2. **A curious 16-year-old.** Answer their likely "but why?" questions directly, in plain words.
3. **A parent who doesn't care yet.** Open with a real-life case they've met but never wondered about: the phone keyboard guessing the next word.

Rules:
- Explain the idea before naming it. "Markov chain" is named only after the frog and the board game have shown it.
- Any unavoidable term gets a one-sentence plain meaning the first time it appears.
- No "stochastic", "ergodic", "eigenvector" or "stationary distribution" in the body text. Say "the long-run share" for the stationary distribution and "forgetting where it started" for mixing. Formulas appear only after the plain-words version, in skippable fold-outs.
- One-sentence version of the whole issue: *Some randomness has a memory of exactly one step: where you go next depends only on where you are now. Even then, things settle into a predictable long-run share. They just take longer, so you need more samples.*

## Link to the CLT issue
The CLT issue ended with a lazy frog on pads 1, 2 and 3. It stays put 8 times out of 10 and otherwise jumps to one of the other two pads (0.1 each). Averaging 50 of its hops gave a hill 2.3× wider than averaging 50 independent pads. This issue explains that number:
- the frog's hops are correlated by 0.7 per step (0.8 − 0.1), so the correlation k steps apart is 0.7ᵏ;
- for 50 hops the variance of the average is 5.36× the independent case, so the width is √5.36 ≈ 2.31× (checked exactly, 2026-10-24);
- **50 sticky hops are worth about 9 independent samples** (50 / 5.36 ≈ 9.3).

The frog keeps the same numbers everywhere in this issue so a reader can carry them over.

## Deliverables
- `index.html`: the article and all demos. Vanilla JS + `<canvas>`, no dependencies, no build step.
- `demos.js`: the demo code, as in the earlier issues.
- `theme.css`: an unchanged copy (from the CLT issue).
- `docs/THEME.md`: unchanged copy.
- `README.md`: what the issue is, plus publishing steps.

## Page structure
0. **Hook: the phone keyboard.** You type "good" and the keyboard offers "morning", "night", "luck". It doesn't read your mind; it only looks at the word you just typed and remembers what usually comes next. Then the callback: *"Last time, a lazy frog's hill came out wider than it should have. Today, we follow the frog."* → Demo A.
1. **Toy: Snakes and Ladders, then your own pond.** In Snakes and Ladders, where you go next depends only on your square and the die, not on how you got there. That's the whole idea. Then the pond: set how sticky each pad is. Start the frog anywhere, and the share of time spent on each pad settles to the same answer. → Demo B.
2. **Statement.** Plain words first: *the future only cares about now.* Write the frog's rules as a small table: "from this pad, the chance of each next pad". Run it long enough and the share of time on each pad stops changing: that's the long-run share. The Law of Large Numbers still works for a chain like this, as long as the frog can reach every pad and doesn't get stuck in a loop. Skippable formula: the long-run share π satisfies πP = π.
3. **History.** Tiles:
   - **Nekrasov vs Markov (1902–1906).** Pavel Nekrasov claimed the Law of Large Numbers needs independence. Andrey Markov built chains of dependent events to prove him wrong: averages still settle.
   - **Eugene Onegin (1913).** Markov counted vowels and consonants in 20,000 letters of Pushkin's poem by hand, and showed that a letter's type depends on the letter before it.
   - **Shannon (1948).** Claude Shannon used letter and word chains to generate fake English, the ancestor of today's text generators.
   - **PageRank (1998).** Brin and Page ranked the web with a random surfer clicking links.
   Check every date and detail against a source while building. Images only if public domain, credited in `assets/credits.json`.
4. **Speed: how fast it forgets.** Release 1,000 frogs, all on pad 1. Watch them spread until each pad holds about a third. Stickier pads forget more slowly. Then close the loop with the CLT number: because the lazy frog forgets slowly, 50 of its hops are worth about 9 independent samples, so its hill is about 2.3× wider. → Demo C.
5. **Small print.** Three ways a chain fails to settle:
   - **Traps.** Square 100 in Snakes and Ladders: once you're there, you never leave.
   - **Endless loops.** A frog that always swaps between two pads never settles; where it is depends on whether the hop count is odd or even.
   - **Cut-off ponds.** If two groups of pads have no path between them, where you start decides everything forever.
   And "memoryless" is an assumption: real sentences remember far more than one word. Uses Demo B (presets for each failure).
6. **Build it.** About 15 lines of JS shown in a code block. It is the same code the page runs: count which word follows which in a paragraph, then babble new text by repeatedly picking a next word in proportion to those counts. → Demo D.
7. **Where it runs today.**
   - **PageRank**: a random surfer clicks links; the long-run share of time on each page is its rank. → Demo E.
   - **Keyboard suggestions**: next-word counts, as in the hook.
   - **GPS snapping**: the road you're really on is hidden and the GPS dots are noisy clues; a chain of roads lets the map snap your car to the right one. One plain paragraph, no demo.
   - **Image generators (diffusion)**: adding a little noise step after step is a chain; the model learns to run it backwards from static to a picture. One sentence; sets up Act VI.
   - **Chatbots**: a chatbot also picks the next word from what came before, but its "now" is the whole conversation so far, not one word. Light touch only.
   - **MCMC**: one sentence. Chains are also used to draw samples from shapes too complicated to sample directly; a later issue.
8. **End hook (unnamed).** A frog on an endless row of pads hops left or right at random. Release 1,000 frogs; after many hops their landing spots pile into the same bell we keep meeting. Closing line, roughly: *"Coins, dice, polls, and now frogs. Why does this one shape keep showing up?"* This hints at the Gaussian, the next issue, without naming it.
9. **Footer.**

## Demos
Shared helpers: pixel-style bar charts on dark screen panels, as in the earlier issues. Each demo has its own controls plus Run/Reset where it makes sense.

| Demo | What you see | Controls |
|---|---|---|
| A. The frog | 3 lily pads and the lazy frog hopping; a tally of time on each pad that settles to ⅓ each | play/pause, speed |
| B. Pond builder | 3 pads with a stickiness slider each (the rest of the chance splits evenly between the other two pads); bars for the share of time on each pad, settling to the long-run share. The rules table is shown under the pond. | 3 sliders, starting pad, presets: lazy frog / trap / endless loop / cut-off pond. The sliders can't make a loop or a cut-off pond, so each preset loads its own rules table (loop: 1→2→3→1 always; cut-off: pads 1 and 2 swap, pad 3 only leads back to itself). Moving a slider returns to the slider rules. |
| C. 1,000 frogs | all frogs start on pad 1; bars show how many sit on each pad after each hop, drifting to a third each | stickiness, step / run |
| D. Babble machine | a sample paragraph (or your own pasted text) and generated text from 1-word vs 2-word memory | text box, memory 1 / 2, generate |
| E. Tiny web | 5 pages with links; a random surfer's visit counts become each page's rank | run, add/remove a link (optional; drop if time is short) |
| End hook | random walk on a line; histogram of where 1,000 frogs end up after n hops | Run |

The sample paragraph for D must be public domain or my own writing.

## Out of scope
Frameworks, build tooling, analytics, comments, formal proofs, continuous-time chains, hidden Markov models, a full MCMC demo (a later issue), and the matrix view of chains beyond one fold-out (matrices are Act II).

## Testing
Open `index.html` in a browser and check:
- every demo runs
- A's tally settles near ⅓ each
- B: the lazy-frog preset settles to ⅓ each from any starting pad; the trap preset ends on the trap pad; the endless-loop preset keeps swapping; the cut-off preset depends on the starting pad
- C's bars drift toward a third each, and more slowly when stickiness is high
- D produces readable babble, and 2-word memory reads more like the source than 1-word
- E's ranks are stable across runs (within a few percent)
- the end-hook histogram is bell-shaped
- no console errors, and the page reads well at phone width

## Publishing
Use `publish.sh` into `sample-space/markov-chains/`. The issue card replaces the "Issue 3 · A frog that remembers" coming-soon card, a new coming-soon card is added for the Gaussian issue, and a row goes into the README. Ask before pushing.
