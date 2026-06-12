/**
 * 화자별 메신저 표시 메타. 색·정렬은 Neo-Brutalism 팔레트 안에서.
 */

import type { SpeakerId } from "@/lib/game/scenarios/schema";

export interface SpeakerMeta {
  name: string;
  /** 내 메시지는 우측 정렬 */
  align: "left" | "right" | "center";
  bubbleClass: string;
  nameClass: string;
}

export const SPEAKERS: Record<SpeakerId, SpeakerMeta> = {
  me: {
    name: "나",
    align: "right",
    bubbleClass: "bg-black text-white border-black",
    nameClass: "text-gray-500",
  },
  manager: {
    name: "김 팀장",
    align: "left",
    bubbleClass: "bg-white text-black border-black",
    nameClass: "text-gray-700",
  },
  minji: {
    name: "민지 선배",
    align: "left",
    bubbleClass: "bg-accent/30 text-black border-black",
    nameClass: "text-gray-700",
  },
  director: {
    name: "본부장",
    align: "left",
    bubbleClass: "bg-primary/10 text-black border-black font-semibold",
    nameClass: "text-primary font-bold",
  },
  security: {
    name: "보안팀",
    align: "left",
    bubbleClass: "bg-primary text-white border-black",
    nameClass: "text-primary font-bold",
  },
  ai: {
    name: "AI 어시스턴트",
    align: "left",
    bubbleClass: "bg-gray-100 text-gray-900 border-gray-400 border-dashed",
    nameClass: "text-gray-500",
  },
  system: {
    name: "",
    align: "center",
    bubbleClass: "",
    nameClass: "",
  },
};

/** 클래스/코스 링크 맵: 서버에서 만들어 클라이언트로 내려준다 */
export type ClassLinkMap = Record<string, { title: string; href: string }>;
