/**
 * AIPBL 진행 상태 저장 (localStorage).
 * CLASS 학습 진도(hongblog-class-progress)와 같은 방식으로, 실습 중간 이탈자가
 * 다시 방문했을 때 이어서 할 수 있게 하고, 트랙 스테퍼에 완료 표시를 제공한다.
 */

export const AIPBL_PROGRESS_KEY = "hongblog-aipbl-progress";
export const AIPBL_PROGRESS_EVENT = "aipbl-progress-updated";

export type LabPhaseName = "brief" | "mission" | "quiz" | "wrap";

export interface LabProgress {
  phase: LabPhaseName;
  /** phase가 "mission"일 때 진행 중인 미션 인덱스 (0부터) */
  missionIndex: number;
  /** 정리 단계까지 마친 시각. 있으면 완료로 취급한다 */
  completedAt?: number;
  /** 점검 퀴즈 최고 점수. 다시 실습해도 최고 기록을 유지한다 */
  quizScore?: number;
  quizTotal?: number;
  updatedAt: number;
}

export function readAipblProgress(): Record<string, LabProgress> {
  try {
    const raw = localStorage.getItem(AIPBL_PROGRESS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, LabProgress>;
  } catch {
    return {};
  }
}

export function saveAipblProgress(labId: string, progress: Omit<LabProgress, "updatedAt">): void {
  try {
    const all = readAipblProgress();
    const prev = all[labId];
    const bestScore =
      progress.quizScore !== undefined
        ? Math.max(progress.quizScore, prev?.quizScore ?? 0)
        : prev?.quizScore;
    const next: LabProgress = {
      ...progress,
      // 한 번 완료한 기록과 퀴즈 최고 점수는 다시 실습해도 유지한다
      completedAt: progress.completedAt ?? prev?.completedAt,
      quizScore: bestScore,
      quizTotal: progress.quizTotal ?? prev?.quizTotal,
      updatedAt: Date.now(),
    };
    localStorage.setItem(AIPBL_PROGRESS_KEY, JSON.stringify({ ...all, [labId]: next }));
    window.dispatchEvent(new Event(AIPBL_PROGRESS_EVENT));
  } catch {
    // localStorage를 쓸 수 없는 환경(시크릿 모드 등)에서는 조용히 건너뛴다
  }
}
