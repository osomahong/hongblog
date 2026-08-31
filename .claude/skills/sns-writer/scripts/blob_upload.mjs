#!/usr/bin/env node
/**
 * 카드뉴스와 썸네일을 Vercel Blob에 올리고 공개 URL을 돌려준다.
 * Buffer에는 파일 업로드 엔드포인트가 없어서 assets에 공개 URL을 넣어야 한다.
 *
 * 사용법 (hongblog 루트에서):
 *   node .claude/skills/sns-writer/scripts/blob_upload.mjs <prefix> <파일...>
 *   예: node ... blob_upload.mjs sns/ga4-edu-v1 /tmp/cards/card_01.png ...
 *
 * .env.local의 BLOB_READ_WRITE_TOKEN을 쓴다. 토큰은 파일에만 두고 출력하지 않는다.
 */
import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { put } from "@vercel/blob";

function token() {
  if (process.env.BLOB_READ_WRITE_TOKEN) return process.env.BLOB_READ_WRITE_TOKEN;
  for (const f of [".env.local", ".env"]) {
    try {
      const line = readFileSync(f, "utf8").split("\n").find((l) => l.startsWith("BLOB_READ_WRITE_TOKEN="));
      // .env 값에 감싸인 따옴표를 벗긴다. Next.js는 알아서 벗기지만
      // 직접 파싱할 때는 남아서 토큰이 통째로 무효가 된다 (2026-08-24 확인).
      if (line) return line.slice(line.indexOf("=") + 1).trim().replace(/^["']|["']$/g, "");
    } catch {}
  }
  return null;
}

const [prefix, ...files] = process.argv.slice(2);
if (!prefix || !files.length) {
  console.error("사용법: blob_upload.mjs <prefix> <파일...>");
  process.exit(2);
}
const tok = token();
if (!tok) { console.error("BLOB_READ_WRITE_TOKEN 없음"); process.exit(1); }

const urls = [];
for (const f of files) {
  const r = await put(`${prefix}/${basename(f)}`, readFileSync(f), {
    access: "public", token: tok, contentType: "image/png", addRandomSuffix: true,
  });
  urls.push(r.url);
  console.log(" ✓", basename(f), "→", r.url);
}
console.log("\n" + JSON.stringify(urls, null, 2));
