# Sample Space roadmap: from the Law of Large Numbers to 3D world generation

Date: 2026-10-22
Status: approved

## Purpose

Sample Space is a public record of what I'm learning. Each issue moves one step closer to the endpoint:
**Gaussian splatting** and **AI-driven 3D world generation**.

Each topic gets foundation-level coverage, not full depth. The aim is to touch every topic the endpoint depends on,
not to cover any of them completely.

## Rules

- **Order, no dates.** Milestones are a sequence with no calendar dates.
- **Acts.** Issues are grouped into acts. Inside an act they run in a line, and each issue ends with the usual unnamed hint at the next one.
- **Checkpoint.** Every act ends with a checkpoint issue: one hands-on toy that uses the act's maths together.
  The checkpoint is also the milestone review: what was covered, what was missing, and whether the next act still makes sense.
- **Gap slot.** After each checkpoint come 1–2 gap issues for important topics that were skipped.
  They are chosen at the checkpoint, from the candidates below plus whatever turned out to be missing. They are not fixed in advance.
- **Format and theme stay locked.** Every issue uses the existing theme and structure (see `docs/THEME.md`).
- **Demos.** Acts I–III use live in-browser toys. From Act IV on, an issue may use precomputed demos or short clips when live compute is too heavy.
- **The roadmap can change.** Issue lists are drafts. Any checkpoint can reorder, add or drop issues. Act VII is revisited before it starts, since the field moves fast.

## Through-line

The Gaussian introduced in Act I runs through the rest. It becomes the "splat" in Act V and the noise in diffusion in Act VI.

## Acts

| Act | Theme | Core issues (draft order) | Checkpoint toy | Gap candidates |
|---|---|---|---|---|
| 0 ✅ | Start | Law of Large Numbers | — | — |
| I | Randomness → the bell curve | Central Limit Theorem · the Gaussian · variance & covariance · multivariate Gaussian · Bayes | Draw a 2D Gaussian ellipse from a covariance matrix | Monte Carlo sampling, entropy |
| II | Space & transforms | Matrices as transformations · eigenvectors (an ellipse's axes) · rotations & quaternions · cameras & projection · spherical harmonics | Project a 3D Gaussian onto the screen as a 2D ellipse | SVD / PCA |
| III | Learning from data | Gradient descent · autodiff / backprop · neural nets in one issue · loss functions | 2D splatting: fit coloured Gaussians to a photo | Overfitting & regularisation |
| IV | Seeing in 3D | Rasterising vs ray tracing · alpha compositing · structure-from-motion (photos → points) · NeRF / volume rendering | A tiny NeRF-style volume render | Aliasing & sampling |
| V | Gaussian splatting | The 3DGS idea · the differentiable rasteriser · densify & prune | Train a splat on your own photos | Compression, 4D / dynamic splats |
| VI | Generative models | Entropy & KL · VAEs · diffusion · attention & transformers (light touch) · conditioning on text and images | A toy diffusion model on 2D points | GANs (history only) |
| VII | 3D world generation (endpoint) | Image → 3D · multi-view diffusion · feed-forward splat generators · world models (video → explorable world) | Generate a scene and view it as splats | Whatever the field has moved on to by then |

Scale: about 30 core issues (checkpoints included) plus about 7 gap issues.

## Progress tracking

Progress is tracked in this table. When an act is finished, mark it ✅ and write down the gap issues that were chosen.

## Out of scope for now

- A "path" page on the site that shows this roadmap. That's a separate task.
- Exact titles and slugs for future issues. Each issue gets its own design spec when it starts.
