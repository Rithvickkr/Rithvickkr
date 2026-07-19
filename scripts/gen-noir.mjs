// v4 NOIR design assets — monochrome, serif display, silver sheen, film grain.
import { writeFile } from "node:fs/promises";

const W = 850;
const LM = 42;
const SERIF = "Georgia, 'Times New Roman', Times, serif";
const SANS = "'Helvetica Neue', Arial, 'Segoe UI', sans-serif";
const C = {
  bg: "#0A0A0B", panel: "#0F1011", hair: "#26282B", hair2: "#33363A",
  muted: "#7C8288", text: "#C7CCD1", bright: "#F4F6F8", dim: "#4A4E53",
};
const F = (fam, w, s) => `font-family:${fam};font-weight:${w};font-size:${s}px`;
const est = (s, size, ls = 0) => Math.ceil(s.length * size * 0.56 + (s.length - 1) * ls);

const grain = `
  <filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch"/><feColorMatrix type="saturate" values="0"/></filter>`;
const sheen = `
  <linearGradient id="sheen" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${W}" y2="0">
    <stop offset="0" stop-color="#8A8F94"/><stop offset="0.25" stop-color="#D8DADE"/><stop offset="0.5" stop-color="#FFFFFF"/><stop offset="0.75" stop-color="#D8DADE"/><stop offset="1" stop-color="#8A8F94"/>
    <animateTransform attributeName="gradientTransform" type="translate" from="0 0" to="${W} 0" dur="8s" repeatCount="indefinite"/>
  </linearGradient>`;

// ---------- HERO ----------
function hero() {
  const H = 240;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar">
<defs>${grain}${sheen}
  <style>
    .fade{animation:fi 1s ease both}.d1{animation-delay:.12s}.d2{animation-delay:.3s}.d3{animation-delay:.55s}.d4{animation-delay:.75s}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    .eye{${F(SANS, 600, 12.5)};fill:${C.muted};letter-spacing:5px}
    .name{${F(SERIF, 700, 66)};letter-spacing:.5px}
    .tag{${F(SERIF, 400, 19)};font-style:italic;fill:${C.text}}
    .sub{${F(SANS, 500, 12.5)};fill:${C.muted};letter-spacing:2.4px}
    .mk{${F(SERIF, 700, 200)};fill:none;stroke:${C.hair2};stroke-width:1}
  </style>
</defs>
  <rect width="${W}" height="${H}" fill="${C.bg}"/>
  <text class="mk" x="712" y="196" text-anchor="middle" opacity="0.5">RK</text>
  <text class="eye fade d1" x="${LM}" y="66">AI / ML  —  FULL-STACK  —  BACKEND</text>
  <text class="name fade d2" x="${LM - 2}" y="130" fill="url(#sheen)">Rithvick Kumar</text>
  <rect class="fade d2" x="${LM}" y="152" width="360" height="1" fill="${C.hair2}"><animate attributeName="width" from="0" to="360" dur="1.1s" begin=".5s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;360"/></rect>
  <text class="tag fade d3" x="${LM}" y="188">I ship production AI systems — LLM &amp; RAG pipelines, agents, and the APIs.</text>
  <text class="sub fade d4" x="${LM}" y="214">B.TECH, NIT KURUKSHETRA &#8217;26   ·   GEMINI CLI CONTRIBUTOR</text>
  <rect width="${W}" height="${H}" fill="#FFFFFF" filter="url(#grain)" opacity="0.035"/>
</svg>`;
}

// ---------- SECTION HEADER ----------
function section(title, roman) {
  const H = 66;
  const t = title.toUpperCase();
  const titleW = est(t, 24, 3.2);
  const lineX = LM + titleW + 26;
  const numX = W - LM;
  const lineW = numX - 34 - lineX;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${title}">
<defs>
  <style>
    .f{animation:fi .8s ease both}@keyframes fi{from{opacity:0}to{opacity:1}}
    .ttl{${F(SERIF, 700, 24)};fill:${C.bright};letter-spacing:3.2px}
    .rn{${F(SERIF, 400, 15)};font-style:italic;fill:${C.muted}}
  </style>
</defs>
  <text class="ttl f" x="${LM}" y="40">${t}</text>
  <rect x="${lineX}" y="34" width="${lineW}" height="1" fill="${C.hair2}"><animate attributeName="width" from="0" to="${lineW}" dur="1s" begin=".3s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;${lineW}"/></rect>
  <text class="rn f" x="${numX}" y="40" text-anchor="end">${roman}</text>
  <line x1="${LM}" y1="58" x2="${W - LM}" y2="58" stroke="${C.hair}" stroke-width="1"/>
</svg>`;
}

// ---------- TECH GRID ----------
function tech() {
  const rows = [
    ["AI / ML", "PyTorch · TensorFlow · LangChain · RAG · MCP · Hugging Face · Vertex AI · Ollama"],
    ["Languages", "Python · TypeScript · JavaScript · Java · C"],
    ["Backend", "FastAPI · Node.js · Express · WebRTC · WebSockets · OAuth 2.0 · Nginx"],
    ["Frontend", "React · Next.js · Tailwind CSS · Three.js"],
    ["Data", "PostgreSQL · SQLite · sqlite-vec · MongoDB · Supabase · Prisma · FAISS"],
    ["Tooling", "Git · Docker · GitHub Actions · Vercel · Weights & Biases · MLflow"],
  ];
  const top = 20, rh = 38, H = top + rows.length * rh + 6;
  const items = rows.map(([label, val], i) => {
    const y = top + i * rh + 22;
    const delay = 0.12 + i * 0.08;
    return `
  <g class="row" style="animation-delay:${delay}s">
    <rect x="${LM}" y="${y - 11}" width="7" height="7" fill="${C.bright}"/>
    <text class="lab" x="${LM + 22}" y="${y}">${label.toUpperCase()}</text>
    <text class="val" x="${LM + 160}" y="${y}">${val.replace(/&/g, "&amp;").replace(/ · /g, '  <tspan class="dot">·</tspan>  ')}</text>
    <line x1="${LM}" y1="${y + 14}" x2="${W - LM}" y2="${y + 14}" stroke="#ffffff" stroke-opacity="0.03"/>
  </g>`;
  }).join("");
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Tech stack">
<defs>
  <style>
    .row{animation:ri .7s ease both}@keyframes ri{from{opacity:0;transform:translateX(-5px)}to{opacity:1;transform:translateX(0)}}
    .lab{${F(SANS, 600, 12)};fill:${C.muted};letter-spacing:2.4px}
    .val{${F(SANS, 400, 14.5)};fill:${C.text}}
    .dot{fill:${C.dim}}
  </style>
</defs>
  ${items}
</svg>`;
}

// ---------- FOOTER ----------
function footer() {
  const H = 92;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="footer">
<defs><style>.q{${F(SERIF, 400, 16)};font-style:italic;fill:${C.muted}}.h{${F(SANS, 700, 13)};fill:${C.bright};letter-spacing:3px}</style></defs>
  <line x1="0" y1="26" x2="${W}" y2="26" stroke="${C.hair}" stroke-width="1"/>
  <text class="q" x="${W / 2}" y="62" text-anchor="middle">Thanks for scrolling — let's build something.   <tspan class="h">NEVER GIVE UP</tspan></text>
</svg>`;
}

const files = {
  "n-hero.svg": hero(),
  "n-tech.svg": tech(),
  "n-footer.svg": footer(),
  "n-sec-about.svg": section("About", "i"),
  "n-sec-highlights.svg": section("Highlights", "ii"),
  "n-sec-stack.svg": section("Tech Stack", "iii"),
  "n-sec-stats.svg": section("GitHub Stats", "iv"),
  "n-sec-projects.svg": section("Projects", "v"),
  "n-sec-contrib.svg": section("Contributions", "vi"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).join(", "));
