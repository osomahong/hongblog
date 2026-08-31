/**
 * GA4 Edu 실습 진행 저장 (localStorage).
 * AIPBL 진행 저장(hongblog-aipbl-progress)과 같은 구조를 쓰되 키를 나눠,
 * 두 학습 트랙의 기록이 서로 덮어쓰지 않게 한다.
 */

export const GA4_EDU_PROGRESS_KEY = "hongblog-ga4edu-progress";
export const GA4_EDU_PROGRESS_EVENT = "ga4edu-progress-updated";

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

export function readGa4EduProgress(): Record<string, LabProgress> {
  try {
    const raw = localStorage.getItem(GA4_EDU_PROGRESS_KEY);
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (parsed === null || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed as Record<string, LabProgress>;
  } catch {
    return {};
  }
}

export function saveGa4EduProgress(
  labId: string,
  progress: Omit<LabProgress, "updatedAt">
): void {
  try {
    const all = readGa4EduProgress();
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
    localStorage.setItem(GA4_EDU_PROGRESS_KEY, JSON.stringify({ ...all, [labId]: next }));
    window.dispatchEvent(new Event(GA4_EDU_PROGRESS_EVENT));
  } catch {
    // localStorage를 쓸 수 없는 환경(시크릿 모드 등)에서는 조용히 건너뛴다
  }
}
