"use client";

/**
 * 실습이 놓이는 자리.
 *
 * GA4 화면은 가로가 넓어야 표를 다 볼 수 있어서 좁은 화면에서는 안내만 놓는다.
 * CSS로만 숨기면 휴대전화에서도 실습 묶음을 내려받게 되어 그만큼 낭비다.
 * 그래서 화면 폭을 실제로 보고 넓을 때만 실습을 불러온다.
 *
 * 폭 판정은 useSyncExternalStore로 읽는다. 미디어 쿼리는 리액트 바깥의 상태라
 * useEffect에서 setState로 옮겨 담으면 렌더가 한 번 더 돈다.
 */

import { useCallback, useSyncExternalStore } from "react";
import { Monitor } from "lucide-react";
import { LabLoader } from "./LabLoader";

/** GA4 화면을 조작할 수 있는 최소 폭. Tailwind lg와 같은 값이다 */
const WIDE = "(min-width: 1024px)";

interface LabStageProps {
  slug: string;
  /** 좁은 화면에서 안내에 적어 주는 주소 */
  url: string;
}

export function LabStage({ slug, url }: LabStageProps) {
  const subscribe = useCallback((onChange: () => void) => {
    const mq = window.matchMedia(WIDE);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const wide = useSyncExternalStore(
    subscribe,
    () => window.matchMedia(WIDE).matches,
    // 서버에서는 좁은 화면으로 두고 그린다. 안내가 먼저 나오고 넓으면 실습으로 바뀐다
    () => false
  );

  if (wide) return <LabLoader slug={slug} />;

  return (
    <div className="ga4-wrap">
      <div className="ga4-pc-only">
        <span className="ga4-pc-icon" aria-hidden>
          <Monitor className="w-6 h-6" strokeWidth={1.5} />
        </span>
        <h2>PC에서 여세요</h2>
        <p>GA4 화면을 그대로 옮긴 실습이라 가로 폭이 넓은 화면이 필요합니다.</p>
        <p className="ga4-pc-url">{url}</p>
      </div>
    </div>
  );
}
