/**
 * localStorage 저장/복원. normalize는 순수 함수로 분리해 테스트 가능하게 한다.
 * 외부 데이터(localStorage)는 신뢰하지 않고 형태를 검증한다.
 */

import type { GameState } from "./types";

export const SAVE_KEY = "hb_game_save_v1";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** 손상/구버전 데이터 방어: 형태가 어긋나면 null (새 게임 유도) */
export function normalizeSave(raw: unknown): GameState | null {
  if (!isRecord(raw)) return null;
  if (raw.version !== 1) return null;
  if (typeof raw.chapterId !== "string") return null;
  if (typeof raw.seed !== "number" || typeof raw.rngCursor !== "number") {
    return null;
  }
  if (typeof raw.day !== "number") return null;
  if (!isRecord(raw.phase) || typeof raw.phase.kind !== "string") return null;
  if (!isRecord(raw.resources)) return null;
  const { time, energy, trust, kpi } = raw.resources;
  if (
    typeof time !== "number" ||
    typeof energy !== "number" ||
    typeof trust !== "number" ||
    typeof kpi !== "number"
  ) {
    return null;
  }
  if (!isRecord(raw.tasks)) return null;
  if (!Array.isArray(raw.unlockedConcepts)) return null;
  if (!isRecord(raw.flags)) return null;
  if (!Array.isArray(raw.history)) return null;
  if (!isRecord(raw.dayRt)) return null;
  if (
    typeof raw.securityIncidents !== "number" ||
    typeof raw.consecutiveOvertime !== "number" ||
    typeof raw.prepScore !== "number" ||
    typeof raw.bossScore !== "number"
  ) {
    return null;
  }
  return raw as unknown as GameState;
}

// 세이브 존재 여부 구독 (useSyncExternalStore용):
// effect 안에서 setState 없이 타이틀의 "이어하기" 노출을 갱신한다.
let hasSaveCache: boolean | null = null;
const listeners = new Set<() => void>();

function notify(value: boolean): void {
  hasSaveCache = value;
  listeners.forEach((listener) => listener());
}

export function subscribeSave(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function hasSaveSnapshot(): boolean {
  if (hasSaveCache === null) {
    hasSaveCache = loadSave() !== null;
  }
  return hasSaveCache;
}

export function loadSave(): GameState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    return normalizeSave(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function persistSave(state: GameState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SAVE_KEY, JSON.stringify(state));
    notify(true);
  } catch {
    // 저장 실패(쿼터 등)는 게임 진행을 막지 않는다
  }
}

export function clearSave(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SAVE_KEY);
    notify(false);
  } catch {
    // no-op
  }
}
