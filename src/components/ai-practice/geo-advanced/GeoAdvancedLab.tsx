"use client";

/**
 * GEO 심화 AIPBL.
 * 공용 LabShell에 GEO 심화 단계의 대본 데이터와 미션 컴포넌트를 주입한다.
 * 문장(기초)과 구조(중급)를 갖춘 모모팜 사이트의 기술 층을 점검한다.
 * robots.txt 크롤러 접근, JSON-LD 구조화 데이터, llms.txt를 다룬다.
 */

import { LabShell } from "../lab/LabShell";
import { FINAL_TEMPLATE, MISSIONS, QUIZ, THREE_ELEMENTS } from "./lab-data";
import { MissionCrawler } from "./MissionCrawler";
import { MissionSchema } from "./MissionSchema";
import { MissionLlms } from "./MissionLlms";

export function GeoAdvancedLab() {
  return (
    <LabShell
      windowTitle="AIPBL 06 : GEO 심화"
      eventParams={{ content_id: "geo-advanced", content_name: "GEO 심화" }}
      brief={{
        intro:
          "이번 실습에서는 문장과 구조를 갖춘 모모팜 사이트의 기술 층을 점검합니다. AI 크롤러의 접근을 막는 robots.txt를 고치고, 구조화 데이터(JSON-LD)로 정보에 이름표를 붙이고, 사이트 안내문 llms.txt를 만듭니다.",
        goal: "내 사이트의 기술 상태를 점검할 수 있는 GEO 기술 점검 카드 1개",
        footer:
          "미션 3개를 마치면 점검 퀴즈 3문항을 풀고, 마지막에 오늘 익힌 세 가지를 점검 카드 한 장으로 정리합니다. 예상 소요 시간은 약 15분입니다.",
      }}
      missions={[
        { meta: MISSIONS[0], name: "crawler", Component: MissionCrawler },
        { meta: MISSIONS[1], name: "schema", Component: MissionSchema },
        { meta: MISSIONS[2], name: "llms", Component: MissionLlms },
      ]}
      quiz={QUIZ}
      quizTitle="점검: GEO에 유리한 쪽 고르기"
      quizDesc="두 선택지 중 GEO에 유리한 쪽을 고릅니다. 모두 3문항이고, 고르면 해설이 바로 표시됩니다."
      wrapDesc="오늘 익힌 세 가지를 점검 카드 한 장으로 정리합니다. 내 사이트의 기술 상태에 같은 기준을 적용하면 실습이 완성됩니다."
      wrap={{
        completeTitle: "GEO 심화 AIPBL 완료",
        elements: THREE_ELEMENTS,
        templateTitle: "오늘의 결과물: GEO 기술 점검 카드",
        template: FINAL_TEMPLATE,
        calloutTitle: "실습 마무리",
        calloutText:
          "이 점검 카드로 내 사이트의 robots.txt와 구조화 데이터를 확인해 보면 오늘 실습이 완성됩니다.\n기초의 문장, 중급의 구조, 심화의 기술 층까지 GEO 트랙 세 단계를 모두 마쳤습니다. GEO의 개념과 실제 검증 데이터가 궁금하면 아래의 GEO 최적화 가이드 글에서 이어서 볼 수 있습니다.",
        primary: { href: "/insights/geo-marketing-start-guide", label: "GEO 최적화 가이드 글 읽기" },
        secondary: { href: "/ai-practice", label: "AI-PRACTICE 목록으로" },
      }}
    />
  );
}
