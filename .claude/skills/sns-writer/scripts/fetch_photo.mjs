#!/usr/bin/env node
/**
 * 카드뉴스 배경용 실사 이미지 검색과 다운로드. Openverse API(키 불필요)로
 * 상업적 이용 가능한 CC 라이선스 이미지만 가져온다.
 *
 * 사용법 (hongblog 루트에서):
 *   node .claude/skills/sns-writer/scripts/fetch_photo.mjs "<검색어(영문)>" <저장경로.jpg> [--candidates 5]
 *
 * - CC0/PDM(퍼블릭 도메인)을 우선하고, 없으면 CC-BY 계열을 쓴다.
 * - 저장 경로 옆에 <이름>.attribution.json을 만들어 출처와 라이선스를 기록한다.
 *   CC-BY 이미지를 쓴 게시물에는 출처 표기가 필요하므로 이 파일을 반드시 사용자에게 전달한다.
 * - --candidates N을 주면 다운로드 없이 후보 N개의 제목/라이선스/URL만 출력한다(고르기용).
 */
import { writeFileSync } from "node:fs";

const [query, outPath] = process.argv.slice(2);
const candIdx = process.argv.indexOf("--candidates");
const listOnly = candIdx !== -1;
const listN = listOnly ? Number(process.argv[candIdx + 1]) || 5 : 0;

if (!query || (!outPath && !listOnly)) {
  console.error('사용법: fetch_photo.mjs "<검색어>" <저장경로.jpg> | "<검색어>" --candidates 5');
  process.exit(2);
}

const api = new URL("https://api.openverse.org/v1/images/");
api.searchParams.set("q", query);
api.searchParams.set("license_type", "commercial");
api.searchParams.set("page_size", "20");

const res = await fetch(api, { headers: { "User-Agent": "hongblog-sns-writer/1.0" } });
if (!res.ok) {
  console.error(`Openverse 응답 오류: ${res.status}`);
  process.exit(1);
}
const data = await res.json();
const results = (data.results || []).filter((r) => r.url);
if (!results.length) {
  console.error(`검색 결과 없음: ${query}. 더 일반적인 영문 검색어로 다시 시도한다`);
  process.exit(1);
}

// 퍼블릭 도메인 우선, 그다음 CC-BY 계열. 해상도가 낮은 것은 뒤로 보낸다.
const rank = (r) =>
  (["cc0", "pdm"].includes(r.license) ? 0 : r.license === "by" ? 1 : 2) * 10 +
  ((r.width || 0) >= 1200 ? 0 : 5);
results.sort((a, b) => rank(a) - rank(b));

if (listOnly) {
  for (const r of results.slice(0, listN))
    console.log(`${r.license.toUpperCase()} | ${r.width}x${r.height} | ${(r.title || "").slice(0, 40)} | ${r.url}`);
  process.exit(0);
}

let picked = null;
for (const r of results.slice(0, 6)) {
  try {
    const img = await fetch(r.url, { headers: { "User-Agent": "hongblog-sns-writer/1.0" } });
    if (!img.ok) continue;
    const buf = Buffer.from(await img.arrayBuffer());
    if (buf.length < 30_000) continue; // 썸네일 수준은 배경으로 못 쓴다
    writeFileSync(outPath, buf);
    picked = r;
    break;
  } catch {
    continue;
  }
}
if (!picked) {
  console.error("다운로드 실패. --candidates로 목록을 보고 다른 검색어를 시도한다");
  process.exit(1);
}

const attribution = {
  query,
  title: picked.title || "",
  creator: picked.creator || "",
  license: picked.license,
  license_url: picked.license_url || "",
  source_page: picked.foreign_landing_url || "",
  attribution_text: picked.attribution || "",
};
writeFileSync(outPath.replace(/\.[a-z]+$/i, "") + ".attribution.json", JSON.stringify(attribution, null, 2));
console.log(`saved: ${outPath} (${picked.license.toUpperCase()}, ${picked.width}x${picked.height})`);
if (!["cc0", "pdm"].includes(picked.license))
  console.log(`주의: ${picked.license.toUpperCase()} 라이선스라 게시물에 출처 표기가 필요하다. attribution.json 참고`);
