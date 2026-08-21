"use client";

/**
 * 중급 3번: 맞춤 측정기준 등록해 매개변수를 보고서에 올리기.
 *
 * 매개변수는 수집만 해서는 보고서에 나오지 않는다는 것이 이 편의 핵심이다.
 * 학습자는 inquiry_type을 직접 등록해 보고, 앞서 누군가 등록해 둔 member_id가
 * 값의 종류를 회원 수만큼 늘리는 함정이라는 것을 찾아 보관 처리한다.
 */

import { useEffect, useState } from "react";
import { Ga4AdminShell, Ga4OtherAdmin, adminTitleOf } from "../../app/Ga4AdminShell";
import { Ga4DefinitionsAdmin, Ga4CreateDimensionPanel } from "../../app/Ga4DefinitionsAdmin";
import { RingProvider, Ga4Guide } from "../../app/tour";
import { INITIAL_STATE, type Ga4State, type TourStep } from "../../app/types";
import { useStepEngine } from "../../lab/useStepEngine";
import {
  ACCOUNT_NAME,
  PROPERTY_NAME,
  SEARCH_HINT,
  INITIAL_DIMS,
  NEW_DIM,
  NAME_OPTIONS,
  PARAM_OPTIONS,
  FACTS,
  TARGET_NAME,
  TARGET_PARAM,
  WRONG_DIM,
  quotaOf,
} from "./data";

const LAB_ID = "custom-dimension-registration";
const LAB_TITLE = "맞춤 측정기준 등록해 매개변수를 보고서에 올리기";

/** 관리 화면의 속성 설정에서 시작한다. member_id는 앞서 누군가 등록해 둔 것으로 둔다 */
const START_STATE: Ga4State = {
  ...INITIAL_STATE,
  dateRange: "28d",
  adminPage: "property-settings",
  createOpen: false,
  createName: null,
  createValue: null,
  createList: null,
  customDims: [],
  dimMenuFor: null,
  archivedDims: [],
};

const made = (s: Ga4State) => (s.customDims ?? []).includes(TARGET_NAME);
const archived = (s: Ga4State) => (s.archivedDims ?? []).includes(WRONG_DIM);

/* ===================== 스텝 ===================== */

const STEPS: TourStep<Ga4State>[] = [
  {
    id: "open_definitions",
    instruction: "왼쪽 관리 메뉴의 속성 묶음에서 맞춤 정의를 누릅니다.",
    ring: "admin:custom-definitions",
    isDone: (s) => s.adminPage === "custom-definitions",
  },
  {
    id: "open_create",
    instruction: "오른쪽 위 맞춤 측정기준 만들기를 누릅니다.",
    ring: "create-dimension",
    isDone: (s) => s.createOpen === true,
  },
  {
    id: "create_dimension",
    instruction:
      "이름과 이벤트 매개변수를 모두 inquiry_type으로 고른 다음 저장까지 마칩니다.",
    // 아직 고르지 않은 입력 칸을 차례로 가리킨다
    ring: (s) => {
      if (s.createName !== TARGET_NAME) {
        return s.createList === "name" ? `dname:${TARGET_NAME}` : "dim-name";
      }
      if (s.createValue !== TARGET_PARAM) {
        return s.createList === "value" ? `dparam:${TARGET_PARAM}` : "dim-param";
      }
      return "dim-save";
    },
    isDone: (s) => made(s) && s.createOpen === false,
  },
  {
    id: "pick_wrong_dim",
    instruction:
      "목록에 값의 종류를 회원 수만큼 늘려 놓는 측정기준이 하나 섞여 있습니다. 그 줄을 골라 봅니다.",
    ring: null,
    reset: { selectedRow: null },
    isDone: (s) => s.selectedRow === WRONG_DIM,
    isMiss: (s) => s.selectedRow !== null && s.selectedRow !== WRONG_DIM,
    missText:
      "로그인 여부와 멤버십 등급은 값이 몇 가지뿐입니다. 사람마다 값이 달라지는 매개변수를 찾습니다.",
  },
  {
    id: "open_row_menu",
    instruction: "그 줄 오른쪽 끝 점 세 개를 눌러 메뉴를 폅니다.",
    ring: (s) => (s.dimMenuFor === WRONG_DIM ? null : `dim-more:${WRONG_DIM}`),
    isDone: (s) => s.dimMenuFor === WRONG_DIM,
  },
  {
    id: "archive_wrong",
    instruction: "메뉴에서 보관 처리를 눌러 목록에서 내립니다.",
    ring: (s) => (s.dimMenuFor === WRONG_DIM ? `dim-archive:${WRONG_DIM}` : `dim-more:${WRONG_DIM}`),
    isDone: (s) => archived(s),
  },
];

const DONE_TEXT = `member_id는 회원마다 값이 다릅니다. 사용자 ${FACTS.users}명이면 값의 종류도 그만큼 생겨서, 카디널리티 한도를 높이고 다른 보고서에까지 (other) 줄을 만듭니다. 방금 등록한 inquiry_type은 값이 ${FACTS.inquiryValues}라 알맞습니다. 다만 등록한 시점부터 쌓이기 때문에 어제까지의 문의는 (not set)으로 나옵니다. 보관 처리도 같은 방식이라, member_id로 이미 쌓인 값이 지워지지는 않고 내일부터 새 값이 붙지 않을 뿐입니다.`;

/* ===================== 화면 ===================== */

export default function CustomDimensionRegistrationLab() {
  const { state, stepIndex, miss, done, step, ring, apply, restart } = useStepEngine<Ga4State>({
    labId: LAB_ID,
    labTitle: LAB_TITLE,
    initialState: START_STATE,
    steps: STEPS,
  });
  const [pinned, setPinned] = useState(false);

  // 화면을 고정하는 동안에는 뒤쪽 문서가 움직이지 않게 막고, Esc로 풀 수 있게 한다
  useEffect(() => {
    if (!pinned) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPinned(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [pinned]);

  const page = state.adminPage ?? "";
  const customDims = state.customDims ?? [];
  const archivedDims = state.archivedDims ?? [];

  /** 시작 목록에 학습자가 등록한 것을 더하고, 보관한 것을 뺀다 */
  const rows = [...INITIAL_DIMS, ...(customDims.includes(NEW_DIM.name) ? [NEW_DIM] : [])].filter(
    (r) => !archivedDims.includes(r.name)
  );

  const panel = (
    <Ga4CreateDimensionPanel
      open={state.createOpen === true}
      name={state.createName ?? null}
      parameter={state.createValue ?? null}
      openList={state.createList ?? null}
      nameOptions={NAME_OPTIONS}
      parameterOptions={PARAM_OPTIONS}
      onToggleList={(list) => apply({ createList: list })}
      onPickName={(key) => apply({ createName: key, createList: null })}
      onPickParameter={(key) => apply({ createValue: key, createList: null })}
      onSave={() =>
        apply({
          customDims: state.createName ? [...customDims, state.createName] : customDims,
          createOpen: false,
          createList: null,
        })
      }
      onClose={() => apply({ createOpen: false, createList: null })}
    />
  );

  return (
    <RingProvider value={ring}>
      <div
        className={`ga4-stage${pinned ? " ga4-stage-pinned" : ""}${
          state.createOpen ? " ga4-stage-panel" : ""
        }`}
      >
        <Ga4AdminShell
          account={ACCOUNT_NAME}
          property={PROPERTY_NAME}
          searchHint={SEARCH_HINT}
          pinned={pinned}
          onTogglePin={() => setPinned((v) => !v)}
          page={page}
          onOpenPage={(id) =>
            apply({ adminPage: id, createOpen: false, createList: null, dimMenuFor: null })
          }
          panel={panel}
        >
          {page === "custom-definitions" ? (
            <Ga4DefinitionsAdmin
              rows={rows}
              quota={quotaOf(rows)}
              selected={state.selectedRow}
              onSelect={(name) => apply({ selectedRow: name })}
              menuFor={state.dimMenuFor ?? null}
              onToggleMenu={(name) => apply({ dimMenuFor: name })}
              onArchive={(name) =>
                apply({ archivedDims: [...archivedDims, name], dimMenuFor: null })
              }
              onOpenCreate={() => apply({ createOpen: true })}
            />
          ) : (
            <Ga4OtherAdmin label={adminTitleOf(page)} backTo="맞춤 정의" />
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
