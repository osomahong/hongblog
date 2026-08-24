#!/usr/bin/env node
/**
 * 인스타 카드뉴스 생성기. 1080x1350(4:5) 카드를 SVG로 그려 @resvg/resvg-js로
 * PNG 변환한다. 브라우저 없이 동작한다.
 *
 * 사용법 (hongblog 루트에서 실행):
 *   node .claude/skills/sns-writer/scripts/make_cards.mjs <cards.json> <출력디렉터리>
 *
 * cards.json 형식:
 * {
 *   "cards": [
 *     {"type":"cover","kicker":"AI 실무","title":"...","cta":"...","photo":"/경로/bg.jpg"},
 *     {"type":"content","number":"01","heading":"...","body":"...","highlight":"강조할 한 줄","photo":"/경로/bg2.jpg"},
 *     {"type":"last","title":"...","cta":"...","note":"...","handle":"digitalmarketer.co.kr","photo":"..."}
 *   ]
 * }
 * photo가 있으면 위쪽은 사진, 아래쪽은 완전한 검정으로 끊어 그 위에 글을 얹는다.
 * photo가 없으면 카드 전체가 검정이다. title/heading/body의 \n은 그대로
 * 줄바꿈. 나머지는 폭에 맞춰 자동 줄바꿈한다.
 *
 * 디자인 (2026-08-24, 사용자 레퍼런스 5장 반영)
 *   테두리, 드롭섀도, 색 배지 박스를 전부 없앴다. 번호와 킥커는 박스 없이
 *   작은 글자로만 쓴다. 본문 중 한 줄만 highlight 필드로 지정하면 금색
 *   형광펜 바를 글자 뒤에 깐다(떠 있는 배지가 아니라 글자에 붙는 바탕색).
 *   사진은 카드 전체를 어둡게 깔지 않고, 글이 앉는 아래 구간만 완전한
 *   검정으로 끊는다. 예전 버전(검정 보더 + 빨강/금색 하드섀도 박스)은
 *   hongblog 사이트의 네오브루탈리즘을 그대로 옮긴 것이었는데, 사용자가
 *   준 레퍼런스와 전혀 다른 스타일이었다.
 *
 * 넘침 방지
 *   글자 수가 아니라 폰트에서 읽은 실제 자폭으로 줄바꿈하고, 하이라이트 바는
 *   글자를 재서 그린다. 마지막에 assertInside로 안전 영역을 넘었는지 확인하고,
 *   넘으면 PNG를 쓰지 않고 멈춘다.
 *
 * 글감 규칙은 references/card-text-rules.md를 따른다. 개조식으로 쓴다.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";
import { FONT_FILES, esc, fit, textBlock, fitHighlight, highlightBlock, assertInside, width } from "./lib/layout.mjs";

const W = 1080, H = 1350;
const PAD = 80;            // 글자가 시작하는 가장자리
const SAFE = 48;           // 이 안쪽으로는 아무것도 나가면 안 된다
const COL = W - PAD * 2;   // 920, 글이 쓸 수 있는 가로
const BG = "#0D0D0D";      // 카드 바탕. 순검정 대신 아주 짙은 회색 (레퍼런스 톤)
const GOLD = "#FFD700";

// 사진이 없으면 카드 전체가 짙은 배경.
const flatBg = `<rect width="${W}" height="${H}" fill="${BG}"/>`;

/**
 * 사진 배경. 레퍼런스처럼 위쪽은 사진을 그대로 두고, 글이 앉는 아래 구간
 * (splitY부터)만 완전한 배경색으로 끊는다. 카드 전체를 어둡게 까는 방식이 아니다.
 */
async function photoBg(photoPath, splitY) {
  const jpg = await sharp(photoPath).resize(W, H, { fit: "cover", position: "attention" })
    .jpeg({ quality: 85 }).toBuffer();
  const f0 = Math.max(0, (splitY - 140) / H).toFixed(4);
  const f1 = (splitY / H).toFixed(4);
  return `<image href="data:image/jpeg;base64,${jpg.toString("base64")}" x="0" y="0" width="${W}" height="${H}"/>
  <linearGradient id="ov" x1="0" y1="0" x2="0" y2="1">
    <stop offset="0" stop-color="${BG}" stop-opacity="0"/>
    <stop offset="${f0}" stop-color="${BG}" stop-opacity="0"/>
    <stop offset="${f1}" stop-color="${BG}" stop-opacity="0.97"/>
    <stop offset="1" stop-color="${BG}" stop-opacity="0.99"/>
  </linearGradient>
  <rect width="${W}" height="${H}" fill="url(#ov)"/>`;
}

// 킥커·번호는 박스 없이 작은 글자로만 쓴다 (레퍼런스: 배지 없음).
// 2단계(재기 → 그리기). y를 모르는 시점에 SVG를 구워 버리면 다른 요소 위에
// 겹쳐 찍힌다 (2026-08-24, highlightLines에서 겪은 것과 같은 버그).
function measureLabel(text, { size = 34, weight = 800 } = {}) {
  if (!text) return { text: "", w: 0, h: 0, size, weight };
  return { text, w: width(text, size, weight), h: size, size, weight };
}
function renderLabel(m, x, y, color = GOLD) {
  if (!m.text) return "";
  return `<text x="${x}" y="${y + Math.round(m.size * 0.82)}" font-family="Pretendard" font-weight="${m.weight}" font-size="${m.size}" fill="${color}">${esc(m.text)}</text>`;
}

// 계정 표기는 오른쪽 아래에 오른쪽 맞춤. 작은 글자, 박스 없음.
function handle(text) {
  const size = 26;
  const w = width(text, size, 500);
  return {
    svg: `<text x="${W - PAD}" y="${H - 64}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="${size}" fill="#999">${esc(text)}</text>`,
    box: { name: "handle", x: W - PAD - w, y: H - 64 - size, w, h: size + 8 },
  };
}

async function cover(c) {
  const kick = measureLabel(c.kicker, { size: 34 });
  const t = fit(c.title, { maxW: COL, maxH: 480, sizes: [96, 88, 80, 72, 64], weight: 800, lineRatio: 1.2 });
  const cta = c.cta !== "" ? fitHighlight(c.cta || "넘겨서 보기 →", { maxW: COL, sizes: [34, 30] }) : { lines: [], height: 0 };

  const gapKickTitle = 46, gapTitleCta = 56, bottomMargin = 130;
  const blockH = kick.h + gapKickTitle + t.height + (cta.lines.length ? gapTitleCta + cta.height : 0);
  const top = Math.max(160, H - bottomMargin - blockH);
  const kickY = top;
  const titleTop = kickY + kick.h + gapKickTitle;
  const titleBase = titleTop + t.size * 0.82;
  const ctaY = titleTop + t.height + gapTitleCta;

  const photo = c.photo ? await photoBg(c.photo, top - 90) : null;

  const boxes = [
    { name: "kicker", x: PAD, y: kickY, w: kick.w, h: kick.h },
    { name: "title", x: PAD, y: titleTop, w: COL, h: t.height },
  ];
  if (cta.lines.length) boxes.push({ name: "cta", x: PAD, y: ctaY, w: cta.maxW, h: cta.height });
  const h = handle(c.handle || "digitalmarketer.co.kr");
  boxes.push(h.box);
  assertInside(boxes, { W, H, pad: SAFE, label: `cover / ${c.title?.slice(0, 20)}` });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || flatBg}
  ${renderLabel(kick, PAD, kickY)}
  ${textBlock(t, PAD, titleBase, "#fff")}
  ${highlightBlock(cta, PAD, ctaY)}
  ${h.svg}
</svg>`;
}

async function content(c) {
  const num = measureLabel(c.number, { size: 36 });
  const head = fit(c.heading, { maxW: COL, maxH: 320, sizes: [66, 60, 54, 48], weight: 800, lineRatio: 1.24 });
  const hi = c.highlight ? fitHighlight(c.highlight, { maxW: COL, sizes: [38, 34, 30] }) : { lines: [], height: 0 };
  const body = c.body ? fit(c.body, { maxW: COL, maxH: 420, sizes: [40, 36, 32, 30], weight: 500, lineRatio: 1.5 }) : { lines: [], height: 0, size: 0, lineH: 0, weight: 500 };

  const gap = 40;
  const blockH = num.h + gap + head.height + (hi.lines.length ? gap + hi.height : 0) + (body.lines.length ? gap + body.height : 0);
  const bottomMargin = 130;
  const numTop = Math.max(110, H - bottomMargin - blockH);
  const headTop = numTop + num.h + gap;
  const headBase = headTop + head.size * 0.82;
  const hiY = headTop + head.height + gap;
  const bodyTop = hiY + (hi.lines.length ? hi.height + gap : 0);
  const bodyBase = bodyTop + body.size * 0.82;

  const photo = c.photo ? await photoBg(c.photo, numTop - 90) : null;

  const boxes = [
    { name: "number", x: PAD, y: numTop, w: num.w, h: num.h },
    { name: "heading", x: PAD, y: headTop, w: COL, h: head.height },
  ];
  if (hi.lines.length) boxes.push({ name: "highlight", x: PAD, y: hiY, w: hi.maxW, h: hi.height });
  if (body.lines.length) boxes.push({ name: "body", x: PAD, y: bodyTop, w: COL, h: body.height });
  const h = handle(c.handle || "digitalmarketer.co.kr");
  boxes.push(h.box);
  assertInside(boxes, { W, H, pad: SAFE, label: `content ${c.number} / ${c.heading?.slice(0, 20)}` });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || flatBg}
  ${renderLabel(num, PAD, numTop)}
  ${textBlock(head, PAD, headBase, "#fff")}
  ${highlightBlock(hi, PAD, hiY)}
  ${body.lines.length ? textBlock(body, PAD, bodyBase, "#ccc") : ""}
  ${h.svg}
</svg>`;
}

async function last(c) {
  const title = fit(c.title, { maxW: COL, maxH: 420, sizes: [76, 68, 60, 54], weight: 800, lineRatio: 1.2 });
  const cta = c.cta ? fitHighlight(c.cta, { maxW: COL, sizes: [38, 34, 30] }) : { lines: [], height: 0 };
  const note = c.note ? fit(c.note, { maxW: COL, maxH: 120, sizes: [32, 30, 28], weight: 500, lineRatio: 1.4 }) : { lines: [], height: 0, size: 0, weight: 500 };
  const url = fitHighlight(c.handle || "digitalmarketer.co.kr", { maxW: COL, sizes: [34, 30] });

  const gap = 44;
  const blockH = title.height + (cta.lines.length ? gap + cta.height : 0) + (note.lines.length ? gap - 8 + note.height : 0) + gap + url.height;
  const bottomMargin = 120;
  const top = Math.max(220, H - bottomMargin - blockH);
  const titleBase = top + title.size * 0.82;
  const ctaY = top + title.height + gap;
  const noteTop = ctaY + (cta.lines.length ? cta.height + gap - 8 : 0);
  const urlY = noteTop + (note.lines.length ? note.height + gap : gap);

  const photo = c.photo ? await photoBg(c.photo, top - 90) : null;

  const boxes = [{ name: "title", x: PAD, y: top, w: COL, h: title.height }];
  if (cta.lines.length) boxes.push({ name: "cta", x: PAD, y: ctaY, w: cta.maxW, h: cta.height });
  if (note.lines.length) boxes.push({ name: "note", x: PAD, y: noteTop, w: COL, h: note.height });
  boxes.push({ name: "url", x: PAD, y: urlY, w: url.maxW, h: url.height });
  assertInside(boxes, { W, H, pad: SAFE, label: `last / ${c.title?.slice(0, 20)}` });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || flatBg}
  ${textBlock(title, PAD, titleBase, "#fff")}
  ${highlightBlock(cta, PAD, ctaY)}
  ${note.lines.length ? textBlock(note, PAD, noteTop + note.size * 0.82, "#ccc") : ""}
  ${highlightBlock(url, PAD, urlY)}
</svg>`;
}

const BUILDERS = { cover, content, last };

const [srcPath, outDir] = process.argv.slice(2);
if (!srcPath || !outDir) {
  console.error("사용법: make_cards.mjs <cards.json> <출력디렉터리>");
  process.exit(2);
}
// 글자 검사를 통과해야 그린다. 문체 게이트를 카드 밖에 두면 아무도 돌리지 않는다.
if (!process.argv.includes("--skip-check")) {
  const checker = join(dirname(fileURLToPath(import.meta.url)), "check_cards.mjs");
  try {
    execFileSync("node", [checker, srcPath], { stdio: "inherit" });
  } catch {
    console.error("\n글자 검사에서 HARD가 나와 카드를 그리지 않았습니다. cards.json을 고치세요.");
    process.exit(1);
  }
}

const { cards } = JSON.parse(readFileSync(srcPath, "utf8"));
mkdirSync(outDir, { recursive: true });

for (const [i, c] of cards.entries()) {
  const builder = BUILDERS[c.type];
  if (!builder) throw new Error(`알 수 없는 type: ${c.type}`);
  const svg = await builder(c);
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: W },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: "Pretendard" },
  });
  const out = join(outDir, `card_${String(i + 1).padStart(2, "0")}.png`);
  writeFileSync(out, Buffer.from(resvg.render().asPng()));
  console.log(out);
}
