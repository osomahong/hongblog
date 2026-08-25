#!/usr/bin/env node
/**
 * 카드뉴스·썸네일 글자 검사. make_cards.mjs와 make_thumb.mjs가 그리기 전에
 * 자동으로 부른다. 따로 돌릴 수도 있다.
 *
 *   node check_cards.mjs <cards.json>
 *   node check_cards.mjs --text "제목" "부제"        # 썸네일 인자 검사
 *
 * 왜 따로 있나 (2026-08-24)
 *   카드 글자는 hongblog 문체 게이트 밖에 있었다. check-literary는 문어체
 *   어휘만 보고, 카드에서 실제로 깨지는 것은 문체 규칙과 주어 누락이다.
 *   GA4 교육 카드에서 "화면이 처음이면 초급"처럼 무엇의 화면인지 없는 줄이
 *   그대로 나갔다.
 *
 * 문체: 라벨은 그대로, 제목은 명사구, 본문은 간결한 합쇼체 (2026-08-24 갱신)
 *   처음에는 개조식(명사형 종결)으로 정했다가, 실제로 나온 카드가 문장이
 *   뚝뚝 끊겨 읽힌다는 지적을 받고 뒤집었다. 이제 필드 성격에 따라 다르게 본다.
 *   - kicker, number: 라벨이다. 문장이 아니므로 종결 규칙을 적용하지 않는다
 *   - title, heading: hongblog 헤딩 관례대로 명사구로 쓴다 (마침표·종결어미 없음)
 *   - body, cta, note, highlight: 간결한 합쇼체 문장이다. "습니다/니다"로
 *     끝나는 완결된 문장이어야 한다. 개조식 잔재(명사형 종결)나 해요체가
 *     섞이면 잡는다
 *
 * 두 층으로 본다
 *   1. hongblog 공용 문어체 사전 (prose-inspector/check-literary.mjs를 그대로 부른다)
 *      사전은 한 곳에만 둔다. 여기서 따로 만들지 않는다.
 *   2. 카드 전용 문체 규칙 (아래 RULES, 필드 성격별)
 *
 * 판단이 필요한 것(주어가 정말 빠졌는지, 낭독했을 때 걸리는지)은 사람 몫이라
 * 마지막에 낭독 검수 항목을 찍어 준다.
 */
import { readFileSync, writeFileSync, existsSync, mkdtempSync } from "node:fs";
import { join, dirname } from "node:path";
import { tmpdir } from "node:os";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { wrap } from "./lib/layout.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const LITERARY = join(HERE, "../../prose-inspector/scripts/check-literary.mjs");

// 필드 성격 분류. LABEL은 문장이 아니라 그냥 넘긴다.
const LABEL = new Set(["kicker", "number"]);
const PHRASE = new Set(["title", "heading"]);
// 나머지(body, cta, note, highlight)는 SENTENCE로 본다.

// 모든 필드 공통 (라벨 포함).
const COMMON_RULES = [
  { re: /[—–·…]/, sev: "HARD", msg: "금지 기호", fix: "쉼표나 줄바꿈으로" },
];

// 제목·헤딩: hongblog 헤딩 관례대로 명사구. 마침표나 종결어미로 닫지 않는다.
const PHRASE_RULES = [
  { re: /[.]$/, sev: "HARD", msg: "마침표 종결. 제목·헤딩은 명사구로 쓴다", fix: "마침표를 뺀다" },
  { re: /\?$/, sev: "HARD", msg: "질문형 종결. 카드 제목과 소제목은 명사형 선언으로 쓴다", fix: "명사구로 (…하는 법, …인 이유)" },
  { re: /(습니다|입니다|합니다|됩니다|해요|세요|어요|예요)\s*[.!?]?$/, sev: "HARD", msg: "종결어미로 끝난 헤딩. 헤딩은 문장이 아니라 명사구다", fix: "명사구로 (…하는 이유, …만든 화면)" },
  // 조사 종결. 한 글자 조사(은/는/이/가/도/로)는 명사의 끝 음절과 겹친다.
  // `차이`, `속도`, `정도`, `사이`를 조사로 잘못 읽어 멀쩡한 명사구를 막았다
  // (2026-08-24). 그래서 겹치지 않는 조사만 HARD로 두고 나머지는 WARN으로 내린다.
  { re: /(을|를|에|에서|으로|부터|까지|처럼|보다|만)$/, sev: "HARD", msg: "조사로 끝나 문장이 끊겨 보인다", fix: "그 줄에서 끝맺거나 다음 말을 붙인다" },
  { re: /(?<=\s\S{1,6})(은|는|이|가|도|로|과|와|의)$/, sev: "WARN", msg: "조사로 끝난 것처럼 읽힐 수 있다 (명사의 끝 음절이면 무시한다)", fix: "조사가 맞다면 그 줄에서 끝맺는다" },
];

// 본문·강조·마무리: 간결한 합쇼체 문장. 개조식 잔재(명사형 종결)와 해요체를 잡는다.
const SENTENCE_RULES = [
  { re: /(?<!있|없|만들|이루|해내|일으키|더하|줄이)(음|함)$/, sev: "HARD", msg: "명사형 종결(개조식 잔재). 합쇼체 문장으로 닫는다", fix: "…습니다/…합니다로" },
  { re: /(해요|세요|어요|아요|예요|네요|이에요|거예요)\s*[.!?]?$/, sev: "HARD", msg: "해요체 종결. 카드 문장은 합쇼체로 통일한다", fix: "…습니다/…합니다로" },
  { re: /(을|를|에|에서|으로|부터|까지|처럼|보다|만)$/, sev: "HARD", msg: "조사로 끝나 문장이 끊겼다", fix: "합쇼체로 문장을 맺는다" },
  // 연결어미로 끝나면 뒷말을 기다리게 된다. 카드에는 뒷말이 없다.
  { re: /(?:어서|아서|해서|면서|는데|지만|니까|다가|도록|려고|므로|든지)$/, sev: "HARD", msg: "연결어미로 끝나 뒷말을 기다리게 된다", fix: "그 자리에서 합쇼체로 문장을 맺는다" },
];

// SENTENCE 필드는 이 꼴로 끝나야 한다. 위 부정 규칙을 다 피해도 이 꼴이
// 아니면(예: 영단어로 끝나거나 다른 어미로 얼버무리면) 잡는다.
// 합쇼체 평서형은 어간이 뭐든 전부 "니다"로 끝난다(합니다/습니다/됩니다/입니다/
// 갑니다...). "습니다"만 찾으면 "못합니다"의 "합니다"를 놓친다.
const HAPSYO_ENDING = /니다\s*[.]?$/;
// cover의 cta는 클레임 문장이 아니라 "넘겨서 보기 →" 같은 넘김 안내다.
// 화살표로 끝나는 짧은 탐색 안내는 문장 규칙에서 뺀다.
const NAV_HINT = /→\s*$/;

// 개체가 하나도 없는 카드는 무엇에 관한 말인지 알 수 없다.
// 영문 낱말, 숫자, 또는 등록한 고유명사 중 하나는 있어야 한다.
const ENTITY = /[A-Za-z]{2,}|\d|구글|네이버|앤트로픽|클로드|메타|준이아빠블로그/;

const args = process.argv.slice(2);
if (!args.length) {
  console.error('사용법: check_cards.mjs <cards.json> | --text "제목" "부제" ...');
  process.exit(2);
}

/** 검사 대상: {group, field, text} 목록 */
function collect() {
  if (args[0] === "--text") {
    // make_thumb.mjs가 (kicker, title, sub) 순서로 넘긴다. 필드명을 그대로
    // 매겨야 kicker는 라벨로, title은 명사구로, sub는 문장으로 검사된다.
    const names = ["kicker", "title", "sub"];
    return args.slice(1).filter(Boolean).map((text, i) => ({ group: "썸네일", field: names[i] || `인자${i + 1}`, text }));
  }
  const { cards } = JSON.parse(readFileSync(args[0], "utf8"));
  const out = [];
  cards.forEach((c, i) => {
    const group = `카드 ${i + 1} (${c.type})`;
    for (const field of ["kicker", "title", "heading", "body", "cta", "note", "highlight"]) {
      if (c[field]) out.push({ group, field, text: String(c[field]), card: i });
    }
  });
  return out;
}

const items = collect();
let hard = 0, warn = 0;

// ── 1층: hongblog 공용 문어체 사전 ────────────────────────────────────────
const tmp = join(mkdtempSync(join(tmpdir(), "cards-")), "card-text.md");
writeFileSync(tmp, items.map((it) => it.text).join("\n") + "\n");
if (existsSync(LITERARY)) {
  try {
    execFileSync("node", [LITERARY, tmp], { stdio: "inherit" });
  } catch {
    hard += 1; // check-literary가 HARD로 죽으면 여기서도 실패로 본다
    console.log("");
  }
} else {
  console.log(`[WARN] 공용 문어체 사전을 찾지 못했습니다: ${LITERARY}`);
}

// ── 2층: 카드 전용 문체 규칙 (필드 성격별) ────────────────────────────────
console.log("── 문체 검사 ──");
for (const it of items) {
  const kind = LABEL.has(it.field) ? "label" : PHRASE.has(it.field) ? "phrase" : "sentence";
  const ruleSets = kind === "label" ? [COMMON_RULES] : kind === "phrase" ? [COMMON_RULES, PHRASE_RULES] : [COMMON_RULES, SENTENCE_RULES];

  for (const line of it.text.split("\n").map((l) => l.trim()).filter(Boolean)) {
    let matched = false;
    for (const set of ruleSets) {
      for (const r of set) {
        if (!r.re.test(line)) continue;
        matched = true;
        console.log(`[${r.sev}] ${it.group} ${it.field}: "${line}"`);
        console.log(`    ${r.msg} -> ${r.fix}`);
        if (r.sev === "HARD") hard++;
        else warn++;
      }
    }
    // SENTENCE인데 부정 규칙에 안 걸렸어도 합쇼체 종결이 아니면 잡는다.
    // 단 "넘겨서 보기 →" 같은 탐색 안내는 예외다.
    if (kind === "sentence" && !matched && !NAV_HINT.test(line) && !HAPSYO_ENDING.test(line)) {
      console.log(`[HARD] ${it.group} ${it.field}: "${line}"`);
      console.log("    합쇼체 종결이 아닙니다 -> …습니다/…입니다로 문장을 맺습니다");
      hard++;
    }
  }
}

// ── 3층: 개체 유무와 줄바꿈 ───────────────────────────────────────────────
if (args[0] !== "--text") {
  const byCard = new Map();
  for (const it of items) {
    if (!byCard.has(it.card)) byCard.set(it.card, []);
    byCard.get(it.card).push(it.text);
  }
  for (const [i, texts] of byCard) {
    if (!ENTITY.test(texts.join(" "))) {
      console.log(`[WARN] 카드 ${i + 1}: 개체가 없어 무엇에 관한 말인지 카드만 봐서는 모릅니다`);
      console.log(`    ${JSON.stringify(texts.join(" / ").slice(0, 60))} -> 대상 이름(GA4, 클로드 코드 등)을 넣습니다`);
      warn++;
    }
  }
}

// 실제 렌더 폭으로 줄을 나눠 보고, 마지막 줄에 두 글자 이하가 홀로 남는지 본다.
for (const it of items) {
  const size = it.field === "body" ? 56 : 70;
  const lines = wrap(it.text, size, 920, it.field === "body" ? 600 : 800);
  const orphan = lines.length > 1 && [...lines[lines.length - 1]].length <= 2;
  if (orphan) {
    console.log(`[WARN] ${it.group} ${it.field}: 마지막 줄에 "${lines[lines.length - 1]}"만 남습니다`);
    console.log("    문장을 다시 짜거나 줄바꿈을 직접 넣습니다");
    warn++;
  }
}

console.log(`\n합계: HARD ${hard}건 / WARN ${warn}건`);
console.log(`
낭독 검수 (기계가 못 보는 것, 사람이 소리 내어 읽는다)
  1. 주어 확인. "화면이 처음이면"의 화면이 무엇의 화면인지 카드만 보고 아는지 본다
  2. 주어와 서술어의 호응 확인
  3. 그 목적어에 실제로 쓰는 동사인지 확인 ("목록을 펴기" X, "목록 열기" O)
  4. 조사 확인. 은/는과 이/가를 바꿔 읽어도 뜻이 같으면 조사가 헐거운 것이다
  5. 카드를 순서대로 이어 읽어 말이 되는지 확인`);

if (hard > 0) {
  console.error("\nHARD가 있습니다. 고친 뒤 다시 검사하세요.");
  process.exit(1);
}
