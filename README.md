# Sample Space

One idea from maths, statistics or machine learning per issue, with simulations you can play with.
Live at **https://mathblender17.github.io/sample-space/**

| Issue | Folder |
|---|---|
| The law of large numbers | [`law-of-large-numbers/`](law-of-large-numbers/) |
| The central limit theorem | [`central-limit-theorem/`](central-limit-theorem/) |

## How this repo works
- Each issue is written in its own local folder with its own git repo, e.g. `WriteUps/Law of large numbers`.
- `publish.sh` copies that issue's **committed** files into a folder here. Nothing is linked or synced; it's a plain copy.
- `theme.css` at the root is the series theme, used by this homepage. Each issue carries its own copy.

## Publish or update an issue
From this folder (Git Bash):
```bash
./publish.sh "../Law of large numbers" law-of-large-numbers
git add -A && git commit -m "Update law-of-large-numbers" && git push
```
Commit in the issue folder first, because only committed files are copied. For a new issue, run the same command with a new slug, then add a card for it to `index.html` and a row to the table above.

## Hosting
GitHub Pages: **Settings → Pages → Deploy from a branch → `main` / `(root)`**.
