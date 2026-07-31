"use client";

/**
 * 프롬프트 기초 AIPBL.
 * 공용 LabShell에 기초 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_ELEMENTS } from "./lab-data";
import { MissionRole } from "./MissionRole";
import { MissionContext } from "./MissionContext";
import { MissionFormat } from "./MissionFormat";

export function PromptBasicsLab() {
  return (
    <LabShell
      windowTitle="AIPBL 01 : 프롬프트 기초"
      eventParams={{ content_id: "prompt-basics", content_name: "프롬프트 기초" }}
      brief={{
        intro:
          "이번 실습에서는 AI에게 요청하는 문장, 곧 프롬프트에 역할, 맥락, 형식을 하나씩 더해 봅니다. 같은 질문이라도 어떻게 요청하느냐에 따라 답변이 얼마나 달라지는지 실습 채팅 화면에서 직접 확인합니다.",
        goal: "내 업무에 바로 쓸 수 있는 프롬프트 템플릿 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 오늘 익힌 3요소를 템플릿 한 장으로 정리합니다. 예상 소요 시간은 약 15분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "role", Component: MissionRole },
        { meta: MISSIONS[1], name: "context", Component: MissionContext },
        { meta: MISSIONS[2], name: "format", Component: MissionFormat },
      ]}
      quiz={QUIZ}
      wrapDesc="오늘 익힌 3요소를 템플릿 한 장으로 정리합니다. 복사해서 실제 AI에게 붙여 넣으면 실습이 완성됩니다."
      wrap={{
        completeTitle: "프롬프트 기초 AIPBL 완료",
        elements: THREE_ELEMENTS,
        templateTitle: "오늘의 결과물: 프롬프트 템플릿",
        template: FINAL_TEMPLATE,
        calloutTitle: "실습 마무리",
        calloutText:
          "이 템플릿의 대괄호를 내 업무 내용으로 채워, 실제 Claude나 ChatGPT에 붙여 넣으면 오늘 실습이 완성됩니다.\n다음 단계인 프롬프트 중급에서는 예시 제시, 단계 나누기, 질문 유도를 다룹니다.",
        primary: { href: "/ai-practice/prompt-intermediate", label: "다음 AIPBL: 프롬프트 중급" },
        secondary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
