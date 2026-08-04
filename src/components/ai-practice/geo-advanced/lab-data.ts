/**
 * GEO 심화 AIPBL 실습 데이터.
 * 실습 화면의 AI 응답은 모두 이 파일의 사전 구성 대본으로 재생된다 (실제 AI 호출 없음).
 * 문장(기초)과 구조(중급)를 갖춘 모모팜 사이트의 기술 층을 점검한다.
 * robots.txt 크롤러 접근, JSON-LD 구조화 데이터, llms.txt 세 가지를 3개 미션으로 나눈다.
 * 목업 사이트: /ai-practice/mock/momofarm-v2.html(반영 전), momofarm-v3.html(반영 후)
 */

import type { Block } from "../lab/SimChat";
import type { LabMissionMeta } from "../lab/LabShell";
import type { QuizQuestion } from "../lab/QuizPhase";

export type { Block };

export const MISSIONS: LabMissionMeta[] = [
  {
    title: "미션 1: AI 크롤러 출입문 점검하기",
    goal: "robots.txt를 점검해 AI 크롤러가 페이지를 읽을 수 있는 상태인지 확인하고, 차단을 풉니다.",
  },
  {
    title: "미션 2: 구조화 데이터로 정보에 이름표 붙이기",
    goal: "JSON-LD 구조화 데이터를 반영하고, 사람의 눈에는 안 보이는 변화가 AI의 눈에서 어떻게 잡히는지 확인합니다.",
  },
  {
    title: "미션 3: llms.txt로 사이트 안내문 만들기",
    goal: "사이트 전체를 AI에게 요약해 주는 llms.txt를 구성 요소부터 골라 완성합니다.",
  },
];

/* ===== 미션 1: AI 크롤러 출입문 점검하기 (robots.txt) ===== */

export const M1 = {
  introNote:
    "중급까지 마친 모모팜 페이지는 문장과 구조가 준비된 상태입니다.\n심화에서는 페이지 바깥의 기술 층을 점검합니다. 첫 번째는 AI 크롤러가 페이지에 들어올 수 있는지입니다.\n아래 점검 요청을 그대로 전송해 보세요.",
  checkQuestion:
    "momofarm.example의 robots.txt를 점검해 주세요. AI 검색 크롤러가 페이지를 읽을 수 있는 상태인가요?",
  recheckQuestion: "robots.txt를 수정했습니다. 다시 점검해 주세요.",
  blockedReport: [
    {
      type: "p",
      text: "robots.txt를 확인했습니다. 검색엔진 크롤러는 들어올 수 있지만, AI 크롤러는 모두 차단된 상태입니다.",
    },
    {
      type: "pre",
      text: `User-agent: Googlebot
Allow: /

User-agent: GPTBot
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: PerplexityBot
Disallow: /`,
    },
    {
      type: "table",
      headers: ["크롤러", "서비스", "접근 상태"],
      rows: [
        ["Googlebot", "구글 검색", "허용"],
        ["GPTBot", "챗GPT (오픈AI)", "차단"],
        ["ClaudeBot", "클로드 (앤트로픽)", "차단"],
        ["PerplexityBot", "퍼플렉시티", "차단"],
      ],
    },
    {
      type: "p",
      text: "이 상태에서는 페이지 안의 근거 문장을 아무리 보강해도 AI 답변에 인용되기 어렵습니다. 크롤러가 페이지 자체를 읽지 못하기 때문입니다.",
    },
  ] satisfies Block[],
  allowedReport: [
    {
      type: "p",
      text: "수정된 robots.txt를 다시 확인했습니다.",
    },
    {
      type: "pre",
      text: `User-agent: *
Allow: /

Sitemap: https://momofarm.example/sitemap.xml`,
    },
    {
      type: "table",
      headers: ["크롤러", "서비스", "접근 상태"],
      rows: [
        ["Googlebot", "구글 검색", "허용"],
        ["GPTBot", "챗GPT (오픈AI)", "허용"],
        ["ClaudeBot", "클로드 (앤트로픽)", "허용"],
        ["PerplexityBot", "퍼플렉시티", "허용"],
      ],
    },
    {
      type: "p",
      text: "이제 AI 크롤러가 모모팜 페이지를 읽을 수 있습니다. 페이지를 보강하는 작업은 문이 열려 있을 때만 효과가 있으므로, 기술 점검에서 가장 먼저 확인할 항목입니다.",
    },
  ] satisfies Block[],
  afterBlockedNote:
    "쇼핑몰 솔루션이 만들어 둔 기본 robots.txt가 검색 크롤러 외의 접근을 막고 있었습니다.\n차단 규칙을 지우고 모든 크롤러를 허용하는 내용으로 수정했습니다.\n수정한 robots.txt로 다시 점검해 보세요.",
  doneNote:
    "robots.txt는 크롤러에게 어디를 읽어도 되는지 알려 주는 파일입니다. 사이트 주소 뒤에 /robots.txt를 붙여 열면 내 사이트의 상태도 바로 확인할 수 있습니다.\n다음 미션에서는 열린 문 안쪽의 정보에 이름표를 붙입니다.",
};

/* ===== 미션 2: 구조화 데이터로 정보에 이름표 붙이기 (JSON-LD) ===== */

export interface SchemaChip {
  id: string;
  label: string;
  desc: string;
}

export const M2 = {
  beforeSrc: "/ai-practice/mock/momofarm-v2.html",
  afterSrc: "/ai-practice/mock/momofarm-v3.html",
  chips: [
    {
      id: "product",
      label: "Product 스키마",
      desc: "상품명, 가격, 평점을 상품(Product) 항목으로 선언합니다",
    },
    {
      id: "faq",
      label: "FAQPage 스키마",
      desc: "FAQ 4개를 질문과 답변(Question, Answer) 항목으로 선언합니다",
    },
    {
      id: "org",
      label: "Organization 스키마",
      desc: "모모팜이 어떤 조직인지 정의문 그대로 선언합니다",
    },
  ] satisfies SchemaChip[],
  introNote:
    "구조화 데이터는 페이지 정보가 무엇인지 정해진 형식(JSON-LD)으로 선언하는 코드입니다. 화면에는 나타나지 않고 크롤러만 읽습니다.\n모모팜 페이지의 정보 세 묶음에 이름표를 붙여 보겠습니다.\n아래 세 항목을 모두 선택한 뒤 사이트에 반영해 보세요.",
  appliedNote:
    "반영됐습니다. 그런데 왼쪽 화면은 아무것도 달라지지 않았습니다. 구조화 데이터는 사람의 눈에 보이지 않는 코드이기 때문입니다.\n[AI의 눈으로 보기] 탭을 열면 달라진 것이 보입니다.",
  doneNote:
    "같은 화면이지만 AI의 눈에는 상품, 가격, FAQ가 정돈된 데이터로 잡힙니다.\n구조화 데이터는 AI가 페이지 정보를 추측 없이 확정하도록 돕는 장치입니다.\n다음 미션에서는 페이지 단위를 넘어 사이트 전체의 안내문을 만듭니다.",
};

/** AI의 눈 (반영 전): 본문 텍스트는 잡히지만 구조화 데이터가 없다 */
export const EXTRACT_BEFORE_V3: string[] = [
  "<title> 모모팜 : 산지직송 복숭아",
  "[상단] 여름 복숭아 시즌 오픈, 첫 주문 10% 할인",
  "[헤더] 모모팜 / 홈 > 과일 > 복숭아",
  "[본문] 모모팜은 경북 영천에서 딱딱이 복숭아만 재배하는 산지직송 가족 농장입니다.",
  "  모모팜 딱딱이 복숭아 4.5kg / 32,000원 / 4.9 후기 128개",
  "  근거 문장 3개, 산출 기준, 질문 문형 FAQ: 반영됨 (중급까지 완료)",
  "[구조화 데이터] 없음",
  "  상품명, 가격, 평점, FAQ가 무엇인지 크롤러가 본문에서 추측해야 함",
  "[푸터] 복숭아 시즌 소식 받기 / 고객센터 010-2345-6789 / © 모모팜",
];

/** AI의 눈 (반영 후): JSON-LD 3건이 실제 문법 그대로 잡힌다 (momofarm-v3.html의 스크립트와 일치) */
export const EXTRACT_AFTER_V3: string[] = [
  "<title> 모모팜 : 산지직송 복숭아",
  "[상단] 여름 복숭아 시즌 오픈, 첫 주문 10% 할인",
  "[헤더] 모모팜 / 홈 > 과일 > 복숭아",
  "[본문] 모모팜은 경북 영천에서 딱딱이 복숭아만 재배하는 산지직송 가족 농장입니다.",
  "  모모팜 딱딱이 복숭아 4.5kg / 32,000원 / 4.9 후기 128개",
  "  근거 문장 3개, 산출 기준, 질문 문형 FAQ: 반영됨 (중급까지 완료)",
  '[구조화 데이터] <script type="application/ld+json"> 3건 인식',
  '  + { "@type": "Product",',
  '  +   "name": "모모팜 딱딱이 복숭아 4.5kg",',
  '  +   "brand": { "@type": "Brand", "name": "모모팜" },',
  '  +   "offers": { "price": "32000", "priceCurrency": "KRW" },',
  '  +   "aggregateRating": { "ratingValue": "4.9", "reviewCount": "128" } }',
  '  + { "@type": "FAQPage", "mainEntity": [',
  '  +   { "@type": "Question", "name": "배송은 얼마나 걸리나요?" },',
  '  +   { "@type": "Question", "name": "단단한 복숭아인가요?" },',
  '  +   { "@type": "Question", "name": "단단한 복숭아 당일 발송 되나요?" },',
  '  +   { "@type": "Question", "name": "당도 13브릭스는 어떻게 확인하나요?" } ] }',
  '  + { "@type": "Organization", "name": "모모팜",',
  '  +   "description": "경북 영천에서 딱딱이 복숭아만 재배하는 산지직송 가족 농장입니다." }',
  "[푸터] 복숭아 시즌 소식 받기 / 고객센터 010-2345-6789 / © 모모팜",
];

/* ===== 미션 3: llms.txt로 사이트 안내문 만들기 ===== */

export interface LlmsChip {
  id: string;
  label: string;
  desc: string;
}

export const M3 = {
  chips: [
    {
      id: "summary",
      label: "사이트 한 줄 정의",
      desc: "모모팜이 무엇인지 첫 줄에 단정형으로 씁니다",
    },
    {
      id: "pages",
      label: "핵심 페이지 목록",
      desc: "AI가 봐야 할 페이지를 링크와 한 줄 설명으로 정리합니다",
    },
    {
      id: "facts",
      label: "핵심 근거 요약",
      desc: "당일 발송, 13브릭스, 재구매율 41%를 본문과 일치하게 요약합니다",
    },
  ] satisfies LlmsChip[],
  fakeUrl: "momofarm.example/llms.txt",
  llmsText: `# 모모팜

> 모모팜은 경북 영천에서 딱딱이 복숭아만 재배하는 산지직송 가족 농장입니다.

## 핵심 페이지
- [복숭아 상품 페이지](https://momofarm.example/peach): 가정용 4.5kg 구성, 가격, 판매 기간
- [자주 묻는 질문](https://momofarm.example/peach#faq): 당일 발송, 당도 확인 방법

## 핵심 근거
- 오전에 수확한 복숭아를 그날 오후에 발송합니다 (2026년 7월에서 8월 발송 기록)
- 당도 13브릭스 이상만 비파괴 선별기로 골라 포장합니다
- 지난해 주문 고객의 재구매율은 41%였습니다`,
  introNote:
    "마지막 미션입니다. llms.txt는 AI에게 사이트 전체를 요약해 주는 안내 파일로, 사이트 최상위 주소에 올려 둡니다.\n아직 제안 단계의 표준이라 모든 AI가 읽는 것은 아니지만, 사이트의 핵심을 파일 하나로 정리해 두는 효과가 있습니다.\n안내문에 들어갈 세 가지를 모두 선택하고 llms.txt를 만들어 보세요.",
  builtNote:
    "momofarm.example/llms.txt가 만들어졌습니다.\n사이트를 통째로 읽지 않아도 이 파일 하나로 모모팜이 무엇이고 어떤 근거를 가졌는지 파악할 수 있습니다.\n중요한 것은 세 구성 모두 페이지 본문에 실재하는 문장의 요약이라는 점입니다. 본문과 어긋나는 안내문은 신뢰를 잃습니다.",
};

/* ===== 점검 퀴즈 ===== */

export const QUIZ: QuizQuestion[] = [
  {
    question: "GEO 기술 점검을 시작할 때 가장 먼저 확인할 항목은 어느 쪽일까요?",
    options: [
      "페이지 본문에 근거 문장을 먼저 추가한다.",
      "robots.txt에서 AI 크롤러가 차단되어 있지 않은지 확인한다.",
    ],
    correct: 1,
    explain:
      "크롤러가 못 들어오는 상태에서는 어떤 페이지 보강도 효과를 내지 못합니다.\n문이 열려 있는지 먼저 확인한 뒤에 안을 채우는 것이 순서입니다.",
  },
  {
    question: "구조화 데이터(JSON-LD)에 대한 설명으로 맞는 쪽은 어디일까요?",
    options: [
      "페이지 화면의 디자인을 바꿔 사람의 눈에 잘 띄게 한다.",
      "화면에는 보이지 않고, 크롤러가 정보의 의미를 확정하도록 돕는다.",
    ],
    correct: 1,
    explain:
      "구조화 데이터는 화면에 나타나지 않는 코드입니다.\n상품명, 가격, FAQ 같은 정보가 무엇인지 형식으로 선언해, AI가 추측 없이 정보를 읽게 합니다.",
  },
  {
    question: "llms.txt를 쓰는 방법으로 알맞은 쪽은 어디일까요?",
    options: [
      "본문에 없는 홍보 문구를 자유롭게 쓴다.",
      "사이트 정의와 핵심 페이지, 근거 요약을 본문과 일치하게 쓴다.",
    ],
    correct: 1,
    explain:
      "llms.txt는 사이트의 요약 안내문이므로 본문과 어긋나면 신뢰를 잃습니다.\n페이지에 실재하는 정의문과 근거를 그대로 요약하는 것이 원칙입니다.",
  },
];

/* ===== 정리: GEO 기술 점검 카드 ===== */

export const FINAL_TEMPLATE = `[GEO 기술 점검 카드]

1. 크롤러 접근 (robots.txt)
- 사이트주소/robots.txt 를 열어 확인했는가: [예 / 아니요]
- GPTBot, ClaudeBot, PerplexityBot이 차단되어 있지 않은가: [예 / 아니요]

2. 구조화 데이터 (JSON-LD)
- 페이지 유형에 맞는 스키마가 있는가 (Product, FAQPage, Article 등): [예 / 아니요]
- 스키마의 내용이 본문의 문장과 일치하는가: [예 / 아니요]

3. llms.txt
- 사이트 한 줄 정의가 첫 줄에 있는가: [예 / 아니요]
- 핵심 페이지 목록과 근거 요약이 본문과 일치하는가: [예 / 아니요]`;

export const THREE_ELEMENTS = [
  {
    name: "크롤러 접근",
    desc: "robots.txt가 AI 크롤러를 차단하고 있으면 어떤 보강도 효과가 없습니다. 기술 점검의 첫 순서입니다.",
  },
  {
    name: "구조화 데이터",
    desc: "JSON-LD는 화면에 보이지 않는 이름표입니다. AI가 상품, 가격, FAQ를 추측 없이 확정하게 합니다.",
  },
  {
    name: "llms.txt",
    desc: "사이트 전체를 AI에게 요약해 주는 안내 파일입니다. 정의문과 근거를 본문과 일치하게 요약합니다.",
  },
];
