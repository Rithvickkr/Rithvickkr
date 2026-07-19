// Custom GitHub stats SVG generator — no third-party services.
// Fetches real data via the GitHub GraphQL API and renders two themed SVG cards
// (assets/stats.svg + assets/top-langs.svg). Run by .github/workflows/stats.yml.

import { writeFile, mkdir } from "node:fs/promises";

const LOGIN = process.env.GH_LOGIN || "Rithvickkr";
const TOKEN = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;

// ---- theme -----------------------------------------------------------------
const T = {
  bg: "#0D1117",
  card: "#0D1117",
  border: "url(#accent)",
  cyan: "#06B6D4",
  indigo: "#6366F1",
  violet: "#8B5CF6",
  text: "#C9D1D9",
  muted: "#8B949E",
  track: "#21262D",
  font: "'Segoe UI', Ubuntu, 'Helvetica Neue', Sans-Serif",
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

const FALLBACK_COLORS = [T.cyan, T.violet, T.indigo, "#22D3EE", "#A78BFA", "#818CF8"];

// ---- stats card ------------------------------------------------------------
function statsCard(u) {
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
      <stop offset="0" stop-color="${T.cyan}"/><stop offset="0.5" stop-color="${T.indigo}"/><stop offset="1" stop-color="${T.violet}"/>
    </linearGradient>
    <style>
      .fade { animation: rise 0.7s ease both; }
      @keyframes rise { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      .num { font: 700 26px ${T.font}; fill: ${T.cyan}; }
      .lbl { font: 400 12px ${T.font}; fill: ${T.muted}; }
      .title { font: 700 18px ${T.font}; fill: ${T.text}; }
    </style>
  </defs>
  <rect x="1" y="1" width="448" height="198" rx="12" fill="${T.card}" stroke="url(#accent)" stroke-width="1.5"/>
  <text x="25" y="42" class="title">${esc(u.name || u.login)} · GitHub Stats</text>
  <rect x="25" y="52" width="52" height="3" rx="1.5" fill="url(#accent)"/>
  ${items}
</svg>`;
}

// ---- languages card --------------------------------------------------------
function langCard(u) {
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
      color: colors.get(name) || FALLBACK_COLORS[i % FALLBACK_COLORS.length],
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
      <stop offset="0" stop-color="${T.cyan}"/><stop offset="0.5" stop-color="${T.indigo}"/><stop offset="1" stop-color="${T.violet}"/>
    </linearGradient>
    <clipPath id="reveal"><rect x="${barX}" y="${barY}" width="${barW}" height="${barH}"><animate attributeName="width" dur="1s" begin="0.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" keyTimes="0;1" values="0;${barW}"/></rect></clipPath>
    <clipPath id="round"><rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5"/></clipPath>
    <style>
      .fade { animation: rise 0.7s ease both; }
      @keyframes rise { from { opacity:0; transform: translateY(8px); } to { opacity:1; transform: translateY(0); } }
      .title { font: 700 18px ${T.font}; fill: ${T.text}; }
      .lname { font: 600 13px ${T.font}; fill: ${T.text}; }
      .lpct  { font: 400 13px ${T.font}; fill: ${T.muted}; }
    </style>
  </defs>
  <rect x="1" y="1" width="448" height="198" rx="12" fill="${T.card}" stroke="url(#accent)" stroke-width="1.5"/>
  <text x="25" y="42" class="title">Most Used Languages</text>
  <rect x="25" y="52" width="52" height="3" rx="1.5" fill="url(#accent)"/>
  <rect x="${barX}" y="${barY}" width="${barW}" height="${barH}" rx="5.5" fill="${T.track}"/>
  <g clip-path="url(#round)"><g clip-path="url(#reveal)">${segs}</g></g>
  ${legend}
</svg>`;
}

export { statsCard, langCard };

// ---- main ------------------------------------------------------------------
// Only runs when executed directly (not when imported for tests).
if (import.meta.url === `file://${process.argv[1]}` || process.argv[1]?.endsWith("generate-stats.mjs")) {
  if (!TOKEN) {
    console.error("Missing GH_TOKEN / GITHUB_TOKEN");
    process.exit(1);
  }
  const user = await fetchData();
  await mkdir("assets", { recursive: true });
  await writeFile("assets/stats.svg", statsCard(user), "utf8");
  await writeFile("assets/top-langs.svg", langCard(user), "utf8");
  console.log("Generated assets/stats.svg and assets/top-langs.svg");
}
