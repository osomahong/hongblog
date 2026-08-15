"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RefreshCw, Code2, AlertTriangle } from "lucide-react";
import { ActiveUsersPanel } from "./components/ActiveUsersPanel";
import { DeviceDonut } from "./components/DeviceDonut";
import { RealtimeCard } from "./components/RealtimeCard";
import { UnavailableCard } from "./components/UnavailableCard";
import type { RealtimeApiResponse, RealtimeSnapshot } from "@/lib/ga4-types";

/** 자동 갱신 주기. 서버 캐시(20초)보다 길게 잡아 헛도는 요청을 만들지 않는다 */
const POLL_INTERVAL_MS = 30_000;

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function RealtimeDashboard() {
  const [snapshot, setSnapshot] = useState<RealtimeSnapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showApi, setShowApi] = useState(false);
  // 탭을 벗어난 동안에는 갱신을 멈춰 불필요한 호출을 막는다
  const isVisible = useRef(true);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/ga4/realtime", { cache: "no-store" });
      const json = (await res.json()) as RealtimeApiResponse;
      if (!json.ok) {
        setError(json.error);
        return;
      }
      setSnapshot(json.data);
      setError(null);
    } catch {
      setError("실시간 데이터를 불러오지 못했습니다");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const timer = setInterval(() => {
      if (isVisible.current) load();
    }, POLL_INTERVAL_MS);

    function onVisibilityChange() {
      isVisible.current = document.visibilityState === "visible";
      // 돌아왔을 때는 다음 주기를 기다리지 않고 곧바로 한 번 갱신한다
      if (isVisible.current) load();
    }
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, [load]);

  return (
    <div>
      {/* 보고서 상단 바 */}
      <div className="flex items-center justify-between gap-4 flex-wrap mb-4">
        <div className="flex items-center gap-2 text-sm text-[color:var(--ga4-muted)]">
          <span className="ga4-live-dot" />
          <span>
            {snapshot ? `${formatTime(snapshot.fetchedAt)} 기준` : "불러오는 중"}
            <span className="hidden sm:inline">, 30초마다 갱신</span>
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowApi(!showApi)}
            aria-pressed={showApi}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border transition-colors"
            style={{
              borderColor: showApi ? "var(--ga4-amber-deep)" : "var(--ga4-line)",
              color: showApi ? "var(--ga4-amber-deep)" : "var(--ga4-muted)",
              background: showApi ? "#fef7e0" : "var(--ga4-surface)",
            }}
          >
            <Code2 className="w-4 h-4" />
            API 항목 보기
          </button>
          <button
            type="button"
            onClick={load}
            className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-2 rounded-md border transition-colors"
            style={{
              borderColor: "var(--ga4-line)",
              color: "var(--ga4-muted)",
              background: "var(--ga4-surface)",
            }}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            지금 갱신
          </button>
        </div>
      </div>

      {error && (
        <div
          className="flex items-center gap-2 text-sm p-4 rounded-lg mb-4"
          style={{ background: "#fce8e6", color: "#c5221f" }}
          role="alert"
        >
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {!snapshot ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="ga4-card animate-pulse h-64" aria-hidden="true" />
          ))}
        </div>
      ) : (
        <>
          {/* 1행: 활성 사용자 추이와 기기 구성 */}
          <div className="grid gap-4 lg:grid-cols-2 mb-4">
            <ActiveUsersPanel
              activeUsers={snapshot.activeUsers}
              perMinute={snapshot.perMinute}
              showApi={showApi}
            />
            <DeviceDonut data={snapshot.devices} showApi={showApi} />
          </div>

          {/* 2행: GA4 실시간 개요의 카드 그리드 */}
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <RealtimeCard
              dimensionLabel="국가 및 도시"
              metricLabel="활성 사용자"
              data={snapshot.countries}
              api={{ dimensions: ["country", "city"], metric: "activeUsers" }}
              showApi={showApi}
            />
            <UnavailableCard
              dimensionLabel="첫 사용자 소스"
              metricLabel="활성 사용자"
              missingField="firstUserSource"
              note="GA4 화면에는 있지만 실시간 API는 유입 소스 측정기준을 제공하지 않습니다. 소스별 수치는 실시간이 아닌 일반 보고서(runReport)에서 조회합니다."
            />
            <RealtimeCard
              dimensionLabel="잠재고객"
              metricLabel="활성 사용자"
              data={snapshot.audiences}
              api={{ dimensions: ["audienceName"], metric: "activeUsers" }}
              showApi={showApi}
            />
            <RealtimeCard
              dimensionLabel="페이지 제목 및 화면 이름"
              metricLabel="조회수"
              data={snapshot.pages}
              api={{ dimensions: ["unifiedScreenName"], metric: "screenPageViews" }}
              showApi={showApi}
            />
            <RealtimeCard
              dimensionLabel="이벤트 이름"
              metricLabel="이벤트 수"
              data={snapshot.events}
              api={{ dimensions: ["eventName"], metric: "eventCount" }}
              showApi={showApi}
            />
            <RealtimeCard
              dimensionLabel="이벤트 이름"
              metricLabel="주요 이벤트"
              data={snapshot.keyEvents}
              api={{ dimensions: ["eventName"], metric: "keyEvents" }}
              showApi={showApi}
            />
            <UnavailableCard
              dimensionLabel="사용자 속성"
              metricLabel="활성 사용자"
              missingField="customUser:*"
              note="사용자 속성을 실시간으로 보려면 속성에 맞춤 사용자 속성이 등록되어 있어야 합니다. 준이아빠블로그는 등록된 사용자 속성이 없어 GA4 화면에서도 비어 있습니다."
            />
          </div>
        </>
      )}
    </div>
  );
}
