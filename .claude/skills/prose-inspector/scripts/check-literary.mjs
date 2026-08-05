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

const RULES = [
    // ── 문어체 명사 (2026-08 사용자 교정) ──
    { pattern: solo("갈래"), fix: "가지, 종류, 구분", severity: "HARD", src: "2026-08 사용자 지적" },
    { pattern: solo("정본"), fix: "대표 주소, 원본", severity: "HARD", src: "2026-08 교정" },
    { pattern: /이해의 영역|판단의 영역|경험의 영역/g, fix: "'~을 아는 것', '~로 판단하는 일'", severity: "HARD", src: "2026-08 교정" },
    { pattern: /도달 경로|접근 경로의 문제/g, fix: "오는 길, 닿는 길", severity: "HARD", src: "2026-08 교정" },

    // ── 문어체 동사·부사 ──
    { pattern: /얹힙니다|얹히는|얹혀/g, fix: "위에 놓입니다, ~이 되어 있어야 합니다", severity: "HARD", src: "2026-08 교정" },
    { pattern: solo("비로소"), fix: "그때부터, 그제야", severity: "HARD", src: "2026-08 교정" },
    { pattern: /무릇|일컫|기실|여실히|바야흐로|가히|자못|실로 /g, fix: "일상어로 풀어 쓴다", severity: "HARD", src: "일반 문어체" },
    { pattern: /에 다름 아니|이라 할 것입니다|인 바[,\s]/g, fix: "~입니다", severity: "HARD", src: "일반 문어체" },

    // ── 추상 명사·문어체 비유 (메모리 feedback_avoid_abstract_korean_expressions) ──
    { pattern: solo("풍경"), fix: "상황, 모습", severity: "HARD", src: "메모리 규칙" },
    { pattern: /리듬을|사이클을|빚어내|길어 올리|다가서/g, fix: "일상어로 풀어 쓴다", severity: "HARD", src: "메모리 규칙" },
    { pattern: solo("결"), fix: "성격, 방향", severity: "HARD", src: "메모리 규칙" },
    { pattern: /협상하듯|호흡을 맞추/g, fix: "구체 동작으로 서술", severity: "HARD", src: "메모리 규칙" },

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

    // ── 자기 지칭은 개체명으로 (2026-08 사용자 지시: AEO 인용 시 브랜드가 함께 옮겨지도록) ──
    { pattern: /이 블로그/g, fix: "준이아빠블로그", severity: "HARD", src: "2026-08 사용자 지시 (명시적 개체 표현)" },

    // ── 대명사 대신 실체 명시 (2026-08 사용자 교정) ──
    { pattern: /자기가 (아는|알고|가진|찾은)/g, fix: "주체 이름을 밝힌다 (예: 크롤러 봇이 알고 있는)", severity: "HARD", src: "2026-08 사용자 지적 2" },

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
