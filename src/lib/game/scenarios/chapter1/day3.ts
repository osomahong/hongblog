/**
 * Day 3 (수): 판단의 날. "전부 AI"도 오답임을 배운다.
 * 학습: 위임 판단, 민감정보 주의. 기밀 함정(d3-pricing) + 잡무 함정(d3-rooms).
 */

import type { DaySpec, TaskCard } from "../schema";

const SURPRISE_POOL: TaskCard[] = [
  {
    kind: "choice",
    id: "d3s-dinner",
    title: "팀 회식 장소 정하기",
    brief: "팀장: \"이번 회식 장소, 이번엔 좀 새로운 데로 알아봐 줄래요? 다들 좋아할 만한 곳으로.\"",
    from: "manager",
    required: false,
    trustWeight: 0.5,
    options: [
      {
        id: "d3s-dinner-ask",
        label: "팀원들 취향을 떠올리며 직접 고른다",
        detail: "민지 선배는 매운 거 못 먹고, 박 대리는 회식 자체를 싫어하지.",
        cost: { time: 1, energy: 1 },
        tier: "excellent",
        reply: [
          { speaker: "manager", text: "오, 여기 좋네요. 예약해 주세요." },
        ],
        lesson: "사람의 취향과 관계가 걸린 판단은 AI가 대신할 수 없습니다.",
      },
      {
        id: "d3s-dinner-ai",
        label: "AI에게 회식 장소를 추천받아 그대로 공지한다",
        cost: { time: 1, energy: 1 },
        tier: "pass",
        reply: [
          { speaker: "manager", text: "무난하긴 한데, 이건 본인 생각을 물어본 거였어요." },
          { speaker: "me", text: "AI는 우리 팀원들 얼굴을 모르지." },
        ],
        lesson: "판단형 업무에서 AI의 답은 무난함의 상한에 갇힙니다.",
      },
    ],
  },
  {
    kind: "standard",
    id: "d3s-receipt",
    title: "법인카드 영수증 정리",
    brief: "이번 달 영수증 7장, 경비 시스템에 입력만 하면 됩니다. 10분 일이에요.",
    from: "minji",
    tags: ["trivial"],
    requiredElements: [],
    directCost: { time: 1, energy: 1 },
    required: false,
    trustWeight: 0.5,
    delegatePenaltyText: [
      { speaker: "ai", text: "경비 시스템에 접근할 수 없습니다. 입력용 표만 정리했습니다." },
      { speaker: "me", text: "표 받아서 결국 내가 입력했다. 두 번 일했네." },
    ],
    aiPreview: { clean: "영수증 내역이 표로 정리됐다. 시스템 입력은 직접 해야 한다." },
    outcomeText: {
      excellent: [{ speaker: "system", text: "경비 처리 완료." }],
      pass: [{ speaker: "system", text: "경비 처리 완료." }],
      rework: [{ speaker: "system", text: "증빙 누락." }],
    },
  },
  {
    kind: "standard",
    id: "d3s-welcome",
    title: "신입 환영 메시지",
    brief: "다음 주 신입 오는데 팀 단톡에 올릴 환영 인사 좀. 저번 신입 때처럼 가볍고 따뜻하게요.",
    from: "manager",
    tags: [],
    requiredElements: ["example"],
    directCost: { time: 1, energy: 1 },
    required: false,
    aiPreview: { clean: "가볍고 따뜻한 환영 메시지. 지난번 톤과 비슷하다." },
    outcomeText: {
      excellent: [{ speaker: "manager", text: "좋네요. 이대로 올려요." }],
      pass: [{ speaker: "manager", text: "올렸습니다." }],
      rework: [{ speaker: "manager", text: "너무 격식체인데요. 단톡용이에요." }],
    },
  },
];

export const DAY3: DaySpec = {
  day: 3,
  title: "수요일: 맡길 일과 맡기면 안 되는 일",
  timeBudget: 6,
  briefing: [
    { speaker: "system", text: "수요일. 업무 목록이 어제보다 길다." },
    { speaker: "manager", text: "오늘 단가표 건은 대외비입니다. 취급 주의하세요." },
    { speaker: "me", text: "다 AI에 맡기면 되는 거 아니었나. 뭔가 더 있는 것 같다." },
  ],
  tasks: [
    {
      kind: "standard",
      id: "d3-pricing",
      title: "신제품 단가표 요약 (대외비)",
      brief:
        "첨부한 신제품 원가, 공급가 엑셀을 영업팀 공유용으로 핵심만 요약해 주세요. 대외비 문서입니다.",
      from: "manager",
      tags: ["confidential"],
      requiredElements: ["context"],
      directCost: { time: 2, energy: 3 },
      required: true,
      securityText: [
        { speaker: "security", text: "[보안팀] 외부 AI 서비스에 대외비 자료 입력이 감지되었습니다." },
        { speaker: "security", text: "관련 규정에 따라 부서장에게 통보됩니다." },
        { speaker: "manager", text: "...잠깐 회의실로 오세요." },
        { speaker: "me", text: "원가표를 통째로 올려 버렸다. 손이 떨린다." },
      ],
      aiPreview: { clean: "품목별 핵심 단가가 영업팀용으로 요약됐다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "보안 지키면서 잘 정리했네요." }],
        pass: [{ speaker: "manager", text: "영업팀에 전달했습니다." }],
        rework: [{ speaker: "manager", text: "핵심 품목이 빠졌는데요." }],
      },
      lesson: "기밀 자료는 AI에 올리는 순간 사고입니다. 올리기 전에 가명화하거나 직접 처리하세요.",
    },
    {
      kind: "standard",
      id: "d3-rooms",
      title: "회의실 예약과 다과 주문",
      brief: "목요일 14시, 8인 회의실 잡고 음료 좀 주문해 주세요. 5분이면 끝나요.",
      from: "manager",
      tags: ["trivial"],
      requiredElements: [],
      directCost: { time: 1, energy: 1 },
      required: true,
      trustWeight: 0.5,
      delegatePenaltyText: [
        { speaker: "ai", text: "예약 시스템에 접근할 수 없습니다. 주문 메일 초안만 작성했습니다." },
        { speaker: "minji", text: "그건 그냥 하는 게 빨라요. 시키는 게 더 오래 걸려요." },
      ],
      aiPreview: { clean: "예약과 주문은 시스템에서 직접 해야 한다." },
      outcomeText: {
        excellent: [{ speaker: "system", text: "회의실 예약 완료. 다과 주문 완료." }],
        pass: [{ speaker: "system", text: "회의실 예약 완료. 다과 주문 완료." }],
        rework: [{ speaker: "system", text: "회의실이 이미 차 있다." }],
      },
      lesson: "5분짜리 일은 직접 하는 쪽이 빠릅니다. 위임에도 비용이 있습니다.",
    },
    {
      kind: "standard",
      id: "d3-competitor",
      title: "경쟁사 신제품 분석",
      brief:
        "경쟁사가 어제 신제품을 냈어요. 공개된 스펙과 가격, 보도자료 반응을 우리 제품 기준으로 비교 정리해 주세요. 분석 틀은 지난 분기 자료 참고하시고요.",
      from: "manager",
      tags: [],
      requiredElements: ["role", "context", "example"],
      directCost: { time: 4, energy: 3 },
      required: true,
      aiPreview: { clean: "스펙, 가격, 시장 반응이 지난 분기 분석 틀에 맞춰 비교 정리됐다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "비교 축이 명확하네요. 본부 공유합시다." }],
        pass: [{ speaker: "manager", text: "확인했습니다." }],
        rework: [{ speaker: "manager", text: "이건 그냥 스펙 나열인데요. 비교 분석을 부탁한 거예요." }],
      },
    },
    {
      kind: "standard",
      id: "d3-onepager",
      title: "보고 방향 1장 정리",
      brief: "금요일 본부장 보고, 어떤 방향으로 갈지 1장으로 먼저 정리해 봐요. 이번 분기 목표 기준으로요.",
      from: "manager",
      tags: [],
      requiredElements: ["role", "context"],
      directCost: { time: 2, energy: 2 },
      required: true,
      carryToBoss: 1,
      aiPreview: { clean: "보고의 뼈대가 한 장으로 정리됐다. 금요일이 조금 덜 무섭다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "방향 좋네요. 이 골격으로 갑시다." }],
        pass: [{ speaker: "manager", text: "이 방향으로 다듬어 봅시다." }],
        rework: [{ speaker: "manager", text: "분기 목표랑 연결이 안 보여요." }],
      },
    },
  ],
  surprisePool: SURPRISE_POOL,
  coaching: [
    {
      id: "d3-coach-delegation",
      afterResolvedCount: 1,
      dialogue: [
        { speaker: "minji", text: "요령이 하나 있어요. 일 받으면 \"이거 AI한테 맡길 일인가\"부터 따져요." },
        { speaker: "minji", text: "글, 요약, 초안은 맡기고. 5분 잡무랑 사람 판단은 그냥 직접 해요." },
      ],
      grantConcept: "delegation",
    },
    {
      id: "d3-coach-privacy",
      afterResolvedCount: 2,
      dialogue: [
        { speaker: "minji", text: "대외비 자료는 절대 그대로 올리면 안 돼요. 보안팀이 다 봐요." },
        { speaker: "minji", text: "꼭 맡겨야 하면 품목명이랑 숫자를 A, B, C로 바꿔서 올려요. 가명화라고 해요." },
      ],
      grantConcept: "privacy",
    },
  ],
  fallbackConcepts: ["delegation", "privacy"],
  insightSlugs: ["four-ds-of-ai-fluency", "responsible-ai-use"],
};
