#!/usr/bin/env node
/**
 * 인스타 카드뉴스 생성기. 블로그의 Neo-Brutalism 톤(검정 보더, 하드 섀도,
 * 빨강 #FF0000, 금색 #FFD700)을 따르는 1080x1350(4:5) 카드를 SVG로 그려
 * @resvg/resvg-js로 PNG 변환한다. 브라우저 없이 동작한다.
 *
 * 사용법 (hongblog 루트에서 실행):
 *   node .claude/skills/sns-writer/scripts/make_cards.mjs <cards.json> <출력디렉터리>
 *
 * cards.json 형식:
 * {
 *   "cards": [
 *     {"type":"cover","kicker":"AI 실무","title":"...","photo":"/경로/bg.jpg"},
 *     {"type":"content","number":"01","heading":"...","body":"...","photo":"/경로/bg2.jpg"},
 *     {"type":"last","title":"...","cta":"...","handle":"digitalmarketer.co.kr","photo":"..."}
 *   ]
 * }
 * photo가 있으면 실사 배경 + 어두운 오버레이 + 흰 글자로 그린다 (fetch_photo.mjs로 수급).
 * photo가 없으면 기존 플랫 디자인을 쓴다.
 * title/heading/body의 \n은 그대로 줄바꿈. body는 글자 수 기준 자동 줄바꿈도 지원.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const W = 1080, H = 1350;
const FONT_DIR = join(process.cwd(), "node_modules/pretendard/dist/public/static");
const FONTS = ["Pretendard-ExtraBold.otf","Pretendard-Bold.otf","Pretendard-Medium.otf","Pretendard-Regular.otf"]
  .map((f) => join(FONT_DIR, f));

const esc = (s) => String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// 한글 기준 글자 수로 자동 줄바꿈. \n은 강제 줄바꿈.
function wrap(text, maxChars) {
  const out = [];
  for (const seg of String(text).split("\n")) {
    let line = "";
    for (const word of seg.split(" ")) {
      const cand = line ? line + " " + word : word;
      if ([...cand].length > maxChars && line) { out.push(line); line = word; }
      else line = cand;
    }
    out.push(line);
  }
  return out;
}

function tspans(lines, x, y, lineH) {
  return lines.map((l, i) => `<tspan x="${x}" y="${y + i * lineH}">${esc(l)}</tspan>`).join("");
}

// 하드 섀도 사각형 (Neo-Brutalism)
function shadowRect(x, y, w, h, fill, shadow = 10) {
  return `<rect x="${x + shadow}" y="${y + shadow}" width="${w}" height="${h}" fill="#000"/>
  <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}" stroke="#000" stroke-width="5"/>`;
}

const frame = `<rect width="${W}" height="${H}" fill="#F3F3F3"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#000" stroke-width="8"/>`;

// 실사 배경: 1080x1350으로 크롭한 사진 + 가독성용 어두운 그라데이션 오버레이
async function photoBg(photoPath, darkness = 0.55) {
  const jpg = await sharp(photoPath).resize(W, H, { fit: "cover", position: "attention" })
    .jpeg({ quality: 82 }).toBuffer();
  return `<image href="data:image/jpeg;base64,${jpg.toString("base64")}" x="0" y="0" width="${W}" height="${H}"/>
  <linearGradient id="ov" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="${Math.max(0, darkness - 0.25)}"/>
    <stop offset="0.55" stop-color="#000" stop-opacity="${darkness}"/>
    <stop offset="1" stop-color="#000" stop-opacity="${Math.min(0.92, darkness + 0.25)}"/>
  </linearGradient>
  <rect width="${W}" height="${H}" fill="url(#ov)"/>
  <rect x="24" y="24" width="${W - 48}" height="${H - 48}" fill="none" stroke="#fff" stroke-width="6"/>`;
}

async function cover(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.55) : null;
  const fg = photo ? "#fff" : "#000";
  const sub = photo ? "#ddd" : "#555";
  const titleLines = wrap(c.title, 11);
  const size = titleLines.length > 3 ? 88 : 100;
  const lineH = size * 1.22;
  const startY = (H - titleLines.length * lineH) / 2 + size * 0.6;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  ${shadowRect(80, 130, 46 + [...(c.kicker||"")].length * 34, 78, "#FF0000")}
  <text x="${103}" y="${184}" font-family="Pretendard" font-weight="800" font-size="38" fill="#fff">${esc(c.kicker || "")}</text>
  <text font-family="Pretendard" font-weight="800" font-size="${size}" fill="${fg}">${tspans(titleLines, 80, startY, lineH)}</text>
  ${shadowRect(80, H - 220, 320, 82, "#FFD700")}
  <text x="106" y="${H - 165}" font-family="Pretendard" font-weight="700" font-size="36" fill="#000">넘겨서 보기 →</text>
  <text x="${W - 80}" y="${H - 90}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="28" fill="${sub}">${esc(c.handle || "digitalmarketer.co.kr")}</text>
</svg>`;
}

async function content(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.62) : null;
  const fg = photo ? "#fff" : "#000";
  const bodyFg = photo ? "#f0f0f0" : "#111";
  const sub = photo ? "#ddd" : "#555";
  const headLines = wrap(c.heading, 13);
  const headH = headLines.length * 78;
  const bodyLines = wrap(c.body || "", 22);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  ${shadowRect(80, 110, 130, 96, "#FF0000")}
  <text x="145" y="178" text-anchor="middle" font-family="Pretendard" font-weight="800" font-size="52" fill="#fff">${esc(c.number || "")}</text>
  <text font-family="Pretendard" font-weight="800" font-size="62" fill="${fg}">${tspans(headLines, 80, 330, 78)}</text>
  <rect x="80" y="${300 + headH + 26}" width="200" height="14" fill="#FFD700" stroke="#000" stroke-width="3"/>
  <text font-family="Pretendard" font-weight="500" font-size="42" fill="${bodyFg}">${tspans(bodyLines, 80, 320 + headH + 120, 66)}</text>
  <text x="${W - 80}" y="${H - 90}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="28" fill="${sub}">${esc(c.handle || "digitalmarketer.co.kr")}</text>
</svg>`;
}

async function last(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.62) : null;
  const fg = photo ? "#fff" : "#000";
  const titleLines = wrap(c.title, 12);
  const lineH = 92;
  const startY = 420;
  const ctaLines = wrap(c.cta || "", 24);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  <text font-family="Pretendard" font-weight="800" font-size="76" fill="${fg}">${tspans(titleLines, 80, startY, lineH)}</text>
  ${shadowRect(80, startY + titleLines.length * lineH + 60, W - 240, 80 + ctaLines.length * 58, "#FFD700")}
  <text font-family="Pretendard" font-weight="700" font-size="40" fill="#000">${tspans(ctaLines, 112, startY + titleLines.length * lineH + 128, 58)}</text>
  ${shadowRect(80, H - 250, 560, 90, "#FF0000")}
  <text x="108" y="${H - 190}" font-family="Pretendard" font-weight="800" font-size="40" fill="#fff">${esc(c.handle || "digitalmarketer.co.kr")}</text>
</svg>`;
}

const BUILDERS = { cover, content, last };

const [srcPath, outDir] = process.argv.slice(2);
if (!srcPath || !outDir) {
  console.error("사용법: make_cards.mjs <cards.json> <출력디렉터리>");
  process.exit(2);
}
const { cards } = JSON.parse(readFileSync(srcPath, "utf8"));
mkdirSync(outDir, { recursive: true });

for (const [i, c] of cards.entries()) {
  const builder = BUILDERS[c.type];
  if (!builder) throw new Error(`알 수 없는 type: ${c.type}`);
  const svg = await builder(c);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: { fontFiles: FONTS, loadSystemFonts: false, defaultFontFamily: "Pretendard" },
  });
  const out = join(outDir, `card_${String(i + 1).padStart(2, "0")}.png`);
  writeFileSync(out, Buffer.from(resvg.render().asPng()));
  console.log(out);
}
