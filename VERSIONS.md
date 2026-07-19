# Profile README — Versions

Three self-hosted designs to A/B on the live profile. Pick one, switch, push.

| Version | Vibe | Preview on GitHub |
|---|---|---|
| **v1 — Signature** ⭐ | Minimal mono: centered hero, quiet section dividers, monochrome tech grid + stat cards | [`README.v1-signature.md`](./README.v1-signature.md) |
| **v2 — Editorial** | Minimal: custom animated hero, numbered section headers, typographic tech grid | [`README.v2-editorial.md`](./README.v2-editorial.md) |
| **v3 — Terminal** | Dev: terminal-window hero, `➜` prompt section headers, `git log` highlights | [`README.v3-terminal.md`](./README.v3-terminal.md) |
| **v4 — Noir** | Monochrome: serif display, silver sheen, film grain, hairline sections (Roman numerals) | [`README.v4-noir.md`](./README.v4-noir.md) |
| **v5 — Azure** ⭐ | Premium minimal: graphite mono + one restrained steel-blue accent, clean editorial column | [`README.v5-azure.md`](./README.v5-azure.md) |

## How to preview each one live
After pushing once, open any file above on **github.com** — it renders fully (images load from `./assets/`).
Locally: open the file in VS Code → `Ctrl+Shift+V`.

## How to make one the live profile
The profile always shows `README.md`. Promote a version into it:

```powershell
# Windows (PowerShell)
.\scripts\use-version.ps1 v2
```
```bash
# macOS / Linux / Git Bash
./scripts/use-version.sh v2
```

Then commit & push:
```bash
git add -A && git commit -m "switch profile README to v2" && git push
```

## Editing the designs
- Editorial SVGs (hero, section headers, tech grid, footer): [`scripts/gen-design.mjs`](./scripts/gen-design.mjs)
- Terminal SVGs (hero, prompt headers): [`scripts/gen-terminal.mjs`](./scripts/gen-terminal.mjs)
- Noir SVGs (serif hero, hairline headers, mono tech/footer): [`scripts/gen-noir.mjs`](./scripts/gen-noir.mjs)
- Azure SVGs (hero, section labels, stack, numbers, pills, footer): [`scripts/gen-azure.mjs`](./scripts/gen-azure.mjs)
- Stat cards — color **and** noir variants, auto-refreshed by Actions: [`scripts/generate-stats.mjs`](./scripts/generate-stats.mjs)
- Social badges (color + noir): generated from `simple-icons`; live in [`assets/`](./assets/)
- Contribution snake: 3 palettes (default, dark, noir) via [`.github/workflows/snake.yml`](./.github/workflows/snake.yml)

Run a generator with `node scripts/<file>.mjs` (writes SVGs into `assets/`).
