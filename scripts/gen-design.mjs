// v2 editorial design assets (self-hosted, animated). Outputs to CWD.
import { writeFile } from "node:fs/promises";

const W = 850;
const LM = 42; // shared left margin for editorial alignment
const FF = "'Segoe UI', 'Helvetica Neue', Arial, Sans-Serif";
const C = { cyan: "#22D3EE", indigo: "#6366F1", violet: "#A78BFA", text: "#E6EDF3", muted: "#8B949E", faint: "#30363D", bg: "#0D1117" };

// explicit longhand — resvg + browsers + GitHub all honor these
const F = (w, s) => `font-family:${FF};font-weight:${w};font-size:${s}px`;

const accentDefs = `
  <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="0.5" stop-color="${C.indigo}"/><stop offset="1" stop-color="${C.violet}"/>
  </linearGradient>`;

const flowDefs = `
  <linearGradient id="flow" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="0.25" stop-color="${C.indigo}"/><stop offset="0.5" stop-color="${C.violet}"/><stop offset="0.75" stop-color="${C.indigo}"/><stop offset="1" stop-color="${C.cyan}"/>
    <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="${W} 0" dur="7s" repeatCount="indefinite"/>
  </linearGradient>`;

const est = (s, size, ls = 0) => Math.ceil(s.length * size * 0.6 + (s.length - 1) * ls);

// ---------- HERO ----------
function hero() {
  const H = 240;
  const kicker = "AI / ML  ·  FULL-STACK  ·  BACKEND ENGINEER";
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar">
<defs>${accentDefs}${flowDefs}
  <style>
    .fade{animation:fi 1s ease both}
    .d1{animation-delay:.15s}.d2{animation-delay:.4s}.d3{animation-delay:.65s}.d4{animation-delay:.9s}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    .k{${F(600, 13)};fill:${C.muted};letter-spacing:4px}
    .n{${F(800, 62)};letter-spacing:1px}
    .t{${F(400, 16.5)};fill:${C.text}}
    .s{${F(400, 13.5)};fill:${C.muted};letter-spacing:.3px}
    .mono{${F(800, 200)};fill:none;stroke:url(#flow);stroke-width:1.4}
  </style>
</defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <text class="mono" x="712" y="196" text-anchor="middle" opacity="0.13">RK</text>
  <rect class="fade d1" x="${LM}" y="52" width="3" height="140" fill="url(#acc)"><animate attributeName="height" from="0" to="140" dur="1s" begin=".2s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;140"/></rect>
  <text class="k fade d1" x="${LM + 22}" y="70">${kicker}</text>
  <text class="n fade d2" x="${LM + 20}" y="136" fill="url(#flow)">RITHVICK KUMAR</text>
  <g class="fade d2">
    <rect x="${LM + 22}" y="158" width="356" height="2" rx="1" fill="url(#acc)"><animate attributeName="width" from="0" to="356" dur="1.1s" begin=".5s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;356"/></rect>
    <circle cx="${LM + 388}" cy="159" r="3.5" fill="${C.violet}"><animate attributeName="cx" from="${LM + 40}" to="${LM + 388}" dur="1.1s" begin=".5s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="${LM + 40};${LM + 388}"/></circle>
  </g>
  <text class="t fade d3" x="${LM + 22}" y="192">I ship production AI systems — LLM &amp; RAG pipelines, agents, and the APIs around them.</text>
  <text class="s fade d4" x="${LM + 22}" y="218">B.Tech, NIT Kurukshetra &#8217;26  ·  Gemini CLI contributor  ·  github.com/Rithvickkr</text>
</svg>`;
}

// ---------- SECTION HEADER ----------
function section(num, title) {
  const H = 72;
  const t = title.toUpperCase();
  const numW = est(num, 30, 0);
  const divX = LM + numW + 18;
  const tx = divX + 18;
  const titleW = est(t, 25, 2.5);
  const ruleX = tx + titleW + 26;
  const ruleW = W - LM - ruleX;
  const baseY = 54;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<defs>${accentDefs}
  <style>
    .f{animation:fi .8s ease both}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    .num{${F(800, 30)};fill:url(#acc)}
    .ttl{${F(800, 25)};fill:#F0F6FC;letter-spacing:2.5px}
  </style>
</defs>
  <text class="num f" x="${LM}" y="44">${num}</text>
  <line class="f" x1="${divX}" y1="20" x2="${divX}" y2="48" stroke="${C.faint}" stroke-width="1.5"/>
  <text class="ttl f" x="${tx}" y="43">${t}</text>
  <rect x="${ruleX}" y="33" width="${ruleW}" height="2" rx="1" fill="url(#acc)" opacity="0.6"><animate attributeName="width" from="0" to="${ruleW}" dur="1s" begin=".3s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;${ruleW}"/></rect>
  <line x1="${LM}" y1="${baseY + 10}" x2="${W - LM}" y2="${baseY + 10}" stroke="${C.faint}" stroke-width="1" opacity="0.7"/>
</svg>`;
}

// ---------- TECH GRID ----------
function tech() {
  const rows = [
    ["AI / ML", "PyTorch · TensorFlow · LangChain · RAG · MCP · Hugging Face · Vertex AI · Ollama"],
    ["Languages", "Python · TypeScript · JavaScript · Java · C"],
    ["Backend", "FastAPI · Node.js · Express · WebRTC · WebSockets · OAuth 2.0 · Nginx"],
    ["Frontend", "React · Next.js · Tailwind CSS · Three.js"],
    ["Data", "PostgreSQL · SQLite · sqlite-vec · MongoDB · Supabase · Prisma · FAISS · ChromaDB"],
    ["Tooling", "Git · Docker · GitHub Actions · Vercel · Weights & Biases · MLflow"],
  ];
  const top = 22, rh = 36, H = top + rows.length * rh + 8;
  const items = rows
    .map(([label, val], i) => {
      const y = top + i * rh + 20;
      const delay = 0.15 + i * 0.09;
      return `
  <g class="row" style="animation-delay:${delay}s">
    <rect x="${LM}" y="${y - 12}" width="8" height="8" rx="2" fill="url(#acc)"/>
    <text class="lab" x="${LM + 22}" y="${y}">${label.toUpperCase()}</text>
    <text class="val" x="${LM + 154}" y="${y}">${val.replace(/&/g, "&amp;")}</text>
  </g>`;
    })
    .join("");
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
<defs>${accentDefs}
  <style>
    .row{animation:ri .7s ease both}
    @keyframes ri{from{opacity:0;transform:translateX(-6px)}to{opacity:1;transform:translateX(0)}}
    .lab{${F(700, 12.5)};fill:${C.cyan};letter-spacing:2px}
    .val{${F(400, 14.5)};fill:${C.text};letter-spacing:.2px}
  </style>
</defs>
  ${items}
</svg>`;
}

// ---------- FOOTER ----------
function footer() {
  const H = 92;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="footer">
<defs>${accentDefs}
  <style>.q{${F(500, 15)};fill:${C.muted};letter-spacing:1px}.h{${F(800, 15)};fill:url(#acc);letter-spacing:2px}</style>
</defs>
  <rect x="0" y="28" width="${W}" height="2" rx="1" fill="url(#acc)" opacity="0.5"/>
  <text class="q" x="${W / 2}" y="64" text-anchor="middle">Thanks for scrolling — let's build something.  <tspan class="h">NEVER GIVE UP</tspan></text>
</svg>`;
}

// ---------- write ----------
const files = {
  "hero.svg": hero(),
  "tech.svg": tech(),
  "footer.svg": footer(),
  "sec-about.svg": section("01", "About"),
  "sec-highlights.svg": section("02", "Highlights"),
  "sec-stack.svg": section("03", "Tech Stack"),
  "sec-stats.svg": section("04", "GitHub Stats"),
  "sec-projects.svg": section("05", "Featured Projects"),
  "sec-contrib.svg": section("06", "Contribution Graph"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).join(", "));
