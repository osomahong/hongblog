import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL, CAREER_BASE_YEAR, CAREER_REFERENCE_YEAR, YEARS_OF_EXPERIENCE } from "@/lib/constants";
import { absoluteUrl } from "@/lib/utils";
import { getInsights, getClasses, getCourses } from "@/lib/content";
import {
  ArrowRight,
  MessageSquare,
  BookOpen,
  Layers,
  Award,
  Users,
  Building2,
  GraduationCap,
  CalendarDays,
  Tag,
  FileText,
  GitBranch,
  UserCheck,
  Lock,
  Smartphone,
  Database,
  Workflow,
  ExternalLink,
  Briefcase,
  CircleHelp,
  Bot,
  Sparkles,
} from "lucide-react";
import { NeoButton } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";
import { BrandIcon } from "@/components/icons/BrandIcons";
import { AboutCanvasFx } from "@/components/about/AboutCanvasFx";

const BASE_YEAR = CAREER_BASE_YEAR;
const REFERENCE_YEAR = CAREER_REFERENCE_YEAR;
const CLIENT_COUNT_LABEL = "120곳+";
/** 경력, 고객사, 교육 수치를 마지막으로 확인한 시점 */
const CREDENTIAL_AS_OF = "2026년 8월";
/** 화면의 프로필 버튼과 Person, Organization JSON-LD의 sameAs가 같은 값을 쓴다 */
const LINKEDIN_PROFILE_URL =
  "https://www.linkedin.com/in/%EC%8A%B9%ED%98%91-%ED%99%8D-1771b2240/";

const ABOUT_TITLE = "AI, 데이터 분석 컨설턴트 홍승협(준이아빠) 소개";
const ABOUT_DESCRIPTION = `홍승협(준이아빠)은 ${YEARS_OF_EXPERIENCE}년차 AI/AX, 데이터 분석 컨설턴트입니다. AEO와 GEO, AI 업무 자동화 컨설팅과 함께 ${CLIENT_COUNT_LABEL} 기업과 기관의 GA4, GTM 분석 환경을 구축했고 누적 1,000명 이상을 교육했습니다.`;

export const metadata: Metadata = {
  title: ABOUT_TITLE,
  description: ABOUT_DESCRIPTION,
  alternates: { canonical: `${SITE_URL}/about` },
  openGraph: {
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    type: "profile",
    url: `${SITE_URL}/about`,
    images: [{ url: `${SITE_URL}/og-default.png`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: ABOUT_TITLE,
    description: ABOUT_DESCRIPTION,
    images: [`${SITE_URL}/og-default.png`],
  },
};

interface ContentCounts {
  insights: number;
  classes: number;
  courses: number;
  total: number;
}

function getContentCounts(): ContentCounts {
  const insights = getInsights().length;
  const classes = getClasses().length;
  const courses = getCourses().length;

  return { insights, classes, courses, total: insights + classes + courses };
}

function buildStats(counts: ContentCounts) {
  return [
    {
      icon: CalendarDays,
      value: `${YEARS_OF_EXPERIENCE}년차`,
      label: "디지털 마케팅 경력",
      sub: `${BASE_YEAR}년~${REFERENCE_YEAR}년 기준`,
    },
    {
      icon: Building2,
      value: CLIENT_COUNT_LABEL,
      label: "누적 고객사 프로젝트",
      sub: "최근 5년 누적 기준",
    },
    {
      icon: Tag,
      value: "3,000+",
      label: "누적 설계 이벤트와 파라미터",
      sub: `고객사당 20~30개 × ${CLIENT_COUNT_LABEL}`,
    },
    {
      icon: Users,
      value: "1,000명+",
      label: "누적 실무 교육 수강자",
      sub: "기업 담당자, 공공 아카데미",
    },
    {
      icon: BookOpen,
      value: `${counts.total}편`,
      label: "공개 콘텐츠",
      sub: "GA4, AEO, GEO, AI 실무 해설",
    },
    {
      icon: GraduationCap,
      value: "12개+",
      label: "산업군 경험",
      sub: "공공, 금융, 이커머스, 제조 외",
    },
  ];
}

const principles = [
  {
    title: "성과가 나온 이유를 남깁니다",
    desc: "마케팅 성과를 데이터로 증명하고 구조로 설명합니다. 같은 방법으로 다시 확인할 수 있는 형태로 기록을 남깁니다.",
  },
  {
    title: "누구나 읽을 수 있게 씁니다",
    desc: "담당자와 경영진이 같은 문서를 읽고 같은 결론에 도달하도록 정리합니다. 낯선 개념은 비유와 예시를 먼저 두고 설명합니다.",
  },
  {
    title: "직접 쓰고 직접 운영합니다",
    desc: "이 사이트의 기획, 구현, 콘텐츠를 직접 운영합니다. 일반 기업이 겪는 문제를 같은 자리에서 겪으며 배웁니다.",
  },
];

const workItems = [
  {
    icon: Bot,
    title: "AI/AX 컨설팅과 업무 자동화 설계",
    desc: "기업의 반복 업무를 AI 에이전트와 워크플로우로 옮기는 전환(AX)을 설계합니다. 진단, 도입 우선순위, 실무 정착까지 함께 잡습니다.",
  },
  {
    icon: Sparkles,
    title: "AEO, GEO 컨설팅",
    desc: "AI 검색과 생성형 답변에 인용되도록 콘텐츠 구조, 구조화 데이터, 엔티티를 정비합니다. 이 사이트가 실측 실험장입니다.",
  },
  {
    icon: FileText,
    title: "이벤트 택소노미와 정의서 설계",
    desc: "비즈니스가 신경 써야 하는 순간을 일관된 네이밍과 계층 파라미터로 정의합니다. 고객사당 20~30개, 누적 3,000개 안팎 운영.",
  },
  {
    icon: GitBranch,
    title: "dataLayer → GTM → GA4 파이프라인 구축",
    desc: "개발자용 스크립트 가이드를 작성하고, 반영 후 콘솔 디버깅과 누락 역추적까지 직접 수행합니다.",
  },
  {
    icon: UserCheck,
    title: "Client-ID, User-ID 사용자 식별 설계",
    desc: "개인정보(PII) 노출 없이 같은 사용자의 방문을 하나의 여정으로 이어 붙입니다.",
  },
  {
    icon: Lock,
    title: "Enhanced Conversions와 사용자 제공 데이터",
    desc: "3rd-party 쿠키 제한 환경에서 전환 정확도를 지키기 위한 해시 기반 전송 구조를 설계합니다.",
  },
  {
    icon: Smartphone,
    title: "Firebase와 GA4 웹, 앱 통합",
    desc: "logEvent와 setUserProperty를 웹 스키마와 동일한 네이밍으로 맞춰, 웹과 앱을 한 사용자 여정으로 묶습니다.",
  },
  {
    icon: Database,
    title: "BigQuery 기반 로우데이터 분석",
    desc: "GA4 UI에서 표현되지 않는 어트리뷰션을 SQL로 재정의하고, 예약 쿼리와 대시보드로 자동 리포트를 구성합니다.",
  },
  {
    icon: Workflow,
    title: "대형 프로젝트 리드와 교육",
    desc: "관광 진흥 공공기관 데이터 분석 환경 구축 사업에 2023년부터 4년 연속 컨설턴트. 기업과 공공기관에서 AI 활용과 데이터 분석 실무를 누적 1,000명 이상 교육했습니다.",
  },
];

/** 공개 가능한 전체 업무 연혁 */
const workHistory = [
  {
    year: "2021·2026",
    label: "국내 눈 건강 중심 건강기능식품 기업 A사",
    emoji: "🧃",
    work: "건강기능식품 데이터·물류 분석 환경 구축",
  },
  {
    year: "2021·2026",
    label: "외국인 대상 여행 물류 플랫폼 A사",
    emoji: "🧳",
    work: "여행 물류 데이터·운영 분석 환경 구축",
  },
  {
    year: "2022",
    label: "법률·정책 데이터 플랫폼 A사",
    emoji: "⚖️",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    label: "AI 기반 3D 콘텐츠 제작 솔루션 기업 A사",
    emoji: "🎬",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    label: "3D 디자인 소프트웨어 기업 A사",
    emoji: "🧊",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    label: "음성 AI·디지털 치료 솔루션 기업 A사",
    emoji: "🩺",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    label: "기업용 정보보안 소프트웨어 기업 A사",
    emoji: "🛡️",
    work: "정보보안 소프트웨어 분석 환경·SEO 구축",
  },
  {
    year: "2022",
    label: "구강·생활용품 D2C 브랜드 기업 A사",
    emoji: "🧴",
    work: "디지털 매체 운영, CRM, 데이터 분석 교육",
  },
  {
    year: "2022",
    label: "디지털 마케팅·홍보 전문기업 A사",
    emoji: "📣",
    work: "디지털 마케팅 현황 점검, 채널별 홍보 방향 및 실행 과제 정리",
  },
  {
    year: "2022",
    label: "프랜차이즈 직원관리 소프트웨어 기업 A사",
    emoji: "👥",
    work: "GA4·GTM 이벤트 설계와 태깅, UTM·검색/디스플레이 광고, 보고서 설정",
  },
  {
    year: "2022~2024",
    label: "다국어 커뮤니케이션·산업안전 AI 플랫폼 A사",
    emoji: "🌐",
    work: "GA 데이터 수집 설정, 이벤트·전환 목표 설정, SEO 점검",
  },
  {
    year: "2022",
    label: "채용관리 솔루션 기업 A사",
    emoji: "🧑‍💼",
    work: "검색·디스플레이 광고 캠페인 구조, SEO 체크리스트, GA4·전환 분석",
  },
  {
    year: "2023~2026",
    label: "관광 진흥 공공기관",
    emoji: "🏛️",
    work: "관광 데이터 수집·분석 환경 구축, 참여기업 유입·전환 개선, AI 활용 방향 제안",
  },
  {
    year: "2023",
    label: "프리미엄 숙박 큐레이션 플랫폼 A사",
    emoji: "🏨",
    work: "관광 데이터 수집·분석 환경 점검, 유입·전환 개선안 제시",
  },
  {
    year: "2023",
    label: "관광·렌터카 예약 시스템 기업 A사",
    emoji: "🚙",
    work: "관광 데이터 수집·분석 환경 점검, 유입·전환 개선안 제시",
  },
  {
    year: "2023",
    label: "무역·투자 진흥 공공기관 아카데미",
    emoji: "🌍",
    work: "디지털 마케팅 과정 강의",
  },
  {
    year: "2023",
    label: "대형 서점·콘텐츠 유통 기업 A사",
    emoji: "📚",
    work: "GA4 분석 환경 구축 및 유지보수",
  },
  {
    year: "2023",
    label: "면세 유통 기업 A사",
    emoji: "🛍️",
    work: "면세 유통 분석 환경 구축",
  },
  {
    year: "2023",
    label: "프리미엄 아울렛 운영 기업 A사",
    emoji: "🛍️",
    work: "아울렛 유통 분석 환경 구축",
  },
  {
    year: "2023",
    label: "프리미엄 아울렛 온라인몰 A사",
    emoji: "🛒",
    work: "GA4·GTM 이벤트, UTM, 대시보드 구축",
  },
  {
    year: "2023",
    label: "종합식품·이커머스 기업 A사",
    emoji: "🍱",
    work: "이커머스·결제·간편결제 데이터 추적",
  },
  {
    year: "2023",
    label: "식품·건강음료 기업 A사",
    emoji: "🥗",
    work: "GA4·Firebase 구축 및 이벤트 검수",
  },
  {
    year: "2023",
    label: "호텔·리조트 종합 레저 기업 A사",
    emoji: "🏨",
    work: "호텔·리조트 분석 프로젝트",
  },
  {
    year: "2023",
    label: "도심 프리미엄 호텔 A사",
    emoji: "🏨",
    work: "호텔 GA4·GTM 분석 환경 구축",
  },
  {
    year: "2023",
    label: "글로벌 신발 브랜드 한국 법인 A사",
    emoji: "👟",
    work: "글로벌 브랜드 한국 법인 분석",
  },
  {
    year: "2023",
    label: "신발 멀티숍 유통 기업 A사",
    emoji: "👟",
    work: "글로벌 브랜드 한국 법인 분석",
  },
  {
    year: "2023",
    label: "통합 PC 보안 소프트웨어 기업 A사",
    emoji: "🛡️",
    work: "보안 제품 GA4·Amplitude·GTM 및 SEO",
  },
  {
    year: "2023",
    label: "이커머스 마케팅 자동화 소프트웨어 기업 A사",
    emoji: "🤖",
    work: "태깅 구조 진단, Looker 대시보드 구축, 채널별 성과 개선안 제시",
  },
  {
    year: "2023",
    label: "의료 데이터·헬스케어 플랫폼 기업 A사",
    emoji: "🩺",
    work: "모바일 앱 GA4 온보딩",
  },
  {
    year: "2023",
    label: "두피·헤어 케어 브랜드 기업 A사",
    emoji: "💇",
    work: "GA4 온보딩",
  },
  {
    year: "2023",
    label: "온라인 상품 큐레이션 커머스 기업 A사",
    emoji: "🛒",
    work: "GA4·GTM 이벤트 스크립트 및 검수",
  },
  {
    year: "2023",
    label: "외식·식품 브랜드 기업 A사",
    emoji: "🍽️",
    work: "GA4·GTM 스크립트 및 이벤트 수정",
  },
  {
    year: "2023",
    label: "B2B·B2C 마케팅·콘텐츠 기업 A사",
    emoji: "📣",
    work: "B2B·B2C 포지셔닝, SEO, 검색광고, 제휴 전략",
  },
  {
    year: "2023",
    label: "다회용기 순환 플랫폼 기업 A사",
    emoji: "♻️",
    work: "미디어믹스와 광고 채널·예산 분석, CRM 활용 방안 정리",
  },
  {
    year: "2024",
    label: "국내 보안 소프트웨어 기업 A사",
    emoji: "🛡️",
    work: "국내·일본·중국 GA4·GTM, BigQuery, 대시보드",
  },
  {
    year: "2024",
    label: "사립 종합대학 A",
    emoji: "🎓",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2024",
    label: "AI 기반 여행 추천 소프트웨어 기업 A사",
    emoji: "🧭",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    label: "도매·소매 거래 중개 플랫폼 기업 A사",
    emoji: "🧺",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    label: "디지털 금융·환전 서비스 기업 A사",
    emoji: "💱",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    label: "행사·컨퍼런스 플랫폼 기업 A사",
    emoji: "🎟️",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    label: "B2B 온라인 도매·유통 플랫폼 기업 A사",
    emoji: "📦",
    work: "커머스 유통 분석 환경 구축",
  },
  {
    year: "2024",
    label: "캐릭터 상품·완구·게임 유통 기업 A사",
    emoji: "🎮",
    work: "커머스·엔터테인먼트 유통 분석",
  },
  {
    year: "2024",
    label: "글로벌 광고·마케팅 대행사 A사",
    emoji: "📣",
    work: "GA4 보고서·탐색 기능 실습 교육",
  },
  {
    year: "2024~2026",
    label: "안과·의료 서비스 기업 A사",
    emoji: "🏥",
    work: "병원 GA4/GTM 및 전환 분석",
  },
  {
    year: "2024~2026",
    label: "장애인·아동 지원 비영리재단",
    emoji: "🤝",
    work: "비영리 후원·전환 추적",
  },
  {
    year: "2024",
    label: "글로벌 SaaS·블록체인 서비스 기업 A사",
    emoji: "☁️",
    work: "SaaS 글로벌 마케팅, SEO, 콘텐츠 전략",
  },
  {
    year: "2024",
    label: "요양·돌봄 플랫폼 기업 A사",
    emoji: "👵",
    work: "요양 플랫폼 B2B·B2C 마케팅, SEO, 검색광고",
  },
  {
    year: "2024",
    label: "정밀영양 AI·헬스테크 기업 A사",
    emoji: "🧠",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024",
    label: "문서 AI 소프트웨어 기업 A사",
    emoji: "📄",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024",
    label: "타이어 센싱·스마트 모빌리티 기업 A사",
    emoji: "🚗",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024~2026",
    label: "증권·자산관리 금융사 A사",
    emoji: "💹",
    work: "이벤트 추적, GA4 보고서, BigQuery·Looker 연동",
  },
  {
    year: "2025",
    label: "사립 종합대학 B",
    emoji: "🎓",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2025",
    label: "사이버대학 A",
    emoji: "🎓",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2025~2026",
    label: "전통문화·공연 관광 기업 A사",
    emoji: "🎭",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    label: "여행 데이터 소프트웨어 기업 A사",
    emoji: "🧳",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    label: "모빌리티 데이터·리워드 플랫폼 기업 A사",
    emoji: "🚗",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    label: "국제구호개발 NGO",
    emoji: "🤝",
    work: "비영리 후원 전환 추적",
  },
  {
    year: "2025~2026",
    label: "자립 지원 사회복지 NGO",
    emoji: "🤝",
    work: "GA4·GTM 및 후원 전환 추적",
  },
  {
    year: "2025~2026",
    label: "장애인 재활·복지 비영리재단",
    emoji: "🩺",
    work: "비영리 후원·전환 추적",
  },
  {
    year: "2025",
    label: "사립 종합대학 C",
    emoji: "🎓",
    work: "대학·대학원 페이지 데이터 분석",
  },
  {
    year: "2026",
    label: "국내외 트레킹·자연관광 여행사 A사",
    emoji: "🥾",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    label: "제주 수목원·웰니스 관광시설 A사",
    emoji: "🌳",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    label: "키즈 여행·액티비티 플랫폼 기업 A사",
    emoji: "👨‍👩‍👧‍👦",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    label: "프리미엄 스파·웰니스 기업 A사",
    emoji: "🌿",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    label: "디지털 노마드·워케이션 기업 A사",
    emoji: "🌏",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    label: "클라우드 MSP·데이터 파이프라인 기업 A사",
    emoji: "☁️",
    work: "클라우드 MSP 분석 환경·데이터 파이프라인 구축",
  },
  {
    year: "2026",
    label: "부티크 호텔 A사",
    emoji: "🏨",
    work: "호텔 웹사이트 GA4 설정 및 전환 데이터 점검",
  },
  {
    year: "2026",
    label: "수입 자동차·모터사이클 판매 법인 A사",
    emoji: "🚗",
    work: "GA4 권한, UTM, 프로모션 페이지 추적 기획",
  },
  {
    year: "2026",
    label: "워케이션 서비스 브랜드 A사",
    emoji: "🌏",
    work: "GTM 기본 태그 및 예약 여정 점검",
  },
  {
    year: "2026",
    label: "자동차용품 제조·유통 기업 A사",
    emoji: "🚗",
    work: "광고·전환 데이터 태깅",
  },
  {
    year: "2026",
    label: "사이버대학 B",
    emoji: "🎓",
    work: "입시·모집 광고 데이터 및 마케팅 전략",
  },
  {
    year: "2026",
    label: "리퍼·보상판매 커머스 기업 A사",
    emoji: "🔄",
    work: "브랜드 USP, 콘텐츠, 보상판매, CRM·재구매 마케팅",
  },
  {
    year: "2026",
    label: "산업 신호 분석·모니터링 기업 A사",
    emoji: "📡",
    work: "B2B 글로벌 마케팅, SEO, 사례 콘텐츠·PR 전략",
  },
];

/** 대표 이력. 연도는 계약 시작 기준이며, 고객사명 대신 업종형 라벨을 표시한다. */
const milestones: {
  year: string;
  title: string;
  orgs: { label: string; emoji: string }[];
  note?: string;
}[] = workHistory.map((item) => ({
  year: item.year.split(/[·~]/)[0],
  title: item.work,
  orgs: [{ label: item.label, emoji: item.emoji }],
}));

/** 연혁을 연도로 묶는다. 배열 순서를 유지하므로 같은 해 안에서도 입력 순서가 곧 계약 순서다 */
const milestonesByYear = milestones.reduce<Record<string, typeof milestones>>(
  (acc, m) => {
    (acc[m.year] ??= []).push(m);
    return acc;
  },
  {},
);
const milestoneYears = Object.keys(milestonesByYear).sort();

export default async function AboutPage() {
  const counts = getContentCounts();
  const stats = buildStats(counts);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    // 글마다 붙는 Article.author가 이 @id를 참조해 하나의 인물 그래프로 합산된다
    "@id": absoluteUrl("/about#person"),
    name: "홍승협",
    alternateName: ["준이아빠", "Hong Seunghyub"],
    url: absoluteUrl("/about"),
    image: absoluteUrl("/profile-illustration.png"),
    jobTitle: "AX 컨설팅 랩 차장",
    worksFor: {
      "@type": "Organization",
      name: "오픈소스마케팅",
      url: "https://osoma.kr",
    },
    description: `${YEARS_OF_EXPERIENCE}년차 AI/AX, 데이터 분석 컨설턴트. AEO와 GEO, AI 업무 자동화 컨설팅과 ${CLIENT_COUNT_LABEL} 고객사의 GA4, GTM 분석 환경 구축. 누적 1,000명 이상 교육 경력.`,
    knowsAbout: [
      "AI 업무 자동화(AX)",
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "AI 워크플로우",
      "프롬프트 엔지니어링",
      "Google Analytics 4",
      "Google Tag Manager",
      "퍼포먼스 마케팅",
      "그로스해킹",
      "퍼널 분석",
      "데이터 시각화",
    ],
    knowsLanguage: ["ko", "en"],
    hasOccupation: {
      "@type": "Occupation",
      name: "디지털 마케팅 컨설턴트, 데이터 분석가",
      occupationLocation: { "@type": "Country", name: "대한민국" },
      skills:
        "AEO, GEO, LLM, AI 에이전트, GA4, GTM, BigQuery, LookerStudio, Python",
    },
    sameAs: [SITE_URL, LINKEDIN_PROFILE_URL],
  };

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "준이아빠블로그",
    url: SITE_URL,
    logo: absoluteUrl("/favicon.ico"),
    founder: { "@type": "Person", name: "준이아빠" },
    description:
      "GA4, GTM, AEO, GEO 실무 인사이트를 정리한 디지털 마케팅 지식 사이트.",
    sameAs: [LINKEDIN_PROFILE_URL],
  };

  // 답변 엔진이 그대로 추출해 가는 문답 (아래 FAQ 섹션과 문구를 일치시킨다)
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "어떤 일을 의뢰할 수 있나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "GA4와 GTM 분석 환경 구축, 이벤트 택소노미 설계, BigQuery 로우데이터 분석, AEO와 GEO 컨설팅, 기업 실무 교육을 의뢰할 수 있습니다. hong@oso.ma로 문의하면 됩니다.",
        },
      },
      {
        "@type": "Question",
        name: "강의나 교육은 어떻게 요청하나요?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "기업과 공공기관 출강, 온라인 강의 모두 가능합니다. 무역·투자 진흥 공공기관 아카데미와 대학 강의에서 진행한 커리큘럼을 기준으로 대상에 맞춰 조정합니다. 교육 대상과 인원, 희망 일정을 hong@oso.ma로 보내 주시면 커리큘럼안으로 회신합니다.",
        },
      },
    ],
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
      />
      <ViewTracker
        contentType="about"
        contentTitle="About"
        contentSlug="about"
      />

      {/* Hero Section */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white neo-border-thick neo-shadow-lg p-6 sm:p-10 relative overflow-hidden text-left"
          intensity={20}
          shadowIntensity={10}
        >
          <div
            className="absolute top-0 right-0 w-24 sm:w-32 h-full bg-[#FF0033] hidden sm:block"
            style={{
              clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)",
              zIndex: 0,
            }}
          />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full border-3 border-black overflow-hidden rotate-3">
                <Image
                  src="/profile-illustration.png"
                  alt="준이아빠 프로필 일러스트"
                  fill
                  className="object-cover object-top scale-125"
                />
              </div>
              <span className="inline-block bg-black text-white font-bold px-3 py-1 text-xs uppercase tracking-widest transform -skew-x-6">
                About Me
              </span>
            </div>
            {/* 검색 결과 제목과 같은 H1. 슬로건은 시각 요소로 남긴다 */}
            <h1 className="sr-only">{ABOUT_TITLE}</h1>
            <p className="text-2xl sm:text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              마케팅 성과를
              <br />
              <span className="text-[#FF0033]">데이터로 확인하는</span> 일을
              합니다.
            </p>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
              저는 {YEARS_OF_EXPERIENCE}년차 디지털 마케터이자 AI/AX 컨설턴트로,
              오픈소스마케팅 컨설팅 랩 차장으로 일하고 있는{" "}
              <strong>홍승협(준이아빠)</strong>입니다. 공공기관, 면세 유통,
              정보보안, 클라우드, 호텔, 글로벌 브랜드 한국 법인 등{" "}
              <strong>120곳 이상의 기업과 기관</strong>에서{" "}
              <strong>
                이벤트 택소노미 설계, GA4와 GTM 분석 환경 구축, BigQuery
                로우데이터 분석
              </strong>
              을 해왔습니다. 어떤 마케팅이 성과를 냈는지 데이터로 확인할 수 있게
              만드는 일입니다. 기업 담당자와 공공 아카데미에서{" "}
              <strong>누적 1,000명 이상</strong>을 교육했고, 이 사이트에는 그
              과정에서 정리한 실무 인사이트를 올리고 있습니다.
              <span className="block mt-2 text-xs text-gray-500">
                경력 수치는 {CREDENTIAL_AS_OF} 기준
              </span>
            </p>
            {/* 고객사를 업종 표기로 바꾼 만큼, 경력을 직접 확인할 경로를 남긴다 */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <a
                href={LINKEDIN_PROFILE_URL}
                target="_blank"
                rel="me noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white text-sm font-black border-3 border-black neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
              >
                <BrandIcon name="linkedin" className="w-4 h-4 shrink-0" />
                링크드인 프로필에서 경력 보기
                <ExternalLink
                  className="w-3.5 h-3.5 shrink-0"
                  strokeWidth={2.2}
                />
              </a>
              {/* 디지털 명함 저장/복사와 About 전용 연출 (지원 브라우저에서만 렌더) */}
              <AboutCanvasFx
                blogUrl={SITE_URL}
                linkedinUrl={LINKEDIN_PROFILE_URL}
              />
            </div>
          </div>
        </NeoTiltCard>
      </section>

      {/* Credentials / Stats Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 -rotate-3">
            <Award className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">경력</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              /* 수치는 나란히 읽혀야 비교가 되므로 카드를 기울이지 않는다 */
              <NeoTiltCard
                key={stat.label}
                className="bg-white border-4 border-black p-4 sm:p-5"
                intensity={10}
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <div className="text-2xl sm:text-3xl font-black text-black leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-bold text-sm text-black mb-1">
                  {stat.label}
                </div>
              </NeoTiltCard>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-gray-500">
          경력, 고객사, 교육 수치는 {CREDENTIAL_AS_OF} 기준이며 공개 가능한
          레퍼런스와 내부 기록을 근거로 집계했습니다. 공개 콘텐츠 편수는 현재
          사이트에 올라와 있는 글의 수입니다.
        </p>
      </section>

      {/* 연혁. 연도를 왼쪽 축에 고정하고 그해 계약을 한 열에 순서대로 쌓는다.
          기업 연혁 페이지의 통용 구조로, 시맨틱 ol/li와 업종형 라벨을 유지해
          검색엔진과 AI가 계약 순서를 그대로 읽을 수 있게 한다 */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-8">
          <div className="bg-black border-2 border-black p-1.5 rotate-2">
            <Briefcase className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">연혁</h2>
        </div>
        <div className="border-t-4 border-black">
          {milestoneYears.map((year) => (
            <div
              key={year}
              className="grid grid-cols-[3.25rem_1fr] sm:grid-cols-[7rem_1fr] border-b-2 border-black"
            >
              <time
                dateTime={year}
                className="block font-black text-lg sm:text-4xl leading-none tracking-tight self-start pt-6 sm:pt-7 pr-2 sm:pr-6 sm:text-right sm:sticky sm:top-24"
              >
                {year}
              </time>
              <ol className="min-w-0 space-y-5 sm:space-y-6 border-l-2 border-black/25 pl-4 sm:pl-8 py-6 sm:py-7">
                {milestonesByYear[year].map((m, index) => (
                  <li
                    key={`${year}-${index}-${m.orgs.map((org) => org.label).join("-")}`}
                    className="relative"
                  >
                    {/* 축 위에 계약 하나를 찍는 노드 */}
                    <span
                      aria-hidden="true"
                      className="absolute -left-4 sm:-left-8 top-[0.4rem] w-3 h-3 -translate-x-1/2 rounded-full bg-white border-[3px] border-black"
                    />
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {m.orgs.map((org) => (
                        <span
                          key={org.label}
                          className="inline-flex items-center gap-1.5 bg-white border-2 border-black px-2 py-1 text-xs sm:text-sm font-bold"
                        >
                          <span aria-hidden="true">{org.emoji}</span>
                          {org.label}
                        </span>
                      ))}
                    </div>
                    <h3 className="font-black text-base sm:text-lg leading-snug">
                      {m.title}
                    </h3>
                    {m.note && (
                      <p className="mt-1 text-xs sm:text-sm text-gray-600 leading-relaxed">
                        {m.note}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5"
          intensity={15}
        >
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FF0033] inline-block" />이 일을 시작한
            이유
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
            <p>
              광고를 집행하고, 콘텐츠를 만들고, 캠페인을 설계해왔습니다.
              그러면서 매번 같은 질문을 받았습니다. 무엇이 실제로 바뀌었는지
              묻는 질문이었습니다.
            </p>
            <p>
              광고비를 얼마 썼고 클릭이 몇 번 일어났는지는 답할 수 있었습니다.
              그래서 매출이 늘었는지, 어떤 소재가 그 매출을 만들었는지는 답하지
              못했습니다.
            </p>
            <p>
              GA4와 GTM으로 그 사이를 메우는 일을 시작한 것이 지금 하는 일의
              출발점입니다. 이후 AI와 기술의 변화를 마케팅 실무에 연결하는
              쪽으로 범위를 넓혔고, 이 사이트에는 그 과정에서 정리한 것을 올리고
              있습니다.
            </p>
          </div>
        </NeoTiltCard>
      </section>

      {/* What I do */}
      <section className="mb-12 sm:mb-16">
        <div className="bg-white border-4 border-black p-6 sm:p-8 neo-shadow-lg">
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-black inline-block transform rotate-45" />
            하는 일
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {workItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`bg-white border-2 border-black p-4 sm:p-5 flex gap-4 items-start ${
                    /* 홀수 개일 때 마지막 항목이 빈칸을 남기지 않도록 두 칸을 쓴다 */
                    workItems.length % 2 === 1 && index === workItems.length - 1
                      ? "sm:col-span-2"
                      : ""
                  }`}
                >
                  <span className="bg-primary text-white font-black text-sm px-2.5 py-1 border-2 border-black shrink-0 leading-none self-start mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-black text-sm sm:text-base">
                        {item.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* What is published here */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 -rotate-0.5"
          intensity={15}
        >
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary border-2 border-black p-1.5 rotate-2">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              이 사이트에 쌓인 것
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-4">
            지금까지 공개한 글은 <strong>{counts.total}편</strong>입니다.
          </p>
          <div className="space-y-3">
            {[
              {
                name: "Insights",
                desc: `마케팅, AI, 데이터 분석 심화 해설 ${counts.insights}편`,
              },
              {
                name: "Class",
                desc: `개념을 체계적으로 정리한 학습 콘텐츠 ${counts.classes}편`,
              },
              {
                name: "Courses",
                desc: `주제별 학습 경로 ${counts.courses}개`,
              },
            ].map((item) => (
              <div
                key={item.name}
                className="flex items-start gap-3 bg-gray-50 border-2 border-black p-3"
              >
                <span className="bg-accent text-black text-xs font-bold px-2 py-0.5 border-2 border-black shrink-0">
                  {item.name}
                </span>
                <span className="text-sm sm:text-base text-gray-700">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <Link
              href="/insights?category=AI_TECH"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              AI와 기술 인사이트 →
            </Link>
            <Link
              href="/insights?category=MARKETING"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              마케팅 인사이트 →
            </Link>
            <Link
              href="/class"
              className="underline decoration-2 underline-offset-2 font-bold text-black hover:text-primary"
            >
              Class 모음 →
            </Link>
          </div>
        </NeoTiltCard>
      </section>

      {/* Principles Section */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 rotate-2">
            <MessageSquare className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">일하는 원칙</h2>
        </div>
        <div className="space-y-4">
          {principles.map((principle, index) => {
            const rotations = ["rotate-0.5", "-rotate-0.5", "rotate-0"];
            return (
              <NeoTiltCard
                key={principle.title}
                className={`bg-white border-4 border-black p-5 sm:p-6 ${rotations[index]}`}
                intensity={10}
              >
                <h3 className="font-black text-base sm:text-lg mb-2 flex items-start gap-2">
                  <span className="bg-primary text-white px-2 py-0.5 text-sm border-2 border-black">
                    {index + 1}
                  </span>
                  {principle.title}
                </h3>
                <p className="text-sm sm:text-base text-gray-600 ml-8">
                  {principle.desc}
                </p>
              </NeoTiltCard>
            );
          })}
        </div>
      </section>

      {/* 자주 묻는 질문. FAQPage JSON-LD와 문구를 일치시킨다 */}
      <section className="mb-12 sm:mb-16">
        <div className="flex items-center gap-2 mb-6">
          <div className="bg-black border-2 border-black p-1.5 -rotate-2">
            <CircleHelp className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black">자주 묻는 질문</h2>
        </div>
        <div className="space-y-4">
          <div className="bg-white border-4 border-black p-4 sm:p-5 neo-shadow-sm">
            <h3 className="font-black text-base sm:text-lg mb-2">
              어떤 일을 의뢰할 수 있나요?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              GA4와 GTM 분석 환경 구축, 이벤트 택소노미 설계, BigQuery
              로우데이터 분석, AEO와 GEO 컨설팅, 기업 실무 교육을 의뢰할 수
              있습니다.{" "}
              <a href="mailto:hong@oso.ma" className="font-bold underline">
                hong@oso.ma
              </a>
              로 문의하면 됩니다.
            </p>
          </div>
          <div className="bg-white border-4 border-black p-4 sm:p-5 neo-shadow-sm">
            <h3 className="font-black text-base sm:text-lg mb-2">
              강의나 교육은 어떻게 요청하나요?
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              기업과 공공기관 출강, 온라인 강의 모두 가능합니다. 무역·투자 진흥 공공기관 아카데미와
              대학 강의에서 진행한 커리큘럼을 기준으로 대상에 맞춰 조정합니다.
              교육 대상과 인원, 희망 일정을{" "}
              <a href="mailto:hong@oso.ma" className="font-bold underline">
                hong@oso.ma
              </a>
              로 보내 주시면 커리큘럼안으로 회신합니다.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/insights">
          <NeoButton size="lg">
            Insights 보기 <ArrowRight className="w-4 h-4 ml-2" />
          </NeoButton>
        </Link>
        <Link href="/class">
          <NeoButton size="lg">
            Class 보기 <ArrowRight className="w-4 h-4 ml-2" />
          </NeoButton>
        </Link>
        <Link href="/tags">
          <NeoButton variant="outline" size="lg">
            Tags 둘러보기 <ArrowRight className="w-4 h-4 ml-2" />
          </NeoButton>
        </Link>
      </section>
    </div>
  );
}
