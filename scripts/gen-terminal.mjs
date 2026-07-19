// v3 terminal-style design assets (self-hosted, animated). Outputs to CWD.
import { writeFile } from "node:fs/promises";

const W = 850;
const MONO = "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace";
const C = {
  bg: "#0D1117", panel: "#161B22", border: "#30363D",
  green: "#3FB950", cyan: "#39D3EE", violet: "#A78BFA", yellow: "#E3B341",
  text: "#E6EDF3", muted: "#8B949E", bg2: "#010409",
};
const F = (w, s) => `font-family:${MONO};font-weight:${w};font-size:${s}px`;

const accentDefs = `
  <linearGradient id="acc" x1="0" y1="0" x2="1" y2="0">
    <stop offset="0" stop-color="${C.cyan}"/><stop offset="0.5" stop-color="#6366F1"/><stop offset="1" stop-color="${C.violet}"/>
  </linearGradient>`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// ---------- TERMINAL HERO ----------
function hero() {
  const H = 268;
  const barH = 40, padX = 26;
  let y = barH + 40;
  const lh = 30;
  const line = (segs, delay) => {
    const t = `<text x="${padX}" y="${y}" class="ln" style="animation-delay:${delay}s">${segs}</text>`;
    y += lh;
    return t;
  };
  const P = `<tspan class="grn">$</tspan> `;
  const body = [
    line(`${P}<tspan class="cmd">whoami</tspan>`, 0.2),
    line(`<tspan class="out">Rithvick Kumar — </tspan><tspan class="acc">AI/ML · Full-Stack · Backend Engineer</tspan>`, 0.45),
    line(`${P}<tspan class="cmd">cat</tspan> <tspan class="arg">summary.txt</tspan>`, 0.7),
    line(`<tspan class="out">I ship production AI systems — LLM &amp; RAG pipelines, agents, and the APIs.</tspan>`, 0.95),
    line(`${P}<tspan class="cmd">./highlights</tspan> <tspan class="flag">--top</tspan>`, 1.2),
    line(`<tspan class="out">Gemini CLI · </tspan><tspan class="ylw">2 P1 bugs fixed</tspan><tspan class="out">   Dobbe.ai · </tspan><tspan class="ylw">shipped to prod</tspan>`, 1.45),
  ].join("\n  ");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar terminal">
<defs>${accentDefs}
  <style>
    .ln{${F(500, 15)};fill:${C.text};animation:fi .5s ease both}
    @keyframes fi{from{opacity:0;transform:translateX(-4px)}to{opacity:1;transform:translateX(0)}}
    .grn{fill:${C.green};font-weight:700}.cmd{fill:${C.cyan};font-weight:700}.arg{fill:${C.violet}}
    .flag{fill:${C.yellow}}.out{fill:${C.muted}}.ylw{fill:${C.yellow};font-weight:600}.acc{fill:${C.cyan};font-weight:600}
    .title{${F(500, 13)};fill:${C.muted}}
    @keyframes blink{50%{opacity:0}}
    .cur{animation:blink 1.1s steps(1) infinite}
  </style>
</defs>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="12" fill="${C.bg}" stroke="${C.border}" stroke-width="1.5"/>
  <path d="M1 13 A12 12 0 0 1 13 1 L${W - 13} 1 A12 12 0 0 1 ${W - 1} 13 L${W - 1} ${barH} L1 ${barH} Z" fill="${C.panel}"/>
  <circle cx="24" cy="20" r="6" fill="#FF5F56"/><circle cx="46" cy="20" r="6" fill="#FFBD2E"/><circle cx="68" cy="20" r="6" fill="#27C93F"/>
  <text x="${W / 2}" y="25" text-anchor="middle" class="title">rithvick@github ── ~/portfolio ── zsh</text>
  <line x1="1" y1="${barH}" x2="${W - 1}" y2="${barH}" stroke="${C.border}" stroke-width="1"/>
  ${body}
  <rect class="cur" x="${padX}" y="${y - 16}" width="10" height="18" fill="${C.cyan}"/>
</svg>`;
}

// ---------- PROMPT SECTION HEADER ----------
function section(num, path, cmd) {
  const H = 46;
  const label = `${path} `;
  const est = (s) => s.length * 9.6; // mono ~0.64em at 15px
  const promptW = est(`  ${path}  ${cmd}  `) + 90;
  const ruleX = promptW;
  const ruleW = W - 30 - ruleX;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${path} ${cmd}">
<defs>${accentDefs}
  <style>
    .l{${F(600, 15)};animation:fi .6s ease both}
    @keyframes fi{from{opacity:0}to{opacity:1}}
    .p{fill:${C.green};font-weight:700}.pa{fill:${C.cyan}}.br{fill:${C.muted}}.cm{fill:${C.text};font-weight:600}.hash{fill:${C.violet};font-weight:700}
  </style>
</defs>
  <text class="l" x="6" y="30"><tspan class="p">➜</tspan>  <tspan class="pa">${path}</tspan> <tspan class="br">git:(</tspan><tspan class="hash">main</tspan><tspan class="br">)</tspan> <tspan class="cm">${cmd}</tspan></text>
  <rect x="${ruleX}" y="21" width="${ruleW}" height="2" rx="1" fill="url(#acc)" opacity="0.5"><animate attributeName="width" from="0" to="${ruleW}" dur="1s" begin=".3s" fill="freeze" calcMode="spline" keySplines="0.3 0 0.2 1" keyTimes="0;1" values="0;${ruleW}"/></rect>
  <text class="l br" x="${W - 24}" y="30" text-anchor="end" font-weight="700" fill="${C.violet}">${num}</text>
</svg>`;
}

const files = {
  "t-hero.svg": hero(),
  "t-sec-about.svg": section("01", "~/about", "cat me.md"),
  "t-sec-highlights.svg": section("02", "~/work", "git log --oneline"),
  "t-sec-stack.svg": section("03", "~/stack", "ls -la"),
  "t-sec-stats.svg": section("04", "~/github", "stats --json"),
  "t-sec-projects.svg": section("05", "~/projects", "ls ./featured"),
  "t-sec-contrib.svg": section("06", "~/graph", "./snake.sh"),
};
for (const [f, svg] of Object.entries(files)) await writeFile(new URL(`./${f}`, import.meta.url), svg, "utf8");
console.log("wrote", Object.keys(files).join(", "));
