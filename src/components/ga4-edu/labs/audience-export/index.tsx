"use client";

/**
 * 심화 5번: 잠재고객 만들어 광고 계정으로 내보내기.
 *
 * 어제 만든 잠재고객이 0명으로 남아 있는 화면에서 시작한다. 조건이 틀린 것이 아니라
 * 잠재고객이 만든 시점부터 사람을 모으기 때문인데, 이 점을 모르면 조건을 고치며 시간을 쓴다.
 *
 * 학습자는 그 잠재고객을 광고 계정으로 내보내는 데까지 해 본다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4RuleAdmin } from "../../app/Ga4RuleAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  NEW_AUDIENCE,
  OLD_AUDIENCE,
  EXPORT_LINKED,
  EXPORT_OPTIONS,
  AUDIENCE_COLUMNS,
  buildRows,
} from "./data";

const LAB_ID = "audience-export";
const LAB_TITLE = "잠재고객 만들어 광고 계정으로 내보내기";

const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  adminPage: "property-settings",
  dimMenuFor: null,
  customEvents: [],
};

const exported = (s: Ga4State) => (s.customEvents ?? []).includes(NEW_AUDIENCE);

/* ===================== 스텝 ===================== */

const STEPS: TourStep[] = [
  {
    id: "open_audiences",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 잠재고객을 누릅니다.",
    ring: "admin:audiences",
    isDone: (s) => s.adminPage === "audiences",
  },
  {
    id: "open_menu",
    instruction: `${NEW_AUDIENCE}는 어제 만들어 아직 0명입니다. 줄 오른쪽 더보기를 눌러 내보내기 설정을 엽니다.`,
    ring: `rule:menu:${NEW_AUDIENCE}`,
    isDone: (s) => s.dimMenuFor === NEW_AUDIENCE,
  },
  {
    id: "export",
    instruction: "구글 애즈로 내보내는 중을 골라 광고 계정과 잇습니다.",
    ring: `rule:state:${EXPORT_LINKED}`,
    isDone: exported,
  },
];

const DONE_TEXT = `이제 조건에 맞는 사람이 모이는 대로 광고 계정으로 넘어갑니다. 지금 0명인 것은 조건이 틀려서가 아니라 어제 만들었기 때문입니다. 잠재고객은 만든 시점부터 사람을 모으고 지난 데이터로 채워 주지 않습니다. 오래전에 만든 ${OLD_AUDIENCE}가 4,820명인 것과 견주면 그 차이가 보입니다.`;

export default function AudienceExportLab() {
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
          onOpenPage={(id) => apply({ adminPage: id, dimMenuFor: null })}
        >
          {page === "audiences" ? (
            <Ga4RuleAdmin
              title="잠재고객"
              description="조건에 맞는 사용자를 모아 광고 계정으로 보냅니다. 만든 시점부터 모으기 시작합니다."
              createLabel="잠재고객 만들기"
              columns={AUDIENCE_COLUMNS}
              rows={buildRows(exported(state))}
              onOpenCreate={() => undefined}
              stateOptions={EXPORT_OPTIONS}
              menuFor={state.dimMenuFor ?? null}
              onToggleMenu={(name) =>
                apply({ dimMenuFor: state.dimMenuFor === name ? null : name })
              }
              onPickState={(name, next) => {
                if (name !== NEW_AUDIENCE) {
                  apply({ dimMenuFor: null });
                  return;
                }
                apply({
                  customEvents: next === EXPORT_LINKED ? [NEW_AUDIENCE] : [],
                  dimMenuFor: null,
                });
              }}
              markRow={done ? NEW_AUDIENCE : null}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="잠재고객" />
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
