"use client";

/**
 * 심화 8번: BigQuery 내보내기 설정과 원본 이벤트 표 구조 읽기.
 *
 * 내보내기 방식을 바꾸면 만들어지는 표 이름이 달라진다. 쿼리를 쓸 때 이 이름을 잘못 쓰면
 * 데이터가 없다고 나오므로, 두 방식이 만드는 표를 화면에서 함께 보게 한다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4ChoiceAdmin } from "../../app/Ga4ChoiceAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  CHOICES,
  START_CHOICE,
  TARGET_CHOICE,
  DAILY,
  tableOf,
} from "./data";

const LAB_ID = "bigquery-export";
const LAB_TITLE = "BigQuery 내보내기 설정과 원본 이벤트 표 구조 읽기";

const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  createName: START_CHOICE,
};

const pickedOf = (s: Ga4State) => s.createName ?? START_CHOICE;

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_links",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 제품 링크를 누릅니다.",
    ring: "admin:product-links",
    isDone: (s) => s.adminPage === "product-links",
  },
  {
    id: "pick_streaming",
    instruction:
      "지금은 일일 내보내기입니다. 스트리밍 내보내기를 골라 만들어지는 표 이름이 어떻게 달라지는지 봅니다.",
    ring: `choice:${TARGET_CHOICE}`,
    isDone: (s) => pickedOf(s) === TARGET_CHOICE,
  },
];

const DONE_TEXT = `일일 내보내기는 ${tableOf(DAILY)}처럼 날짜가 붙은 표를 하루에 하나 만들고, 스트리밍은 ${tableOf(TARGET_CHOICE)}처럼 intraday가 붙은 표에 계속 쌓습니다. 쿼리에서 표 이름을 잘못 쓰면 데이터가 없다고 나오므로 어느 방식으로 받고 있는지 먼저 확인합니다. 두 방식은 함께 사용 설정할 수 있고, 스트리밍만 비용이 따로 붙습니다.`;

export default function BigQueryExportLab() {
  const [pinned, setPinned] = useState(false);
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<Ga4State>({
    labId: LAB_ID,
    labTitle: LAB_TITLE,
    initialState: START_STATE,
    steps: STEPS,
  });

  useEffect(() => {
    if (!pinned) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [pinned]);

  const page = state.adminPage ?? "property-settings";

  return (
    <RingProvider value={ring}>
      <div className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}`}>
        <Ga4AdminShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          page={page}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          onOpenPage={(id) => apply({ adminPage: id })}
        >
          {page === "product-links" ? (
            <Ga4ChoiceAdmin
              title="BigQuery 링크: junjun-analytics"
              description="원본 이벤트를 빅쿼리로 보냅니다. 방식에 따라 도착 시점과 표 이름이 달라집니다."
              options={CHOICES}
              picked={pickedOf(state)}
              onPick={(key) => apply({ createName: key })}
              summaryLabel="이 방식으로 만들어지는 표"
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="제품 링크" />
          )}
        </Ga4AdminShell>

        <Ga4Guide
          index={Math.min(stepIndex, STEPS.length - 1)}
          total={STEPS.length}
          instruction={done ? DONE_TEXT : (step?.instruction ?? "")}
          miss={miss}
          done={done}
          onRestart={restart}
        />
      </div>
    </RingProvider>
  );
}
