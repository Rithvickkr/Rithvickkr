// Graphite / Azure design assets — premium monochrome + restrained steel-blue accent.
import { writeFile } from "node:fs/promises";

const W = 850, LM = 42;
const SANS = "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif";
const C = { bg: "#0A0B0D", ink: "#EEF1F5", txt: "#B0B6C0", mut: "#767D89", dim: "#363B43", line: "#1D2027", acc: "#6C90C0" };
const F = (w, s) => `font-family:${SANS};font-weight:${w};font-size:${s}px`;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const est = (s, size, ls = 0) => s.length * size * 0.55 + (s.length - 1) * ls;

function wrap(text, maxChars) {
  const words = text.split(" "); const lines = []; let cur = "";
  for (const w of words) {
    if (cur && (cur + " " + w).length > maxChars) { lines.push(cur); cur = w; }
    else cur = cur ? cur + " " + w : w;
  }
  if (cur) lines.push(cur);
  return lines;
}

// ---------- HERO ----------
function hero() {
  const H = 232;
  const role = "I ship production AI systems end to end — LLM & RAG pipelines, agents, and the APIs around them.";
  const rl = wrap(role, 72);
  const roleSvg = rl.map((l, i) => `<text class="role f d3" x="${LM}" y="${150 + i * 24}">${esc(l)}</text>`).join("\n  ");
  const ruleY = 150 + rl.length * 24 + 10;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar — AI/ML, Full-Stack, Backend Engineer">
<defs><style>
  .f{animation:fi .9s ease both}.d1{animation-delay:.1s}.d2{animation-delay:.28s}.d3{animation-delay:.46s}.d4{animation-delay:.64s}
  @keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .eye{${F(600, 12)};fill:${C.mut};letter-spacing:3.4px}
  .name{${F(600, 54)};fill:${C.ink};letter-spacing:-1.2px}
  .role{${F(400, 15.5)};fill:${C.txt}}
  .meta{${F(400, 13)};fill:${C.mut};letter-spacing:.2px}
</style></defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <g class="f d1"><rect x="${LM}" y="40" width="7" height="7" rx="1" fill="${C.acc}"/><text class="eye" x="${LM + 17}" y="47">AI / ML  —  FULL-STACK  —  BACKEND</text></g>
  <text class="name f d2" x="${LM - 1}" y="108">Rithvick Kumar</text>
  <rect class="f d2" x="${LM}" y="124" width="58" height="2" rx="1" fill="${C.acc}"><animate attributeName="width" from="0" to="58" dur="1s" begin=".5s" fill="freeze"/></rect>
  ${roleSvg}
  <line class="f d4" x1="${LM}" y1="${ruleY}" x2="${W - LM}" y2="${ruleY}" stroke="${C.line}"/>
  <text class="meta f d4" x="${LM}" y="${ruleY + 24}">B.Tech, NIT Kurukshetra &#8217;26   ·   Gemini CLI contributor   ·   Available for work</text>
</svg>`;
}

// ---------- SECTION LABEL ----------
function label(title) {
  const H = 40, t = title.toUpperCase();
  const tw = est(t, 12, 2.6);
  const lineX = LM + tw + 20;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<defs><style>.k{${F(600, 12)};fill:${C.acc};letter-spacing:2.6px}</style></defs>
  <text class="k" x="${LM}" y="26">${t}</text>
  <line x1="${lineX}" y1="21" x2="${W - LM}" y2="21" stroke="${C.line}"><animate attributeName="x2" from="${lineX}" to="${W - LM}" dur="1s" begin=".2s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="${lineX};${W - LM}"/></line>
</svg>`;
}

// ---------- STACK ----------
function stack() {
  const rows = [
    ["AI / ML", "PyTorch · TensorFlow · LangChain · RAG · MCP · Hugging Face · Vertex AI · Ollama"],
    ["Backend", "Python · FastAPI · Node.js · Express · WebRTC · WebSockets · OAuth 2.0 · Nginx"],
    ["Frontend", "TypeScript · React · Next.js · Tailwind · Three.js"],
    ["Data", "PostgreSQL · SQLite · sqlite-vec · MongoDB · Supabase · Prisma · FAISS"],
  ];
  const rh = 34, top = 14, H = top + rows.length * rh + 6;
  const items = rows.map(([c, v], i) => {
    const y = top + i * rh + 20, delay = 0.1 + i * 0.08;
    const val = esc(v).replace(/ · /g, '  <tspan class="dot">·</tspan>  ');
    return `<g class="row" style="animation-delay:${delay}s"><text class="cat" x="${LM}" y="${y}">${c.toUpperCase()}</text><text class="val" x="${LM + 150}" y="${y}">${val}</text></g>`;
  }).join("\n  ");
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
<defs><style>
  .row{animation:ri .6s ease both}@keyframes ri{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:none}}
  .cat{${F(600, 11.5)};fill:${C.mut};letter-spacing:1.8px}
  .val{${F(400, 14.5)};fill:${C.txt}}.dot{fill:${C.dim}}
</style></defs>
  ${items}
</svg>`;
}

// ---------- STATS ----------
function stats() {
  const data = [["746", "Contributions"], ["36", "Repositories"], ["2", "P1 bugs fixed"], ["3", "Internships"]];
  const H = 96, colW = (W - 2 * LM) / data.length;
  const items = data.map(([n, l], i) => {
    const x = LM + i * colW, delay = 0.1 + i * 0.1;
    return `<g class="s" style="animation-delay:${delay}s"><text class="num" x="${x}" y="52">${n}</text><text class="lbl" x="${x}" y="76">${l.toUpperCase()}</text></g>`;
  }).join("\n  ");
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="By the numbers">
<defs><style>
  .s{animation:fi .7s ease both}@keyframes fi{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
  .num{${F(600, 36)};fill:${C.acc};letter-spacing:-1px}
  .lbl{${F(500, 11)};fill:${C.mut};letter-spacing:1.4px}
</style></defs>
  ${items}
</svg>`;
}

// ---------- FOOTER ----------
function footer() {
  const H = 66;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="footer">
<defs><style>.l{${F(400, 12.5)};fill:${C.mut};letter-spacing:.4px}.r{${F(600, 12)};fill:${C.acc};letter-spacing:2px}</style></defs>
  <line x1="${LM}" y1="20" x2="${W - LM}" y2="20" stroke="${C.line}"/>
  <text class="l" x="${LM}" y="46">© 2026 Rithvick Kumar</text>
  <text class="r" x="${W - LM}" y="46" text-anchor="end">NEVER GIVE UP</text>
</svg>`;
}

// ---------- SOCIAL PILL ----------
function pill(labelText) {
  const H = 34, padL = 15, dot = 6, gap = 10, padR = 17;
  const t = labelText.toUpperCase();
  const tw = est(t, 12, 1.2);
  const w = Math.round(padL + dot + gap + tw + padR);
  return `<svg width="${w}" height="${H}" viewBox="0 0 ${w} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${labelText}">
  <rect x="0.5" y="0.5" width="${w - 1}" height="${H - 1}" rx="7" fill="${C.bg}" stroke="${C.line}"/>
  <circle cx="${padL + dot / 2}" cy="${H / 2}" r="${dot / 2}" fill="${C.acc}"/>
  <text x="${padL + dot + gap}" y="${H / 2}" dominant-baseline="central" font-family="${SANS}" font-weight="600" font-size="12" letter-spacing="1.2" fill="${C.ink}">${t}</text>
</svg>`;
}

const files = {
  "az-hero.svg": hero(),
  "az-stack.svg": stack(),
  "az-stats.svg": stats(),
  "az-footer.svg": footer(),
  "az-sec-about.svg": label("About"),
  "az-sec-work.svg": label("Selected Work"),
  "az-sec-stack.svg": label("Stack"),
  "az-sec-numbers.svg": label("By the Numbers"),
  "az-sec-projects.svg": label("Projects"),
  "az-social-linkedin.svg": pill("LinkedIn"),
  "az-social-github.svg": pill("GitHub"),
  "az-social-x.svg": pill("X"),
  "az-social-email.svg": pill("Email"),
  "az-social-portfolio.svg": pill("Portfolio"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).length, "azure assets");
