#!/usr/bin/env node
/**
 * 링크드인과 쓰레드용 단일 썸네일 생성기. 카드뉴스(1080x1350)와 규격이 달라
 * 따로 둔다. 실사 배경 + 어두운 오버레이 + 흰 글자로, 카드뉴스와 같은 톤을 쓴다.
 *
 * 사용법:
 *   node make_thumb.mjs linkedin  <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *   node make_thumb.mjs threads   <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *
 * 규격
 *   linkedin 1200x627  (링크 미리보기와 단일 이미지 공용)
 *   threads  1080x1350 (피드에서 세로가 더 크게 잡힌다)
 *
 * 디자인 지침 (2026-08-24 사용자 레퍼런스)
 *   - 글자를 크게 쓴다. 작은 글자 고집이 가장 흔한 실수다
 *   - 한 문단으로 읽히는 글은 한 정렬로 맞춘다
 *   - 글 덩어리는 아래쪽에 놓고 위는 사진에 내준다
 *   - 폭은 폰트에서 읽은 실제 자폭으로 잰다. 글자 수로 세지 않는다
 *
 * 글감 규칙은 references/card-text-rules.md를 따른다. 개조식으로 쓴다.
 */
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { FONT_FILES, fit, textBlock, pill, assertInside, width } from "./lib/layout.mjs";

const SPEC = {
  linkedin: { W: 1200, H: 627, pad: 72, safe: 40, title: [76, 68, 60, 54, 48], sub: [34, 31, 28], kicker: 32, bottom: 88, handleSize: 26, handleUp: 48 },
  threads: { W: 1080, H: 1350, pad: 80, safe: 48, title: [92, 84, 76, 68, 60], sub: [48, 43, 38, 34], kicker: 40, bottom: 150, handleSize: 30, handleUp: 62 },
};

const [kind, photo, out, kicker, title, sub] = process.argv.slice(2);
if (!SPEC[kind] || !photo || !out) {
  console.error('사용법: make_thumb.mjs <linkedin|threads> <photo.jpg> <출력.png> "킥커" "제목" "부제"');
  process.exit(2);
}
const { W, H, pad, safe, bottom } = SPEC[kind];
const COL = W - pad * 2;

async function bg(darkness) {
  const jpg = await sharp(photo).resize(W, H, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88 }).toBuffer();
  return `<image href="data:image/jpeg;base64,${jpg.toString("base64")}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="#000" stop-opacity="${Math.max(0, darkness - 0.3)}"/>
    <stop offset="0.5" stop-color="#000" stop-opacity="${darkness}"/>
    <stop offset="1" stop-color="#000" stop-opacity="${Math.min(0.94, darkness + 0.2)}"/>
  </linearGradient>
  <rect x="0" y="0" width="${W}" height="${H}" fill="url(#g)"/>`;
}

// 카드뉴스와 같은 글자 검사를 거친다.
if (!process.argv.includes("--skip-check")) {
  const checker = join(dirname(fileURLToPath(import.meta.url)), "check_cards.mjs");
  try {
    execFileSync("node", [checker, "--text", kicker || "", title || "", sub || ""].filter(Boolean), { stdio: "inherit" });
  } catch {
    console.error("\n글자 검사에서 HARD가 나와 썸네일을 그리지 않았습니다.");
    process.exit(1);
  }
}

const boxes = [];
const kickY = kind === "linkedin" ? 52 : 100;
const kick = kicker
  ? pill(kicker, { x: pad, y: kickY, size: SPEC[kind].kicker, padX: 26, padY: 16, shadow: 0, stroke: null, maxW: COL })
  : { svg: "", w: 0, h: 0 };
if (kicker) boxes.push({ name: "kicker", x: pad, y: kickY, w: kick.w, h: kick.h });

// 글 덩어리는 아래에서 위로 쌓는다. 킥커 아래까지가 쓸 수 있는 세로다.
const ceiling = kickY + kick.h + 40;
const floor = H - bottom;
const RULE = 46;

const t = fit(title, { maxW: COL, maxH: floor - ceiling - 120, sizes: SPEC[kind].title, weight: 800, lineRatio: 1.24 });
const s = sub
  ? fit(sub, { maxW: COL, maxH: 200, sizes: SPEC[kind].sub, weight: 500, lineRatio: 1.5 })
  : { lines: [], height: 0, size: 0, lineH: 0, weight: 500 };

const stackH = t.height + RULE + s.height;
const titleTop = Math.max(ceiling, floor - stackH);
const titleBase = titleTop + t.size * 0.82;
const ruleY = titleTop + t.height + 16;
const subBase = ruleY + RULE - 16 + s.size * 0.82;

boxes.push({ name: "title", x: pad, y: titleTop, w: COL, h: t.height });
if (s.lines.length) boxes.push({ name: "sub", x: pad, y: ruleY + RULE - 16, w: COL, h: s.height });

const handleSize = SPEC[kind].handleSize;
const handleY = H - SPEC[kind].handleUp;   // baseline. 아래로 디센더가 더 내려간다
const handleW = width("digitalmarketer.co.kr", handleSize, 500);
boxes.push({ name: "handle", x: W - pad - handleW, y: handleY - handleSize, w: handleW, h: handleSize + 8 });

assertInside(boxes, { W, H, pad: safe, label: `${kind} / ${String(title).slice(0, 24)}` });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${await bg(kind === "linkedin" ? 0.62 : 0.66)}
${kick.svg}
${textBlock(t, pad, titleBase, "#fff")}
<rect x="${pad}" y="${ruleY}" width="180" height="12" fill="#FFD700"/>
${s.lines.length ? textBlock(s, pad, subBase, "#eee") : ""}
<text x="${W - pad}" y="${handleY}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="${handleSize}" fill="#ccc">digitalmarketer.co.kr</text>
</svg>`;

const png = new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Pretendard" }, fitTo: { mode: "width", value: W } })
  .render().asPng();
writeFileSync(out, png);
console.log(`${out}  ${W}x${H}  ${(png.length / 1024).toFixed(0)}KB`);
