/**
 * Day 1 (월): 온보딩. AI 도구가 도입된 첫날.
 * 함정 없음, 직접 처리 총비용 = 시간 예산 (실패 불가 설계).
 * 학습: 역할 지정, 맥락 제공. "직접 3블록 vs AI 1블록" 대비 체험.
 */

import type { DaySpec } from "../schema";

export const DAY1: DaySpec = {
  day: 1,
  title: "월요일: 도구가 먼저 출근했다",
  timeBudget: 6,
  briefing: [
    { speaker: "system", text: "월요일 오전 9시. 메신저가 깜빡인다." },
    { speaker: "manager", text: "공지요. 이번 분기부터 전사 AI 어시스턴트 도입합니다." },
    { speaker: "manager", text: "다들 업무에 활용해 보세요. 활용 사례는 분기 평가에 반영됩니다." },
    { speaker: "me", text: "평가에 반영이라니. 나만 못 쓰고 있는 거 아니었나." },
    { speaker: "minji", text: "어차피 다들 처음이에요. 오늘 할 일부터 봐요." },
  ],
  tasks: [
    {
      kind: "standard",
      id: "d1-minutes",
      title: "주간 회의록 정리",
      brief:
        "어제 주간회의 녹취 텍스트를 결정사항, 담당자, 기한 표로 정리해 주세요. 지난주 포맷 그대로요.",
      from: "manager",
      tags: [],
      requiredElements: ["role", "context"],
      directCost: { time: 3, energy: 3 },
      required: true,
      aiPreview: {
        clean: "결정사항 6건이 담당자, 기한과 함께 표로 정리됐다. 지난주 포맷과 동일하다.",
      },
      outcomeText: {
        excellent: [
          { speaker: "manager", text: "깔끔하네요. 이대로 공유합시다." },
        ],
        pass: [{ speaker: "manager", text: "확인했습니다. 공유해 주세요." }],
        rework: [
          { speaker: "manager", text: "포맷이 왜 바뀌었어요? 잡담까지 다 들어가 있고." },
          { speaker: "me", text: "통째로 던지면 알아서 해 줄 줄 알았는데." },
        ],
      },
      lesson: "AI에게 일을 시킬 때도 신입에게 시키듯 배경과 형식을 줘야 합니다.",
    },
    {
      kind: "standard",
      id: "d1-reply",
      title: "거래처 일정 연기 요청 회신",
      brief:
        "거래처가 납품 일정을 2주 미뤄 달라네요. 정중하지만 단호하게 거절하는 회신 초안 부탁해요.",
      from: "manager",
      tags: [],
      requiredElements: ["role"],
      directCost: { time: 2, energy: 2 },
      required: true,
      aiPreview: {
        clean: "정중한 인사로 시작해 계약 일정 근거를 들어 거절하고, 대안 협의를 제안하는 회신 초안.",
      },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "톤 좋네요. 바로 보냅시다." }],
        pass: [{ speaker: "manager", text: "괜찮네요. 보내 주세요." }],
        rework: [
          { speaker: "manager", text: "이건 너무 사과문 같은데요. 우리가 잘못한 게 아니잖아요." },
        ],
      },
      lesson: "역할을 지정하면 문장의 입장과 톤이 잡힙니다.",
    },
    {
      kind: "standard",
      id: "d1-apply",
      title: "AI 도구 사용 신청서 제출",
      brief: "전산팀에 계정 신청서 내고 보안 서약서에 서명만 하면 됩니다. 5분 거리예요.",
      from: "minji",
      tags: ["trivial"],
      requiredElements: [],
      directCost: { time: 1, energy: 1 },
      required: true,
      trustWeight: 0.5,
      delegatePenaltyText: [
        { speaker: "ai", text: "전산팀 시스템에 접근할 수 없습니다. 신청 메일 초안만 작성했습니다." },
        { speaker: "me", text: "결국 내가 가서 서명해야 하네. 처음부터 그냥 할걸." },
      ],
      aiPreview: { clean: "신청서 양식이 작성됐다. 제출과 서명은 본인이 해야 한다." },
      outcomeText: {
        excellent: [{ speaker: "system", text: "계정이 발급됐다." }],
        pass: [{ speaker: "system", text: "계정이 발급됐다. 이제 진짜 시작이다." }],
        rework: [{ speaker: "system", text: "서명이 누락됐다." }],
      },
    },
  ],
  coaching: [
    {
      id: "d1-coach-role",
      afterResolvedCount: 1,
      dialogue: [
        { speaker: "minji", text: "그거 AI한테 시켜도 돼요. 대신 첫 줄에 역할부터 줘요." },
        { speaker: "minji", text: "\"너는 마케팅팀 회의록 담당자야\" 이렇게요. 결과가 달라져요." },
      ],
      grantConcept: "role",
    },
    {
      id: "d1-coach-context",
      afterResolvedCount: 2,
      dialogue: [
        { speaker: "minji", text: "하나 더. 배경 설명 없이 시키면 AI는 우리 회사를 몰라요." },
        { speaker: "minji", text: "누가 볼 문서인지, 상황이 뭔지 한 줄이라도 넣어 줘요." },
      ],
      grantConcept: "context",
    },
  ],
  fallbackConcepts: ["role", "context"],
  insightSlugs: ["prompt-engineering-basics"],
};
