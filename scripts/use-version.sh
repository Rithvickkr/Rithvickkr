#!/usr/bin/env bash
# Switch the live GitHub profile README to a chosen version.
# Usage:  ./scripts/use-version.sh v1        (v1 | v2 | v3, or a name)
set -e

case "${1:-}" in
  v1|signature) SRC="README.v1-signature.md" ;;
  v2|editorial) SRC="README.v2-editorial.md" ;;
  v3|terminal)  SRC="README.v3-terminal.md" ;;
  v4|noir)      SRC="README.v4-noir.md" ;;
  v5|azure)     SRC="README.v5-azure.md" ;;
  *) echo "Unknown version '${1:-}'. Choose: v1 (signature) | v2 (editorial) | v3 (terminal) | v4 (noir) | v5 (azure)"; exit 1 ;;
esac

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
[ -f "$ROOT/$SRC" ] || { echo "Missing file: $SRC"; exit 1; }

cp "$ROOT/$SRC" "$ROOT/README.md"
echo "OK  README.md is now '$SRC'."
echo "    Then:  git add -A && git commit -m 'switch profile README' && git push"
