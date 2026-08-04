"use client";

/**
 * GEO 중급 AIPBL.
 * 공용 LabShell에 GEO 중급 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 * 기초의 목업 사이트(모모팜)를 이어받아 문장 품질, 질문 매칭, 구조 보강을 다룬다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_ELEMENTS } from "./lab-data";
import { MissionRefine } from "./MissionRefine";
import { MissionMatch } from "./MissionMatch";
import { MissionStructure } from "./MissionStructure";

export function GeoIntermediateLab() {
  return (
    <LabShell
      windowTitle="AIPBL 05 : GEO 중급"
      eventParams={{ content_id: "geo-intermediate", content_name: "GEO 중급" }}
      brief={{
        intro:
          "이번 실습에서는 기초에서 만든 모모팜의 근거 문장을 한 단계 끌어올립니다. 인용되기 좋은 문장의 세 조건을 익히고, 질문 조건에 근거를 매칭하고, 정의문과 산출 기준과 FAQ로 페이지 구조를 보강합니다.",
        goal: "내 사이트의 문장을 점검할 수 있는 GEO 인용 문장 점검 카드 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 오늘 익힌 세 가지를 점검 카드 한 장으로 정리합니다. 예상 소요 시간은 약 15분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "refine", Component: MissionRefine },
        { meta: MISSIONS[1], name: "match", Component: MissionMatch },
        { meta: MISSIONS[2], name: "structure", Component: MissionStructure },
      ]}
      quiz={QUIZ}
      quizTitle="점검: 인용에 유리한 쪽 고르기"
      quizDesc="두 선택지 중 AI 답변 인용에 유리한 쪽을 고릅니다. 모두 3문항이고, 고르면 해설이 바로 표시됩니다."
      wrapDesc="오늘 익힌 세 가지를 점검 카드 한 장으로 정리합니다. 내 사이트의 문장에 같은 기준을 적용하면 실습이 완성됩니다."
      wrap={{
        completeTitle: "GEO 중급 AIPBL 완료",
        elements: THREE_ELEMENTS,
        templateTitle: "오늘의 결과물: GEO 인용 문장 점검 카드",
        template: FINAL_TEMPLATE,
        calloutTitle: "실습 마무리",
        calloutText:
          "이 점검 카드로 내 사이트의 대표 문장 세 개를 검사해 보면 오늘 실습이 완성됩니다.\n다음 심화에서는 robots.txt와 구조화 데이터, llms.txt까지 페이지 바깥의 기술 층을 점검합니다.",
        primary: { href: "/ai-practice/geo-advanced", label: "다음 AIPBL: GEO 심화" },
        secondary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
