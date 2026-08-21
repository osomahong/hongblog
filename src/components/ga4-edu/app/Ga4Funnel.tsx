"use client";

/**
 * 탐색 유입경로 탐색 작업 화면.
 *
 * 자유 형식과 칸 구성은 같지만 탭 설정에 들어가는 것이 다르다. 행과 열 대신 단계 목록이 있고,
 * 그 옆의 연필을 누르면 단계를 수정하는 패널이 열린다. 열린 유입경로 만들기 토글도 여기에 있다.
 *
 * 캔버스는 위에 단계별 막대, 아래에 같은 숫자를 담은 표를 놓는 GA4 배치를 따른다.
 * 막대 높이는 첫 단계를 100으로 둔 비율이고, 막대 위에는 GA4와 같이 완료율을 적는다.
 */

import { Pencil, ChevronDown, X, Check } from "lucide-react";
import { useRing } from "./tour";
import type { Ga4FunnelState } from "./types";

export interface FunnelStage {
  /** 단계 이름. 상태의 stages에 들어가는 값과 같다 */
  name: string;
  /** 이 단계를 만드는 이벤트. 편집 패널의 조건 줄에 적힌다 */
  event: string;
  /** 닫힌 유입경로에서의 사용자 수 */
  closed: number;
  /** 열린 유입경로에서의 사용자 수 */
  open: number;
}

interface Ga4FunnelProps {
  name: string;
  dateLabel: string;
  /** 유입경로에 놓을 수 있는 단계 전부. 순서가 단계 순서다 */
  allStages: FunnelStage[];
  /** 편집 패널에서 아직 고르지 않은 단계 후보 */
  candidates: string[];
  state: Ga4FunnelState;
  onOpenEditor: () => void;
  onCloseEditor: () => void;
  onToggleStageList: () => void;
  onPickDraft: (name: string) => void;
  onApplyStage: () => void;
  onToggleOpenFunnel: () => void;
  onSelectStage: (name: string) => void;
  /** 정답 단계에 표시를 남길 때 쓴다. 마지막에만 채운다 */
  markStage?: string | null;
}

const numberFormat = new Intl.NumberFormat("ko-KR");

export function Ga4Funnel({
  name,
  dateLabel,
  allStages,
  candidates,
  state,
  onOpenEditor,
  onCloseEditor,
  onToggleStageList,
  onPickDraft,
  onApplyStage,
  onToggleOpenFunnel,
  onSelectStage,
  markStage = null,
}: Ga4FunnelProps) {
  const placed = state.stages
    .map((s) => allStages.find((v) => v.name === s))
    .filter((v): v is FunnelStage => Boolean(v));

  const countOf = (stage: FunnelStage) => (state.openFunnel ? stage.open : stage.closed);
  const first = placed[0] ? countOf(placed[0]) : 0;

  const editRing = useRing("funnel:edit");
  const toggleRing = useRing("funnel:open-toggle");
  const applyRing = useRing("funnel:apply");
  const listRing = useRing("funnel:stage-list");

  return (
    <div className="ga4-ff">
      {/* ----- 변수 ----- */}
      <section className="ga4-ff-panel" aria-label="변수">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">변수</span>
        </header>

        <div className="ga4-ff-name">
          <p className="ga4-ff-name-label">데이터 탐색 이름</p>
          <p className="ga4-ff-name-value">{name}</p>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">커스텀</p>
          <p className="ga4-ff-field-value">{dateLabel}</p>
        </div>

        <div className="ga4-ff-group">
          <p className="ga4-ff-group-title">세그먼트</p>
          <p className="ga4-ff-empty">모든 사용자</p>
        </div>

        <div className="ga4-ff-group">
          <p className="ga4-ff-group-title">측정기준</p>
          <p className="ga4-ff-empty">기기 카테고리</p>
          <p className="ga4-ff-empty">국가</p>
        </div>

        <div className="ga4-ff-group">
          <p className="ga4-ff-group-title">측정항목</p>
          <p className="ga4-ff-empty">활성 사용자</p>
        </div>
      </section>

      {/* ----- 탭 설정 ----- */}
      <section className="ga4-ff-panel ga4-ff-settings" aria-label="탭 설정">
        <header className="ga4-ff-panel-head">
          <span className="ga4-ff-panel-title">탭 설정</span>
        </header>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">기법</p>
          <p className="ga4-ff-field-value">유입경로 탐색 분석</p>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">시각화</p>
          <p className="ga4-ff-field-value">표준 유입경로</p>
        </div>

        <div className="ga4-fn-toggle-row">
          <span className="ga4-fn-toggle-label">열린 유입경로 만들기</span>
          <button
            type="button"
            role="switch"
            aria-checked={state.openFunnel}
            aria-label="열린 유입경로 만들기"
            data-tour="funnel:open-toggle"
            onClick={onToggleOpenFunnel}
            className={`ga4-fn-switch${state.openFunnel ? " ga4-fn-switch-on" : ""}${toggleRing}`}
          >
            <span className="ga4-fn-switch-knob" />
          </button>
        </div>

        <div className="ga4-fn-steps">
          <div className="ga4-fn-steps-head">
            <span className="ga4-ff-field-label">단계</span>
            <button
              type="button"
              aria-label="단계 수정"
              data-tour="funnel:edit"
              onClick={onOpenEditor}
              className={`ga4-fn-edit${editRing}`}
            >
              <Pencil className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <ol className="ga4-fn-step-list">
            {placed.map((s, i) => (
              <li key={s.name}>
                <span className="ga4-fn-step-num">{i + 1}</span>
                {s.name}
              </li>
            ))}
            {placed.length === 0 && <li className="ga4-ff-empty">단계 없음</li>}
          </ol>
        </div>

        <div className="ga4-ff-field">
          <p className="ga4-ff-field-label">분류</p>
          <p className="ga4-ff-empty">측정기준 놓기</p>
        </div>
      </section>

      {/* ----- 캔버스 ----- */}
      <section className="ga4-fn-canvas" aria-label="유입경로">
        {placed.length === 0 ? (
          <p className="ga4-fn-blank">단계를 넣으면 유입경로가 그려집니다.</p>
        ) : (
          <>
            <div className="ga4-fn-chart">
              {placed.map((s, i) => {
                const count = countOf(s);
                const rate = first > 0 ? (count / first) * 100 : 0;
                const marked = markStage === s.name;
                return (
                  <div key={s.name} className="ga4-fn-col">
                    <div className="ga4-fn-bar-area">
                      <span className="ga4-fn-rate">{rate.toFixed(1)}%</span>
                      <div
                        className={`ga4-fn-bar${marked ? " ga4-fn-bar-mark" : ""}`}
                        style={{ height: `${Math.max(rate, 2)}%` }}
                      />
                    </div>
                    <p className="ga4-fn-col-name">
                      {i + 1}. {s.name}
                    </p>
                    <p className="ga4-fn-col-count">{numberFormat.format(count)}</p>
                  </div>
                );
              })}
            </div>

            <table className="ga4-fn-table">
              <thead>
                <tr>
                  <th scope="col">단계</th>
                  <th scope="col">활성 사용자</th>
                  <th scope="col">완료율</th>
                  <th scope="col">다음 단계로 넘어가지 않은 비율</th>
                </tr>
              </thead>
              <tbody>
                {placed.map((s, i) => {
                  const count = countOf(s);
                  const next = placed[i + 1];
                  const dropRate = next ? (1 - countOf(next) / count) * 100 : null;
                  const selected = state.selectedStage === s.name;
                  const marked = markStage === s.name;
                  return (
                    <tr
                      key={s.name}
                      onClick={() => onSelectStage(s.name)}
                      className={`${selected ? "ga4-fn-row-on" : ""}${marked ? " ga4-fn-row-mark" : ""}`}
                    >
                      <th scope="row">
                        {i + 1}. {s.name}
                      </th>
                      <td>{numberFormat.format(count)}</td>
                      <td>{first > 0 ? ((count / first) * 100).toFixed(1) : "0.0"}%</td>
                      <td>{dropRate === null ? "-" : `${dropRate.toFixed(1)}%`}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )}
      </section>

      {/* ----- 단계 수정 패널 ----- */}
      {state.editorOpen && (
        <div className="ga4-fn-editor" role="dialog" aria-label="유입경로 단계 수정">
          <header className="ga4-fn-editor-head">
            <span>유입경로 단계 수정</span>
            <button type="button" aria-label="닫기" onClick={onCloseEditor}>
              <X className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>
          </header>

          <ol className="ga4-fn-editor-list">
            {placed.map((s, i) => (
              <li key={s.name}>
                <span className="ga4-fn-step-num">{i + 1}</span>
                <span className="ga4-fn-editor-name">{s.name}</span>
                <span className="ga4-fn-editor-cond">{s.event}</span>
              </li>
            ))}
          </ol>

          <div className="ga4-fn-editor-add">
            <p className="ga4-ff-field-label">단계 추가</p>
            <button
              type="button"
              data-tour="funnel:stage-list"
              onClick={onToggleStageList}
              className={`ga4-fn-select${listRing}`}
            >
              {state.draftStage ?? "단계를 고르세요"}
              <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
            </button>

            {state.stageListOpen && (
              <ul className="ga4-fn-options">
                {candidates.map((c) => (
                  <li key={c}>
                    <button type="button" onClick={() => onPickDraft(c)}>
                      {c}
                      {state.draftStage === c && (
                        <Check className="w-4 h-4" strokeWidth={2} aria-hidden />
                      )}
                    </button>
                  </li>
                ))}
                {candidates.length === 0 && <li className="ga4-ff-empty">추가할 단계가 없습니다</li>}
              </ul>
            )}
          </div>

          <div className="ga4-fn-editor-foot">
            <button
              type="button"
              data-tour="funnel:apply"
              onClick={onApplyStage}
              disabled={!state.draftStage}
              className={`ga4-btn-primary${applyRing}`}
            >
              적용
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
