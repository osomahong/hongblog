/**
 * 런타임 게임 상태 타입. React를 import하지 않는다.
 * 모든 상태 갱신은 불변(새 객체 반환)으로 수행한다.
 */

import type {
  ConceptId,
  Dialogue,
  GameOverCause,
  PromptElement,
} from "./scenarios/schema";

export interface Resources {
  /** 오늘 남은 시간 블록 */
  time: number;
  /** 0~10. 0이면 강제 퇴근 */
  energy: number;
  /** 0~100. 0 이하 게임오버 */
  trust: number;
  /** 누적 성과 점수 (엔딩 산정) */
  kpi: number;
}

export type TierId = "excellent" | "pass" | "rework" | "fail" | "incident";

export type TaskMethod = "direct" | "delegate" | "delegate_anon";

/** UI가 조립해 한 번에 dispatch하는 표준 업무 처리 결정 */
export interface TaskSelection {
  method: TaskMethod;
  /** AI 위임 시 프롬프트 카드 (최대 3장, 해금된 것만) */
  cards: PromptElement[];
  /** 검증하고 제출 (+1블록, verify 개념 필요) */
  verify: boolean;
}

/** 판정 결과 (resolve.ts 순수 함수의 출력) */
export interface ResolvedOutcome {
  taskId: string;
  tier: TierId;
  q: number;
  timeCost: number;
  energyCost: number;
  trustDelta: number;
  kpiDelta: number;
  verified: boolean;
  /** 환각 미검증 제출 → 지연 폭탄 등록 */
  bombArmed: boolean;
  bombDefused: boolean;
  securityIncident: boolean;
  setFlags: string[];
  prepDelta: number;
  dialogue: Dialogue[];
  lesson?: string;
}

export interface TaskRuntime {
  status: "open" | "done" | "rework" | "failed";
  attempts: number;
  resultTier?: TierId;
  q?: number;
  verified?: boolean;
  /** 환각 폭탄 장전 여부 (보스전 발각 전까지) */
  bombArmed?: boolean;
}

export interface DayRuntime {
  resolvedCount: number;
  overtimeUsed: boolean;
  lunchUsed: boolean;
  coffeeUsed: boolean;
  coachingDone: string[];
  /** 시드 추첨된 돌발 업무 id */
  surpriseTaskId?: string;
}

export interface DaySummary {
  day: number;
  results: { taskId: string; title: string; tier: TierId }[];
  failedTaskIds: string[];
  trustDelta: number;
  kpiDelta: number;
  overtime: boolean;
  /** 에너지 0으로 강제 퇴근했는지 */
  forced: boolean;
  energyRestored: number;
  /** 회고로 지급된 개념 */
  fallbackConcepts: ConceptId[];
  /** 오늘 장전된 폭탄이 있으면 암시 문구 노출 */
  bombHint: boolean;
  insightSlugs: string[];
}

export type Phase =
  | { kind: "title" }
  | { kind: "intro" }
  | { kind: "day_start" }
  | { kind: "task_select" }
  | { kind: "task"; taskId: string }
  | { kind: "task_result"; taskId: string; outcome: ResolvedOutcome }
  | { kind: "coaching"; eventId: string }
  | { kind: "overtime_choice"; pendingFailIds: string[] }
  | { kind: "day_end"; summary: DaySummary }
  | { kind: "boss_intro" }
  | { kind: "boss_round"; round: number; bombed: boolean }
  | { kind: "boss_feedback"; round: number; optionId: string; score: number }
  | { kind: "boss_result"; passed: boolean; totalScore: number }
  | { kind: "ending"; endingId: string }
  | { kind: "game_over"; cause: GameOverCause };

export interface TurnRecord {
  day: number;
  taskId: string;
  method: TaskMethod | "choice";
  tier: TierId;
  timeCost: number;
  verified: boolean;
}

/** 게임오버 재시작용 체크포인트 (매일 아침 스냅샷) */
export type CheckpointData = Omit<GameState, "checkpoint">;

export interface GameState {
  version: 1;
  chapterId: string;
  seed: number;
  rngCursor: number;
  phase: Phase;
  day: number;
  resources: Resources;
  tasks: Record<string, TaskRuntime>;
  dayRt: DayRuntime;
  unlockedConcepts: ConceptId[];
  flags: Record<string, boolean>;
  securityIncidents: number;
  consecutiveOvertime: number;
  /** 보스 준비도 (carryToBoss 업무 품질 + 선택지 prepDelta 누적) */
  prepScore: number;
  bossScore: number;
  history: TurnRecord[];
  checkpoint: CheckpointData | null;
}

export type GameAction =
  | { type: "NEW_GAME"; seed: number }
  | { type: "LOAD"; saved: GameState }
  /** 대사 화면(인트로/브리핑/결과/코칭/정산 등) 종료 */
  | { type: "ADVANCE" }
  | { type: "SELECT_TASK"; taskId: string }
  | { type: "CANCEL_TASK" }
  | { type: "RESOLVE_TASK"; taskId: string; selection: TaskSelection }
  | { type: "CHOOSE_OPTION"; taskId: string; optionId: string }
  | { type: "REST"; rest: "lunch" | "coffee" }
  | { type: "REQUEST_DAY_END" }
  | { type: "OVERTIME_DECIDE"; accept: boolean }
  | { type: "START_BOSS" }
  | { type: "BOSS_ANSWER"; optionId: string }
  | { type: "RESTART_CHECKPOINT" }
  | { type: "QUIT_TO_TITLE" };

export const ENERGY_MAX = 10;
export const TRUST_MAX = 100;
export const PROMPT_SLOT_MAX = 3;
export const OVERTIME_BLOCKS = 2;
export const OVERTIME_ENERGY_COST = 4;
export const DEADLINE_FAIL_TRUST = -12;
export const SECURITY_TRUST_HIT = -25;
export const BURNOUT_OVERTIME_STREAK = 3;
