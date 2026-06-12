/**
 * 테스트 전용 미니 챕터: 2일 구성 (Day 1 일반, Day 2 보스).
 * 모든 메커니즘(함정 3종·선택 업무·코칭·폭탄·엔딩)을 최소 데이터로 커버한다.
 */

import type {
  ChapterSpec,
  ChoiceTask,
  Dialogue,
  StandardTask,
} from "../scenarios/schema";

const say = (text: string): Dialogue[] => [{ speaker: "manager", text }];

export const T_BASIC: StandardTask = {
  kind: "standard",
  id: "t-basic",
  title: "회의록 정리",
  brief: "지난주 포맷 그대로 표로 정리해 주세요.",
  from: "manager",
  tags: [],
  requiredElements: ["role", "context"],
  directCost: { time: 3, energy: 3 },
  required: true,
  aiPreview: { clean: "결정사항 표" },
  outcomeText: {
    excellent: say("좋네요. 이대로 갑시다."),
    pass: say("확인했습니다."),
    rework: say("포맷이 왜 바뀌었어요?"),
  },
};

export const T_HALLU: StandardTask = {
  kind: "standard",
  id: "t-hallu",
  title: "시장 규모 조사",
  brief: "최근 3년 수치와 출처를 정리해 주세요.",
  from: "manager",
  tags: ["hallucination"],
  requiredElements: ["role", "context"],
  directCost: { time: 4, energy: 3 },
  required: true,
  bombTrustHit: -15,
  carryToBoss: 1,
  aiPreview: {
    clean: "검증된 시장 수치",
    hallucinated: "그럴듯한 시장 수치",
  },
  hallucinationDetail: "점유율 출처 보고서가 실제로 존재하지 않습니다.",
  outcomeText: {
    excellent: say("수치 깔끔하네요."),
    pass: say("정리됐네요."),
    rework: say("출처가 어디예요?"),
  },
};

export const T_CONF: StandardTask = {
  kind: "standard",
  id: "t-conf",
  title: "단가표 요약 (대외비)",
  brief: "첨부 엑셀 핵심만 요약해 주세요.",
  from: "manager",
  tags: ["confidential"],
  requiredElements: ["context"],
  directCost: { time: 2, energy: 2 },
  required: false,
  securityText: [{ speaker: "security", text: "외부 AI 입력이 감지되었습니다." }],
  aiPreview: { clean: "요약본" },
  outcomeText: {
    excellent: say("좋습니다."),
    pass: say("확인."),
    rework: say("다시요."),
  },
};

export const T_TRIV: StandardTask = {
  kind: "standard",
  id: "t-triv",
  title: "회의실 예약",
  brief: "목요일 14시 8인 회의실 잡아 주세요.",
  from: "manager",
  tags: ["trivial"],
  requiredElements: [],
  directCost: { time: 1, energy: 1 },
  required: false,
  trustWeight: 0.5,
  delegatePenaltyText: [{ speaker: "minji", text: "그건 그냥 하는 게 빨라요." }],
  aiPreview: { clean: "예약 완료" },
  outcomeText: {
    excellent: say("오케이."),
    pass: say("오케이."),
    rework: say("예약 안 됐는데요?"),
  },
};

export const T_CHOICE: ChoiceTask = {
  kind: "choice",
  id: "t-choice",
  title: "초안 점검",
  brief: "임원 보고 초안을 점검한다.",
  from: "me",
  required: false,
  options: [
    {
      id: "opt-critique",
      label: "약점 3가지를 비판해 달라고 요청",
      cost: { time: 1, energy: 1 },
      requiresConcept: "verify",
      tier: "excellent",
      prepDelta: 2,
      setFlags: ["draft-reviewed"],
      reply: [{ speaker: "ai", text: "논리 비약이 1곳 있습니다." }],
    },
    {
      id: "opt-flatter",
      label: "이 정도면 괜찮지? 라고 묻기",
      cost: { time: 1, energy: 1 },
      tier: "pass",
      prepDelta: -1,
      reply: [{ speaker: "ai", text: "전반적으로 훌륭합니다!" }],
    },
  ],
};

export const T_D2: StandardTask = {
  kind: "standard",
  id: "t-d2",
  title: "잔무 처리",
  brief: "오전 중에 끝내 주세요.",
  from: "manager",
  tags: [],
  requiredElements: ["role"],
  directCost: { time: 2, energy: 2 },
  required: true,
  aiPreview: { clean: "처리 완료" },
  outcomeText: {
    excellent: say("빠르네요."),
    pass: say("확인."),
    rework: say("다시."),
  },
};

export const TEST_CHAPTER: ChapterSpec = {
  id: "test-chapter",
  title: "테스트 챕터",
  subtitle: "이틀 생존",
  intro: [{ speaker: "system", text: "월요일 아침." }],
  concepts: [
    {
      id: "role",
      title: "역할 지정",
      summary: "AI에게 역할을 준다.",
      effectLabel: "카드 [역할]",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "context",
      title: "맥락 제공",
      summary: "배경을 준다.",
      effectLabel: "카드 [맥락]",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "verify",
      title: "결과 검증",
      summary: "수치는 검증한다.",
      effectLabel: "행동 [검증]",
      classSlug: "what-is-hallucination",
    },
    {
      id: "privacy",
      title: "민감정보 주의",
      summary: "기밀은 가명화한다.",
      effectLabel: "행동 [가명화]",
      classSlug: "responsible-ai-use",
    },
  ],
  initial: { energy: 10, trust: 50 },
  days: [
    {
      day: 1,
      title: "월요일",
      timeBudget: 6,
      briefing: say("오늘 업무 공유합니다."),
      tasks: [T_BASIC, T_HALLU, T_CONF, T_TRIV, T_CHOICE],
      coaching: [
        {
          id: "c-role",
          afterResolvedCount: 1,
          dialogue: [{ speaker: "minji", text: "역할을 줘 보세요." }],
          grantConcept: "role",
        },
        {
          id: "c-context",
          afterResolvedCount: 2,
          dialogue: [{ speaker: "minji", text: "맥락도요." }],
          grantConcept: "context",
        },
      ],
      fallbackConcepts: ["verify", "privacy"],
      insightSlugs: ["prompt-engineering-basics"],
    },
    {
      day: 2,
      title: "화요일 (보고)",
      timeBudget: 4,
      briefing: say("오후에 본부장 보고입니다."),
      tasks: [T_D2],
      coaching: [],
      fallbackConcepts: [],
      insightSlugs: ["what-is-hallucination"],
    },
  ],
  boss: {
    intro: [{ speaker: "director", text: "시작하죠." }],
    rounds: [
      {
        id: "r1",
        question: [{ speaker: "director", text: "이 수치 출처가 어디죠?" }],
        options: [
          {
            id: "r1-best",
            label: "원문 확인했습니다.",
            score: 5,
            requiresFlag: "verified:t-hallu",
            reply: [{ speaker: "director", text: "좋습니다." }],
          },
          {
            id: "r1-ok",
            label: "확인 후 회신드리겠습니다.",
            score: 3,
            reply: [{ speaker: "director", text: "오늘 중으로요." }],
          },
          {
            id: "r1-bad",
            label: "AI가 정리해 준 수치입니다.",
            score: 0,
            reply: [{ speaker: "director", text: "그게 답변입니까?" }],
          },
        ],
      },
      {
        id: "r2",
        question: [{ speaker: "director", text: "점유율 근거는요?" }],
        bombTaskId: "t-hallu",
        bombReveal: [
          { speaker: "director", text: "이 보고서, 존재하지 않는데요." },
        ],
        options: [
          {
            id: "r2-ok",
            label: "조사 범위를 말씀드리겠습니다.",
            score: 4,
            reply: [{ speaker: "director", text: "계속하세요." }],
          },
          {
            id: "r2-bad",
            label: "대략적인 추정치입니다.",
            score: 1,
            reply: [{ speaker: "director", text: "추정이요?" }],
          },
        ],
      },
    ],
    passScore: 6,
    passDialogue: [{ speaker: "director", text: "수고했어요." }],
    failDialogue: [{ speaker: "director", text: "다시 준비하세요." }],
  },
  endings: [
    {
      id: "ending-a",
      title: "팀의 AI 에이스",
      minTrust: 75,
      minKpi: 10,
      dialogue: say("다음 프로젝트 맡아 볼래요?"),
      epilogue: "에이스가 됐다.",
    },
    {
      id: "ending-b",
      title: "무사히 생존",
      minTrust: 40,
      dialogue: say("한 주 수고했어요."),
      epilogue: "평범한 금요일.",
    },
    {
      id: "ending-c",
      title: "턱걸이 통과",
      dialogue: say("다음 주에 봅시다."),
      epilogue: "경고성 면담.",
    },
  ],
  gameOverTexts: {
    trust: {
      title: "프로젝트 제외",
      dialogue: say("이 프로젝트에서 빠져 주세요."),
    },
    security: {
      title: "보안 사고",
      dialogue: [{ speaker: "security", text: "2차 위반입니다." }],
      classSlug: "responsible-ai-use",
    },
    boss: {
      title: "보고 실패",
      dialogue: [{ speaker: "director", text: "다시 준비하세요." }],
    },
  },
};
