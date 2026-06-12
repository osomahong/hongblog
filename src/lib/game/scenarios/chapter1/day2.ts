/**
 * Day 2 (화): 첫 함정. 직접 처리 총비용(필수 9블록) > 예산(6블록) 시작.
 * 학습: 예시 제시, 결과 검증. 환각 함정(d2-market)이 지연 폭탄으로 장전될 수 있다.
 */

import type { DaySpec, TaskCard } from "../schema";

const SURPRISE_POOL: TaskCard[] = [
  {
    kind: "standard",
    id: "d2s-icebreak",
    title: "워크숍 아이스브레이킹 아이디어",
    brief: "다음 주 팀 워크숍 첫 30분에 쓸 아이스브레이킹 3가지만 뽑아 줘요. 작년에 한 건 빼고요.",
    from: "minji",
    tags: [],
    requiredElements: ["example"],
    directCost: { time: 1, energy: 1 },
    required: false,
    aiPreview: { clean: "진행 방법과 예상 소요 시간이 붙은 아이스브레이킹 3종." },
    outcomeText: {
      excellent: [{ speaker: "minji", text: "오, 둘째 거 좋다. 이걸로 가요." }],
      pass: [{ speaker: "minji", text: "고마워요. 참고할게요." }],
      rework: [{ speaker: "minji", text: "이거 작년에 한 건데요?" }],
    },
  },
  {
    kind: "standard",
    id: "d2s-survey",
    title: "고객 설문 문항 초안",
    brief: "신제품 사전 반응 설문 10문항 초안이 필요해요. 지난번 설문 파일 첨부합니다. 그 톤으로요.",
    from: "manager",
    tags: [],
    requiredElements: ["context", "example"],
    directCost: { time: 2, energy: 2 },
    required: false,
    aiPreview: { clean: "선택형 8문항, 서술형 2문항. 지난 설문과 같은 톤이다." },
    outcomeText: {
      excellent: [{ speaker: "manager", text: "문항 밸런스 좋네요. 이대로 올립시다." }],
      pass: [{ speaker: "manager", text: "두 문항만 다듬어서 올려 주세요." }],
      rework: [{ speaker: "manager", text: "우리 고객층이랑 안 맞는 질문이 많네요." }],
    },
  },
  {
    kind: "standard",
    id: "d2s-faq",
    title: "고객 문의 FAQ 답변 정리",
    brief: "이번 주 반복 문의 5건, 답변 템플릿으로 정리해 주세요. CS팀에 넘길 겁니다.",
    from: "manager",
    tags: [],
    requiredElements: ["role", "context"],
    directCost: { time: 2, energy: 2 },
    required: false,
    aiPreview: { clean: "문의 유형별 답변 템플릿 5종. CS팀이 바로 쓸 수 있는 형태다." },
    outcomeText: {
      excellent: [{ speaker: "manager", text: "CS팀에서 좋아하겠네요." }],
      pass: [{ speaker: "manager", text: "전달했습니다." }],
      rework: [{ speaker: "manager", text: "답변 톤이 우리 게 아닌데요." }],
    },
  },
];

export const DAY2: DaySpec = {
  day: 2,
  title: "화요일: 너무 깔끔한 보고서",
  timeBudget: 6,
  briefing: [
    { speaker: "system", text: "화요일. 출근하자마자 메신저가 쌓여 있다." },
    { speaker: "manager", text: "오늘 좀 많습니다. 우선순위는 알아서 잡으세요." },
    { speaker: "me", text: "전부 직접 하면 오늘 안에 못 끝낸다. 어제 배운 걸 써 볼 때인가." },
  ],
  tasks: [
    {
      kind: "standard",
      id: "d2-summary",
      title: "30페이지 보고서 요약",
      brief:
        "본부 전략 보고서 30페이지, 오후 회의 전까지 1페이지 요약 부탁해요. 지난달 요약본처럼 3단 구성으로요.",
      from: "manager",
      tags: [],
      requiredElements: ["context", "example"],
      directCost: { time: 3, energy: 3 },
      required: true,
      aiPreview: { clean: "핵심 결론, 근거, 시사점 3단 구성의 1페이지 요약." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "30페이지를 이렇게 줄였네요. 회의 때 씁시다." }],
        pass: [{ speaker: "manager", text: "확인했습니다." }],
        rework: [{ speaker: "manager", text: "요약이 아니라 목차네요, 이건." }],
      },
      lesson: "원하는 형식의 예시를 주면 결과물의 형태가 잡힙니다.",
    },
    {
      kind: "standard",
      id: "d2-market",
      title: "시장 규모 조사",
      brief:
        "다음 주 본부장 보고에 들어갈 자료예요. 국내 시장 최근 3년 규모랑 경쟁사 점유율 수치, 출처까지 정리해 주세요.",
      from: "manager",
      tags: ["hallucination"],
      requiredElements: ["role", "context"],
      directCost: { time: 4, energy: 3 },
      required: true,
      bombTrustHit: -15,
      carryToBoss: 1,
      aiPreview: {
        clean: "3개년 시장 규모 추이와 점유율 표. 출처 원문을 확인한 수치만 남겼다.",
        hallucinated:
          "3개년 시장 규모 추이와 점유율 표가 출처까지 깔끔하게 정리됐다. 숫자가 묘하게 딱 떨어진다.",
      },
      hallucinationDetail:
        "점유율 수치 2개의 출처 \"한국산업데이터연구원 2025 동향 보고서\"는 실제로 존재하지 않는 자료입니다.",
      outcomeText: {
        excellent: [{ speaker: "manager", text: "수치 깔끔하네요. 보고 자료에 그대로 넣겠습니다." }],
        pass: [{ speaker: "manager", text: "정리됐네요. 넣어 둘게요." }],
        rework: [{ speaker: "manager", text: "출처가 어디예요? 이 수치." }],
      },
      lesson: "사실과 수치가 들어가는 결과물은 출처 원문을 직접 확인해야 합니다.",
    },
    {
      kind: "standard",
      id: "d2-sns",
      title: "SNS 이벤트 문구 5종",
      brief: "이번 주 금요일 이벤트 공지 문구 5가지 버전이요. 우리 계정 말투 아시죠? 그 톤으로요.",
      from: "manager",
      tags: [],
      requiredElements: ["role", "example"],
      directCost: { time: 2, energy: 2 },
      required: false,
      aiPreview: { clean: "계정 말투를 살린 공지 문구 5종. 길이와 해시태그가 제각각이라 고르기 좋다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "셋째 거 재밌네요. 그걸로 갑시다." }],
        pass: [{ speaker: "manager", text: "하나 골라서 쓸게요." }],
        rework: [{ speaker: "manager", text: "우리 계정 말투가 아닌데요. 너무 딱딱해요." }],
      },
    },
    {
      kind: "standard",
      id: "d2-mail",
      title: "영문 계약 메일 번역",
      brief: "해외 파트너가 보낸 계약 조건 메일, 한국어로 옮기고 핵심 조건만 따로 정리해 주세요.",
      from: "manager",
      tags: [],
      requiredElements: ["context"],
      directCost: { time: 2, energy: 2 },
      required: true,
      aiPreview: { clean: "전문 번역과 함께 금액, 기한, 독점 조항이 따로 정리됐다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "조건 정리까지, 좋네요." }],
        pass: [{ speaker: "manager", text: "번역 확인했습니다." }],
        rework: [{ speaker: "manager", text: "계약 메일인데 직역 투라 뜻이 안 들어와요." }],
      },
    },
  ],
  surprisePool: SURPRISE_POOL,
  coaching: [
    {
      id: "d2-coach-example",
      afterResolvedCount: 1,
      dialogue: [
        { speaker: "minji", text: "형식이 중요한 일은 예시를 첨부해요. \"지난번 이 파일처럼\" 한 줄이면 돼요." },
      ],
      grantConcept: "example",
    },
    {
      id: "d2-coach-verify",
      afterResolvedCount: 2,
      dialogue: [
        { speaker: "minji", text: "아, 그리고 수치나 출처가 나오는 결과물은 꼭 원문 확인하세요." },
        { speaker: "minji", text: "AI가 없는 보고서를 진짜처럼 지어내는 경우가 있어요. 멀쩡해 보여서 더 위험해요." },
      ],
      grantConcept: "verify",
    },
  ],
  fallbackConcepts: ["example", "verify"],
  insightSlugs: ["what-is-hallucination", "prompt-engineering-basics"],
};
