#!/usr/bin/env node
/**
 * 다음에 SNS로 올릴 콘텐츠 후보를 점수로 뽑는다. 하루 이틀에 한 건씩 올리는 루틴의 첫 단계다.
 *
 *   node pick_topic.mjs                # 상위 5개
 *   node pick_topic.mjs --n 8 --json   # JSON으로
 *   node pick_topic.mjs --days 60      # 최근 60일 안에 발행된 글만 (기본 14일. 옛 글은 사용자가 지목할 때만)
 *
 * 점수는 playbook.md P5(개인이 써먹는 글)와 P7(첫 줄 판단/사건, 수치, 지갑 이야기)을 옮긴 것이다.
 * 이미 올린 글(data/sns-log.json)은 뺀다. 점수는 후보를 줄이는 용도이고 최종 선택은 사람이 한다.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import matter from "gray-matter";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..", "..", "..");
const args = process.argv.slice(2);
const opt = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const N = Number(opt("--n", 5));
// 발행 2주가 넘은 글은 올리지 않는다 (2026-08-25 사용자 지시: "이런 옛날 글은 쓰지 않습니다"). --days 0이면 전체.
const DAYS = Number(opt("--days", 14));
const JSON_OUT = args.includes("--json");

const logPath = join(ROOT, ".claude/skills/sns-writer/data/sns-log.json");
const posted = new Set();
if (existsSync(logPath)) {
  const raw = JSON.parse(readFileSync(logPath, "utf8"));
  // 형식이 두 가지다: [{slug:{date,platforms}}, ...] 또는 {slug:{...}} 또는 [{slug:"..."}]
  const walk = (o) => {
    if (!o || typeof o !== "object") return;
    if (Array.isArray(o)) return o.forEach(walk);
    if (typeof o.slug === "string") posted.add(o.slug);
    for (const k of Object.keys(o)) {
      const v = o[k];
      if (v && typeof v === "object" && !Array.isArray(v) && (v.date || v.platforms)) posted.add(k);
      else if (v && typeof v === "object") walk(v);
    }
  };
  walk(raw);
}

// 신호 사전. 제목 + highlights + excerpt에서 센다.
const SIGNALS = [
  { key: "돈 아낌", re: /(무료|가격|요금|인하|비용|만 ?원|달러|\$\d|할인|한도)/g, w: 3, hook: "비용 명시" },
  { key: "직접 돌림", re: /(설치|직접|돌려|실행|해 ?봤|해 ?본|테스트)/g, w: 2, hook: "경험 선언" },
  { key: "도구 판단", re: /(비교|후기|차이|권하지|이유가 없|대신|고르는)/g, w: 2, hook: "판단 선언" },
  { key: "통념 치기", re: /(아니라|아닙니다|줄 알|오해|틀린|반대|생각보다|의외)/g, w: 2, hook: "통념 교정" },
  { key: "사건", re: /(출시|공개|나왔|종료|변경|인상|확정|바뀌)/g, w: 1, hook: "사건 선언" },
];
// 쓰레드에서 읽히지 않는 B2B 방법론 (P5)
const PENALTY = /(업체 선정|업체 찾는|계약|측정 설계|프레임워크|어트리뷰션|전략 정리|조직)/g;

function score(d, body) {
  const text = [d.title, ...(d.highlights || []), d.excerpt || ""].join(" ");
  const hits = [];
  let s = 0;
  for (const sig of SIGNALS) {
    const n = (text.match(sig.re) || []).length;
    if (n) { s += Math.min(n, 2) * sig.w; hits.push(`${sig.key}${n > 1 ? "×" + n : ""}`); }
  }
  const nums = (text.match(/\d[\d,.]*/g) || []).length;
  s += Math.min(nums, 4); if (nums) hits.push(`수치 ${nums}`);
  const pen = (text.match(PENALTY) || []).length;
  if (pen) { s -= 3 * pen; hits.push(`B2B 방법론 -${3 * pen}`); }
  const age = (Date.now() - new Date(d.publishedAt || 0).getTime()) / 86400000;
  if (age <= 14) { s += 2; hits.push("최근 2주"); } else if (age <= 30) { s += 1; hits.push("최근 한 달"); }
  const firstPerson = /(직접 (돌려|설치|만들|해|써)|해 ?봤|돌려 ?봤|재 ?봤|써 ?봤|제 사이트|준이아빠블로그(의|에서|도))/.test(body);
  if (firstPerson) { s += 1; hits.push("1인칭 근거"); }
  const best = SIGNALS.filter((x) => hits.some((h) => h.startsWith(x.key))).sort((a, b) => b.w - a.w)[0];
  return { s, hits, hook: best ? best.hook : "판단 선언 (본문에서 찾을 것)", age: Math.round(age) };
}

const dir = join(ROOT, "content/insights");
const rows = [];
for (const f of readdirSync(dir)) {
  if (!f.endsWith(".md")) continue;
  const { data: d, content } = matter(readFileSync(join(dir, f), "utf8"));
  const slug = d.slug || f.replace(/\.md$/, "");
  if (posted.has(slug)) continue;
  if (DAYS && (Date.now() - new Date(d.publishedAt || 0).getTime()) / 86400000 > DAYS) continue;
  const r = score(d, content);
  rows.push({ slug, title: d.title, category: d.category, score: r.s, signals: r.hits, hook: r.hook, ageDays: r.age });
}
rows.sort((a, b) => b.score - a.score);
const top = rows.slice(0, N);
if (JSON_OUT) { console.log(JSON.stringify(top, null, 2)); process.exit(0); }
console.log(`후보 ${rows.length}편 가운데 상위 ${top.length}편 (이미 올린 ${posted.size}편 제외)\n`);
for (const r of top) {
  console.log(`[${String(r.score).padStart(2)}] ${r.slug}  (${r.category}, ${r.ageDays}일 전)`);
  console.log(`     ${r.title}`);
  console.log(`     신호: ${r.signals.join(", ")}  |  권장 훅: ${r.hook}`);
}
console.log("\n점수는 후보를 줄이는 용도다. 첫 줄을 판단이나 사건으로 열 수 있는지, 첫 편에 수치 셋과 지갑 이야기가 들어가는지는 본문을 열어 사람이 확인한다.");
