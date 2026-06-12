/**
 * 자원 변화를 불변으로 적용하는 헬퍼. React/엔진 상태 머신과 분리된 순수 함수.
 */

import { ENERGY_MAX, TRUST_MAX, type Resources } from "./types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

export function applyResourceDelta(
  resources: Resources,
  delta: Partial<Resources>,
): Resources {
  return {
    time: Math.max(0, resources.time + (delta.time ?? 0)),
    energy: clamp(resources.energy + (delta.energy ?? 0), 0, ENERGY_MAX),
    trust: clamp(resources.trust + (delta.trust ?? 0), -50, TRUST_MAX),
    kpi: Math.max(0, resources.kpi + (delta.kpi ?? 0)),
  };
}

export function setFlags(
  flags: Record<string, boolean>,
  keys: string[],
): Record<string, boolean> {
  if (keys.length === 0) return flags;
  const next = { ...flags };
  keys.forEach((key) => {
    next[key] = true;
  });
  return next;
}
