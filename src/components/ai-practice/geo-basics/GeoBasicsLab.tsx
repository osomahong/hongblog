"use client";

/**
 * GEO 기초 AIPBL.
 * 공용 LabShell에 GEO 기초 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 * 실습 재료로 목업 사이트(모모팜)를 웹인웹으로 쓴다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_ELEMENTS } from "./lab-data";
import { MissionAsk } from "./MissionAsk";
import { MissionInspect } from "./MissionInspect";
import { MissionEvidence } from "./MissionEvidence";

export function GeoBasicsLab() {
  return (
    <LabShell
      windowTitle="AIPBL 04 : GEO 기초"
      eventParams={{ content_id: "geo-basics", content_name: "GEO 기초" }}
      brief={{
        intro:
          "이번 실습에서는 가상의 복숭아 농장, 모모팜의 홈페이지를 AI 답변에 인용되게 만들어 봅니다. 인용되고 싶은 질문을 던지고, 사이트를 AI의 눈으로 확인하고, 근거 문장을 붙이는 GEO의 세 단계를 실습 화면에서 직접 진행합니다.",
        goal: "내 사이트에 바로 쓸 수 있는 GEO 시작 체크리스트 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 오늘 익힌 세 단계를 체크리스트 한 장으로 정리합니다. 예상 소요 시간은 약 15분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "ask", Component: MissionAsk },
        { meta: MISSIONS[1], name: "inspect", Component: MissionInspect },
        { meta: MISSIONS[2], name: "evidence", Component: MissionEvidence },
      ]}
      quiz={QUIZ}
      quizTitle="점검: 인용에 유리한 쪽 고르기"
      quizDesc="두 선택지 중 AI 답변 인용에 유리한 쪽을 고릅니다. 모두 3문항이고, 고르면 해설이 바로 표시됩니다."
      wrapDesc="오늘 익힌 세 단계를 체크리스트 한 장으로 정리합니다. 내 사이트에 같은 순서로 적용하면 실습이 완성됩니다."
      wrap={{
        completeTitle: "GEO 기초 AIPBL 완료",
        elements: THREE_ELEMENTS,
        templateTitle: "오늘의 결과물: GEO 시작 체크리스트",
        template: FINAL_TEMPLATE,
        calloutTitle: "실습 마무리",
        calloutText:
          "모모팜에서 한 작업 순서 그대로, 이 체크리스트의 대괄호를 내 브랜드 내용으로 채우면 오늘 실습이 완성됩니다.\n다음 단계인 GEO 중급에서는 인용되는 문장의 세 조건, 질문 조건 매칭, 구조 보강을 다룹니다.",
        primary: { href: "/ai-practice/geo-intermediate", label: "다음 AIPBL: GEO 중급" },
        secondary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
