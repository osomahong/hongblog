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
 * title/heading/body의 \n은 그대로 줄바꿈. 나머지는 폭에 맞춰 자동 줄바꿈한다.
 *
 * 넘침 방지 (2026-08-24)
 *   글자 수가 아니라 폰트에서 읽은 실제 자폭으로 줄바꿈하고, 색 상자는 글자를
 *   재서 그린다. 마지막에 assertInside로 안전 영역을 넘었는지 확인하고,
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
import { FONT_FILES, esc, fit, textBlock, pill, assertInside, width } from "./lib/layout.mjs";

const W = 1080, H = 1350;
const PAD = 80;            // 글자가 시작하는 가장자리
const SAFE = 48;           // 이 안쪽으로는 아무것도 나가면 안 된다
const COL = W - PAD * 2;   // 920, 글이 쓸 수 있는 가로
const BOX = COL - 12;      // 하드 섀도(10px)까지 넣은 상자 최대 폭

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

// 계정 표기는 오른쪽 아래에 오른쪽 맞춤. 폭을 재서 왼쪽 끝을 잡아 둔다.
function handle(text, fill) {
  const size = 28;
  const w = width(text, size, 500);
  return {
    svg: `<text x="${W - PAD}" y="${H - 90}" text-anchor="end" font-family="Pretendard" font-weight="500" font-size="${size}" fill="${fill}">${esc(text)}</text>`,
    box: { name: "handle", x: W - PAD - w, y: H - 90 - size, w, h: size + 10 },
  };
}

async function cover(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.55) : null;
  const fg = photo ? "#fff" : "#000";
  const sub = photo ? "#ddd" : "#555";
  const boxes = [];

  const kick = pill(c.kicker || "", { x: PAD, y: 130, size: 38, padX: 32, padY: 20, maxW: BOX });
  boxes.push({ name: "kicker", x: PAD, y: 130, w: kick.w + 10, h: kick.h + 10 });

  const cta = pill("넘겨서 보기 →", { x: PAD, y: H - 224, size: 36, weight: 700, fill: "#FFD700", color: "#000", padX: 30, padY: 22, maxW: BOX });
  boxes.push({ name: "cta", x: PAD, y: H - 224, w: cta.w + 10, h: cta.h + 10 });

  // 제목이 쓸 수 있는 세로: 킥커 아래부터 하단 버튼 위까지
  const top = 130 + kick.h + 70;
  const bottom = H - 224 - 60;
  const t = fit(c.title, { maxW: COL, maxH: bottom - top, sizes: [100, 92, 84, 76, 68, 60], weight: 800, lineRatio: 1.22 });
  const startY = top + (bottom - top - t.height) / 2 + t.size * 0.82;
  boxes.push({ name: "title", x: PAD, y: startY - t.size, w: COL, h: t.height });

  const h = handle(c.handle || "digitalmarketer.co.kr", sub);
  boxes.push(h.box);
  assertInside(boxes, { W, H, pad: SAFE, label: `cover / ${c.title?.slice(0, 20)}` });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  ${kick.svg}
  ${textBlock(t, PAD, startY, fg)}
  ${cta.svg}
  ${h.svg}
</svg>`;
}

async function content(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.74) : null;
  const fg = photo ? "#fff" : "#000";
  const bodyFg = photo ? "#f5f5f5" : "#111";
  const sub = photo ? "#ddd" : "#555";
  const boxes = [];

  const num = pill(c.number || "", { x: PAD, y: 110, size: 52, padX: 38, padY: 22, maxW: 260 });
  boxes.push({ name: "number", x: PAD, y: 110, w: num.w + 10, h: num.h + 10 });

  const top = 110 + num.h + 80;              // 글 덩어리가 시작할 수 있는 가장 위
  const bottom = H - 150;                     // 계정 표기 위
  const head = fit(c.heading, { maxW: COL, maxH: 300, sizes: [70, 64, 58, 52], weight: 800, lineRatio: 1.26 });
  const RULE = 54;                            // 금색 밑줄이 차지하는 세로
  const bodyMax = bottom - top - head.height - RULE - 40;
  const body = fit(c.body || "", { maxW: COL, maxH: bodyMax, sizes: [62, 56, 50, 46, 42, 38], weight: 600, lineRatio: 1.55 });

  const blockH = head.height + RULE + body.height;
  // 실사 배경이면 글 덩어리를 아래로 몰아 사진 윗부분을 살린다.
  const headTop = photo ? bottom - blockH : top;
  const headBase = headTop + head.size * 0.82;
  const ruleY = headTop + head.height + 18;
  const bodyBase = ruleY + RULE - 18 + body.size * 0.82;

  boxes.push({ name: "heading", x: PAD, y: headTop, w: COL, h: head.height });
  boxes.push({ name: "body", x: PAD, y: ruleY + RULE - 18, w: COL, h: body.height });

  const h = handle(c.handle || "digitalmarketer.co.kr", sub);
  boxes.push(h.box);
  assertInside(boxes, { W, H, pad: SAFE, label: `content ${c.number} / ${c.heading?.slice(0, 20)}` });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  ${num.svg}
  ${textBlock(head, PAD, headBase, fg)}
  <rect x="${PAD}" y="${ruleY}" width="200" height="14" fill="#FFD700" stroke="#000" stroke-width="3"/>
  ${textBlock(body, PAD, bodyBase, bodyFg)}
  ${h.svg}
</svg>`;
}

async function last(c) {
  const photo = c.photo ? await photoBg(c.photo, 0.62) : null;
  const fg = photo ? "#fff" : "#000";
  const boxes = [];

  // 주소는 카드에서 가장 길다. 예전에는 상자 폭을 560으로 박아 두어
  // 주소가 길어지면 그대로 삐져나왔다. 이제 글자를 재서 상자를 만든다.
  const addr = pill(c.handle || "digitalmarketer.co.kr", {
    x: PAD, y: H - 250, size: 40, weight: 800, padX: 28, padY: 22, maxW: BOX,
  });
  boxes.push({ name: "handle", x: PAD, y: H - 250, w: addr.w + 10, h: addr.h + 10 });

  const title = fit(c.title, { maxW: COL, maxH: 420, sizes: [76, 70, 64, 58, 52], weight: 800, lineRatio: 1.21 });
  const ctaFit = fit(c.cta || "", { maxW: BOX - 72, maxH: 300, sizes: [40, 36, 32, 30], weight: 700, lineRatio: 1.45 });
  // 노란 상자는 글에 맞춰 줄인다. 상자만 넓고 오른쪽이 비면 글이 흘러내려 보인다.
  const ctaPadX = 36, ctaPadY = 32;
  const ctaW = ctaFit.lines.length
    ? Math.min(BOX, Math.ceil(Math.max(...ctaFit.lines.map((l) => width(l, ctaFit.size, ctaFit.weight))) + ctaPadX * 2))
    : 0;
  const ctaBoxH = ctaFit.lines.length ? ctaFit.height + ctaPadY * 2 : 0;

  const note = c.note ? fit(c.note, { maxW: COL, maxH: 120, sizes: [36, 32, 28], weight: 600, lineRatio: 1.4 }) : null;
  const noteH = note ? note.height + 48 : 0;

  const stackH = title.height + (ctaBoxH ? 60 + ctaBoxH : 0) + noteH;
  // 사진 카드는 글 덩어리를 주소 바로 위에 붙인다. 가운데 정렬은 위아래가 다 비어 보인다.
  const top = photo ? Math.max(200, H - 250 - 70 - stackH) : Math.max(280, (H - 250 - 70 - stackH) / 2);
  const titleBase = top + title.size * 0.82;
  const ctaTop = top + title.height + 60;
  const noteTop = ctaTop + ctaBoxH + 48;

  boxes.push({ name: "title", x: PAD, y: top, w: COL, h: title.height });
  if (ctaBoxH) boxes.push({ name: "cta", x: PAD, y: ctaTop, w: ctaW + 10, h: ctaBoxH + 10 });
  if (note) boxes.push({ name: "note", x: PAD, y: noteTop, w: COL, h: note.height });
  assertInside(boxes, { W, H, pad: SAFE, label: `last / ${c.title?.slice(0, 20)}` });

  const ctaSvg = ctaBoxH
    ? `<rect x="${PAD + 10}" y="${ctaTop + 10}" width="${ctaW}" height="${ctaBoxH}" fill="#000"/>
  <rect x="${PAD}" y="${ctaTop}" width="${ctaW}" height="${ctaBoxH}" fill="#FFD700" stroke="#000" stroke-width="5"/>
  ${textBlock(ctaFit, PAD + ctaPadX, ctaTop + ctaPadY + ctaFit.size * 0.82, "#000")}`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${photo || frame}
  ${textBlock(title, PAD, titleBase, fg)}
  ${ctaSvg}
  ${note ? textBlock(note, PAD, noteTop + note.size * 0.82, fg) : ""}
  ${addr.svg}
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
