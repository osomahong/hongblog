/**
 * Day 4 (목): 보고 전야. 대형 업무(보고서 초안)와 아부 함정.
 * 학습: 단계 분해, 반대 의견 요청. 이날의 품질이 보스전 준비도로 이월된다.
 */

import type { DaySpec, TaskCard } from "../schema";

const SURPRISE_POOL: TaskCard[] = [
  {
    kind: "standard",
    id: "d4s-print",
    title: "보고 자료 인쇄와 제본",
    brief: "내일 보고용 자료 6부, 인쇄실에서 제본까지 부탁해요. 직접 가야 해요.",
    from: "manager",
    tags: ["trivial"],
    requiredElements: [],
    directCost: { time: 1, energy: 1 },
    required: false,
    trustWeight: 0.5,
    delegatePenaltyText: [
      { speaker: "ai", text: "인쇄실에 갈 수 없습니다. 인쇄 설정 가이드를 작성했습니다." },
      { speaker: "me", text: "가이드를 들고 결국 내가 내려갔다." },
    ],
    aiPreview: { clean: "인쇄와 제본은 직접 해야 한다." },
    outcomeText: {
      excellent: [{ speaker: "system", text: "제본 6부 완료." }],
      pass: [{ speaker: "system", text: "제본 6부 완료." }],
      rework: [{ speaker: "system", text: "페이지가 뒤섞였다." }],
    },
  },
  {
    kind: "standard",
    id: "d4s-cover",
    title: "보고서 표지 카피",
    brief: "표지에 들어갈 한 줄 카피가 필요해요. 작년 우수 보고서 표지들 첨부할게요. 그 느낌으로.",
    from: "manager",
    tags: [],
    requiredElements: ["example"],
    directCost: { time: 1, energy: 1 },
    required: false,
    aiPreview: { clean: "작년 우수 보고서 느낌의 카피 후보 5개." },
    outcomeText: {
      excellent: [{ speaker: "manager", text: "둘째 줄, 그걸로 갑시다." }],
      pass: [{ speaker: "manager", text: "하나 골라 쓸게요." }],
      rework: [{ speaker: "manager", text: "광고 카피 같은데요. 보고서예요." }],
    },
  },
];

export const DAY4: DaySpec = {
  day: 4,
  title: "목요일: 보고 전야",
  timeBudget: 6,
  briefing: [
    { speaker: "system", text: "목요일. 내일 14시가 본부장 보고다." },
    { speaker: "manager", text: "오늘은 보고 준비가 최우선입니다. 초안 오늘 중으로 봅시다." },
    { speaker: "me", text: "이번 주 내내 한 일이 내일 한 번에 평가받는다." },
  ],
  tasks: [
    {
      kind: "standard",
      id: "d4-deck",
      title: "본부장 보고서 초안",
      brief:
        "분기 실적과 다음 분기 계획, 15장 내외 초안입니다. 이번 분기 목표 문서 기준으로, 결론부터 역순 구성으로 가 주세요. 통으로 쓰지 말고 장별로 나눠서 잡는 게 좋을 거예요.",
      from: "manager",
      tags: [],
      requiredElements: ["context", "steps"],
      directCost: { time: 5, energy: 4 },
      required: true,
      carryToBoss: 2,
      aiPreview: { clean: "목차부터 장별 초안까지, 결론 우선 구성의 15장 초안이 잡혔다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "구성 좋네요. 이대로 내일 갑시다." }],
        pass: [{ speaker: "manager", text: "골격은 됐어요. 몇 장만 보강합시다." }],
        rework: [
          { speaker: "manager", text: "15장이 한 덩어리네요. 장별로 논리가 끊겨요." },
        ],
      },
      lesson: "큰 일은 통째로 시키지 말고 단계로 나눠 시키세요. 사람에게도, AI에게도요.",
    },
    {
      kind: "standard",
      id: "d4-appendix",
      title: "데이터 부록 정리",
      brief:
        "보고서 뒤에 붙을 데이터 부록입니다. 이번 주 조사 자료를 표 형식으로, 지난 분기 부록 양식 그대로 정리해 주세요.",
      from: "manager",
      tags: [],
      requiredElements: ["context", "example"],
      directCost: { time: 2, energy: 2 },
      required: true,
      carryToBoss: 1,
      aiPreview: { clean: "조사 자료가 지난 분기 양식 그대로 부록 표로 정리됐다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "부록까지 양식 맞췄네요. 좋습니다." }],
        pass: [{ speaker: "manager", text: "부록 확인했습니다." }],
        rework: [{ speaker: "manager", text: "양식이 지난 분기랑 다른데요." }],
      },
    },
    {
      kind: "choice",
      id: "d4-feedback",
      title: "내 초안, 제출 전 점검",
      brief: "초안을 한 번 점검하고 싶다. 어딘가 걸리는 데가 있는 것 같은데, 어떻게 물어볼까.",
      from: "me",
      required: true,
      options: [
        {
          id: "d4-feedback-critique",
          label: "\"이 초안의 약점 3가지를 근거와 함께 비판해 줘\"",
          detail: "듣기 불편해도 구멍을 찾는 질문",
          cost: { time: 1, energy: 1 },
          requiresConcept: "critique",
          tier: "excellent",
          prepDelta: 2,
          setFlags: ["draft-critiqued"],
          reply: [
            { speaker: "ai", text: "3번 장의 결론이 근거 없이 비약합니다. 수치 출처 표기가 두 곳 빠졌습니다." },
            { speaker: "me", text: "아프지만 맞는 말이다. 내일 전에 알아서 다행이다." },
          ],
          lesson: "비판을 요청해야 AI가 비판합니다. 그냥 물으면 칭찬부터 합니다.",
        },
        {
          id: "d4-feedback-confirm",
          label: "\"이 정도면 괜찮지?\"",
          detail: "확인받고 싶은 질문",
          cost: { time: 1, energy: 1 },
          tier: "pass",
          prepDelta: -1,
          reply: [
            { speaker: "ai", text: "전반적으로 훌륭한 초안입니다! 논리 전개가 자연스럽습니다." },
            { speaker: "me", text: "칭찬만 하네. 뭔가 찜찜한데, 시간이 없다." },
          ],
          lesson: "AI는 묻는 방식대로 답합니다. 동의를 구하면 동의가 돌아옵니다.",
        },
        {
          id: "d4-feedback-skip",
          label: "점검 생략. 이대로 간다",
          detail: "시간은 아끼지만 구멍도 그대로",
          cost: { time: 0, energy: 0 },
          tier: "pass",
          prepDelta: -2,
          reply: [{ speaker: "me", text: "시간이 없다. 그냥 가자." }],
        },
      ],
    },
    {
      kind: "standard",
      id: "d4-qa",
      title: "예상 질문 리스트",
      brief:
        "본부장님 성향상 수치 근거랑 실행 계획을 파고들 거예요. 예상 질문과 답변 포인트를 단계별로 정리해 둡시다.",
      from: "manager",
      tags: [],
      requiredElements: ["role", "steps"],
      directCost: { time: 2, energy: 2 },
      required: false,
      carryToBoss: 1,
      aiPreview: { clean: "날카로운 예상 질문 8개와 답변 포인트가 단계별로 정리됐다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "질문 리스트 날카롭네요. 이건 진짜 나올 것 같은데요." }],
        pass: [{ speaker: "manager", text: "참고하겠습니다." }],
        rework: [{ speaker: "manager", text: "질문이 너무 일반론이에요." }],
      },
    },
    {
      kind: "standard",
      id: "d4-notice",
      title: "보고 일정 공지 메일",
      brief: "내일 보고 일정과 참석자, 회의실을 관련 부서에 공지해 주세요. 우리 팀 공지 양식 알죠?",
      from: "manager",
      tags: [],
      requiredElements: ["example"],
      directCost: { time: 1, energy: 1 },
      required: true,
      aiPreview: { clean: "팀 공지 양식에 맞춘 일정 공지 메일." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "공지 나갔네요." }],
        pass: [{ speaker: "manager", text: "공지 확인했습니다." }],
        rework: [{ speaker: "manager", text: "참석자 명단이 빠졌어요." }],
      },
    },
  ],
  surprisePool: SURPRISE_POOL,
  coaching: [
    {
      id: "d4-coach-steps",
      afterResolvedCount: 1,
      dialogue: [
        { speaker: "minji", text: "보고서처럼 큰 건 \"목차 먼저, 그다음 장별로\" 나눠서 시켜요." },
        { speaker: "minji", text: "한 번에 다 시키면 중간부터 흐릿해져요. 단계로 쪼개면 각 장이 살아요." },
      ],
      grantConcept: "steps",
    },
    {
      id: "d4-coach-critique",
      afterResolvedCount: 2,
      dialogue: [
        { speaker: "minji", text: "초안 점검할 땐 \"괜찮지?\"라고 묻지 마요. 무조건 괜찮대요." },
        { speaker: "minji", text: "\"약점을 비판해 줘\"라고 해야 진짜 점검이 돼요." },
      ],
      grantConcept: "critique",
    },
  ],
  fallbackConcepts: ["steps", "critique"],
  insightSlugs: ["what-is-sycophancy", "prompt-engineering-basics"],
};
