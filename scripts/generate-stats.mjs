// Custom GitHub stats SVG generator — no third-party services.
// Fetches real data via the GitHub GraphQL API and renders two themed SVG cards
// (assets/stats.svg + assets/top-langs.svg). Run by .github/workflows/stats.yml.

import { writeFile, mkdir } from "node:fs/promises";

const LOGIN = process.env.GH_LOGIN || "Rithvickkr";
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

// ---- themes ----------------------------------------------------------------
const SANS = "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif";
const COLOR = {
  card: "#0D1117", stops: ["#06B6D4", "#6366F1", "#8B5CF6"],
  num: "#06B6D4", text: "#C9D1D9", muted: "#8B949E", track: "#21262D",
  serif: SANS, sans: SANS, ramp: null,
};
const NOIR = {
  card: "#0F1011", stops: ["#3A3E42", "#9AA0A6", "#F4F6F8"],
  num: "#F4F6F8", text: "#C7CCD1", muted: "#7C8288", track: "#1A1C1E",
  serif: "Georgia, 'Times New Roman', Times, serif",
  sans: "'Helvetica Neue', Arial, 'Segoe UI', sans-serif",
  ramp: ["#F4F6F8", "#B9BEC3", "#868B90", "#5C6166", "#3A3E42", "#2A2E31"],
};
// mono/graphite (sans) — matches the v1 minimal header
const MONO = {
  card: "#0D1117", stops: ["#3A3F46", "#8B949E", "#C9D1D9"],
  num: "#EAECEF", text: "#C9D1D9", muted: "#8B949E", track: "#21262D",
  serif: SANS, sans: SANS,
  ramp: ["#EAECEF", "#AEB4BE", "#828A96", "#5C636E", "#3A3F46", "#262B31"],
};

// ---- data ------------------------------------------------------------------
const yearStart = new Date(Date.UTC(new Date().getUTCFullYear(), 0, 1)).toISOString();

const query = `
query($login:String!, $from:DateTime!){
  user(login:$login){
    name login
    followers { totalCount }
    pullRequests { totalCount }
    issues { totalCount }
    repositories(first:100, ownerAffiliations:OWNER, isFork:false, orderBy:{field:STARGAZERS, direction:DESC}){
      totalCount
      nodes {
        stargazerCount
        languages(first:8, orderBy:{field:SIZE, direction:DESC}){
          edges { size node { name color } }
        }
      }
    }
    contributionsCollection(from:$from){
      totalCommitContributions
      restrictedContributionsCount
      contributionCalendar { totalContributions }
    }
  }
}`;

async function fetchData() {
  const res = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Authorization: `bearer ${TOKEN}`,
      "Content-Type": "application/json",
      "User-Agent": "custom-stats-generator",
    },
    body: JSON.stringify({ query, variables: { login: LOGIN, from: yearStart } }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors));
  return json.data.user;
}

// ---- helpers ---------------------------------------------------------------
const fmt = (n) =>
  n >= 1000 ? (n / 1000).toFixed(n >= 10000 ? 0 : 1).replace(/\.0$/, "") + "k" : String(n);
const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const FALLBACK_COLORS = ["#06B6D4", "#8B5CF6", "#6366F1", "#22D3EE", "#A78BFA", "#818CF8"];

// ---- stats card ------------------------------------------------------------
function statsCard(u, t = COLOR) {
  const totalStars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);
  const commits =
    u.contributionsCollection.totalCommitContributions +
    u.contributionsCollection.restrictedContributionsCount;
  const cells = [
    { label: "Total Stars", value: totalStars },
    { label: "Repositories", value: u.repositories.totalCount },
    { label: "Followers", value: u.followers.totalCount },
    { label: `Commits (${new Date().getUTCFullYear()})`, value: commits },
    { label: "Pull Requests", value: u.pullRequests.totalCount },
    { label: "Contributions", value: u.contributionsCollection.contributionCalendar.totalContributions },
  ];

  const colX = [95, 245, 395];
  const rowY = [112, 172];
  const items = cells
    .map((c, i) => {
      const x = colX[i % 3];
      const y = rowY[Math.floor(i / 3)];
      const delay = 0.15 + i * 0.1;
      return `
    <g class="fade" style="animation-delay:${delay}s">
      <text x="${x}" y="${y}" class="num" text-anchor="middle">${fmt(c.value)}</text>
      <text x="${x}" y="${y + 20}" class="lbl" text-anchor="middle">${esc(c.label)}</text>
    </g>`;
    })
    .join("");

  return `<svg width="450" height="200" viewBox="0 0 450 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub statistics for ${esc(u.login)}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.stops[0]}"/><stop offset="0.5" stop-color="${t.stops[1]}"/><stop offset="1" stop-color="${t.stops[2]}"/>
    </linearGradient>
    <style>
      .fade { animation: rise 0.7s ease both; }
      @keyframes rise { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      .num { font: 700 26px ${t.serif}; fill: ${t.num}; }
      .lbl { font: 400 12px ${t.sans}; fill: ${t.muted}; letter-spacing:.4px; }
      .title { font: 700 18px ${t.serif}; fill: ${t.text}; }
    </style>
  </defs>
  <rect x="1" y="1" width="448" height="198" rx="12" fill="${t.card}" stroke="url(#accent)" stroke-width="1.5"/>
  <text x="25" y="42" class="title">${esc(u.name || u.login)} · GitHub Stats</text>
  <rect x="25" y="52" width="52" height="3" rx="1.5" fill="url(#accent)"/>
  ${items}
</svg>`;
}

// ---- languages card --------------------------------------------------------
function langCard(u, t = COLOR) {
  const totals = new Map();
  const colors = new Map();
  for (const repo of u.repositories.nodes) {
    for (const e of repo.languages.edges) {
      totals.set(e.node.name, (totals.get(e.node.name) || 0) + e.size);
      if (e.node.color) colors.set(e.node.name, e.node.color);
    }
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  const top = [...totals.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, size], i) => ({
      name,
      pct: (size / sum) * 100,
      color: t.ramp ? t.ramp[i % t.ramp.length] : (colors.get(name) || FALLBACK_COLORS[i % FALLBACK_COLORS.length]),
    }));

  // stacked bar
  const barX = 25, barY = 66, barW = 400, barH = 11;
  let off = 0;
  const segs = top
    .map((l) => {
      const w = (l.pct / 100) * barW;
      const seg = `<rect x="${(barX + off).toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" fill="${l.color}"/>`;
      off += w;
      return seg;
    })
    .join("");

  // legend, 2 columns x 3 rows
  const legend = top
    .map((l, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = 25 + col * 210;
      const y = 108 + row * 28;
      const delay = 0.2 + i * 0.1;
      return `
    <g class="fade" style="animation-delay:${delay}s">
      <circle cx="${x + 6}" cy="${y - 4}" r="6" fill="${l.color}"/>
      <text x="${x + 20}" y="${y}" class="lname">${esc(l.name)}</text>
      <text x="${x + 185}" y="${y}" class="lpct" text-anchor="end">${l.pct.toFixed(1)}%</text>
    </g>`;
    })
    .join("");

  return `<svg width="450" height="200" viewBox="0 0 450 200" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Most used languages for ${esc(u.login)}">
  <defs>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${t.stops[0]}"/><stop offset="0.5" stop-color="${t.stops[1]}"/><stop offset="1" stop-color="${t.stops[2]}"/>
    </linearGradient>
    <clipPath id="reveal"><rect x="${barX}" y="${barY}" width="${barW}" height="${barH}"><animate attributeName="width" dur="1s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" values="0;${barW}"/></rect></clipPath>
    <clipPath id="round"><rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5"/></clipPath>
    <style>
      .fade { animation: rise 0.7s ease both; }
      @keyframes rise { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      .title { font: 700 18px ${t.serif}; fill: ${t.text}; }
      .lname { font: 600 13px ${t.sans}; fill: ${t.text}; }
      .lpct  { font: 400 13px ${t.sans}; fill: ${t.muted}; }
    </style>
  </defs>
  <rect x="1" y="1" width="448" height="198" rx="12" fill="${t.card}" stroke="url(#accent)" stroke-width="1.5"/>
  <text x="25" y="42" class="title">Most Used Languages</text>
  <rect x="25" y="52" width="52" height="3" rx="1.5" fill="url(#accent)"/>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5" fill="${t.track}"/>
  <g clip-path="url(#round)"><g clip-path="url(#reveal)">${segs}</g></g>
  ${legend}
</svg>`;
}

// ---- full-width combined panel (stats + languages in one element) ---------
function statsPanel(u, t = MONO) {
  const totalStars = u.repositories.nodes.reduce((s, r) => s + r.stargazerCount, 0);
  const commits = u.contributionsCollection.totalCommitContributions + u.contributionsCollection.restrictedContributionsCount;
  const cells = [
    ["Total Stars", totalStars], ["Repositories", u.repositories.totalCount], ["Followers", u.followers.totalCount],
    [`Commits (${new Date().getUTCFullYear()})`, commits], ["Pull Requests", u.pullRequests.totalCount],
    ["Contributions", u.contributionsCollection.contributionCalendar.totalContributions],
  ];
  const totals = new Map(), colors = new Map();
  for (const repo of u.repositories.nodes) for (const e of repo.languages.edges) {
    totals.set(e.node.name, (totals.get(e.node.name) || 0) + e.size);
    if (e.node.color) colors.set(e.node.name, e.node.color);
  }
  const sum = [...totals.values()].reduce((a, b) => a + b, 0) || 1;
  const top = [...totals.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([name, size], i) => ({
    name, pct: (size / sum) * 100, color: t.ramp ? t.ramp[i % t.ramp.length] : (colors.get(name) || FALLBACK_COLORS[i % FALLBACK_COLORS.length]),
  }));

  const W = 850, H = 264, px = 36, inner = W - 2 * px, colW = inner / 6;
  const m = 6, right = W - m, bottom = H - m, ACC = "#6C90C0", rnd = (a, b) => a + Math.random() * (b - a);
  const flakes = Array.from({ length: 18 }, () => {
    const x = rnd(m + 8, right - 8).toFixed(1), y = rnd(m + 6, 128).toFixed(1), r = rnd(0.7, 1.6).toFixed(2);
    const dur = rnd(6, 13).toFixed(1), del = (-rnd(0, 13)).toFixed(1), op = rnd(0.22, 0.42).toFixed(2);
    return `<circle class="sn" cx="${x}" cy="${y}" r="${r}" fill="#DCE3EC" opacity="${op}" style="animation-duration:${dur}s;animation-delay:${del}s"/>`;
  }).join("");
  const pk = 600;
  const ridge = `<path d="M ${m} ${bottom} L ${m} ${bottom - 14} L ${(m + pk) / 2} ${bottom - 8} L ${pk - 40} ${bottom - 12} L ${pk} ${bottom - 34} L ${pk + 44} ${bottom - 12} L ${(pk + right) / 2} ${bottom - 9} L ${right} ${bottom - 15} L ${right} ${bottom} Z" fill="#0A0E13"/><path d="M ${pk - 14} ${bottom - 20} L ${pk} ${bottom - 34} L ${pk + 14} ${bottom - 20} L ${pk + 6} ${bottom - 22} L ${pk} ${bottom - 28} L ${pk - 6} ${bottom - 22} Z" fill="#39424E"/>`;
  const L = 13, cs = `stroke="${ACC}" stroke-width="1.5" fill="none" opacity="0.7"`;
  const cornersP =
    `<path d="M ${m + L} ${m} L ${m} ${m} L ${m} ${m + L}" ${cs}/>` +
    `<path d="M ${right - L} ${m} L ${right} ${m} L ${right} ${m + L}" ${cs}/>` +
    `<path d="M ${m + L} ${bottom} L ${m} ${bottom} L ${m} ${bottom - L}" ${cs}/>` +
    `<path d="M ${right - L} ${bottom} L ${right} ${bottom} L ${right} ${bottom - L}" ${cs}/>`;
  const statItems = cells.map(([l, v], i) => {
    const x = px + colW * i + colW / 2;
    return `<g class="fade" style="animation-delay:${(0.1 + i * 0.06).toFixed(2)}s"><text class="num" x="${x.toFixed(1)}" y="64" text-anchor="middle">${fmt(v)}</text><text class="lbl" x="${x.toFixed(1)}" y="86" text-anchor="middle">${esc(l)}</text></g>`;
  }).join("");
  const barX = px, barY = 150, barW = inner, barH = 10;
  let off = 0;
  const segs = top.map((l) => { const w = (l.pct / 100) * barW; const s = `<rect x="${(barX + off).toFixed(1)}" y="${barY}" width="${w.toFixed(1)}" height="${barH}" fill="${l.color}"/>`; off += w; return s; }).join("");
  const lw = inner / 3;
  const legend = top.map((l, i) => {
    const c = i % 3, r = Math.floor(i / 3), x = px + c * lw, y = 190 + r * 24;
    return `<g class="fade" style="animation-delay:${(0.2 + i * 0.06).toFixed(2)}s"><circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${l.color}"/><text class="lname" x="${x + 18}" y="${y}">${esc(l.name)}</text><text class="lpct" x="${x + lw - 26}" y="${y}" text-anchor="end">${l.pct.toFixed(1)}%</text></g>`;
  }).join("");

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="GitHub statistics for ${esc(u.login)}">
  <defs>
    <clipPath id="scene"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}" rx="10"/></clipPath>
    <clipPath id="rnd"><rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5"/></clipPath>
    <style>
    .sn{animation-name:fall;animation-timing-function:linear;animation-iteration-count:infinite}@keyframes fall{0%{transform:translateY(-12px);opacity:0}14%{opacity:.6}86%{opacity:.6}100%{transform:translateY(58px);opacity:0}}
    .fade{animation:rise .6s ease both}@keyframes rise{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
    .num{font:700 30px ${t.serif};fill:${t.num}}
    .lbl{font:400 11.5px ${t.sans};fill:${t.muted};letter-spacing:.4px}
    .llabel{font:600 11px ${t.sans};fill:${t.muted};letter-spacing:2px}
    .lname{font:600 13px ${t.sans};fill:${t.text}}
    .lpct{font:400 13px ${t.sans};fill:${t.muted}}
  </style></defs>
  <rect width="${W}" height="${H}" fill="#0D1117"/>
  <g clip-path="url(#scene)"><rect x="${m}" y="${m}" width="${W - 2 * m}" height="${H - 2 * m}" fill="#0B0F15"/>${flakes}${ridge}</g>
  <rect x="${m}.5" y="${m}.5" width="${W - 2 * m - 1}" height="${H - 2 * m - 1}" rx="10" fill="none" stroke="${t.muted}" stroke-opacity="0.3"/>
  ${cornersP}
  ${statItems}
  <line x1="${px}" y1="112" x2="${W - px}" y2="112" stroke="${t.muted}" stroke-opacity="0.16"/>
  <text class="llabel" x="${px}" y="136">MOST USED LANGUAGES</text>
  <g clip-path="url(#rnd)">${segs}</g>
  ${legend}
</svg>`;
}

export { statsCard, langCard, statsPanel, COLOR, NOIR, MONO };

// ---- main ------------------------------------------------------------------
// Only runs when executed directly (not when imported for tests).
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("generate-stats.mjs")) {
  if (!TOKEN) {
    console.error("Missing GH_TOKEN / GITHUB_TOKEN");
    process.exit(1);
  }
  const user = await fetchData();
  await mkdir("assets", { recursive: true });
  await writeFile("assets/stats.svg", statsCard(user, COLOR), "utf8");
  await writeFile("assets/top-langs.svg", langCard(user, COLOR), "utf8");
  await writeFile("assets/stats-noir.svg", statsCard(user, NOIR), "utf8");
  await writeFile("assets/top-langs-noir.svg", langCard(user, NOIR), "utf8");
  await writeFile("assets/stats-mono.svg", statsCard(user, MONO), "utf8");
  await writeFile("assets/top-langs-mono.svg", langCard(user, MONO), "utf8");
  await writeFile("assets/stats-panel-mono.svg", statsPanel(user, MONO), "utf8");
  console.log("Generated color + noir + mono stat cards + mono panel in assets/");
}
