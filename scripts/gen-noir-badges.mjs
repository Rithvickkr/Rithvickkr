import { siX, siGmail, siGithub, siVercel } from "simple-icons";
import { writeFile } from "node:fs/promises";

const linkedinPath =
  "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z";

const SANS = "'Helvetica Neue', Arial, 'Segoe UI', sans-serif";
const PANEL = "#0F1011", BORDER = "#33363A", INK = "#F4F6F8";

function badge({ label, path }) {
  const H = 40, padL = 15, icon = 17, gap = 10, padR = 18, ls = 1.6;
  const text = label.toUpperCase();
  const charW = 8.6;
  const textW = Math.ceil(text.length * charW + (text.length - 1) * ls);
  const W = padL + icon + gap + textW + padR;
  const iconY = (H - icon) / 2, scale = icon / 24;
  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
  <rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="8" fill="${PANEL}" stroke="${BORDER}"/>
  <g transform="translate(${padL},${iconY}) scale(${scale.toFixed(4)})"><path d="${path}" fill="${INK}"/></g>
  <text x="${padL + icon + gap}" y="${H / 2}" dominant-baseline="central" font-family="${SANS}" font-size="12" font-weight="600" letter-spacing="${ls}" fill="${INK}">${text}</text>
</svg>`;
}

const badges = {
  "n-social-linkedin": { label: "LinkedIn", path: linkedinPath },
  "n-social-x": { label: "X", path: siX.path },
  "n-social-gmail": { label: "Gmail", path: siGmail.path },
  "n-social-github": { label: "GitHub", path: siGithub.path },
  "n-social-portfolio": { label: "Portfolio", path: siVercel.path },
};
for (const [f, cfg] of Object.entries(badges)) await writeFile(new URL(`./${f}.svg`, import.meta.url), badge(cfg), "utf8");
console.log("wrote", Object.keys(badges).join(", "));
