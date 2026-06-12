/**
 * 챕터 1 "AI 기초": 월요일부터 금요일 보고까지 한 주 생존.
 * 개념 8개가 프롬프트 카드/특수 행동으로 해금되어 게임 실력이 된다.
 */

import type { ChapterSpec } from "../schema";
import { DAY1 } from "./day1";
import { DAY2 } from "./day2";
import { DAY3 } from "./day3";
import { DAY4 } from "./day4";
import { CHAPTER1_BOSS, DAY5 } from "./day5";

export const CHAPTER1: ChapterSpec = {
  id: "ch1-ai-basics",
  title: "AI 오피스 서바이벌",
  subtitle: "1주차: 도구가 먼저 출근했다",
  intro: [
    { speaker: "system", text: "마케팀 3년차. 일은 늘 많았지만 어떻게든 버텨 왔다." },
    { speaker: "system", text: "그런데 이번 주, 회사가 전사 AI 도입을 공지했다." },
    { speaker: "me", text: "옆자리 민지 선배는 벌써 잘 쓰는 것 같던데." },
    { speaker: "me", text: "금요일엔 본부장 보고도 잡혀 있다. 일단, 월요일부터." },
  ],
  concepts: [
    {
      id: "role",
      title: "역할 지정",
      summary: "첫 줄에 \"너는 OO 담당자야\"를 주면 답의 입장과 톤이 잡힌다.",
      effectLabel: "프롬프트 카드 [역할] 사용 가능",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "context",
      title: "맥락 제공",
      summary: "누가 볼 문서인지, 무슨 상황인지를 줘야 AI가 우리 회사 일을 한다.",
      effectLabel: "프롬프트 카드 [맥락] 사용 가능",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "example",
      title: "예시 제시",
      summary: "\"지난번 이 파일처럼\" 한 줄이 형식 설명 열 줄보다 정확하다.",
      effectLabel: "프롬프트 카드 [예시] 사용 가능",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "verify",
      title: "결과 검증",
      summary: "수치와 출처가 든 결과물은 원문을 확인한다. 멀쩡해 보일수록 위험하다.",
      effectLabel: "제출 전 [검증하고 제출] 가능",
      classSlug: "what-is-hallucination",
    },
    {
      id: "delegation",
      title: "위임 판단",
      summary: "글, 요약, 초안은 맡기고 5분 잡무와 사람 판단은 직접 한다.",
      effectLabel: "업무 카드에 위임 적합도 힌트 표시",
      classSlug: "four-ds-of-ai-fluency",
    },
    {
      id: "privacy",
      title: "민감정보 주의",
      summary: "기밀은 AI에 올리는 순간 사고다. 꼭 맡겨야 하면 가명화부터.",
      effectLabel: "기밀 업무에 [가명화 후 위임] 가능",
      classSlug: "responsible-ai-use",
    },
    {
      id: "steps",
      title: "단계 분해",
      summary: "큰 일은 목차 먼저, 그다음 장별로. 통으로 시키면 중간부터 흐려진다.",
      effectLabel: "프롬프트 카드 [단계분해] 사용 가능",
      classSlug: "prompt-engineering-basics",
    },
    {
      id: "critique",
      title: "반대 의견 요청",
      summary: "\"괜찮지?\"라고 물으면 칭찬만 온다. \"약점을 비판해 줘\"라고 묻는다.",
      effectLabel: "점검 업무에서 비판 요청 선택지 활성화",
      classSlug: "what-is-sycophancy",
    },
  ],
  initial: { energy: 10, trust: 50 },
  days: [DAY1, DAY2, DAY3, DAY4, DAY5],
  boss: CHAPTER1_BOSS,
  endings: [
    {
      id: "ending-ace",
      title: "엔딩 A: 팀의 AI 에이스",
      minTrust: 90,
      minKpi: 40,
      dialogue: [
        { speaker: "manager", text: "오늘 보고, 본부장님이 따로 칭찬하셨어요." },
        { speaker: "manager", text: "다음 분기 신사업 검토, 리드 맡아 볼래요?" },
        { speaker: "minji", text: "거봐요. 일주일 만에 이렇게 된다니까요." },
      ],
      epilogue:
        "한 주 전엔 AI가 내 자리를 위협하는 줄 알았다. 지금은 내 일을 두 배로 키워 주는 도구라는 걸 안다. 다음 주가 기다려진다.",
    },
    {
      id: "ending-survivor",
      title: "엔딩 B: 무사히 한 주 생존",
      minTrust: 40,
      dialogue: [
        { speaker: "manager", text: "한 주 수고했어요. 다음 주에 봅시다." },
        { speaker: "minji", text: "처음치고 잘했어요. 다음 주엔 더 늘 거예요." },
      ],
      epilogue:
        "완벽하진 않았지만 한 주를 버텼고, 도구를 다루는 감을 잡았다. 퇴근길 지하철에서 생각했다. 다음 주엔 더 잘할 수 있을 것 같다.",
    },
    {
      id: "ending-barely",
      title: "엔딩 C: 턱걸이 통과",
      dialogue: [
        { speaker: "manager", text: "보고는 넘어갔는데, 잠깐 면담 좀 합시다." },
        { speaker: "manager", text: "다음 분기엔 일하는 방식을 좀 바꿔 봐요. 도구 탓이 아니에요." },
      ],
      epilogue:
        "통과는 했지만 남은 건 경고성 면담이었다. 뭐가 문제였는지는 안다. 다시 하면 다르게 할 수 있다.",
    },
  ],
  gameOverTexts: {
    trust: {
      title: "게임 오버: 프로젝트 제외",
      dialogue: [
        { speaker: "manager", text: "이번 프로젝트는 여기까지 합시다." },
        { speaker: "manager", text: "당분간 다른 업무 맡아 주세요." },
        { speaker: "me", text: "신뢰는 쌓는 데 한 주, 무너지는 건 한순간이었다." },
      ],
      classSlug: "four-ds-of-ai-fluency",
    },
    security: {
      title: "게임 오버: 보안 사고",
      dialogue: [
        { speaker: "security", text: "[보안팀] 대외비 자료 외부 입력 2차 위반입니다." },
        { speaker: "security", text: "징계위원회 회부 대상입니다." },
        { speaker: "me", text: "편하자고 올린 파일 하나가 이렇게 돌아왔다." },
      ],
      classSlug: "responsible-ai-use",
    },
    boss: {
      title: "게임 오버: 보고 실패",
      dialogue: [
        { speaker: "director", text: "준비가 안 된 보고는 안 받느니만 못합니다." },
        { speaker: "manager", text: "...다시 준비합시다." },
        { speaker: "me", text: "금요일 아침으로 돌아가고 싶다." },
      ],
      classSlug: "what-is-hallucination",
    },
  },
};
