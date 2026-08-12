#!/usr/bin/env node
/**
 * SNS 카피 규격 검사. 작성 후 내보내기 전에 돌린다.
 *
 * 사용법:
 *   node check_copy.mjs threads   <파일 또는 - (stdin)>
 *   node check_copy.mjs instagram <파일 또는 - (stdin)>
 *
 * 쓰레드 체인은 한 파일에 `---` 줄로 편을 구분해 담으면 편별로 검사한다.
 * 첫 편은 훅(250자 안팎), 나머지는 본문 편(200~450자)으로 본다.
 *
 * 사람이 눈으로 세기 번거로운 것만 본다: 글자 수, 해시태그, 이모지, 느낌표,
 * 금지 표현, 어미 3연속, 반말 종결. 훅이 좋은지 같은 판단은 사람 몫이다.
 */
import { readFileSync } from "node:fs";

const SPEC = {
  threads: { max: 500, target: [120, 350], hookTarget: [100, 280], tags: 1 },
  instagram: { max: 2200, preview: 125, target: [125, 800], tags: 5 },
  linkedin: { max: 3000, preview: 200, target: [400, 900], tags: 5 },
};

// 정보성 계정은 합쇼체를 쓴다. 반말 종결이 보이면 잡는다.
// "입니다/습니다"는 '니다'로 끝나므로 [^니]다 패턴에 걸리지 않는다.
const CASUAL = /(?:[^니]다|더라|거든|잖아|이야|없음|같음)[.?!]$/;

const BANNED = [
  [/[—–]/, "줄표(—) 사용. 쉼표나 마침표로 끊는다"],
  [/·/, "가운뎃점 사용. 쉼표나 슬래시로 바꾼다"],
  [/…/, "말줄임표 사용"],
  [/에 대(해|한|해서)\s/, "번역투: ~에 대해 → 조사로 직접 연결"],
  [/[을를] 통해/, "번역투: ~을 통해 → ~로"],
  [/중 하나(입니다|이다|다\b)/, "번역투: ~중 하나입니다"],
  [/에 의해\s/, "번역투: ~에 의해"],
  [/(되어지|보여집니다|여겨집니다)/, "이중 피동"],
  [/(혁명적|획기적|게임체인저|차원이 다른|완전히 새로운)/, "과장 표현"],
  [/(놀랍게도|놀라운|마법처럼|상상을 초월)/, "과장 표현"],
  [/(상상해 보세요|떠올려 보세요|기억해 두세요|주목해 주세요)/, "AI식 지시문"],
  [/(놓치지 마세요|지금 바로 확인|무료로 받아 가세요)/, "광고 문구"],
  [/(이것만 알면|모르면 손해|충격적인|1분이면 끝)/, "뻔한 훅"],
  [/혹시 이런 경험/, "뻔한 훅: 질문형 도입"],
  [/컨텐츠/, "맞춤법: 콘텐츠"],
  [/메세지/, "맞춤법: 메시지"],
];

const platform = process.argv[2];
const src = process.argv[3];
if (!SPEC[platform] || !src) {
  console.error("사용법: check_copy.mjs <threads|instagram|linkedin> <파일|->");
  process.exit(2);
}
const raw = (src === "-" ? readFileSync(0, "utf8") : readFileSync(src, "utf8")).trim();
const spec = SPEC[platform];

// 쓰레드는 `---` 줄로 편을 나눈다. 인스타는 항상 한 편.
const parts =
  platform === "threads"
    ? raw.split(/^---+$/m).map((s) => s.trim()).filter(Boolean)
    : [raw];

let failed = 0;

parts.forEach((text, idx) => {
  const issues = [];
  const notes = [];
  const isHook = platform === "threads" && idx === 0;
  const label =
    platform === "threads"
      ? isHook
        ? "훅"
        : `${idx}/`
      : platform === "linkedin"
        ? "본문"
        : "캡션";
  const target = isHook ? spec.hookTarget : spec.target;

  // 링크는 쓰레드에서 글자 수에 포함되지 않는다
  const withoutLinks = text.replace(/https?:\/\/\S+/g, "");
  const len = [...(platform === "threads" ? withoutLinks : text)].length;
  notes.push(`글자 수 ${len}자 (상한 ${spec.max}, 권장 ${target[0]}~${target[1]})`);
  if (len > spec.max) issues.push(`상한 초과: ${len}자 > ${spec.max}자`);
  else if (len > target[1]) notes.push("권장 범위보다 김. 지루해질 수 있으니 줄인다");
  else if (len < target[0]) notes.push("권장 범위보다 짧음. 더 풀어 쓸 수 있는지 본다");

  const hashtags = text.match(/#[^\s#]+/g) || [];
  if (platform === "threads") {
    if (hashtags.length)
      issues.push(`쓰레드 본문에 '#'을 쓰지 않는다. 태그는 따로 안내한다 (${hashtags.join(" ")})`);
  } else if (hashtags.length > spec.tags) {
    issues.push(`해시태그 ${hashtags.length}개 > 상한 ${spec.tags}개`);
  } else {
    notes.push(`해시태그 ${hashtags.length}개`);
    const roots = hashtags.map((h) => h.slice(1, 4));
    const dup = roots.filter((r, i) => roots.indexOf(r) !== i);
    if (dup.length) issues.push(`어근이 겹치는 해시태그 (${dup.join(", ")}). 하나만 남긴다`);
  }

  // 번호 규칙: 본문 편은 N/ 으로 시작한다
  if (platform === "threads" && !isHook && !/^\d+\//.test(text))
    issues.push(`본문 편은 "${idx}/ "로 시작한다`);

  if (spec.preview) {
    const first = text.split("\n")[0];
    notes.push(`첫 줄 ${[...first].length}자 (더보기 전 노출 약 ${spec.preview}자)`);
    if ([...first].length > spec.preview)
      issues.push(`첫 줄이 ${[...first].length}자로 잘린다. ${spec.preview}자 안에서 끝낸다`);
  }
  if (platform === "instagram" && /https?:\/\//.test(text))
    issues.push("인스타에는 링크를 넣지 않는다 (클릭 불가). 저장 유도로 바꾼다");

  // 링크 추적 파라미터 확인
  const REF = { threads: "ref=thd", linkedin: "ref=lkdn" };
  const links = text.match(/https?:\/\/[^\s]+/g) || [];
  if (REF[platform])
    for (const l of links)
      if (l.includes("digitalmarketer.co.kr") && !l.includes(REF[platform]))
        issues.push(`블로그 링크에 ?${REF[platform]} 파라미터가 없다 (${l})`);

  // 합쇼체 확인. 🧵 예고와 번호 표기는 제외하고 문장 종결만 본다
  const sentences = text
    .replace(/https?:\/\/\S+/g, "")
    .split(/[\n.]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && !/^\d+\/$/.test(s));
  const casual = sentences.filter((s) => CASUAL.test(s + "."));
  if (casual.length)
    issues.push(`반말 종결로 보이는 문장 ${casual.length}건. 합쇼체로 바꾼다 ("${casual[0].slice(-18)}")`);

  // 🧵는 스레드 예고 관례라 이모지 집계에서 뺀다
  const emoji = (text.match(/\p{Extended_Pictographic}/gu) || []).filter((e) => e !== "\u{1F9F5}");
  if (emoji.length > 2) issues.push(`이모지 ${emoji.length}개 > 2개. ${emoji.join("")}`);
  else if (emoji.length) notes.push(`이모지 ${emoji.length}개`);

  const bangs = (text.match(/!/g) || []).length;
  if (bangs > 1) issues.push(`느낌표 ${bangs}개 > 1개`);

  for (const [re, msg] of BANNED) {
    const m = text.match(re);
    if (m) issues.push(`${msg} ("${m[0].trim()}")`);
  }

  const endings = text
    .split(/[.!?\n]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.slice(-3));
  for (let i = 0; i + 2 < endings.length; i++) {
    if (endings[i] && endings[i] === endings[i + 1] && endings[i] === endings[i + 2]) {
      issues.push(`같은 어미 3연속: "${endings[i]}"`);
      break;
    }
  }

  console.log(`[${platform} ${label}]`);
  for (const n of notes) console.log(`  - ${n}`);
  if (issues.length) {
    failed += issues.length;
    for (const i of issues) console.log(`  x ${i}`);
  }
  console.log("");
});

if (platform === "threads") {
  console.log(`체인 ${parts.length}편 (훅 1 + 본문 ${parts.length - 1})`);
  if (parts.length < 3)
    console.log("  - 본문 편이 2개 미만이다. 소재가 부족한지 본다");
  if (parts.length > 5)
    console.log("  - 본문 편이 4개를 넘는다. 지루해질 수 있으니 합치거나 버릴 편을 본다");
}
if (failed) {
  console.log(`\n위반 ${failed}건. 고쳐서 통과시킨 뒤 내보낸다.`);
  process.exit(1);
}
console.log("통과. 규격 위반 없음 (두괄식과 사실 확인은 사람이 본다)");
