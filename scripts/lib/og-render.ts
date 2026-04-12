/**
 * resvg 래퍼 — Pretendard 폰트 로딩 + SVG→PNG 변환
 */

import { Resvg } from "@resvg/resvg-js";
import path from "path";

const FONT_DIR = path.join(
  process.cwd(),
  "node_modules/pretendard/dist/public/static",
);

const FONT_FILES = [
  "Pretendard-ExtraBold.otf",
  "Pretendard-Bold.otf",
  "Pretendard-Medium.otf",
  "Pretendard-Regular.otf",
];

export function renderPng(svgString: string): Buffer {
  const resvg = new Resvg(svgString, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      fontFiles: FONT_FILES.map((f) => path.join(FONT_DIR, f)),
      loadSystemFonts: false,
      defaultFontFamily: "Pretendard",
    },
  });

  const pngData = resvg.render();
  return Buffer.from(pngData.asPng());
}
