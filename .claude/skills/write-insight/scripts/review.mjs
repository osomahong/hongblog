#!/usr/bin/env node
/**
 * 글 완료 후 검수 게이트를 한 명령으로 묶는다.
 *
 * 만든 이유: write-insight 스킬은 hongblog 프로젝트 스코프라 다른 작업 디렉터리에서
 * 열리지 않는다. 스킬이 안 열리면 4단계 검수 절차를 아무도 강제하지 않고, 저장 훅이
 * 내보내는 "통과" 문구를 검수 완료로 착각하게 된다. 2026-09-14과 09-15에 같은 일이
 * 두 번 났다. 그래서 cwd와 무관하게 도는 스크립트로 옮겼다.
 *
 *   node <이 파일 절대경로> content/insights/<slug>.md
 *
 * 1단계 기계 검수 세 종을 돌리고, 2단계로 정규식이 놓쳤던 항목을 따로 훑고,
 * 3단계 낭독 점검표와 4단계 안내를 출력한다. 1~2단계에서 걸리면 비정상 종료한다.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve, isAbsolute } from "node:path";
import { createHash } from "node:crypto";

const ROOT = "/Users/hsh/Documents/00_project/hongblog";
const arg = process.argv[2];
if (!arg) {
  console.error("사용법: review.mjs <content/insights/slug.md>");
  process.exit(2);
}
const rel = isAbsolute(arg) ? arg.replace(`${ROOT}/`, "") : arg;
const abs = isAbsolute(arg) ? arg : resolve(ROOT, arg);
if (!existsSync(abs)) {
  console.error(`파일을 찾지 못했습니다: ${abs}`);
  process.exit(2);
}

const run = (cmd, args) => {
  try {
    return { ok: true, out: execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8" }) };
  } catch (e) {
    return { ok: false, out: `${e.stdout || ""}${e.stderr || ""}` };
  }
};
const hardCount = (out) => {
  const m = out.match(/HARD\s*(\d+)\s*건/);
  return m ? Number(m[1]) : (/\[HARD\]/.test(out) ? 1 : 0);
};

let failed = 0;
console.log(`검수 대상: ${rel}\n`);
console.log("═".repeat(64));
console.log("1단계. 기계 검수");
console.log("═".repeat(64));

const machine = [
  ["번역투와 금지 기호", "npm", ["run", "check:prose", "--", rel]],
  ["문어체와 추상 표현", "node", [".claude/skills/prose-inspector/scripts/check-literary.mjs", rel]],
  ["3줄 요약 규칙", "npm", ["run", "check:summary3", "--", rel]],
];
for (const [label, cmd, args] of machine) {
  const r = run(cmd, args);
  const n = hardCount(r.out);
  console.log(`  ${n === 0 ? "o" : "x"} ${label.padEnd(20)} HARD ${n}건`);
  if (n > 0) {
    failed += n;
    console.log(r.out.split("\n").filter((l) => /\[HARD\]|\[SOFT\]|\[WARN\]/.test(l)).map((l) => `      ${l.trim()}`).join("\n"));
  }
}

console.log(`\n${"═".repeat(64)}`);
console.log("2단계. hongblog 글쓰기 지침 교정 (정규식이 놓쳤던 항목)");
console.log("═".repeat(64));

const text = readFileSync(abs, "utf8");
// 전부 실제로 기계 검수를 통과한 채 배포 직전까지 갔던 것들이다. 활용형까지 함께 본다.
const extra = [
  [/먹힌|먹히|먹혔|먹힐/g, "먹히다 금지: 무엇이 통했는지 대상을 밝힌다 (prose-rules 4절)"],
  [/읽힙니다|읽혔|읽힐|읽히는 대목/g, "해석을 피동으로 숨김: ~로 보입니다, ~라는 뜻입니다 (3절)"],
  [/사이클/g, "추상 표현: 주기, 바퀴, 처음부터 끝까지 (4절)"],
  [/갈래|갈리|갈라지/g, "추상 표현: 가지, 종류, 나뉘다, 달라지다 (4절)"],
  [/손보|손대|손이 가|손에 익/g, "손 은유 금지: 고치다, 바꾸다, 익숙해지다 (4절)"],
  // 일자리, 그 자리에서, 자리를 비우다처럼 실제 위치를 뜻하는 일상어는 4절 대상이 아니다.
  [/(?<!일)(?<![가-힣])자리(에|를|가|는|입니다|이다)(?!\s*비[우운웠울워])/g, "도구·환경·화면을 자리로 부르지 않는다: 작업 공간, 환경, 화면 (4절)"],
  [/도해/g, "도해 금지: 이미지, 그림 (4절)"],
  [/독자|당신/g, "2인칭: 여러분, 이 글을 읽는 분들 (4절)"],
  [/셈입니다|셈이라|셈이다/g, "설명조 종결 (writing-craft 1절)"],
  [/비슷합니다|보면 됩니다/g, "설명조 종결 (writing-craft 1절)"],
  [/놀랍|혁명적|획기적|마법|차원이 다른|엄청나게|순식간/g, "과장 은유 (4절)"],
  [/모아 봤|추렸|바꿔 봤/g, "1인칭 수집 표현 금지: 정리했습니다 (5절)"],
  [/알아보세요|확인하세요|시작해 보세요|상상해 보세요|기억해 두세요/g, "행동 유도·AI식 지시문 (3절, 6절)"],
  [/(로이터|비즈니스 인사이더|블룸버그|포브스|테크크런치)(는|가|에|도)/g, "출처 강박: 언론사명을 본문에 일일이 적지 않는다 (5절)"],
  [/[—·…]/g, "금지 기호 (1절)"],
];
let extraHit = 0;
for (const [re, msg] of extra) {
  const hits = [...text.matchAll(re)];
  if (!hits.length) continue;
  extraHit += hits.length;
  const lineOf = (i) => text.slice(0, i).split("\n").length;
  const lines = [...new Set(hits.map((h) => lineOf(h.index)))].slice(0, 6);
  console.log(`  x ${msg}`);
  console.log(`      ${hits.length}건, 줄 ${lines.join(", ")}`);
}
if (!extraHit) console.log("  o 걸리는 항목 없음");
failed += extraHit;

console.log(`\n${"═".repeat(64)}`);
console.log("3단계. 낭독 검수 (사람이 직접 읽는다. 스크립트가 대신하지 못한다)");
console.log("═".repeat(64));
console.log(`
  읽는 범위는 본문만이 아니다. 아래를 전부 포함한다.
    frontmatter (excerpt, summary3, highlights, metaDescription, ogDescription, quiz)
    표 셀, 이미지 alt, 이미지 앞뒤 문장의 호응

  한 문장씩 보며 확인할 것
    [ ] 주어와 서술어가 맞물리는가 (그 주어가 그 동사를 할 수 있는가)
    [ ] 무생물이 주어인데 타동사를 쓰지 않았는가 (이 대목이 소문을 키웠습니다)
    [ ] 주어나 목적어가 빠져 되묻게 되는 자리가 없는가
    [ ] 명사와 서술어의 궁합이 맞는가 (이야기가 얇다, 품을 없애다)
    [ ] 지시어(이, 그것)의 대상이 바로 앞에서 하나로 정해지는가
    [ ] 중심 비유가 하나이고 곁가지 비유를 두 번 쓰지 않았는가
    [ ] 같은 종결이 인접 문장에 반복되지 않는가
    [ ] 그 문장만 떼어 읽었을 때 뜻이 한 번에 잡히는가
    [ ] highlights와 summary3의 논리가 본문과 뒤집혀 있지 않은가

  판단 기준: 평범한 사람이 동료에게 말할 때 자연스러운가, 신문 사설처럼 들리는가

4단계. 다중 에이전트 순차 검수 (SKILL.md 4-4, 생략 불가)
  references/review-agents.md를 먼저 열고 general-purpose 에이전트 셋을 순서대로 돌린다.
  1 지침 준수 / 2 낭독 / 3 최종. 각 에이전트는 찾기만 하고 고치지 않는다.
`);

console.log("═".repeat(64));
if (failed > 0) {
  console.log(`1~2단계에서 ${failed}건 걸렸습니다. 고친 뒤 다시 돌립니다.`);
  process.exit(1);
}
console.log("1~2단계 통과.");

console.log("3단계 낭독과 4단계 에이전트 검수는 사람이 수행합니다. 점검표는 위에 있습니다.");
