// v1 Signature — custom vibrant hero (self-hosted). Replaces the capsule-render wave.
import { writeFile } from "node:fs/promises";

const W = 850, H = 240, LM = 42;
const SANS = "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif";
const F = (w, s) => `font-family:${SANS};font-weight:${w};font-size:${s}px`;
const C = { bg: "#0D1117", ink: "#F0F1F3", txt: "#C9D1D9", mut: "#8B949E", dim: "#3A3F46", line: "#23262D", acc: "#6C90C0" };
const est = (s, size, ls = 0) => s.length * size * 0.55 + (s.length - 1) * ls;
const cx = W / 2;
const rnd = (a, b) => a + Math.random() * (b - a);

// ---- shared cozy-scene helpers ----
const SNOW_CSS = `.sn{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}@keyframes fall{0%{transform:translateY(-12px);opacity:0}14%{opacity:.6}86%{opacity:.6}100%{transform:translateY(58px);opacity:0}}`;
const snow = (n, x0, x1, y0, y1, maxOp = 0.55) => Array.from({ length: n }, () => {
  const x = rnd(x0, x1).toFixed(1), y = rnd(y0, y1).toFixed(1), r = rnd(0.7, 1.7).toFixed(2);
  const dur = rnd(6, 13).toFixed(1), del = (-rnd(0, 13)).toFixed(1), op = rnd(0.22, maxOp).toFixed(2);
  return `<circle class="sn" cx="${x}" cy="${y}" r="${r}" fill="#DCE3EC" opacity="${op}" style="animation-duration:${dur}s;animation-delay:${del}s"/>`;
}).join("");
const corners = (m, right, bottom, len = 13) =>
  `<path d="M ${m + len} ${m} L ${m} ${m} L ${m} ${m + len}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>` +
  `<path d="M ${right - len} ${m} L ${right} ${m} L ${right} ${m + len}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>` +
  `<path d="M ${m + len} ${bottom} L ${m} ${bottom} L ${m} ${bottom - len}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>` +
  `<path d="M ${right - len} ${bottom} L ${right} ${bottom} L ${right} ${bottom - len}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>`;
// a low, subtle mountain silhouette that sits along the bottom edge (peakX = dominant Everest peak)
const ridge = (m, right, base, peakX) =>
  `<path d="M ${m} ${base} L ${m} ${base - 14} L ${(m + peakX) / 2} ${base - 8} L ${peakX - 40} ${base - 12} L ${peakX} ${base - 34} L ${peakX + 44} ${base - 12} L ${(peakX + right) / 2} ${base - 9} L ${right} ${base - 15} L ${right} ${base} Z" fill="#0A0E13"/>` +
  `<path d="M ${peakX - 14} ${base - 20} L ${peakX} ${base - 34} L ${peakX + 14} ${base - 20} L ${peakX + 6} ${base - 22} L ${peakX} ${base - 28} L ${peakX - 6} ${base - 22} Z" fill="#39424E"/>`;
const hero = () => {
  const HH = 300, m = 14, right = W - m, bottom = HH - m;
  // snowfall
  const flakes = Array.from({ length: 46 }, () => {
    const x = rnd(m + 4, right - 4).toFixed(1), y = rnd(m + 4, HH - 70).toFixed(1);
    const r = rnd(0.7, 1.9).toFixed(2), dur = rnd(6, 13).toFixed(1), del = (-rnd(0, 13)).toFixed(1), op = rnd(0.3, 0.75).toFixed(2);
    return `<circle class="sn" cx="${x}" cy="${y}" r="${r}" fill="#DCE3EC" opacity="${op}" style="animation-duration:${dur}s;animation-delay:${del}s"/>`;
  }).join("");
  return `<svg width="${W}" height="${HH}" viewBox="0 0 ${W} ${HH}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar — AI/ML, Full-Stack, Backend Engineer">
<defs>
  <clipPath id="scene"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${HH - 2 * m}" rx="9"/></clipPath>
  <radialGradient id="moon" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#20293380"/><stop offset="1" stop-color="#20293300"/></radialGradient>
  <style>
    .f{animation:fi 1s ease both}.d1{animation-delay:.15s}.d2{animation-delay:.35s}.d3{animation-delay:.6s}
    @keyframes fi{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .sn{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}
    @keyframes fall{0%{transform:translateY(-14px);opacity:0}14%{opacity:.7}86%{opacity:.7}100%{transform:translateY(66px);opacity:0}}
    .kick{${F(600, 12)};fill:#7A828E;letter-spacing:3.6px}
    .name{${F(600, 56)};fill:#F4F6F8;letter-spacing:-1.2px}
    .tag{${F(400, 15.5)};fill:#B7BEC8}
    .sub{${F(400, 13)};fill:#828A96;letter-spacing:.3px}
  </style>
</defs>
  <rect width="${W}" height="${HH}" fill="#0D1117"/>
  <g clip-path="url(#scene)">
    <rect x="${m}" y="${m}" width="${W - 2 * m}" height="${HH - 2 * m}" fill="#0B0F15"/>
    <circle cx="688" cy="74" r="60" fill="url(#moon)"/>
    <circle cx="688" cy="74" r="15" fill="#161C25"/>
    <!-- mountains: back, mid, front(Everest) -->
    <path d="M ${m} ${bottom} L ${m} 248 L 150 224 L 300 250 L 470 214 L 620 244 L 760 220 L ${right} 242 L ${right} ${bottom} Z" fill="#141A22"/>
    <path d="M ${m} ${bottom} L ${m} 262 L 120 244 L 260 266 L 410 240 L 560 262 L 690 244 L ${right} 264 L ${right} ${bottom} Z" fill="#10151C"/>
    <path d="M ${m} ${bottom} L ${m} 270 L 130 256 L 250 272 L 360 258 L 470 268 L 560 250 L 628 258 L 662 196 L 700 250 L 786 244 L ${right} 262 L ${right} ${bottom} Z" fill="#0A0E13"/>
    <path d="M 640 224 L 662 196 L 684 224 L 672 220 L 662 210 L 652 220 Z" fill="#39424E"/>
    ${flakes}
  </g>
  <rect x="${m}.5" y="${m}.5" width="${W - 2 * m - 1}" height="${HH - 2 * m - 1}" rx="9" fill="none" stroke="${C.line}" stroke-width="1"/>
  <path d="M ${m + 16} ${m} L ${m} ${m} L ${m} ${m + 16}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>
  <path d="M ${right - 16} ${m} L ${right} ${m} L ${right} ${m + 16}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>
  <path d="M ${m + 16} ${bottom} L ${m} ${bottom} L ${m} ${bottom - 16}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>
  <path d="M ${right - 16} ${bottom} L ${right} ${bottom} L ${right} ${bottom - 16}" stroke="${C.acc}" stroke-width="1.5" fill="none" opacity="0.7"/>
  <text class="kick f d1" x="${cx}" y="70" text-anchor="middle">AI / ML  ·  FULL-STACK  ·  BACKEND ENGINEER</text>
  <text class="name f d2" x="${cx}" y="128" text-anchor="middle">Rithvick Kumar</text>
  <g class="f d2">
    <line x1="${cx - 54}" y1="152" x2="${cx - 13}" y2="152" stroke="#2E333B" stroke-width="1"/>
    <path d="M ${cx} 148 L ${cx + 4} 152 L ${cx} 156 L ${cx - 4} 152 Z" fill="${C.acc}"/>
    <line x1="${cx + 13}" y1="152" x2="${cx + 54}" y2="152" stroke="#2E333B" stroke-width="1"/>
  </g>
  <text class="tag f d3" x="${cx}" y="188" text-anchor="middle">I ship production AI systems: LLM &amp; RAG pipelines, agents, and the APIs around them.</text>
  <text class="sub f d3" x="${cx}" y="212" text-anchor="middle">B.Tech, NIT Kurukshetra &#8217;26  ·  Gemini CLI contributor</text>
</svg>`;
};

// ---------- FRAMED COZY SECTION BANNER ----------
const secLabel = (title) => {
  const h = 60, m = 6, right = W - m, bottom = h - m;
  const t = title.toUpperCase(), tw = est(t, 13, 3), half = tw / 2, gap = 22;
  const flakes = snow(14, m + 8, right - 8, m + 6, bottom - 8, 0.5);
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<defs>
  <clipPath id="scene"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${h - 2 * m}" rx="7"/></clipPath>
  <style>${SNOW_CSS}.k{${F(600, 13)};fill:${C.ink};letter-spacing:3px}.f{animation:fi .8s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}</style>
</defs>
  <rect width="${W}" height="${h}" fill="#0D1117"/>
  <g clip-path="url(#scene)"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${h - 2 * m}" fill="#0B0F15"/>${flakes}</g>
  <rect x="${m}.5" y="${m}.5" width="${W - 2 * m - 1}" height="${h - 2 * m - 1}" rx="7" fill="none" stroke="${C.line}"/>
  ${corners(m, right, bottom, 11)}
  <path class="f" d="M ${cx - half - gap} ${h / 2 - 4} L ${cx - half - gap + 3} ${h / 2} L ${cx - half - gap} ${h / 2 + 4} L ${cx - half - gap - 3} ${h / 2} Z" fill="${C.acc}"/>
  <text class="k f" x="${cx}" y="${h / 2 + 4.5}" text-anchor="middle">${t}</text>
  <path class="f" d="M ${cx + half + gap} ${h / 2 - 4} L ${cx + half + gap + 3} ${h / 2} L ${cx + half + gap} ${h / 2 + 4} L ${cx + half + gap - 3} ${h / 2} Z" fill="${C.acc}"/>
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
  const rh = 34, top = 20, m = 6, right = W - m;
  const h = top + rows.length * rh + 16;
  const bottom = h - m;
  const items = rows.map(([c, v], i) => {
    const y = top + i * rh + 20, delay = 0.1 + i * 0.07;
    const val = v.replace(/&/g, "&amp;").replace(/ · /g, '  <tspan class="dot">·</tspan>  ');
    return `<g class="row" style="animation-delay:${delay}s"><text class="cat" x="${LM}" y="${y}">${c.toUpperCase()}</text><text class="val" x="${LM + 150}" y="${y}">${val}</text></g>`;
  }).join("\n  ");
  const flakes = snow(20, m + 8, right - 8, m + 6, top + 10, 0.4);
  return `<svg width="${W}" height="${h}" viewBox="0 0 ${W} ${h}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
<defs>
  <clipPath id="scene"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${h - 2 * m}" rx="8"/></clipPath>
  <style>${SNOW_CSS}
  .row{animation:ri .6s ease both}@keyframes ri{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
  .cat{${F(600, 11.5)};fill:${C.mut};letter-spacing:1.8px}.val{${F(400, 14.5)};fill:${C.txt}}.dot{fill:${C.dim}}
  </style>
</defs>
  <rect width="${W}" height="${h}" fill="#0D1117"/>
  <g clip-path="url(#scene)"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${h - 2 * m}" fill="#0B0F15"/>${flakes}</g>
  <rect x="${m}.5" y="${m}.5" width="${W - 2 * m - 1}" height="${h - 2 * m - 1}" rx="8" fill="none" stroke="${C.line}"/>
  ${corners(m, right, bottom, 13)}
  ${items}
</svg>`;
};

// ---------- FOOTER (summit quote) ----------
const footer = () => `<svg width="${W}" height="104" viewBox="0 0 ${W} 104" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Every summit begins with a step that refused to turn back — NEVER GIVE UP">
<defs><style>
  .f{animation:fi .9s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}
  .q{font-family:Georgia,'Times New Roman',Times,serif;font-style:italic;font-weight:400;font-size:16.5px;fill:${C.txt}}
  .h{${F(700, 12)};fill:${C.ink};letter-spacing:3.4px}
</style></defs>
  <line class="f" x1="${LM}" y1="30" x2="${W - LM}" y2="30" stroke="${C.line}"/>
  <text class="q f" x="${cx}" y="64" text-anchor="middle">&#8220;Every summit begins with a step that refused to turn back&#8221;</text>
  <text class="h f" x="${cx}" y="90" text-anchor="middle">NEVER GIVE UP</text>
</svg>`;

const files = {
  "sig-hero.svg": hero(),
  "sig-tech.svg": tech(),
  "sig-footer.svg": footer(),
  "sig-sec-about.svg": secLabel("About Me"),
  "sig-sec-tech.svg": secLabel("Tech Stack"),
  "sig-sec-stats.svg": secLabel("GitHub Stats"),
  "sig-sec-projects.svg": secLabel("Featured Projects"),
  "sig-sec-contrib.svg": secLabel("Contribution Landscape"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).length, "signature assets");
