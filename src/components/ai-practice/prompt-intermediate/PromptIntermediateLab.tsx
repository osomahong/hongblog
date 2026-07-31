"use client";

/**
 * 프롬프트 중급 AIPBL.
 * 공용 LabShell에 중급 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_SKILLS } from "./lab-data";
import { MissionExample } from "./MissionExample";
import { MissionSteps } from "./MissionSteps";
import { MissionAskFirst } from "./MissionAskFirst";

export function PromptIntermediateLab() {
  return (
    <LabShell
      windowTitle="AIPBL 02 : 프롬프트 중급"
      eventParams={{ content_id: "prompt-intermediate", content_name: "프롬프트 중급" }}
      brief={{
        intro:
          "이번 실습에서는 기초에서 만든 프롬프트에 예시 제시, 단계 나누기, 질문 유도 세 가지 기술을 더합니다. 요청하는 문장을 조금 바꾸는 것만으로 답변의 톤과 깊이가 어떻게 달라지는지 실습 채팅 화면에서 직접 확인합니다.",
        goal: "예시, 단계, 질문이 들어간 프롬프트 중급 템플릿 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 오늘 익힌 세 기술을 템플릿 한 장으로 정리합니다. 예상 소요 시간은 약 20분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "example", Component: MissionExample },
        { meta: MISSIONS[1], name: "steps", Component: MissionSteps },
        { meta: MISSIONS[2], name: "ask_first", Component: MissionAskFirst },
      ]}
      quiz={QUIZ}
      wrap={{
        completeTitle: "프롬프트 중급 AIPBL 완료",
        elements: THREE_SKILLS,
        templateTitle: "오늘의 결과물: 프롬프트 중급 템플릿",
        template: FINAL_TEMPLATE,
        calloutTitle: "실습 마무리",
        calloutText:
          "이 템플릿의 대괄호를 내 업무 내용으로 채워, 실제 Claude나 ChatGPT에 붙여 넣으면 오늘 실습이 완성됩니다.\n다음 단계인 프롬프트 심화에서는 제약 조건, 자기 점검, 메타 프롬프트를 다룹니다.",
        primary: { href: "/ai-practice/prompt-advanced", label: "다음 AIPBL: 프롬프트 심화" },
        secondary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
