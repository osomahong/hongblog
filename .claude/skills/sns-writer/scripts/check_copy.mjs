#!/usr/bin/env node
/**
 * SNS 카피 규격 검사. 작성 후 내보내기 전에 돌린다.
 *
 * 사용법:
 *   node check_copy.mjs threads   <파일 또는 - (stdin)>
 *   node check_copy.mjs linkedin  <파일 또는 - (stdin)>
 *   node check_copy.mjs instagram <파일 또는 - (stdin)>
 *
 * 쓰레드 체인은 한 파일에 `---` 줄로 편을 구분해 담으면 편별로 검사한다.
 * 첫 편은 훅(250자 안팎), 나머지는 본문 편(120~350자)으로 본다.
 *
 * 사람이 눈으로 세기 번거로운 것만 본다: 글자 수, 해시태그, 이모지, 느낌표,
 * 금지 표현, 어미 3연속, 반말 종결, utm 파라미터, 첫 줄 질문, 마지막 질문.
 * 훅이 좋은지 같은 판단은 사람 몫이다.
 */
import { readFileSync, existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";

const SPEC = {
  threads: { max: 500, target: [120, 350], hookTarget: [100, 280], tags: 1 },
  instagram: { max: 2200, preview: 125, target: [125, 800], tags: 5 },
  linkedin: { max: 3000, preview: 200, target: [500, 700], tags: 5 },
};

// 반말 종결은 어느 채널에도 쓰지 않는다. 종결의 기본값은 채널마다 다르다:
// 쓰레드는 해요체(판단 한 줄만 합쇼체), 링크드인은 합쇼체, 인스타는 해요체.
// 그 층은 hongsh-voice의 check_voice.mjs가 본다 (아래에서 반드시 호출한다).
// "입니다/습니다"는 '니다'로 끝나므로 [^니]다 패턴에 걸리지 않는다.
const CASUAL = /(?:[^니]다|더라|거든|잖아|이야|없음|같음)[.?!]$/;
// 음슴체("~음", "~함", "~임")도 반말이다. 2026-08-25 사용자 결정: 존대로 충분히 SNS 스타일이 된다.
const CASUAL_THREADS = /(?:[^니]다|더라|거든|잖아|이야|없음|같음|[가-힣][음함임])[.?!]$/;

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
  // 좋아요 요구는 주는 것이 없어 미끼로 읽힌다. 댓글 유도는 2026-08 실측에서
  // 가치 교환형이 답글 551개를 만들어 허용한다 (platforms.md 참고).
  [/좋아요\s*(눌러|부탁|한\s*번)/, "좋아요 요구는 미끼로 읽힌다. 주는 것이 있는 문장으로 바꾼다"],
  [/(팔로우|구독)\s*(하고|누르고)\s*가세요/, "일방적 요구. 무엇을 올리는 계정인지 함께 말한다"],
  [/여러분(의)?\s*(생각|의견)/, "미끼성 질문. 경험을 묻거나 줄 것을 제시한다"],
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

  // 링크 추적 파라미터 확인. SNS 카피는 채널별 ref 하나만 붙인다.
  // GA4가 page_location의 ref 값을 직접 읽으므로 utm은 쓰지 않는다.
  const REF = { threads: "ref=thd", linkedin: "ref=lkdn" };
  const links = text.match(/https?:\/\/[^\s]+/g) || [];
  if (REF[platform])
    for (const l of links) {
      if (!l.includes("digitalmarketer.co.kr")) continue;
      if (/utm_[a-z]+=/.test(l))
        issues.push(`utm 파라미터는 쓰지 않는다. 채널별 ${REF[platform]} 하나만 붙인다 (${l})`);
      else if (!l.includes(REF[platform]))
        issues.push(`블로그 링크에 ${REF[platform]} 파라미터가 없다 (${l})`);
    }

  // 첫 줄 질문은 즉답 구조면 허용한다 (2026-08-23 실측). 답이 없는 질문만 막는다.
  const bodyLines = text.replace(/^\d+\/\s*/, "").split("\n").map((l) => l.trim()).filter(Boolean);
  const firstLine = bodyLines[0] || "";
  if (/[?？]\s*$/.test(firstLine) && (isHook || platform !== "threads")) {
    const HOLLOW = /(아셨나요|아세요|해 ?보신 적|있으신가요|궁금하지 ?않)/;
    const answer = bodyLines[1] || "";
    if (HOLLOW.test(firstLine))
      issues.push(`감추는 질문으로 열었다. 수치를 박거나 사실로 연다 ("${firstLine.slice(0, 24)}")`);
    else if (!/\d/.test(firstLine) && !/\d/.test(answer))
      issues.push(`질문으로 열었는데 다음 줄에 답이 될 수치가 없다. 답을 바로 주거나 질문을 버린다`);
  }

  // 합쇼체 확인. 🧵 예고와 번호 표기는 제외하고 문장 종결만 본다
  const sentences = text
    .replace(/https?:\/\/\S+/g, "")
    .split(/[\n.]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 3 && !/^\d+\/$/.test(s));
  const casual = sentences.filter((s) => (platform === "threads" ? CASUAL_THREADS : CASUAL).test(s + "."));
  if (casual.length)
    issues.push(`반말 종결로 보이는 문장 ${casual.length}건. 쓰레드는 해요체, 링크드인은 합쇼체로 바꾼다 ("${casual[0].slice(-18)}")`);

  // 이모지는 채널 불문 거의 쓰지 않는다. 쓰레드는 🧵 예고까지 포함해 0개가 기준이다 (hongsh-voice 00-voice-card)
  const emoji = text.match(/\p{Extended_Pictographic}/gu) || [];
  if (platform === "threads" && emoji.length) issues.push(`쓰레드에 이모지 ${emoji.length}개. 🧵 예고까지 전부 뺀다 (${emoji.join("")})`);
  else if (emoji.length > 1) issues.push(`이모지 ${emoji.length}개 > 1개. ${emoji.join("")}`);
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

// 답글이 도달을 만든다. 마지막에 열린 질문이 하나 있어야 한다
// 경험 질문형과 가치 교환형 둘 다 인정한다. 어느 쪽이 나은지는 playbook 실험으로 가린다.
const ASK_EXPERIENCE = /(궁금합니다|계실까요|계신가요|계신지|싶습니다|있을까요|어떠신지|막히셨는지|쓰고 계신)/;
const ASK_EXCHANGE = /댓글[^.\n]{0,20}(드리|보내|남겨\s*주시면|알려\s*드)/;
const QUESTION = new RegExp(`${ASK_EXPERIENCE.source}|${ASK_EXCHANGE.source}`);
if (platform === "threads" || platform === "linkedin") {
  const last = parts[parts.length - 1];
  if (!QUESTION.test(last))
    console.log(
      platform === "threads"
        ? "  - 마지막 편에 열린 질문이 없다. 답글이 도달을 만드므로 경험을 묻는 한 줄을 넣는다"
        : "  - 마지막에 열린 질문이 없다. 댓글이 도달을 만드므로 업무 경험을 묻는 한 줄을 넣는다",
    );
}

// 사용자 시그니처 접속어. 링크드인은 판단 문단이 핵심이라 특히 챙긴다
if (platform === "linkedin") {
  const SIG = ["다만", "대신", "실제로"];
  const found = SIG.filter((w) => raw.includes(w));
  if (!found.length)
    console.log(
      '  - "다만", "대신", "실제로"가 하나도 없다. 판단을 담는 문단이 빠졌는지 본다',
    );
  else console.log(`  - 시그니처 접속어 ${found.join(", ")} 사용`);
}

// 첫 줄에 숫자나 통념 뒤집기가 있는지 본다. 첫 두세 줄만 보이고 나머지는 접힌다.
if (platform === "threads" || platform === "linkedin") {
  const first = (platform === "threads" ? parts[0] : raw).split("\n")[0];
  // 실측 16건에서 상위는 전부 8~32자였고 49자짜리 하나만 성과가 무너졌다
  if (platform === "threads" && [...first].length > 32)
    console.log(
      `  - 첫 줄이 ${[...first].length}자다. 실측 상위는 8~32자였고 49자짜리만 성과가 무너졌다.\n` +
        "    수식어를 버리거나 문장을 둘로 쪼개 둘째 줄로 넘긴다",
    );
  const hasNumber = /\d/.test(first);
  // 판단 선언("쓸 이유가 없음")과 사건 선언("~가 나왔음", "충격")도 통념 뒤집기로 친다 (playbook P7)
  const hasTwist = /(아닙니다|막혔습니다|바뀌었습니다|반대|생각보다|줄 알았|의외|이유가 없|없음|나왔음|뒤집|충격|안 잡|틀렸|아니야|아님)/.test(first);
  // 1인칭 판단 선언도 훅 재료다. 실측에서 "마케팅 절대하지마세요"가 220좋아요를 받았다
  // 구어 감상("~더라구요", "~거같", "엄청")으로 여는 훅도 1인칭 판단이다 (2026-08-25 사용자 교정).
  const hasStance =
    /(더라구요|더라고요|거 ?같|같아요|엄청|진짜|생각보다|의외로|솔직히)/.test(first) ||
    /(저는|제가).{0,20}(권|봅니다|씁니다|않습니다|합니다|입니다)/.test(first) ||
    /(안 권|권하지 않|하지 마|쓰지 않|아직 안|안 하셔도|안 해도|하지 않아도|필요 없|충분합니다)/.test(first);
  if (!hasNumber && !hasTwist && !hasStance)
    console.log(
      "  - 첫 줄에 숫자도, 통념 뒤집기도, 1인칭 판단도 없다.\n" +
        "    셋 중 하나를 넣는다 (platforms.md 5번)",
    );
  else if (hasNumber && /%/.test(first) && !/배|몫|분의/.test(first)) {
    // 질문형으로 열고 둘째 줄에서 배수를 주는 구조는 정상이다
    const second = (platform === "threads" ? parts[0] : raw).split("\n").filter(Boolean)[1] || "";
    if (!/배|몫|분의/.test(second))
      console.log("  - 첫 줄이 비율(%)로만 되어 있다. 배수로 환산하면 더 세진다");
  }
}

// 쓰레드는 정리해 주는 글이 아니라 자기 뷰를 보이는 글이 통한다
if (platform === "threads") {
  const CURATOR = /(정리했습니다|정리해 ?뒀습니다|모아 ?봤습니다|알아보겠습니다|살펴보겠습니다)/;
  const STANCE = /(저는|제가|봅니다|생각합니다|권합니다|권하지|느꼈|걸렸|놀랐)/;
  const hookText = parts[0] || "";
  if (CURATOR.test(hookText) && !STANCE.test(hookText))
    console.log(
      '  - 훅이 "정리했습니다"로 닫힌다. 큐레이터 포지션은 쓰레드에서 약하다.\n' +
        "    본문의 판단을 1인칭으로 옮긴다 (저는 ~라고 봅니다, 저는 아직 ~하지 않습니다)",
    );
}

// 실측 상위 게시물은 전부 1인칭 경험으로 연다. 훅에 그 흔적이 있는지 본다.
if (platform === "threads" || platform === "linkedin") {
  const head = platform === "threads" ? parts[0] : raw;
  const FIRST_PERSON =
    /(제가|저는|저희|제 ?(사이트|블로그|글|데이터|계정)|직접|써 ?보|해 ?보|돌려 ?보|재 ?보|겪|만들어 ?보|붙여 ?보|이 ?사이트|우리 ?사이트|년 ?차|현직|마케터인데|PD인데|살펴보|봐 ?드리)/;
  if (!FIRST_PERSON.test(head))
    console.log(
      "  - 1인칭 경험이나 자기 데이터가 안 보인다. 남의 조사만 인용하면 피드에서 밀린다.\n" +
        "    본문에 직접 겪은 대목이 있으면 그것으로 열고, 없으면 관찰형으로 낮춘다",
    );
}

if (platform === "threads") {
  console.log(`체인 ${parts.length}편 (훅 1 + 본문 ${parts.length - 1})`);
  if (parts.length < 3)
    console.log("  - 본문 편이 2개 미만이다. 소재가 부족한지 본다");
  if (parts.length > 5)
    console.log("  - 본문 편이 4개를 넘는다. 지루해질 수 있으니 합치거나 버릴 편을 본다");
}
// ── 말투 검사 (hongsh-voice) ──────────────────────────────────────────
// 2026-08-25 사고: 이 검사를 거치지 않아 합쇼체에 마침표를 찍고 이모지를 단 카피,
// 개성 장치가 하나도 없는 카피가 나갔다. 규격 통과는 말투 통과가 아니다.
// 검사기가 없으면 통과시키지 않는다 (SOFT가 아니라 실패다).
const VOICE = [process.env.HONGSH_VOICE_DIR, join(homedir(), ".claude/skills/hongsh-voice")]
  .filter(Boolean)
  .map((d) => join(d, "scripts/check_voice.mjs"))
  .find((p) => existsSync(p));
const REGISTER = { threads: "threads", instagram: "insta", linkedin: "formal" };
console.log("\n[말투 검사: hongsh-voice]");
if (!VOICE) {
  console.log("  x hongsh-voice/scripts/check_voice.mjs를 찾지 못했다. 말투 검사 없이는 내보내지 않는다 (HONGSH_VOICE_DIR 지정)");
  failed += 1;
} else if (src === "-") {
  console.log("  x 표준입력으로는 말투 검사를 돌릴 수 없다. 파일로 저장해 다시 검사한다");
  failed += 1;
} else {
  const args = [VOICE, "--register", REGISTER[platform]];
  if (platform === "threads") args.push("--chain");
  args.push(src);
  const env = { ...process.env, HONGBLOG_DIR: process.env.HONGBLOG_DIR || join(homedir(), "Documents/00_project/hongblog") };
  let out = "";
  let code = 0;
  try {
    out = execFileSync("node", args, { encoding: "utf8", env, stdio: ["ignore", "pipe", "pipe"] });
  } catch (e) {
    out = (e.stdout ?? "") + (e.stderr ?? "");
    code = e.status ?? 1;
  }
  console.log(out.trim().split("\n").map((l) => "  " + l).join("\n"));
  const hardN = (out.match(/\[HARD\]/g) || []).length;
  if (code || hardN) failed += Math.max(hardN, 1);
}

if (failed) {
  console.log(`\n위반 ${failed}건. 고쳐서 통과시킨 뒤 내보낸다.`);
  process.exit(1);
}
console.log("통과. 규격 위반 없음 (두괄식과 사실 확인은 사람이 본다)");
