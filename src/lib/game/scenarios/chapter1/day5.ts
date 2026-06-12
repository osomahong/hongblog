/**
 * Day 5 (금): 디데이. 오전 잔무 2건 + 14시 본부장 보고(보스전).
 * 시간 예산 4블록 (오전만). 보고는 START_BOSS로 진입한다.
 */

import type { BossSpec, DaySpec } from "../schema";

export const DAY5: DaySpec = {
  day: 5,
  title: "금요일: 14시, 본부장 보고",
  timeBudget: 4,
  briefing: [
    { speaker: "system", text: "금요일 오전. 14시에 본부장 보고가 잡혀 있다." },
    { speaker: "manager", text: "오전에 마무리 두 건만 부탁해요. 14시에 봅시다." },
    { speaker: "minji", text: "긴장돼요? 이번 주에 배운 대로만 하면 돼요." },
  ],
  tasks: [
    {
      kind: "standard",
      id: "d5-proof",
      title: "최종본 오탈자 점검",
      brief: "보고서 최종본 오탈자랑 수치 표기를 한 번 더 봐 주세요. 발표 직전 마지막 점검이에요.",
      from: "manager",
      tags: [],
      requiredElements: ["example"],
      directCost: { time: 2, energy: 2 },
      required: true,
      aiPreview: { clean: "오탈자 4건과 표기 불일치 2건이 잡혔다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "표기까지 잡았네요. 꼼꼼합니다." }],
        pass: [{ speaker: "manager", text: "수정 반영했습니다." }],
        rework: [{ speaker: "manager", text: "표지에 오타가 그대로 있는데요." }],
      },
    },
    {
      kind: "standard",
      id: "d5-handout",
      title: "배포용 1장 요약",
      brief: "참석자 배포용으로 보고서를 1장에 요약해 주세요. 보고 흐름 그대로, 결론부터요.",
      from: "manager",
      tags: [],
      requiredElements: ["context", "steps"],
      directCost: { time: 2, energy: 2 },
      required: true,
      aiPreview: { clean: "결론 우선 1장 요약. 보고 흐름과 같은 순서다." },
      outcomeText: {
        excellent: [{ speaker: "manager", text: "배포본 좋네요. 인쇄합시다." }],
        pass: [{ speaker: "manager", text: "배포본 확인했습니다." }],
        rework: [{ speaker: "manager", text: "보고 순서랑 요약 순서가 달라요." }],
      },
    },
  ],
  coaching: [],
  fallbackConcepts: [],
  insightSlugs: ["claude-fundamentals"],
};

export const CHAPTER1_BOSS: BossSpec = {
  intro: [
    { speaker: "system", text: "14시. 본부장실 옆 회의실. 프로젝터가 켜진다." },
    { speaker: "director", text: "시작하죠. 시간이 많지 않습니다." },
    { speaker: "system", text: "보고가 시작됐다. 본부장이 자료를 넘기다 멈춘다." },
  ],
  rounds: [
    {
      id: "boss-r1",
      question: [
        { speaker: "director", text: "이 시장이 내년에도 성장한다는 근거가 뭡니까?" },
      ],
      options: [
        {
          id: "boss-r1-verified",
          label: "출처 원문을 확인한 3개년 추세입니다. 부록에 근거를 붙였습니다.",
          score: 5,
          requiresFlag: "verified:d2-market",
          reply: [{ speaker: "director", text: "원문까지 봤다면 됐습니다. 다음." }],
        },
        {
          id: "boss-r1-defer",
          label: "보고 후 출처를 정리해 금일 중 회신드리겠습니다.",
          score: 3,
          reply: [{ speaker: "director", text: "오늘 퇴근 전까지요." }],
        },
        {
          id: "boss-r1-feel",
          label: "현장 체감상 성장세가 뚜렷합니다.",
          score: 1,
          reply: [{ speaker: "director", text: "체감은 근거가 아닙니다." }],
        },
        {
          id: "boss-r1-ai",
          label: "AI로 조사한 자료라 정확할 겁니다.",
          score: 0,
          reply: [
            { speaker: "director", text: "도구가 한 조사의 책임은 누가 집니까?" },
            { speaker: "me", text: "대답이 떠오르지 않았다." },
          ],
        },
      ],
    },
    {
      id: "boss-r2",
      question: [
        { speaker: "director", text: "경쟁사 점유율, 이 수치 근거 자료를 봅시다." },
      ],
      bombTaskId: "d2-market",
      bombReveal: [
        { speaker: "director", text: "출처가 한국산업데이터연구원이라는데, 그런 기관 보고서가 없어요." },
        { speaker: "system", text: "회의실이 조용해졌다. 등에서 식은땀이 흐른다." },
        { speaker: "manager", text: "...확인 후 정정 보고드리겠습니다." },
      ],
      options: [
        {
          id: "boss-r2-verified",
          label: "원문 검증을 거친 수치입니다. 부록 3페이지에 근거가 있습니다.",
          score: 5,
          requiresFlag: "verified:d2-market",
          reply: [{ speaker: "director", text: "부록 확인했습니다. 깔끔하네요." }],
        },
        {
          id: "boss-r2-scope",
          label: "조사 범위와 한계를 함께 말씀드리겠습니다.",
          score: 3,
          reply: [{ speaker: "director", text: "한계를 아는 건 좋은 신호죠." }],
        },
        {
          id: "boss-r2-rough",
          label: "대략적인 추정치입니다.",
          score: 1,
          reply: [{ speaker: "director", text: "추정이면 추정이라고 적었어야죠." }],
        },
      ],
    },
    {
      id: "boss-r3",
      question: [
        { speaker: "director", text: "좋습니다. 그래서 다음 분기에 뭘 하자는 겁니까?" },
      ],
      options: [
        {
          id: "boss-r3-steps",
          label: "실행안을 3단계로 나눴습니다. 1단계부터 보고드리겠습니다.",
          score: 5,
          requiresConcept: "steps",
          reply: [{ speaker: "director", text: "단계가 명확하네요. 1단계 예산부터 봅시다." }],
        },
        {
          id: "boss-r3-focus",
          label: "핵심 제안 한 가지에 집중해 말씀드리겠습니다.",
          score: 3,
          reply: [{ speaker: "director", text: "들어 봅시다." }],
        },
        {
          id: "boss-r3-later",
          label: "추가 검토 후 별도 보고드리겠습니다.",
          score: 1,
          reply: [{ speaker: "director", text: "오늘이 그 보고 아니었나요?" }],
        },
      ],
    },
  ],
  // 준비도(최대 14) + Q&A(최대 15). 검증/단계분해를 안 배운 런의 상한은 통과선 부근
  passScore: 16,
  passDialogue: [
    { speaker: "director", text: "정리합시다. 방향 좋았습니다. 다음 분기 기대하죠." },
    { speaker: "system", text: "보고가 끝났다. 다리에 힘이 풀린다." },
  ],
  failDialogue: [
    { speaker: "director", text: "오늘 보고는 여기까지 합시다. 다시 준비해서 오세요." },
    { speaker: "system", text: "프로젝터가 꺼졌다. 아무도 말을 걸지 않는다." },
  ],
};
