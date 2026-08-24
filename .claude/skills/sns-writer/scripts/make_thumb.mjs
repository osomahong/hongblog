#!/usr/bin/env node
/**
 * 링크드인과 쓰레드용 단일 썸네일 생성기. 카드뉴스(1080x1350)와 규격이 달라
 * 따로 둔다. make_cards.mjs와 같은 톤을 쓴다.
 *
 * 사용법:
 *   node make_thumb.mjs linkedin  <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *   node make_thumb.mjs threads   <photo.jpg> <출력.png> "킥커" "제목" "부제"
 *
 * 규격
 *   linkedin 1200x627  (링크 미리보기와 단일 이미지 공용)
 *   threads  1080x1350 (피드에서 세로가 더 크게 잡힌다)
 *
 * 디자인 (2026-08-24, 사용자 레퍼런스 5장 반영. make_cards.mjs와 같은 결정)
 *   테두리, 드롭섀도, 배지 박스를 없앴다. 킥커는 박스 없이 작은 글자로만 쓴다.
 *   사진은 전체를 어둡게 깔지 않고, 글이 앉는 아래 구간만 완전한 배경색으로
 *   끊는다. 부제가 있으면 금색 형광펜 바로 강조한다 (얇은 밑줄 바가 아니라
 *   글자 뒤에 붙는 바탕색).
 *   - 글자를 크게 쓴다. 작은 글자 고집이 가장 흔한 실수다
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
import { FONT_FILES, esc, fit, textBlock, fitHighlight, highlightBlock, assertInside, width } from "./lib/layout.mjs";

const BG = "#0D0D0D";
const SPEC = {
  linkedin: { W: 1200, H: 627, pad: 72, safe: 40, title: [72, 64, 56, 50, 44], sub: [30, 28, 26], kicker: 30, bottom: 84, handleSize: 24, handleUp: 50 },
  threads: { W: 1080, H: 1350, pad: 80, safe: 48, title: [88, 80, 72, 64, 56], sub: [36, 32, 30], kicker: 34, bottom: 130, handleSize: 26, handleUp: 56 },
};

const [kind, photo, out, kicker, title, sub] = process.argv.slice(2);
if (!SPEC[kind] || !photo || !out) {
  console.error('사용법: make_thumb.mjs <linkedin|threads> <photo.jpg> <출력.png> "킥커" "제목" "부제"');
  process.exit(2);
}
const { W, H, pad, safe, bottom } = SPEC[kind];
const COL = W - pad * 2;

// 사진 위쪽은 그대로 두고, splitY부터는 완전한 배경색으로 끊는다.
async function photoBg(photoPath, splitY) {
  const jpg = await sharp(photoPath).resize(W, H, { fit: "cover", position: "attention" })
    .jpeg({ quality: 88 }).toBuffer();
  const f0 = (Math.max(0, splitY - 110) / H).toFixed(4);
  const f1 = (splitY / H).toFixed(4);
  return `<image href="data:image/jpeg;base64,${jpg.toString("base64")}" x="0" y="0" width="${W}" height="${H}" preserveAspectRatio="xMidYMid slice"/>
  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BG}" stop-opacity="0"/>
    <stop offset="${f0}" stop-color="${BG}" stop-opacity="0"/>
    <stop offset="${f1}" stop-color="${BG}" stop-opacity="0.97"/>
    <stop offset="1" stop-color="${BG}" stop-opacity="0.99"/>
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

const kickSize = SPEC[kind].kicker;
const kickW = kicker ? width(kicker, kickSize, 800) : 0;

const t = fit(title, { maxW: COL, maxH: 420, sizes: SPEC[kind].title, weight: 800, lineRatio: 1.22 });
const s = sub ? fitHighlight(sub, { maxW: COL, sizes: SPEC[kind].sub }) : { lines: [], height: 0 };

const gap = kind === "linkedin" ? 36 : 44;
const blockH = (kicker ? kickSize + gap : 0) + t.height + (s.lines.length ? gap + s.height : 0);
const floor = H - bottom;
const top = Math.max(kind === "linkedin" ? 56 : 100, floor - blockH);

const kickTop = top;
const titleTop = top + (kicker ? kickSize + gap : 0);
const titleBase = titleTop + t.size * 0.82;
const subY = titleTop + t.height + gap;

const photoSvg = await photoBg(photo, top - (kind === "linkedin" ? 60 : 90));

const boxes = [{ name: "title", x: pad, y: titleTop, w: COL, h: t.height }];
if (kicker) boxes.push({ name: "kicker", x: pad, y: kickTop, w: kickW, h: kickSize });
if (s.lines.length) boxes.push({ name: "sub", x: pad, y: subY, w: s.maxW, h: s.height });

const handleSize = SPEC[kind].handleSize;
const handleY = H - SPEC[kind].handleUp;
const handleW = width("digitalmarketer.co.kr", handleSize, 500);
boxes.push({ name: "handle", x: W - pad - handleW, y: handleY - handleSize, w: handleW, h: handleSize + 8 });

assertInside(boxes, { W, H, pad: safe, label: `${kind} / ${String(title).slice(0, 24)}` });

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
${photoSvg}
${kicker ? `<text x="${pad}" y="${kickTop + Math.round(kickSize * 0.82)}" font-family="Pretendard" font-weight="800" font-size="${kickSize}" fill="#FFD700">${esc(kicker)}</text>` : ""}
${textBlock(t, pad, titleBase, "#fff")}
${highlightBlock(s, pad, subY)}
<text x="${W - pad}" y="${handleY}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="${handleSize}" fill="#999">digitalmarketer.co.kr</text>
</svg>`;

const png = new Resvg(svg, { font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Pretendard" }, fitTo: { mode: "width", value: W } })
  .render().asPng();
writeFileSync(out, png);
console.log(`${out}  ${W}x${H}  ${(png.length / 1024).toFixed(0)}KB`);
