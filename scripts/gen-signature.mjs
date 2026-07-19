// v1 Signature — custom vibrant hero (self-hosted). Replaces the capsule-render wave.
import { writeFile } from "node:fs/promises";

const W = 850, H = 240, LM = 42;
const SANS = "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif";
const F = (w, s) => `font-family:${SANS};font-weight:${w};font-size:${s}px`;
const C = { bg: "#0D1117", ink: "#F0F1F3", txt: "#C9D1D9", mut: "#8B949E", dim: "#3A3F46", line: "#23262D", acc: "#6C90C0" };
const est = (s, size, ls = 0) => s.length * size * 0.55 + (s.length - 1) * ls;
const cx = W / 2;
const bracket = (x, y, dx, dy) => `<path d="M ${x + dx} ${y} L ${x} ${y} L ${x} ${y + dy}" stroke="${C.line}" stroke-width="1" fill="none"/>`;
const hero = () => `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar — AI/ML · Full-Stack · Backend Engineer">
<defs>
  <pattern id="dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1.4" cy="1.4" r="1.4" fill="#1B2028"/></pattern>
  <radialGradient id="fade" cx="50%" cy="46%" r="62%"><stop offset="0" stop-color="#000"/><stop offset="0.72" stop-color="#000"/><stop offset="1" stop-color="#fff"/></radialGradient>
  <mask id="vgn"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
  <style>
    .f{animation:fi 1s ease both}.d1{animation-delay:.1s}.d2{animation-delay:.3s}.d3{animation-delay:.55s}
    @keyframes fi{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .kick{${F(600, 12)};fill:#6B7079;letter-spacing:3.6px}
    .name{${F(600, 56)};fill:#F0F1F3;letter-spacing:-1.2px}
    .tag{${F(400, 15.5)};fill:#AEB4BE}
    .sub{${F(400, 13)};fill:#767C85;letter-spacing:.3px}
    .bk{opacity:0;animation:fi 1.2s .2s ease forwards}
  </style>
</defs>
  <rect width="${W}" height="${H}" fill="#0D1117"/>
  <rect width="${W}" height="${H}" fill="url(#dots)" mask="url(#vgn)"/>
  <g class="bk">${bracket(24, 24, 16, 16)}${bracket(W - 24, 24, -16, 16)}${bracket(24, H - 24, 16, -16)}${bracket(W - 24, H - 24, -16, -16)}</g>
  <text class="kick f d1" x="${cx}" y="66" text-anchor="middle">AI / ML  ·  FULL-STACK  ·  BACKEND ENGINEER</text>
  <text class="name f d2" x="${cx}" y="126" text-anchor="middle">Rithvick Kumar</text>
  <g class="f d2">
    <line x1="${cx - 54}" y1="150" x2="${cx - 13}" y2="150" stroke="#2A2D33" stroke-width="1"/>
    <path d="M ${cx} 146 L ${cx + 4} 150 L ${cx} 154 L ${cx - 4} 150 Z" fill="${C.acc}"/>
    <line x1="${cx + 13}" y1="150" x2="${cx + 54}" y2="150" stroke="#2A2D33" stroke-width="1"/>
  </g>
  <text class="tag f d3" x="${cx}" y="188" text-anchor="middle">I ship production AI systems — LLM &amp; RAG pipelines, agents, and the APIs around them.</text>
  <text class="sub f d3" x="${cx}" y="212" text-anchor="middle">B.Tech, NIT Kurukshetra &#8217;26  ·  Gemini CLI contributor</text>
</svg>`;

// ---------- CENTERED SECTION DIVIDER ----------
const secLabel = (title) => {
  const h = 44, t = title.toUpperCase(), tw = est(t, 12.5, 3), half = tw / 2, gap = 20;
  const lx2 = cx - half - gap, rx1 = cx + half + gap;
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<defs><style>.k{${F(600, 12.5)};fill:${C.ink};letter-spacing:3px}.f{animation:fi .8s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}</style></defs>
  <line class="f" x1="${LM}" y1="23" x2="${lx2}" y2="23" stroke="${C.line}"/>
  <path class="f" d="M ${lx2 - 9} 20 L ${lx2 - 6} 23 L ${lx2 - 9} 26 L ${lx2 - 12} 23 Z" fill="${C.acc}"/>
  <text class="k f" x="${cx}" y="28" text-anchor="middle">${t}</text>
  <path class="f" d="M ${rx1 + 9} 20 L ${rx1 + 12} 23 L ${rx1 + 9} 26 L ${rx1 + 6} 23 Z" fill="${C.acc}"/>
  <line class="f" x1="${rx1}" y1="23" x2="${W - LM}" y2="23" stroke="${C.line}"/>
</svg>`;
};

// ---------- MONO TECH GRID ----------
const tech = () => {
  const rows = [
    ["AI / ML", "PyTorch · TensorFlow · LangChain · RAG · MCP · Hugging Face · Vertex AI · Ollama"],
    ["Languages", "Python · TypeScript · JavaScript · Java · C"],
    ["Backend", "FastAPI · Node.js · Express · WebRTC · WebSockets · OAuth 2.0 · Nginx"],
    ["Frontend", "React · Next.js · Tailwind CSS · Three.js"],
    ["Data", "PostgreSQL · SQLite · sqlite-vec · MongoDB · Supabase · Prisma · FAISS"],
    ["Tooling", "Git · Docker · GitHub Actions · Vercel · Weights & Biases · MLflow"],
  ];
  const rh = 34, top = 12, h = top + rows.length * rh + 4;
  const items = rows.map(([c, v], i) => {
    const y = top + i * rh + 20, delay = 0.1 + i * 0.07;
    const val = v.replace(/&/g, "&amp;").replace(/ · /g, '  <tspan class="dot">·</tspan>  ');
    return `<g class="row" style="animation-delay:${delay}s"><text class="cat" x="${LM}" y="${y}">${c.toUpperCase()}</text><text class="val" x="${LM + 150}" y="${y}">${val}</text></g>`;
  }).join("\n  ");
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
<defs><style>
  .row{animation:ri .6s ease both}@keyframes ri{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
  .cat{${F(600, 11.5)};fill:${C.mut};letter-spacing:1.8px}.val{${F(400, 14.5)};fill:${C.txt}}.dot{fill:${C.dim}}
</style></defs>
  ${items}
</svg>`;
};

// ---------- MONO FOOTER ----------
const footer = () => `<svg width="${W}" height="84" viewBox="0 0 ${W} 84" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Thanks for scrolling — NEVER GIVE UP">
<defs><style>
  .f{animation:fi .8s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}
  .q{${F(400, 14)};fill:${C.mut};letter-spacing:.3px}.h{${F(700, 13)};fill:${C.ink};letter-spacing:2.6px}
</style></defs>
  <line class="f" x1="${LM}" y1="30" x2="${W - LM}" y2="30" stroke="${C.line}"/>
  <text class="q f" x="${cx}" y="62" text-anchor="middle">Thanks for scrolling — let's build something.   <tspan class="h">NEVER GIVE UP</tspan></text>
</svg>`;

const files = {
  "sig-hero.svg": hero(),
  "sig-tech.svg": tech(),
  "sig-footer.svg": footer(),
  "sig-sec-about.svg": secLabel("About Me"),
  "sig-sec-tech.svg": secLabel("Tech Stack"),
  "sig-sec-stats.svg": secLabel("GitHub Stats"),
  "sig-sec-projects.svg": secLabel("Featured Projects"),
  "sig-sec-contrib.svg": secLabel("Contribution Graph"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).length, "signature assets");
