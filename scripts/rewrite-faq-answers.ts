#!/usr/bin/env npx tsx --tsconfig tsconfig.json

/**
 * FAQ 답변 간결화 스크립트
 *
 * 기존 FAQ 답변(500-1500단어)을 대화체(150-300단어)로 축약 재작성합니다.
 *
 * 사용법:
 *   1단계: 리뷰 파일 생성 (dry-run)
 *     npx dotenv -e .env.local -- npx tsx scripts/rewrite-faq-answers.ts
 *
 *   2단계: scripts/data/faq-rewrites-review.json 검토
 *
 *   3단계: DB 반영
 *     npx dotenv -e .env.local -- npx tsx scripts/rewrite-faq-answers.ts --apply
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as fs from "fs";
import * as path from "path";

const REVIEW_FILE = path.join(__dirname, "data", "faq-rewrites-review.json");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);
const aiModel = genAI.getGenerativeModel({
  model: process.env.AI_MODEL_NAME || "gemini-1.5-flash",
});

const REWRITE_PROMPT = `당신은 테크/마케팅 분야 블로그 에디터입니다. 아래 FAQ 답변을 간결하게 재작성하세요.

## 재작성 규칙
1. 150-300단어로 압축
2. 마크다운 헤딩(##, ###) 사용 금지
3. 문단 구분은 빈 줄로만
4. **볼드**는 핵심 용어에만 최소 사용 (0-3회)
5. 첫 문장에서 질문에 직접 답변
6. 원문의 핵심 수치·비율·구체적 팁 보존
7. 존댓말(~입니다/~합니다) 유지
8. 이미지 마크다운(![...](...)  ) 제거
9. 불릿 리스트는 0-2개만 허용 (과도한 리스트 구조 지양)

## 입력
질문: {question}

원문 답변:
{answer}

## 출력
재작성된 답변만 출력하세요. JSON이 아닌 순수 텍스트로 응답하세요.`;

function countWords(text: string): number {
  // 한국어+영어 혼합 단어 수 계산
  const cleaned = text.replace(/!\[.*?\]\(.*?\)/g, "").replace(/[#*`>\-|]/g, "").trim();
  const tokens = cleaned.split(/\s+/).filter(Boolean);
  return tokens.length;
}

interface FaqRecord {
  id: number;
  slug: string;
  question: string;
  answer: string;
}

interface RewriteEntry {
  id: number;
  slug: string;
  question: string;
  originalWordCount: number;
  rewrittenWordCount: number;
  originalAnswer: string;
  rewrittenAnswer: string;
}

async function rewriteAnswer(question: string, answer: string): Promise<string> {
  const prompt = REWRITE_PROMPT
    .replace("{question}", question)
    .replace("{answer}", answer);

  const result = await aiModel.generateContent(prompt);
  const response = result.response.text().trim();

  // 혹시 마크다운 코드블록으로 감싼 경우 제거
  return response.replace(/^```(?:markdown)?\n?/, "").replace(/\n?```$/, "").trim();
}

async function main() {
  const applyMode = process.argv.includes("--apply");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL 환경 변수가 필요합니다.");
    process.exit(1);
  }

  if (!process.env.GOOGLE_AI_API_KEY) {
    console.error("❌ GOOGLE_AI_API_KEY 환경 변수가 필요합니다.");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  if (applyMode) {
    // --apply 모드: 리뷰 파일에서 읽어서 DB 반영
    if (!fs.existsSync(REVIEW_FILE)) {
      console.error("❌ 리뷰 파일이 없습니다. 먼저 --apply 없이 실행하세요.");
      process.exit(1);
    }

    const entries: RewriteEntry[] = JSON.parse(fs.readFileSync(REVIEW_FILE, "utf-8"));
    console.log(`\n📝 ${entries.length}개 FAQ 답변을 DB에 반영합니다...\n`);

    let updated = 0;
    for (const entry of entries) {
      await db
        .update(schema.faqs)
        .set({ answer: entry.rewrittenAnswer, updatedAt: new Date() })
        .where(eq(schema.faqs.id, entry.id));

      console.log(`✅ [${entry.slug}] ${entry.originalWordCount}→${entry.rewrittenWordCount}단어`);
      updated++;

      // Rate limit: 약간의 딜레이
      await new Promise((r) => setTimeout(r, 200));
    }

    console.log(`\n📊 완료: ${updated}개 FAQ 업데이트됨`);
    return;
  }

  // 기본 모드: 전체 FAQ 조회 → AI 재작성 → 리뷰 파일 생성
  console.log("\n📄 전체 FAQ 조회 중...\n");

  const allFaqs = await db.query.faqs.findMany({
    orderBy: [schema.faqs.id],
  });

  console.log(`총 ${allFaqs.length}개 FAQ 발견\n`);

  // 이미 짧은 FAQ 필터링 (150단어 이하는 스킵)
  const targets = allFaqs.filter((faq) => countWords(faq.answer) > 150);
  const skipped = allFaqs.filter((faq) => countWords(faq.answer) <= 150);

  if (skipped.length > 0) {
    console.log(`⏭️  이미 짧은 FAQ ${skipped.length}개 스킵:`);
    for (const faq of skipped) {
      console.log(`   - [${faq.slug}] ${countWords(faq.answer)}단어`);
    }
    console.log("");
  }

  if (targets.length === 0) {
    console.log("✅ 재작성할 FAQ가 없습니다.");
    return;
  }

  console.log(`🔄 ${targets.length}개 FAQ 재작성 시작...\n`);

  const entries: RewriteEntry[] = [];

  for (const faq of targets) {
    const originalCount = countWords(faq.answer);
    console.log(`  🔄 [${faq.slug}] (${originalCount}단어) 재작성 중...`);

    try {
      const rewritten = await rewriteAnswer(faq.question, faq.answer);
      const rewrittenCount = countWords(rewritten);

      entries.push({
        id: faq.id,
        slug: faq.slug,
        question: faq.question,
        originalWordCount: originalCount,
        rewrittenWordCount: rewrittenCount,
        originalAnswer: faq.answer,
        rewrittenAnswer: rewritten,
      });

      console.log(`  ✅ [${faq.slug}] ${originalCount}→${rewrittenCount}단어`);

      // Rate limit: Gemini API 3 req/sec
      await new Promise((r) => setTimeout(r, 500));
    } catch (err) {
      console.error(`  ❌ [${faq.slug}] 재작성 실패:`, err instanceof Error ? err.message : err);
    }
  }

  // 리뷰 파일 저장
  const dataDir = path.dirname(REVIEW_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  fs.writeFileSync(REVIEW_FILE, JSON.stringify(entries, null, 2), "utf-8");

  console.log(`\n📊 결과 요약:`);
  console.log(`   재작성: ${entries.length}개`);
  console.log(`   스킵:   ${skipped.length}개`);
  console.log(`\n📁 리뷰 파일: ${REVIEW_FILE}`);
  console.log(`\n검토 후 DB 반영하려면:`);
  console.log(`   npx dotenv -e .env.local -- npx tsx scripts/rewrite-faq-answers.ts --apply`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
