"use client";

/**
 * 프롬프트 심화 AIPBL.
 * 공용 LabShell에 심화 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_SKILLS } from "./lab-data";
import { MissionConstraints } from "./MissionConstraints";
import { MissionSelfCheck } from "./MissionSelfCheck";
import { MissionMetaPrompt } from "./MissionMetaPrompt";

export function PromptAdvancedLab() {
  return (
    <LabShell
      windowTitle="AIPBL 03 : 프롬프트 심화"
      eventParams={{ content_id: "prompt-advanced", content_name: "프롬프트 심화" }}
      brief={{
        intro:
          "이번 실습에서는 결과물의 품질을 스스로 관리하는 세 가지 기술, 제약 조건, 자기 점검, 메타 프롬프트를 다룹니다. AI에게 일을 시키는 단계를 지나, 결과를 검증하고 프롬프트 설계까지 맡기는 단계로 넘어갑니다.",
        goal: "제약과 점검까지 담긴 프롬프트 종합 템플릿 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 프롬프트 트랙 전체를 종합 템플릿 한 장으로 정리합니다. 예상 소요 시간은 약 20분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "constraints", Component: MissionConstraints },
        { meta: MISSIONS[1], name: "self_check", Component: MissionSelfCheck },
        { meta: MISSIONS[2], name: "meta_prompt", Component: MissionMetaPrompt },
      ]}
      quiz={QUIZ}
      wrap={{
        completeTitle: "프롬프트 심화 AIPBL 완료",
        elements: THREE_SKILLS,
        templateTitle: "오늘의 결과물: 프롬프트 종합 템플릿",
        template: FINAL_TEMPLATE,
        calloutTitle: "프롬프트 트랙 완주",
        calloutText:
          "프롬프트 트랙 세 단계를 모두 마쳤습니다.\n기초의 역할, 맥락, 형식부터 중급의 예시, 단계, 질문, 심화의 제약, 점검, 설계까지 아홉 가지 기술이 이 템플릿 한 장에 담겨 있습니다.\n다음 영역인 AI 업무 자동화 AIPBL은 준비 중이며, 열리면 AI-PRACTICE 페이지에서 안내합니다.",
        primary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
