// v1 Signature — custom vibrant hero (self-hosted). Replaces the capsule-render wave.
import { writeFile } from "node:fs/promises";

const W = 850, H = 240;
const SANS = "'Segoe UI', -apple-system, 'Helvetica Neue', Arial, sans-serif";
const F = (w, s) => `font-family:${SANS};font-weight:${w};font-size:${s}px`;

const cx = W / 2;
const hero = () => `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Rithvick Kumar — AI/ML · Full-Stack · Backend Engineer">
<defs>
  <style>
    .f{animation:fi 1s ease both}.d1{animation-delay:.1s}.d2{animation-delay:.3s}.d3{animation-delay:.55s}
    @keyframes fi{from{opacity:0;transform:translateY(7px)}to{opacity:1;transform:none}}
    .kick{${F(600, 12)};fill:#6B7079;letter-spacing:3.6px}
    .name{${F(600, 56)};fill:#F0F1F3;letter-spacing:-1.2px}
    .tag{${F(400, 15.5)};fill:#AEB4BE}
    .sub{${F(400, 13)};fill:#767C85;letter-spacing:.3px}
  </style>
</defs>
  <rect width="${W}" height="${H}" fill="#0D1117"/>
  <text class="kick f d1" x="${cx}" y="66" text-anchor="middle">AI / ML  ·  FULL-STACK  ·  BACKEND ENGINEER</text>
  <text class="name f d2" x="${cx}" y="126" text-anchor="middle">Rithvick Kumar</text>
  <g class="f d2">
    <line x1="${cx - 52}" y1="150" x2="${cx - 12}" y2="150" stroke="#2A2D33" stroke-width="1"/>
    <circle cx="${cx}" cy="150" r="2.5" fill="#4A4F57"/>
    <line x1="${cx + 12}" y1="150" x2="${cx + 52}" y2="150" stroke="#2A2D33" stroke-width="1"/>
  </g>
  <text class="tag f d3" x="${cx}" y="188" text-anchor="middle">I ship production AI systems — LLM &amp; RAG pipelines, agents, and the APIs around them.</text>
  <text class="sub f d3" x="${cx}" y="212" text-anchor="middle">B.Tech, NIT Kurukshetra &#8217;26  ·  Gemini CLI contributor</text>
</svg>`;

await writeFile(new URL("./sig-hero.svg", import.meta.url), hero(), "utf8");
console.log("wrote sig-hero.svg");
