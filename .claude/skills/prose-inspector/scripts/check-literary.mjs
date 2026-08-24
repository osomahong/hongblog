#!/usr/bin/env node
/**
 * 문어체·추상 표현 검출기.
 *
 * scripts/check-prose.ts가 잡지 못하는 층위를 담당한다.
 * check-prose는 번역투와 금지 기호를 보고, 이 스크립트는 "틀리지는 않았으나
 * 일상 한국어가 아닌" 어휘와 구문을 본다.
 *
 * 사전은 사용자 교정 이력에서만 늘린다. 추측으로 항목을 넣지 않는다.
 *
 * Usage:
 *   node scripts/check-literary.mjs <파일.md> [파일2.md ...]
 *   node scripts/check-literary.mjs --all
 */
import fs from "node:fs";
import path from "node:path";

/** 앞뒤에 한글이 붙지 않은 독립 어절만 잡는다 (한국어는 단어 경계가 없다) */
const solo = (w) => new RegExp(`(?<![가-힣])${w}(?![가-힣])`, "g");

/**
 * 명사 뒤에 붙는 조사와 서술격 활용.
 * 한국어는 조사가 붙어 오는 것이 기본이라, 명사를 잡는 규칙을 `(?![가-힣])`로
 * 바로 닫으면 "세 지식"은 잡고 "세 지식이"는 놓친다. 실제로 2026-08-12에 등록한
 * 수 관형사 규칙이 이 문제로 계속 통과되고 있었고, 2026-08-24에 "두 축으로"가
 * 그대로 나가면서 드러났다. 명사 대상 규칙에는 이 조각을 붙인다.
 */
const JOSA = "(?:은|는|이|가|을|를|로|으로|도|만|와|과|의|에서|에|부터|까지|처럼|보다|랑){0,2}(?:입니다|입니까|이다|이고|이며|였다|였습니다|라는)?";

const RULES = [
    // ── 문어체 명사 (2026-08 사용자 교정) ──
    // "두 갈래로"처럼 조사가 붙으면 solo()가 놓친다. 조사와 서술격 결합형까지 잡는다.
    // "갈래로만"처럼 조사가 두 개 겹쳐도 잡히도록 결합 수를 늘렸다 (2026-08-15)
    // 2026-08-20: "다섯 갈래입니다"가 빠져나가 배포 직전 낭독 검수에서야 잡혔다. 서술격 활용을 추가했다.
    { pattern: /(?<![가-힣])갈래(?:로|가|를|는|의|와|도|만){0,2}(?:입니다|입니까|이다|이고|이며|였다|였습니다|라는)?(?![가-힣])/g, fix: "가지, 종류, 구분", severity: "HARD", src: "2026-08 사용자 지적, 2026-08-11 조사 결합형 보강, 2026-08-20 서술격 결합형 보강" },
    // "시도해", "유도해" 같은 동사 활용은 lookbehind로 제외한다.
    { pattern: /(?<![가-힣])도해(?:는|가|를|로|와|의|도|만|처럼|라는)?(?![가-힣])/g, fix: "이미지, 그림", severity: "HARD", src: "2026-08-12 사용자 지적 (향상된 전환 글)" },
    { pattern: solo("정본"), fix: "대표 주소, 원본", severity: "HARD", src: "2026-08 교정" },
    { pattern: /이해의 영역|판단의 영역|경험의 영역/g, fix: "'~을 아는 것', '~로 판단하는 일'", severity: "HARD", src: "2026-08 교정" },
    { pattern: /도달 경로|접근 경로의 문제/g, fix: "오는 길, 닿는 길", severity: "HARD", src: "2026-08 교정" },

    // ── 문어체 동사·부사 ──
    { pattern: /얹힙니다|얹히는|얹혀/g, fix: "위에 놓입니다, ~이 되어 있어야 합니다", severity: "HARD", src: "2026-08 교정" },
    { pattern: solo("비로소"), fix: "그때부터, 그제야", severity: "HARD", src: "2026-08 교정" },
    { pattern: /무릇|일컫|(?<![가-힣])기실|여실히|바야흐로|가히|자못|실로 /g, fix: "일상어로 풀어 쓴다", severity: "HARD", src: "일반 문어체" },
    { pattern: /(?<!헷)(?:갈립니다|갈리는|갈린다|갈렸|갈라집니다|갈라지는|갈라진|갈라졌)/g, fix: "달라집니다, 나뉩니다", severity: "HARD", src: "2026-08-07 사용자 지적" },
    // 수 관형사 + 추상명사 직접 결합. "세 지식", "두 재료"처럼 단위명사 없이 눌러 쓴 AI식 압축.
    // "두 값", "두 경로"는 개발 문서에서 자연스러워 셋 이상만 잡는다.
    { pattern: new RegExp(`(?<![가-힣])(?:한|두|세|네|다섯|여섯|일곱|여덟|아홉|열)\\s?(?:지식|재료|개념|축)${JOSA}(?![가-힣])`, "g"), fix: "단위명사를 붙인다 (세 가지 지식, 두 가지 재료, 두 가지로)", severity: "HARD", src: "2026-08-12 사용자 지적 (투슬리 온보딩 덱), 2026-08-24 조사 결합형과 '축' 보강" },
    { pattern: new RegExp(`(?<![가-힣])(?:세|네|다섯|여섯|일곱|여덟|아홉|열)\\s?(?:값|경로)${JOSA}(?![가-힣])`, "g"), fix: "단위명사를 붙인다 (다섯 가지 값)", severity: "HARD", src: "2026-08-12 사용자 지적 (투슬리 온보딩 덱), 2026-08-24 조사 결합형 보강" },
    // 라벨·명사구의 단형 부정. 구어에서는 자연스러우므로 명사형으로 닫히는 꼴만 잡는다.
    { pattern: /안 (?:남는|남은|되는|보이는) (?:것|일|곳|자리)|안 보일 때/g, fix: "장형 부정으로 (남지 않는 것, 되지 않는 것)", severity: "WARN", src: "2026-08-12 사용자 지적 (투슬리 온보딩 덱)" },
    { pattern: /에 다름 아니|이라 할 것입니다|인 바[,\s]/g, fix: "~입니다", severity: "HARD", src: "일반 문어체" },

    // ── 추상 명사·문어체 비유 (메모리 feedback_avoid_abstract_korean_expressions) ──
    { pattern: solo("풍경"), fix: "상황, 모습", severity: "HARD", src: "메모리 규칙" },
    { pattern: /리듬을|사이클을|빚어내|길어 올리|다가서/g, fix: "일상어로 풀어 쓴다", severity: "HARD", src: "메모리 규칙" },
    { pattern: solo("결"), fix: "성격, 방향", severity: "HARD", src: "메모리 규칙" },
    { pattern: /협상하듯|호흡을 맞추/g, fix: "구체 동작으로 서술", severity: "HARD", src: "메모리 규칙" },
    // 고치는 행위를 손 은유로 대신한 것. "손을 씻다" 같은 실제 손 동작은 건드리지 않는다.
    { pattern: /손보[아았습는기려면]|손봐|손볼|손봅니다|손대[는고며기려면]|손댑니다|손댄|손이 가는|손에 익/g, fix: "고칩니다, 바꿉니다, 익숙해집니다", severity: "HARD", src: "2026-08-15 사용자 지적 (GA4 Edu), 2026-08-15 손봐 활용형 보강" },
    // 아래 셋은 손보다에서 파생한 같은 갈래의 은유다. 기존 배포 글에 이미 쓰인 자리가 있어
    // 저장을 막지 않는 WARN으로 두고, 낭독 검수에서 문맥을 보고 판단한다.
    // 수치·상태 변화를 흔들림, 묻힘, 가림으로 은유한 것.
    { pattern: /흔들리(?:면|는|고)|흔들립니다|흔들려|묻힙니다|묻히는|변화를 가립니다|가려집니다/g, fix: "줄어듭니다, 잘 보이지 않습니다, 달라집니다", severity: "WARN", src: "2026-08-15 사용자 지적 (GA4 Edu)" },
    // 유입·방문자를 사람 데려오기로 은유한 것.
    { pattern: /데려오|데려온|붙잡지 못|붙잡습니다|실마리(?:입니다|가|를|는)?(?![가-힣])/g, fix: "유입됩니다, 바로 나갑니다, 먼저 확인합니다", severity: "WARN", src: "2026-08-15 사용자 지적 (GA4 Edu)" },
    // 뜻·몫·감각으로 뭉뚱그린 추상 서술.
    { pattern: /뜻이 (?:생깁|맞습)|(?:그|제) 몫입니다|감각을 (?:잡|기르|익히)/g, fix: "판단 근거가 됩니다, 비율입니다, 방법을 익힙니다", severity: "WARN", src: "2026-08-15 사용자 지적 (GA4 Edu)" },
    // 도구·환경·화면을 '자리'로 은유한 것. 일상어 '그 자리에서', '일자리'는 건드리지 않고
    // 개수를 세거나 순서를 매기거나 종류를 나누는 용법만 잡는다.
    { pattern: /(?:첫|두|세|네|다섯)\s?자리(?!\s?[수값]|에\s?올|를\s?차지)|(?:첫|두|세|네|다섯|[0-9])\s?번째\s?자리|자리(?:별|마다)|(?:만나는|일하는|작업하는|머무는|쓰는)\s자리/g, fix: "작업 공간, 환경, 화면", severity: "HARD", src: "2026-08-10 사용자 지적 (도구를 '자리'로 은유)" },
    // 화면·항목을 지시어와 함께 '자리'로 부른 것. `어느 자리에서`, `이 자리를`처럼 위치를 가리키는 용법.
    { pattern: /(?:어느|이|그|저|같은|다른)\s자리(?:에서|에|를|가|는)(?![가-힣])/g, fix: "화면, 항목, 단계", severity: "HARD", src: "2026-08-18 사용자 지적 (루커스튜디오 가이드)" },
    // 관형절에 붙은 추상 명사를 존재·소멸 동사와 묶은 공간 은유.
    // 2026-08-10과 08-18 규칙이 개수·순서·지시어 결합만 잡아
    // "사람이 마지막에 봐야 하는 자리는 남습니다"가 그대로 빠져나갔다.
    // 좌석을 뜻하는 일상어(앉는 자리가 남았다)는 관형절 조건으로 걸러진다.
    { pattern: /(?:해야\s?하는|해야\s?할|봐야\s?하는|봐야\s?할|확인해야\s?하는|확인할|살펴야\s?하는|볼|하는|필요한|맡는|담당하는)\s?(?:자리|영역|공간|대목)(?:은|는|이|가|을|를|도|만)?\s*(?:남|생기|사라지|없어지|줄|늘)/g, fix: "일, 단계로 바꾸거나 '~해야 합니다'로 직접 서술", severity: "HARD", src: "2026-08-24 사용자 지적 (SNS 링크드인 초안)" },

    // ── 번역투 구문 (check-prose 미수록분) ──
    { pattern: /는 데서 (옵니다|비롯|생깁)/g, fix: "~때문에 생깁니다", severity: "HARD", src: "2026-08 교정" },
    { pattern: /의미를 (갖|가집|지닙)/g, fix: "소용이 있습니다, ~에 쓰입니다", severity: "HARD", src: "2026-08 교정" },
    { pattern: /와는 무관합니다|과는 무관합니다/g, fix: "~와는 상관이 없습니다", severity: "HARD", src: "2026-08 교정" },
    { pattern: /존재가 아닙니다|존재입니다/g, fix: "주어를 살려 동사로 서술", severity: "HARD", src: "2026-08 교정" },
    { pattern: /대응을 합니다|대응을 하게/g, fix: "구체 동작으로 (예: 메뉴부터 바꿉니다)", severity: "HARD", src: "2026-08 교정" },
    { pattern: /[을를] 요합니다|[이가] 요구됩니다/g, fix: "~가 필요합니다", severity: "HARD", src: "일반 번역투" },

    // ── 자기 지칭 (2026-08 사용자 교정) ──
    // 이 사이트의 클래스는 "강의"가 아니라 교육 목적 콘텐츠다. 번호로 서로를 부르지도 않는다.
    { pattern: solo("강의"), fix: "이 글, 이 콘텐츠", severity: "HARD", src: "2026-08 사용자 지적 1" },
    { pattern: /[0-9]+강(?![가-힣])/g, fix: "'앞에서', '뒤에서', 해당 개념 이름으로 지칭", severity: "HARD", src: "2026-08 사용자 지적 9" },
    { pattern: /이번 강|앞 강|다음 강|마지막 강|이 강(?![가-힣])/g, fix: "이 글, 앞에서, 뒤에서", severity: "HARD", src: "2026-08 사용자 지적 1" },

    // ── 방언성·구어 동사 (2026-08 사용자 교정) ──
    { pattern: /거드는|거듭니다|거들어|거들고/g, fix: "돕는, 돕습니다", severity: "HARD", src: "2026-08 사용자 지적 7" },
    { pattern: /갈라집니다|갈라지는|갈라져|갈림길/g, fix: "나뉩니다, 달라집니다", severity: "HARD", src: "2026-08 사용자 지적 (seo-title-creator 글)" },

    // ── 격식 문어체·통계 용어 (2026-08-17 뉴스레터 사용자 지적) ──
    { pattern: /여쭙|여쭤|여쭈어/g, fix: "물어보다, 궁금합니다, 질문드리겠습니다", severity: "HARD", src: "2026-08-17 사용자 지적 (뉴스레터)" },
    { pattern: /분포/g, fix: "결과, 다른 분들의 답, 비율 (통계·데이터 분석 설명이면 유지 가능)", severity: "WARN", src: "2026-08-17 사용자 지적 (뉴스레터)" },

    // ── 자기 지칭은 개체명으로 (2026-08 사용자 지시: AEO 인용 시 브랜드가 함께 옮겨지도록) ──
    { pattern: /이 블로그/g, fix: "준이아빠블로그", severity: "HARD", src: "2026-08 사용자 지시 (명시적 개체 표현)" },

    // ── 대명사 대신 실체 명시 (2026-08 사용자 교정) ──
    { pattern: /자기가 (아는|알고|가진|찾은)/g, fix: "주체 이름을 밝힌다 (예: 크롤러 봇이 알고 있는)", severity: "HARD", src: "2026-08 사용자 지적 2" },

    // ── 문어체 의문형 종결 (2026-08-06 사용자 지적: GA4 온보딩 커리큘럼 "왜 재는가") ──
    { pattern: /[가-힣](는가|은가|던가)(?![가-힣])/g, fix: "헤딩은 명사형으로, 본문은 '-는지' 절로 (예: 왜 재는가 → 측정하는 이유)", severity: "HARD", src: "2026-08-06 사용자 지적 (GA4 온보딩 커리큘럼)" },
    // 절 끝에 오는 의문형만 잡는다. "할인가", "승인가"처럼 명사 안에 들어간 -인가는
    // 뒤에 다른 말이 이어지므로 여기서 걸러진다. "~인가 싶다", "~인가 하는"도 그대로 둔다.
    { pattern: /[가-힣]인가(?!요)(?=\s*(?:$|[?!.]|\n))/g, fix: "의문이면 '-인지'나 명사형으로 ('무언가/누군가' 부정칭과 '~인가 싶다'는 유지)", severity: "WARN", src: "2026-08-06 사용자 지적 (GA4 온보딩 커리큘럼)" },

    // ── 판단 필요 (WARN: 맥락에 따라 허용) ──
    { pattern: /짚어|짚습니다|짚는 것/g, fix: "확인합니다, 알아봅니다 (비유 맥락이면 유지 가능)", severity: "WARN", src: "2026-08 교정" },
    { pattern: /쪼갠|쪼개는 것/g, fix: "나눈, 나누는 일", severity: "WARN", src: "2026-08 교정" },
    { pattern: solo("구간"), fix: "부분, 단계 (측정 맥락이면 유지 가능)", severity: "WARN", src: "2026-08 교정" },
    { pattern: /좌우합니다|좌우됩니다/g, fix: "결정합니다, 달라집니다", severity: "WARN", src: "과장 완화" },
    { pattern: /덩어리/g, fix: "하나의 작업, 한 묶음", severity: "WARN", src: "2026-08 교정" },
];

/** 코드, HTML, 링크 URL은 검사 대상이 아니다 */
function stripNonProse(raw) {
    return raw
        .replace(/^---\n[\s\S]*?\n---\n/, (m) => "\n".repeat(m.split("\n").length - 1))
        .replace(/```[\s\S]*?```/g, "")
        // 인라인 코드는 검사하지 않는다. 문체를 다루는 글은 고쳐야 할 예시를
        // 그대로 인용해야 하는데, 그 인용까지 위반으로 잡히면 규칙을 설명할 수 없다.
        .replace(/`[^`\n]+`/g, "")
        .replace(/<[^>]+>/g, "")
        .replace(/\]\([^)]*\)/g, "]")
        .replace(/https?:\/\/\S+/g, "");
}

function checkFile(filePath) {
    const text = stripNonProse(fs.readFileSync(filePath, "utf-8"));
    const lines = text.split("\n");
    const findings = [];

    for (const rule of RULES) {
        lines.forEach((line, idx) => {
            for (const m of line.matchAll(rule.pattern)) {
                findings.push({
                    line: idx + 1,
                    word: m[0].trim(),
                    fix: rule.fix,
                    severity: rule.severity,
                    src: rule.src,
                    excerpt: line.trim().slice(Math.max(0, m.index - 20), m.index + 40),
                });
            }
        });
    }

    console.log(`\n===== ${path.relative(process.cwd(), filePath)} =====`);
    if (findings.length === 0) {
        console.log("문어체 표현 없음");
        return { hard: 0, warn: 0 };
    }

    const hard = findings.filter((f) => f.severity === "HARD");
    const warn = findings.filter((f) => f.severity === "WARN");

    for (const f of [...hard, ...warn]) {
        console.log(`[${f.severity}] L${f.line} "${f.word}" -> ${f.fix}`);
        console.log(`    …${f.excerpt}…  (근거: ${f.src})`);
    }
    return { hard: hard.length, warn: warn.length };
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("사용법: node check-literary.mjs <파일.md> [...] | --all");
    process.exit(1);
}

const targets = args.includes("--all")
    ? ["content/insights", "content/classes", "content/courses"].flatMap((d) =>
          fs.existsSync(d) ? fs.readdirSync(d).filter((f) => f.endsWith(".md")).map((f) => path.join(d, f)) : [],
      )
    : args;

let totalHard = 0;
let totalWarn = 0;
for (const t of targets) {
    if (!fs.existsSync(t)) {
        console.error(`파일 없음: ${t}`);
        process.exit(1);
    }
    const { hard, warn } = checkFile(t);
    totalHard += hard;
    totalWarn += warn;
}

console.log(`\n합계: HARD ${totalHard}건 / WARN ${totalWarn}건`);
if (totalHard > 0) {
    console.error("HARD 문어체가 있습니다. 일상어로 바꾼 뒤 다시 검사하세요.");
    process.exit(1);
}
console.log("HARD 통과. WARN 항목은 낭독 검수에서 판단하세요.");
