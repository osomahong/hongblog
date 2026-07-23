/**
 * 콘텐츠 윤문 기계 검사.
 *
 * 글 생성 워크플로우의 필수 게이트다. HARD 위반이 1건이라도 있으면 exit 1로 종료하며,
 * 그 상태로 커밋·배포해서는 안 된다. 배포 후 반복 수정을 막기 위해 생성 시점에 걸러낸다.
 *
 * Run: npx tsx scripts/check-prose.ts content/insights/{slug}.md
 *      npx tsx scripts/check-prose.ts --all        (전체 콘텐츠 검사, 리포트용)
 *
 * 규칙 출처: .claude/skills/content-ops/references/writing-style-guide.md
 *           사용자 교정 이력 (2026-07 비문 교정 세션)
 */
import fs from "node:fs";
import path from "node:path";

interface Rule {
    /** 위반을 찾는 정규식 */
    pattern: RegExp;
    label: string;
    /** HARD: 있으면 실패. SOFT: 경고만 (낭독 검수에서 판단) */
    severity: "HARD" | "SOFT";
    /** 오탐 제외 정규식 (매치 주변 문맥에 이 패턴이 있으면 통과) */
    allowContext?: RegExp;
}

const RULES: Rule[] = [
    // ── 금지 기호 ──
    { pattern: /—|–/g, label: "em dash(—) 금지: 콜론이나 쉼표로 대체", severity: "HARD" },
    { pattern: /·/g, label: "가운뎃점(·) 금지: 쉼표로 대체", severity: "HARD" },

    // ── 번역투 (전면 금지) ──
    { pattern: /중 하나(입니다|였습니다|이다|다\b)/g, label: "번역투 '~중 하나입니다': '흔한 ~입니다'로", severity: "HARD" },
    { pattern: /에 대(해|한|해서)\s/g, label: "번역투 '~에 대해/대한': 조사로 직접 연결", severity: "HARD" },
    { pattern: /[을를] 통해/g, label: "번역투 '~을 통해': '~로'로", severity: "HARD" },
    { pattern: /에 있어서?\s/g, label: "번역투 '~에 있어서': '~에서'로", severity: "HARD" },
    { pattern: /되어지|보여집니다|여겨집니다/g, label: "이중 피동: 능동이나 단일 피동으로", severity: "HARD" },
    { pattern: /에 의해\s/g, label: "번역투 '~에 의해': 행위 주어를 주어 자리로", severity: "HARD" },
    { pattern: /라는 사실[을이]/g, label: "번역투 '~라는 사실': '~인 것', '~인 점'으로", severity: "HARD" },
    { pattern: /당신/g, label: "'당신' 금지: '여러분' 또는 주어 생략", severity: "HARD" },
    { pattern: /에도 불구하고/g, label: "번역투 '~에도 불구하고': '~인데도'로", severity: "HARD" },
    { pattern: /하는 것을 돕/g, label: "번역투 '~하는 것을 돕다': '~하기 쉬워지다'로", severity: "HARD" },
    { pattern: /만약 .{0,20}(다면|라면)/g, label: "'만약 ~한다면' 남용: '~하면'으로", severity: "SOFT" },

    // ── 과장·극적 은유 ──
    {
        pattern: /변신|마법처럼|놀랍게도|놀랍도록|혁명적|획기적|차원이 다른|상상을 초월|세상을 바꾸는|기적처럼/g,
        label: "과장 표현 금지: 사실 서술로",
        severity: "HARD",
    },
    { pattern: /엄청나게|순식간에/g, label: "강조 부사 남용 주의", severity: "SOFT" },

    // ── 금지 어휘 ──
    { pattern: /독자/g, label: "'독자' 금지: '이 글을 읽는 분들', '여러분'으로", severity: "HARD", allowContext: /구독자/ },

    // ── AI식 안내 지시문 (2026-07 사용자 교정) ──
    {
        pattern: /(하면서|생각하면서|떠올리면서) 읽어 ?주세요|소리 내어|상상해 ?보세요|떠올려 ?보세요/g,
        label: "AI식 안내 지시문 금지: 독자 행동을 지시하지 말고 서술문으로",
        severity: "HARD",
    },
    { pattern: /해 ?보시기 바랍니다|주목해 ?주세요|기억해 ?두세요/g, label: "안내문 투 주의: 서술문 전환 검토", severity: "SOFT" },

    // ── 사용자 교정 이력 표현 (2026-07) ──
    { pattern: /시스템의 그림|그림을 (제대로 )?그리지 못/g, label: "'시스템의 그림을 그리다' 금지: '구조를 이해하다'로", severity: "HARD" },
    { pattern: /이해[가를] (더 )?(줄어|깎)/g, label: "'이해가 줄어들다' 금지: '이해가 어려워지다'로", severity: "HARD" },
    { pattern: /풍경|리듬을|사이클을|빚어내|길어 올리|다가서/g, label: "추상 명사·문어체 동사 금지 (일상어로)", severity: "HARD" },

    // ── 헤딩 규칙 ──
    { pattern: /^#{2,3} .*(는가|은가|인가|한가|할까|일까|인지|하나|되나)\?\s*$/gm, label: "반말 의문형 헤딩 금지: '~을까요?' 존댓말로", severity: "HARD" },

    // ── SOFT: 낭독 검수 대상 ──
    { pattern: /것입니다/g, label: "'것입니다' 남용 여부 확인 (3회 초과 시 정리)", severity: "SOFT" },
    { pattern: /수 있습니다/g, label: "'~할 수 있습니다' 남용 여부 확인 (5회 초과 시 정리)", severity: "SOFT" },
];

/** 인접 두 문장이 같은 어절로 끝나는지 (예: ~보겠습니다. ~보겠습니다.) */
function findRepeatedEndings(text: string): string[] {
    const found: string[] = [];
    const sentences = text.split(/(?<=니다\.|까요\?|시다\.)\s+/);
    for (let i = 1; i < sentences.length; i++) {
        const prev = sentences[i - 1].trim().split(/\s+/).pop() ?? "";
        const cur = sentences[i].trim().split(/\s+/).pop() ?? "";
        if (prev && prev === cur && prev.length >= 4) {
            found.push(`"${prev}" 연속: …${sentences[i - 1].slice(-25)} / …${sentences[i].slice(-25)}`);
        }
    }
    return found;
}

/** 같은 어미 3연속 (했습니다-했습니다-했습니다) */
function findTripleSameEnding(text: string): string[] {
    const found: string[] = [];
    for (const m of text.matchAll(/([가-힣]{2,4}(?:습니다|합니다))\.\s[^.]{0,80}\1\.\s[^.]{0,80}\1\./g)) {
        found.push(`동일 종결 3연속 "${m[1]}": …${m[0].slice(0, 60)}…`);
    }
    return found;
}

function stripNonProse(raw: string): string {
    return raw
        .replace(/```[\s\S]*?```/g, "")           // 코드 펜스
        .replace(/<pre[\s\S]*?<\/pre>/g, "")       // HTML 예시 블록
        .replace(/<div[\s\S]*?<\/div>/g, "")       // 인라인 스타일 블록
        .replace(/\]\([^)]*\)/g, "]")              // 링크 URL
        .replace(/https?:\/\/\S+/g, "");           // 맨몸 URL
}

function checkFile(filePath: string): { hard: number; soft: number } {
    const raw = fs.readFileSync(filePath, "utf-8");
    const text = stripNonProse(raw);
    const lines = text.split("\n");

    let hard = 0;
    let soft = 0;
    const report: string[] = [];

    for (const rule of RULES) {
        const counts = new Map<number, string[]>();
        lines.forEach((line, idx) => {
            for (const m of line.matchAll(rule.pattern)) {
                if (rule.allowContext) {
                    const ctx = line.slice(Math.max(0, (m.index ?? 0) - 10), (m.index ?? 0) + m[0].length + 10);
                    if (rule.allowContext.test(ctx)) continue;
                }
                counts.set(idx + 1, [...(counts.get(idx + 1) ?? []), m[0]]);
            }
        });
        if (counts.size === 0) continue;

        const total = [...counts.values()].reduce((s, v) => s + v.length, 0);
        // SOFT 남용 계열은 임계치 이하면 통과
        if (rule.severity === "SOFT" && /남용/.test(rule.label)) {
            const threshold = rule.label.includes("5회") ? 5 : 3;
            if (total <= threshold) continue;
        }

        if (rule.severity === "HARD") hard += total;
        else soft += total;
        report.push(`[${rule.severity}] ${rule.label} (${total}건)`);
        for (const [line, matches] of [...counts.entries()].slice(0, 5)) {
            report.push(`    L${line}: ${matches.join(", ")}`);
        }
    }

    for (const msg of findRepeatedEndings(text)) {
        soft += 1;
        report.push(`[SOFT] 인접 문장 동일 종결\n    ${msg}`);
    }
    for (const msg of findTripleSameEnding(text)) {
        soft += 1;
        report.push(`[SOFT] ${msg}`);
    }

    console.log(`\n===== ${path.relative(process.cwd(), filePath)} =====`);
    if (report.length === 0) console.log("위반 없음");
    else console.log(report.join("\n"));
    return { hard, soft };
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.error("사용법: npx tsx scripts/check-prose.ts <파일.md> [파일2.md ...] | --all");
    process.exit(1);
}

const targets = args.includes("--all")
    ? ["content/insights", "content/classes", "content/courses"].flatMap((d) =>
          fs.readdirSync(d).filter((f) => f.endsWith(".md")).map((f) => path.join(d, f)),
      )
    : args;

let totalHard = 0;
let totalSoft = 0;
for (const t of targets) {
    if (!fs.existsSync(t)) {
        console.error(`파일 없음: ${t}`);
        process.exit(1);
    }
    const { hard, soft } = checkFile(t);
    totalHard += hard;
    totalSoft += soft;
}

console.log(`\n합계: HARD ${totalHard}건 / SOFT ${totalSoft}건`);
if (totalHard > 0) {
    console.error("HARD 위반이 있습니다. 해당 문장을 재작성한 뒤 다시 검사하세요. 이 상태로 커밋·배포 금지.");
    process.exit(1);
}
console.log("HARD 통과. SOFT 항목은 낭독 검수에서 판단하세요.");
