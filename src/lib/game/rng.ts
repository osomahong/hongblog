/**
 * 시드 기반 결정론 난수 (mulberry32). 의존성 0.
 * 판정에는 난수를 쓰지 않는다. 돌발 업무 추첨·플레이버 텍스트 변형 전용.
 * 상태에는 seed와 소비 횟수(cursor)만 저장해 저장/복원 후에도 같은 결과를 보장한다.
 */

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** seed에서 cursor번째 난수 값 (0 이상 1 미만) */
export function drawAt(seed: number, cursor: number): number {
  const next = mulberry32(seed);
  let value = next();
  for (let i = 0; i < cursor; i += 1) {
    value = next();
  }
  return value;
}

/** 배열에서 cursor번째 난수로 1개 추첨 */
export function pickAt<T>(items: readonly T[], seed: number, cursor: number): T {
  const index = Math.floor(drawAt(seed, cursor) * items.length);
  return items[Math.min(index, items.length - 1)];
}
