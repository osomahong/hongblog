#!/usr/bin/env node
/**
 * OTF/TTF에서 글자별 실제 자폭(advance width)을 읽는다.
 * 카드뉴스와 썸네일이 칸을 넘기던 원인은 글자 수로 줄바꿈하고 상자 폭을
 * 상수로 박아 둔 것이었다. 한글은 1em인데 영문 소문자는 0.5em대라 같은
 * 글자 수라도 실제 폭이 두 배까지 벌어진다. 그래서 폰트를 직접 읽는다.
 *
 * head(unitsPerEm), hhea(numberOfHMetrics), hmtx(자폭), cmap(코드포인트 → 글리프)
 * 네 표만 본다. CFF든 glyf든 이 네 표는 똑같이 있다.
 */
import { readFileSync } from "node:fs";

function parse(buf) {
  const numTables = buf.readUInt16BE(4);
  const tables = {};
  for (let i = 0; i < numTables; i++) {
    const o = 12 + i * 16;
    tables[buf.toString("ascii", o, o + 4)] = { off: buf.readUInt32BE(o + 8), len: buf.readUInt32BE(o + 12) };
  }
  const head = tables.head.off;
  const unitsPerEm = buf.readUInt16BE(head + 18);
  const numHMetrics = buf.readUInt16BE(tables.hhea.off + 34);

  const hmtx = tables.hmtx.off;
  const advance = (gid) => buf.readUInt16BE(hmtx + Math.min(gid, numHMetrics - 1) * 4);

  return { buf, unitsPerEm, advance, cmap: readCmap(buf, tables.cmap.off) };
}

// 유니코드 서브테이블만 고른다. format 4(BMP)와 12(전체)를 읽는다.
function readCmap(buf, off) {
  const n = buf.readUInt16BE(off + 2);
  let best = null;
  for (let i = 0; i < n; i++) {
    const p = off + 4 + i * 8;
    const platform = buf.readUInt16BE(p);
    const encoding = buf.readUInt16BE(p + 2);
    const sub = off + buf.readUInt32BE(p + 4);
    const format = buf.readUInt16BE(sub);
    const unicode = platform === 0 || (platform === 3 && (encoding === 1 || encoding === 10));
    if (!unicode) continue;
    if (format === 12) return { format, sub };
    if (format === 4 && !best) best = { format, sub };
  }
  if (!best) throw new Error("cmap: 유니코드 서브테이블 없음");
  return best;
}

function lookup(buf, cmap, cp) {
  if (cmap.format === 12) {
    const sub = cmap.sub;
    const groups = buf.readUInt32BE(sub + 12);
    let lo = 0, hi = groups - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1;
      const g = sub + 16 + mid * 12;
      const start = buf.readUInt32BE(g), end = buf.readUInt32BE(g + 4);
      if (cp < start) hi = mid - 1;
      else if (cp > end) lo = mid + 1;
      else return buf.readUInt32BE(g + 8) + (cp - start);
    }
    return 0;
  }
  if (cp > 0xffff) return 0;
  const sub = cmap.sub;
  const segX2 = buf.readUInt16BE(sub + 6);
  const ends = sub + 14;
  const starts = ends + segX2 + 2;
  const deltas = starts + segX2;
  const ranges = deltas + segX2;
  for (let i = 0; i < segX2; i += 2) {
    if (cp > buf.readUInt16BE(ends + i)) continue;
    const start = buf.readUInt16BE(starts + i);
    if (cp < start) return 0;
    const ro = buf.readUInt16BE(ranges + i);
    if (ro === 0) return (cp + buf.readInt16BE(deltas + i)) & 0xffff;
    const gi = buf.readUInt16BE(ranges + i + ro + (cp - start) * 2);
    return gi === 0 ? 0 : (gi + buf.readInt16BE(deltas + i)) & 0xffff;
  }
  return 0;
}

const cache = new Map();

/** 폰트 파일 하나를 열어 폭 재는 함수를 돌려준다. */
export function loadFont(path) {
  if (cache.has(path)) return cache.get(path);
  const font = parse(readFileSync(path));
  const widths = new Map();
  const em = (cp) => {
    if (widths.has(cp)) return widths.get(cp);
    const gid = lookup(font.buf, font.cmap, cp);
    const w = font.advance(gid) / font.unitsPerEm;
    widths.set(cp, w);
    return w;
  };
  /** 문자열이 size px일 때 차지하는 실제 가로 폭(px) */
  const measure = (text, size) => {
    let sum = 0;
    for (const ch of String(text ?? "")) sum += em(ch.codePointAt(0));
    return sum * size;
  };
  const api = { measure, em };
  cache.set(path, api);
  return api;
}
