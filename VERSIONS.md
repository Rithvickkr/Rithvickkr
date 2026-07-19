# Profile README — Versions

Three self-hosted designs to A/B on the live profile. Pick one, switch, push.

| Version | Vibe | Preview on GitHub |
|---|---|---|
| **v1 — Signature** | Vibrant: waving gradient header, colorful logo grid, emoji sections | [`README.v1-signature.md`](./README.v1-signature.md) |
| **v2 — Editorial** | Minimal: custom animated hero, numbered section headers, typographic tech grid | [`README.v2-editorial.md`](./README.v2-editorial.md) |
| **v3 — Terminal** | Dev: terminal-window hero, `➜` prompt section headers, `git log` highlights | [`README.v3-terminal.md`](./README.v3-terminal.md) |

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
- Stat cards (auto-refreshed by Actions): [`scripts/generate-stats.mjs`](./scripts/generate-stats.mjs)
- Social badges: generated once from `simple-icons`; live in [`assets/`](./assets/)

Run a generator with `node scripts/<file>.mjs` (writes SVGs into `assets/`).
