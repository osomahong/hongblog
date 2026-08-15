"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Sparkline } from "./Sparkline";
import type { RealtimeCard as RealtimeCardData } from "@/lib/ga4-types";

/** 한 화면에 보여줄 줄 수. GA4 카드와 같게 6줄 */
const PAGE_SIZE = 6;

interface RealtimeCardProps {
  /**
   * 기준이 되는 측정기준의 한국어 이름 (예: "이벤트 이름").
   * 제목과 표 왼쪽 열에 함께 쓴다. GA4 카드 제목은 "{측정기준}별 {측정항목}" 구조다.
   */
  dimensionLabel: string;
  /** 측정항목의 한국어 이름 (예: "이벤트 수") */
  metricLabel: string;
  data: RealtimeCardData;
  /** 이 카드가 GA4 API에서 무엇을 부르는지. 교육용 배지로 노출한다 */
  api: { dimensions: string[]; metric: string };
  /** true면 API 배지를 보여준다 */
  showApi: boolean;
}

function formatNumber(value: number): string {
  return value.toLocaleString("ko-KR");
}

export function RealtimeCard({
  dimensionLabel,
  metricLabel,
  data,
  api,
  showApi,
}: RealtimeCardProps) {
  const [page, setPage] = useState(0);

  const pageCount = Math.max(1, Math.ceil(data.rows.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount - 1);
  const start = safePage * PAGE_SIZE;
  const visible = data.rows.slice(start, start + PAGE_SIZE);
  const top = data.rows[0];
  const maxValue = Math.max(...data.rows.map((row) => row.value), 1);
  const share = top && data.total > 0 ? (top.value / data.total) * 100 : 0;
  const isEmpty = data.rows.length === 0;

  return (
    <div className="ga4-card">
      <div className="ga4-card-title">
        <span>{dimensionLabel}별</span>
        <span className="ga4-dotted">{metricLabel}</span>
      </div>

      {isEmpty ? (
        <>
          <div className="ga4-rank">#1 -</div>
          <p className="ga4-empty">사용 가능한 데이터가 없습니다.</p>
        </>
      ) : (
        <>
          <div className="ga4-rank">
            #1<strong>{top.label}</strong>
          </div>
          <div className="flex items-end justify-between gap-4 mt-1">
            <div className="flex-shrink-0">
              <div className="ga4-big">{formatNumber(top.value)}</div>
              <div className="ga4-pct">{share.toFixed(2)}%</div>
            </div>
            <div className="flex-1 min-w-0 max-w-[190px]">
              <Sparkline values={data.topSparkline} />
            </div>
          </div>
        </>
      )}

      <div className="ga4-table-head">
        <span>{dimensionLabel}</span>
        <span>{metricLabel}</span>
      </div>

      {isEmpty ? (
        <p className="ga4-empty">사용 가능한 데이터가 없습니다.</p>
      ) : (
        <div>
          {visible.map((row) => (
            <div key={row.label} className="ga4-row">
              <div className="ga4-row-top">
                <span className="ga4-row-label" title={row.label}>
                  {row.label}
                </span>
                <span className="ga4-row-value">{formatNumber(row.value)}</span>
              </div>
              <div className="ga4-bar" style={{ width: `${(row.value / maxValue) * 100}%` }} />
            </div>
          ))}
        </div>
      )}

      {showApi && (
        <div className="ga4-api-badge">
          <span>
            dimension <code>{api.dimensions.join(" + ")}</code>
          </span>
          <span>
            metric <code>{api.metric}</code>
          </span>
        </div>
      )}

      <div className="ga4-card-foot">
        {!isEmpty && (
          <>
            <span>
              {data.totalRows}개 중 {start + 1}~{start + visible.length}번째
            </span>
            <button
              type="button"
              className="ga4-pager"
              onClick={() => setPage(safePage - 1)}
              disabled={safePage === 0}
              aria-label="이전 목록"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="ga4-pager"
              onClick={() => setPage(safePage + 1)}
              disabled={safePage >= pageCount - 1}
              aria-label="다음 목록"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
