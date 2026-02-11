/**
 * 모든 포스트의 quiz 필드를 업데이트하는 스크립트
 *
 * 사용법:
 *   npx tsx scripts/update-post-quiz.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../src/lib/schema";
import type { QuizQuestion } from "../src/lib/schema";

const quizBySlug: Record<string, QuizQuestion[]> = {
  "n8n-for-non-developers": [
    {
      question:
        "비개발자가 n8n 같은 자동화 도구를 도입할 때, 가장 큰 장벽은 무엇일까요?",
      options: [
        "도구 자체의 사용법 익히기 (UI, 노드 연결 등)",
        "도구 바깥의 기반 지식 (JSON, HTTP, API 인증 등)",
        "자동화할 업무를 정의하고 로직을 설계하는 것",
        "AI에게 질문하는 방법을 모르는 것",
      ],
      correctIndex: 1,
      explanation:
        "글에서도 다뤘듯이, n8n의 노드 연결 자체는 직관적입니다. 진짜 장벽은 JSON 구조 이해, HTTP 상태 코드, API 인증 같은 '도구 바깥의 기반 지식'입니다. 물론 3번도 중요한 요소이고 의견이 갈릴 수 있지만, 로직 설계는 어느 정도 AI의 도움을 받을 수 있는 반면, 에러 메시지를 읽고 디버깅하려면 기반 지식이 필수적입니다.",
    },
  ],

  "ga4-data-loss-automation-with-bigquery": [
    {
      question:
        "GA4에서 발생하는 데이터 결측치(NULL) 보정은 어느 단계에서 처리하는 것이 가장 효과적일까요?",
      options: [
        "루커 스튜디오 대시보드에서 필터로 처리 (시각화 단계)",
        "BigQuery 데이터 적재 시 자동 보정 (Mart 단계)",
        "스프레드시트에 수동으로 맵핑 테이블 관리",
        "GA4 설정에서 데이터 수집 방식 자체를 변경",
      ],
      correctIndex: 1,
      explanation:
        "시각화 단계(루커 스튜디오)에서 혼합 테이블로 보정하면 조회 속도가 저하되고, 스프레드시트 수동 관리는 휴먼 에러가 발생합니다. 글에서 다뤘듯이 데이터 적재 단계(Mart Level)에서 BigQuery 파이프라인으로 자동 보정하는 것이 조회 성능과 데이터 정합성을 모두 확보하는 방법입니다.",
    },
  ],

  "non-developer-chrome-extension-deployment-guide": [
    {
      question:
        "크롬 확장 프로그램이 외부 API를 호출해서 JSON 데이터를 주고받는 경우, 심사 제출 시 '원격 코드 사용 여부' 항목에 어떻게 답해야 할까요?",
      options: [
        "Yes — 외부 서버와 통신하므로 원격 코드에 해당한다",
        "No — API로 데이터만 주고받는 것은 원격 코드가 아니다",
        "Yes로 답하되, 보안 심사 추가 서류를 준비한다",
        "해당 항목을 건너뛰고 설명란에 상세 내용을 적는다",
      ],
      correctIndex: 1,
      explanation:
        "구글이 말하는 '원격 코드'란 외부 서버에서 실행 가능한 스크립트 파일(.js)을 다운로드하여 실행(eval)하는 보안 위협을 의미합니다. API를 통해 텍스트 데이터(JSON)만 주고받는 것은 원격 코드에 해당하지 않습니다. 여기서 Yes를 선택하면 심사가 매우 까다로워지거나 반려될 수 있습니다.",
    },
  ],

  "react-spa-gtm-setup-guide": [
    {
      question:
        "리액트 SPA에서 GTM의 기본 Page View 트리거가 첫 로딩에서만 작동하는 근본적인 이유는 무엇일까요?",
      options: [
        "리액트가 GTM 스크립트를 차단하기 때문",
        "SPA는 페이지 이동 시 HTML을 새로 로드하지 않고 DOM만 교체하기 때문",
        "GTM이 리액트 프레임워크를 공식 지원하지 않기 때문",
        "브라우저 보안 정책이 SPA의 반복 이벤트를 제한하기 때문",
      ],
      correctIndex: 1,
      explanation:
        "SPA는 최초에 HTML을 한 번만 로드하고, 이후 페이지 전환은 JavaScript로 DOM을 교체하며 history.pushState()로 URL만 변경합니다. 브라우저 입장에서 '새 페이지를 열었다'는 이벤트가 발생하지 않으므로, GTM의 기본 Page View 트리거(gtm.js)는 최초 로딩 시에만 작동합니다.",
    },
  ],

  "redirect-types-seo-marketing-guide": [
    {
      question:
        "영구적으로 URL을 변경했는데 실수로 302 리디렉션을 적용했다면, 어떤 문제가 발생할까요?",
      options: [
        "사용자가 페이지를 찾을 수 없어 404 에러가 발생한다",
        "기존 URL의 SEO 링크 자산이 새 URL로 전달되지 않는다",
        "검색 엔진이 두 URL을 모두 인덱싱하여 중복 콘텐츠 패널티를 받는다",
        "리디렉션 자체가 작동하지 않아 사용자가 이동하지 못한다",
      ],
      correctIndex: 1,
      explanation:
        "302는 '임시 이동'을 의미하므로 검색 엔진은 기존 URL을 계속 원본으로 인덱싱하고, 링크 자산(Link Equity)을 새 URL로 전달하지 않습니다. 사용자 입장에서는 정상적으로 이동하지만, SEO 관점에서 기존 URL이 쌓아온 검색 순위 가치가 새 URL에 전혀 반영되지 않는 심각한 문제가 발생합니다.",
    },
  ],

  "meta-attribution-window-guide": [
    {
      question:
        "메타 광고에서 '클릭 후 7일' 어트리뷰션 설정은 정확히 어떤 의미일까요?",
      options: [
        "클릭한 지 정확히 7일째 되는 날의 전환만 집계한다",
        "클릭 시점부터 7일 이내에 발생한 모든 전환을 집계한다",
        "7일 동안 클릭이 반복되면 마지막 클릭 기준으로 전환을 집계한다",
        "클릭 후 7일이 지나야 전환 데이터가 확정되어 리포트에 반영된다",
      ],
      correctIndex: 1,
      explanation:
        "'클릭 후 7일'은 클릭한 시점부터 7일 이내의 모든 전환을 잡는 것입니다. 클릭 당일 전환도, 3일 뒤 전환도, 7일째 전환도 모두 포함됩니다. 따라서 '클릭 후 7일' 설정의 전환 수는 항상 '클릭 후 1일' 설정의 전환 수보다 같거나 많습니다.",
    },
  ],
};

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  const db = drizzle(sql, { schema });

  let updated = 0;
  let skipped = 0;

  for (const [slug, quiz] of Object.entries(quizBySlug)) {
    const existing = await db.query.posts.findFirst({
      where: eq(schema.posts.slug, slug),
    });

    if (!existing) {
      console.log(`⏭️  포스트 없음 (스킵): ${slug}`);
      skipped++;
      continue;
    }

    await db
      .update(schema.posts)
      .set({ quiz, updatedAt: new Date() })
      .where(eq(schema.posts.id, existing.id));

    console.log(`✅ ${slug} — "${quiz[0].question.substring(0, 40)}..."`);
    updated++;
  }

  console.log(`\n📊 결과: ${updated}개 업데이트, ${skipped}개 스킵`);
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error("❌ 오류:", e.message || e);
    process.exit(1);
  });
