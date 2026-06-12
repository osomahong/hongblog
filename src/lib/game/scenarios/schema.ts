/**
 * 시나리오 저작 스키마: 대사·텍스트(콘텐츠)와 판정 규칙(로직)을 분리한다.
 * 챕터 추가 = scenarios/chapterN/ 디렉터리 + 레지스트리 등록만으로 가능해야 한다.
 * 이 파일은 React를 import하지 않는다.
 */

export type SpeakerId =
  | "me" // 플레이어 독백
  | "manager" // 김 팀장
  | "minji" // 민지 선배 (AI 얼리어답터 동료)
  | "director" // 본부장 (보스)
  | "security" // 보안팀
  | "ai" // AI 어시스턴트
  | "system"; // 내레이션/시스템

export interface Dialogue {
  speaker: SpeakerId;
  text: string;
}

/** 프롬프트 카드 (해금형 자원) */
export type PromptElement = "role" | "context" | "example" | "steps";

/** 챕터 1 교육 개념. 습득 = 카드/행동 해금 */
export type ConceptId =
  | "role" // 역할 지정 → 카드 [역할]
  | "context" // 맥락 제공 → 카드 [맥락]
  | "example" // 예시 제시 → 카드 [예시]
  | "verify" // 결과 검증/환각 → 행동 [검증하고 제출]
  | "delegation" // 위임 판단 → 업무 카드 위임 적합도 힌트
  | "privacy" // 민감정보 주의 → 행동 [가명화 후 위임]
  | "steps" // 단계 분해 → 카드 [단계분해]
  | "critique"; // 아부 경계 → 선택지 [반대 의견 요청]

export interface ConceptDef {
  id: ConceptId;
  title: string;
  /** AI 노트 1줄 요약 */
  summary: string;
  /** 해금물 설명 (예: "프롬프트 카드 [역할] 사용 가능") */
  effectLabel: string;
  /** 더 알아보기 클래스 slug (/class/{slug}) */
  classSlug: string;
}

export interface DirectCost {
  time: number;
  energy: number;
}

/**
 * 함정 태그. 플레이어에게 비공개지만 단서는 brief에 반드시 적는다.
 * - hallucination: 수치·출처 요구 → 미검증 제출 시 지연 폭탄
 * - confidential: 대외비 → AI 위임 즉시 보안 경고
 * - trivial: 잡무 → AI 위임이 오히려 손해
 */
export type TaskTag = "hallucination" | "confidential" | "trivial";

export interface TaskOutcomeText {
  excellent: Dialogue[];
  pass: Dialogue[];
  rework: Dialogue[];
}

/** 표준 업무: 직접 처리 / AI 위임(+프롬프트 카드 조합) / 검증 */
export interface StandardTask {
  kind: "standard";
  id: string;
  title: string;
  brief: string;
  from: SpeakerId;
  tags: TaskTag[];
  /** 프롬프트 카드 일치 시 +2/장. 단서는 brief에 공개 */
  requiredElements: PromptElement[];
  directCost: DirectCost;
  /** true면 당일 미완료 시 마감 실패 (신뢰 페널티) */
  required: boolean;
  /** 잡무는 0.5 (신뢰 보상 절반) */
  trustWeight?: 0.5 | 1;
  /** 보스 준비도 가중치: 결과 등급에 곱해 prepScore에 누적 */
  carryToBoss?: number;
  /** hallucination 태그 전용: 미검증 제출 시 발각 페널티 */
  bombTrustHit?: number;
  /** AI 위임 결과 미리보기 텍스트 */
  aiPreview: {
    clean: string;
    /** hallucination 태그면 필수: 그럴듯하지만 틀린 결과 */
    hallucinated?: string;
  };
  /** 검증 시 빨간 하이라이트로 보여줄 설명 */
  hallucinationDetail?: string;
  /** confidential 태그 전용: AI 위임 시 보안팀 경고 컷신 */
  securityText?: Dialogue[];
  /** trivial 태그 전용: AI 위임이 손해였다는 결과 연출 */
  delegatePenaltyText?: Dialogue[];
  outcomeText: TaskOutcomeText;
  /** 결과 화면 학습 포인트 1줄 */
  lesson?: string;
}

/** 분기 선택 업무: 처리 방식이 아니라 명시적 선택지 (판단형·아부 함정 등) */
export interface ChoiceOption {
  id: string;
  label: string;
  detail?: string;
  cost: DirectCost;
  /** 해금 개념이 있어야 선택 가능 (미해금 시 잠금 표시) */
  requiresConcept?: ConceptId;
  tier: "excellent" | "pass" | "rework";
  /** 보스 준비도 가감 */
  prepDelta?: number;
  setFlags?: string[];
  reply: Dialogue[];
  lesson?: string;
}

export interface ChoiceTask {
  kind: "choice";
  id: string;
  title: string;
  brief: string;
  from: SpeakerId;
  required: boolean;
  trustWeight?: 0.5 | 1;
  options: ChoiceOption[];
}

export type TaskCard = StandardTask | ChoiceTask;

/** 동료 코칭: 그날 업무 N개 해결 후 등장, 개념 카드 지급 */
export interface CoachingEvent {
  id: string;
  afterResolvedCount: number;
  dialogue: Dialogue[];
  grantConcept?: ConceptId;
}

export interface DaySpec {
  day: number;
  title: string;
  /** 하루 시간 블록 (기본 6) */
  timeBudget: number;
  briefing: Dialogue[];
  tasks: TaskCard[];
  /** 시드 난수로 1개 추첨해 당일 업무에 추가 */
  surprisePool?: TaskCard[];
  coaching: CoachingEvent[];
  /** 그날 끝까지 미습득이면 정산에서 회고로 지급 (진행 보장) */
  fallbackConcepts: ConceptId[];
  /** 정산 화면 "오늘의 인사이트" 추천 클래스 slug */
  insightSlugs: string[];
}

export interface BossOption {
  id: string;
  label: string;
  /** 0~5점 */
  score: number;
  /** 플래그 보유 시에만 활성화 (예: verified:task-d2-market) */
  requiresFlag?: string;
  /** 개념 해금 시에만 활성화 (배운 것이 보스전 선택지가 된다) */
  requiresConcept?: ConceptId;
  reply: Dialogue[];
}

export interface BossRound {
  id: string;
  question: Dialogue[];
  /** 이 업무의 폭탄이 미해제면 라운드가 발각 이벤트로 교체됨 */
  bombTaskId?: string;
  bombReveal?: Dialogue[];
  options: BossOption[];
}

export interface BossSpec {
  intro: Dialogue[];
  rounds: BossRound[];
  /** 준비도 + Q&A 합산 통과선 */
  passScore: number;
  passDialogue: Dialogue[];
  failDialogue: Dialogue[];
}

export type GameOverCause = "trust" | "security" | "boss";

export interface GameOverText {
  title: string;
  dialogue: Dialogue[];
  /** 사인과 직결된 클래스 추천 */
  classSlug?: string;
}

export interface EndingDef {
  id: string;
  title: string;
  /** 조건 AND. 우선순위 순 평가, 마지막 엔딩은 조건 없이 catch-all */
  minTrust?: number;
  minKpi?: number;
  dialogue: Dialogue[];
  epilogue: string;
}

export interface ChapterSpec {
  id: string;
  title: string;
  subtitle: string;
  intro: Dialogue[];
  concepts: ConceptDef[];
  initial: {
    energy: number;
    trust: number;
  };
  /** 마지막 Day가 보스 데이 (잔무 + START_BOSS) */
  days: DaySpec[];
  boss: BossSpec;
  endings: EndingDef[];
  gameOverTexts: Record<GameOverCause, GameOverText>;
}
