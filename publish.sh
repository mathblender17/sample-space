#!/usr/bin/env bash
# Copy an issue's committed files into this repo under <slug>/.
# usage: ./publish.sh "../Law of large numbers" law-of-large-numbers
# Only git-tracked files are copied, so .gitignore'd folders (.taste-skill, .claude) stay out.
set -euo pipefail
src="$1"; slug="$2"
[ -d "$src/.git" ] || { echo "not a git repo: $src" >&2; exit 1; }
rm -rf "$slug"
(cd "$src" && git ls-files -z) | while IFS= read -r -d '' f; do
  mkdir -p "$slug/$(dirname "$f")"
  cp "$src/$f" "$slug/$f"
done
echo "copied $(cd "$src" && git ls-files | wc -l) files into $slug/ (from commit $(cd "$src" && git rev-parse --short HEAD))"
