import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { SITE_URL } from "@/lib/constants";
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
} from "lucide-react";
import { NeoButton } from "@/components/neo";
import { NeoTiltCard } from "@/components/neo";
import { ViewTracker } from "@/components/ViewTracker";
import { BrandIcon } from "@/components/icons/BrandIcons";

const BASE_YEAR = 2017;
const REFERENCE_YEAR = 2026;
const YEARS_OF_EXPERIENCE = REFERENCE_YEAR - BASE_YEAR + 1;
const CLIENT_COUNT_LABEL = "120곳+";
/** 경력, 고객사, 교육 수치를 마지막으로 확인한 시점 */
const CREDENTIAL_AS_OF = "2026년 4월";
/** 화면의 프로필 버튼과 Person, Organization JSON-LD의 sameAs가 같은 값을 쓴다 */
const LINKEDIN_PROFILE_URL =
  "https://www.linkedin.com/in/%EC%8A%B9%ED%98%91-%ED%99%8D-1771b2240/";

const ABOUT_TITLE = "About | GA4, GTM 분석 환경 구축";
const ABOUT_DESCRIPTION = `${YEARS_OF_EXPERIENCE}년차 디지털 마케터이자 데이터 분석가입니다. 공공기관, 금융, 유통, 대학 등 ${CLIENT_COUNT_LABEL} 기업과 기관의 GA4, GTM 환경을 구축했고 누적 1,000명 이상을 교육했습니다. 마케팅 성과를 데이터로 확인하는 방법과 AEO, GEO 실무를 정리합니다.`;

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
      sub: "고객사당 20~30개 × 120곳+",
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

/**
 * 고객사는 산업군과 조직 유형으로 먼저 요약한다.
 * 공개 가능한 주요 업무 연혁은 아래 별도 목록에 기록한다.
 */
const clientSectors = [
  "관광 분야 공공기관",
  "면세, 아울렛 유통 대기업",
  "도서 유통 대기업",
  "증권사",
  "정보보안 상장사",
  "클라우드 관리 서비스(MSP) 기업",
  "글로벌 모빌리티 브랜드 한국 법인",
  "글로벌 스포츠 브랜드 한국 법인",
  "글로벌 엔터테인먼트 기업 한국 법인",
  "B2B 이커머스 플랫폼",
  "이벤트 플랫폼 스타트업",
  "4년제 대학과 사이버대학",
];

const workHistory = [
  {
    year: "2021·2026",
    company: "안국건강",
    work: "건강기능식품 데이터·물류 분석 환경 구축",
  },
  {
    year: "2021·2026",
    company: "레프트아이템딜리버리",
    work: "건강기능식품 데이터·물류 분석 환경 구축",
  },
  {
    year: "2022",
    company: "코딧",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    company: "플라스크",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    company: "엔닷라이트",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    company: "네오폰스",
    work: "타깃 고객과 핵심 전환 정의, 유입·광고 데이터 분석, 성장 실험 설계",
  },
  {
    year: "2022",
    company: "지란지교소프트",
    work: "정보보안 소프트웨어 분석 환경·SEO 구축",
  },
  {
    year: "2022",
    company: "이피엘컴퍼니",
    work: "디지털 매체 운영, CRM, 데이터 분석 교육",
  },
  {
    year: "2022",
    company: "센디네어",
    work: "디지털 마케팅 현황 점검, 채널별 홍보 방향 및 실행 과제 정리",
  },
  {
    year: "2022",
    company: "위솝",
    work: "GA4·GTM 이벤트 설계와 태깅, UTM·검색/디스플레이 광고, 보고서 설정",
  },
  {
    year: "2022~2024",
    company: "하이로컬",
    work: "GA 데이터 수집 설정, 이벤트·전환 목표 설정, SEO 점검",
  },
  {
    year: "2022",
    company: "나인하이어",
    work: "검색·디스플레이 광고 캠페인 구조, SEO 체크리스트, GA4·전환 분석",
  },
  {
    year: "2023~2026",
    company: "한국관광공사",
    work: "관광 데이터 수집·분석 환경 구축, 참여기업 유입·전환 개선, AI 활용 방향 제안",
  },
  {
    year: "2023",
    company: "스테이폴리오",
    work: "관광 데이터 수집·분석 환경 점검, 유입·전환 개선안 제시",
  },
  {
    year: "2023",
    company: "캐플릭스",
    work: "관광 데이터 수집·분석 환경 점검, 유입·전환 개선안 제시",
  },
  {
    year: "2023",
    company: "KOTRA아카데미",
    work: "디지털 마케팅 과정 강의",
  },
  {
    year: "2023",
    company: "교보문고",
    work: "GA4 분석 환경 구축 및 유지보수",
  },
  {
    year: "2023",
    company: "신세계면세점",
    work: "면세 유통 분석 환경 구축",
  },
  {
    year: "2023",
    company: "신세계사이먼 프리미엄아울렛",
    work: "아울렛 유통 분석 환경 구축",
  },
  {
    year: "2023",
    company: "신세계아울렛 eShop",
    work: "GA4·GTM 이벤트, UTM, 대시보드 구축",
  },
  {
    year: "2023",
    company: "동원·동원디어푸드(동원몰·더반찬)",
    work: "이커머스·결제·네이버페이 데이터 추적",
  },
  {
    year: "2023",
    company: "풀무원(풀무원녹즙)",
    work: "GA4·Firebase 구축 및 이벤트 검수",
  },
  {
    year: "2023",
    company: "한화호텔앤드리조트",
    work: "호텔·리조트 분석 프로젝트",
  },
  {
    year: "2023",
    company: "더플라자",
    work: "호텔 GA4·GTM 분석 환경 구축",
  },
  {
    year: "2023",
    company: "스케쳐스(스케쳐스코리아)",
    work: "글로벌 브랜드 한국 법인 분석",
  },
  {
    year: "2023",
    company: "ABC마트",
    work: "글로벌 브랜드 한국 법인 분석",
  },
  {
    year: "2023",
    company: "오피스키퍼",
    work: "보안 제품 GA4·Amplitude·GTM 및 SEO",
  },
  {
    year: "2023",
    company: "유니드컴즈(킵그로우)",
    work: "태깅 구조 진단, Looker 대시보드 구축, 채널별 성과 개선안 제시",
  },
  {
    year: "2023",
    company: "비바이노베이션",
    work: "모바일 앱 GA4 온보딩",
  },
  {
    year: "2023",
    company: "그레이시티",
    work: "GA4 온보딩",
  },
  {
    year: "2023",
    company: "어라운더블(픽앤픽)",
    work: "GA4·GTM 이벤트 스크립트 및 검수",
  },
  {
    year: "2023",
    company: "더본아이에프(알고리즙)",
    work: "GA4·GTM 스크립트 및 이벤트 수정",
  },
  {
    year: "2023",
    company: "나누",
    work: "B2B·B2C 포지셔닝, SEO, 검색광고, 제휴 전략",
  },
  {
    year: "2023",
    company: "잇그린",
    work: "미디어믹스와 광고 채널·예산 분석, CRM 활용 방안 정리",
  },
  {
    year: "2024",
    company: "안랩(AhnLab)",
    work: "국내·일본·중국 GA4·GTM, BigQuery, 대시보드",
  },
  {
    year: "2024",
    company: "고려대학교",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2024",
    company: "나그네들",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    company: "남도마켓",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    company: "커런시유나이티드",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    company: "이벤터스",
    work: "GA4 이벤트·전환 데이터 점검, 유입경로 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2024",
    company: "지앤지커머스(도매꾹)",
    work: "커머스 유통 분석 환경 구축",
  },
  {
    year: "2024",
    company: "반다이남코코리아(BNKR)",
    work: "커머스·엔터테인먼트 유통 분석",
  },
  {
    year: "2024",
    company: "이노션",
    work: "GA4 보고서·탐색 기능 실습 교육",
  },
  {
    year: "2024~2026",
    company: "메디비젼·비앤빛안과",
    work: "병원 GA4/GTM 및 전환 분석",
  },
  {
    year: "2024~2026",
    company: "하트하트재단",
    work: "비영리 후원·전환 추적",
  },
  {
    year: "2024",
    company: "그라운드원",
    work: "SaaS 글로벌 마케팅, SEO, 콘텐츠 전략",
  },
  {
    year: "2024",
    company: "펴나니",
    work: "요양 플랫폼 B2B·B2C 마케팅, SEO, 검색광고",
  },
  {
    year: "2024",
    company: "뉴지엄랩",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024",
    company: "로민",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024",
    company: "반프",
    work: "타깃 고객 정의, 브랜드 메시지·콘텐츠·채널 전략 제안",
  },
  {
    year: "2024~2026",
    company: "유진투자증권",
    work: "이벤트 추적, GA4 보고서, BigQuery·Looker 연동",
  },
  {
    year: "2025",
    company: "연세대학교",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2025",
    company: "사이버한국외국어대학교",
    work: "디지털 마케팅·데이터 분석 강의",
  },
  {
    year: "2025~2026",
    company: "그리니어",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    company: "이지백",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    company: "요즘피플",
    work: "관광기업 데이터 점검, 유입·전환 분석, 콘텐츠·광고 개선안 제시",
  },
  {
    year: "2025",
    company: "함께하는사랑밭",
    work: "비영리 후원 전환 추적",
  },
  {
    year: "2025~2026",
    company: "열매나눔재단",
    work: "GA4·GTM 및 후원 전환 추적",
  },
  {
    year: "2025~2026",
    company: "푸르메재단",
    work: "비영리 후원·전환 추적",
  },
  {
    year: "2025",
    company: "한림대학교",
    work: "대학·대학원 페이지 데이터 분석",
  },
  {
    year: "2026",
    company: "승우여행사",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    company: "가시림수목원",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    company: "애기야가자",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    company: "알브이에이치",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    company: "호퍼스",
    work: "관광기업 데이터 점검, AI 활용 사례 검토, 마케팅·분석 실행안 제안",
  },
  {
    year: "2026",
    company: "베스핀글로벌",
    work: "클라우드 MSP 분석 환경·데이터 파이프라인 구축",
  },
  {
    year: "2026",
    company: "네스트호텔",
    work: "호텔 웹사이트 GA4 설정 및 전환 데이터 점검",
  },
  {
    year: "2026",
    company: "혼다코리아",
    work: "GA4 권한, UTM, 프로모션 페이지 추적 기획",
  },
  {
    year: "2026",
    company: "레아딜",
    work: "GA4·GTM 및 전환 데이터 업무",
  },
  {
    year: "2026",
    company: "hoppin",
    work: "GTM 기본 태그 및 예약 여정 점검",
  },
  {
    year: "2026",
    company: "불스원",
    work: "광고·전환 데이터 태깅",
  },
  {
    year: "2026",
    company: "국제사이버대학교",
    work: "입시·모집 광고 데이터 및 마케팅 전략",
  },
  {
    year: "2026",
    company: "슬로운(뉴라이즌)",
    work: "브랜드 USP, 콘텐츠, 보상판매, CRM·재구매 마케팅",
  },
  {
    year: "2026",
    company: "자일로랩스",
    work: "B2B 글로벌 마케팅, SEO, 사례 콘텐츠·PR 전략",
  },
];

const educationPartners = [
  "무역 진흥 공공기관 아카데미",
  "사회적경제 지원 공공기관",
  "기업 내부 담당자 교육",
];

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
    desc: "관광 분야 공공기관의 데이터 분석 환경 구축 사업에 2023년부터 4년 연속 컨설턴트. 이벤트 정합성 90% KPI와 5단계 산출물 워크플로우로 참여 기업을 지원하고, 누적 1,000명 이상 실무자를 교육했습니다.",
  },
];

export default async function AboutPage() {
  const counts = getContentCounts();
  const stats = buildStats(counts);

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "준이아빠",
    alternateName: "Hong (준이아빠)",
    url: absoluteUrl("/about"),
    image: absoluteUrl("/profile-illustration.png"),
    jobTitle: "디지털 마케팅, 데이터 분석 컨설턴트",
    description: `${YEARS_OF_EXPERIENCE}년차 디지털 마케터. ${CLIENT_COUNT_LABEL} 고객사의 GA4와 GTM 분석 환경 구축, AEO와 GEO 실무. 누적 1,000명 이상 교육 경력.`,
    knowsAbout: [
      "Google Analytics 4",
      "Google Tag Manager",
      "Answer Engine Optimization",
      "Generative Engine Optimization",
      "퍼포먼스 마케팅",
      "그로스해킹",
      "퍼널 분석",
      "데이터 시각화",
      "AI 워크플로우",
      "프롬프트 엔지니어링",
    ],
    knowsLanguage: ["ko", "en"],
    hasOccupation: {
      "@type": "Occupation",
      name: "디지털 마케팅 컨설턴트, 데이터 분석가",
      occupationLocation: { "@type": "Country", name: "대한민국" },
      skills: "GA4, GTM, BigQuery, LookerStudio, AEO, GEO, LLM, Python",
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
            style={{ clipPath: "polygon(20% 0, 100% 0, 100% 100%, 0% 100%)", zIndex: 0 }}
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
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-black leading-tight mb-4">
              마케팅 성과를
              <br />
              <span className="text-[#FF0033]">데이터로 확인하는</span> 일을 합니다.
            </h1>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-2xl">
              <strong>{YEARS_OF_EXPERIENCE}년차 디지털 마케터</strong>입니다. 면세 유통, 정보보안, 클라우드, 글로벌 브랜드 한국 법인 등 <strong>120곳 이상의 기업과 기관</strong>에서 <strong>이벤트 택소노미 설계, GA4와 GTM 분석 환경 구축, BigQuery 로우데이터 분석</strong>을 해왔습니다. 어떤 마케팅이 성과를 냈는지 데이터로 확인할 수 있게 만드는 일입니다. 기업 담당자와 공공 아카데미에서 <strong>누적 1,000명 이상</strong>을 교육했고, 이 사이트에는 그 과정에서 정리한 실무 인사이트를 올리고 있습니다.
              <span className="block mt-2 text-xs text-gray-500">
                경력 수치는 {CREDENTIAL_AS_OF} 기준
              </span>
            </p>
            {/* 고객사를 업종 표기로 바꾼 만큼, 경력을 직접 확인할 경로를 남긴다 */}
            <a
              href={LINKEDIN_PROFILE_URL}
              target="_blank"
              rel="me noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#0A66C2] text-white text-sm font-black border-3 border-black neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            >
              <BrandIcon name="linkedin" className="w-4 h-4 shrink-0" />
              링크드인 프로필에서 경력 보기
              <ExternalLink className="w-3.5 h-3.5 shrink-0" strokeWidth={2.2} />
            </a>
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
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            const rotations = [
              "-rotate-1",
              "rotate-1",
              "rotate-0.5",
              "-rotate-0.5",
              "rotate-1",
              "-rotate-1",
            ];
            return (
              <NeoTiltCard
                key={stat.label}
                className={`bg-white border-4 border-black p-4 sm:p-5 ${rotations[index]}`}
                intensity={10}
              >
                <Icon className="w-6 h-6 mb-2 text-primary" />
                <div className="text-2xl sm:text-3xl font-black text-black leading-none mb-1">
                  {stat.value}
                </div>
                <div className="font-bold text-sm text-black mb-1">
                  {stat.label}
                </div>
                <div className="text-xs text-gray-500">{stat.sub}</div>
              </NeoTiltCard>
            );
          })}
        </div>
        <p className="mt-4 text-xs text-gray-500">
          경력, 고객사, 교육 수치는 {CREDENTIAL_AS_OF} 기준이며 공개 가능한 레퍼런스와 내부 기록을 근거로 집계했습니다. 공개 콘텐츠 편수는 현재 사이트에 올라와 있는 글의 수입니다.
        </p>
      </section>

      {/* Representative Clients */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5"
          intensity={12}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-primary border-2 border-black p-1.5 rotate-2">
              <Building2 className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">
              함께 일한 기업과 기관
            </h2>
          </div>
          <p className="text-base sm:text-lg text-gray-700 mb-4 leading-relaxed">
            공공, 금융, 이커머스, 제조, 유통, 면세, 대학 교육 등 <strong>12개 이상 산업군</strong>에 걸쳐 <strong>{CLIENT_COUNT_LABEL} 고객사 프로젝트</strong>를 진행했습니다. 계약별 공개 범위를 고려해 산업군으로 요약하고, 공개 가능한 주요 연혁은 아래에 따로 기록합니다.
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {clientSectors.map((sector) => (
              <span
                key={sector}
                className="inline-block bg-gray-50 border-2 border-black text-black text-xs sm:text-sm font-bold px-3 py-1.5"
              >
                {sector}
              </span>
            ))}
            <span className="inline-block bg-black text-white border-2 border-black text-xs sm:text-sm font-bold px-3 py-1.5">
              외 다수
            </span>
          </div>
          <div className="pt-4 border-t-2 border-black/20">
            <p className="text-sm text-gray-600 mb-2 font-bold">교육 협력 기관</p>
            <div className="flex flex-wrap gap-2">
              {educationPartners.map((partner) => (
                <span
                  key={partner}
                  className="inline-block bg-accent border-2 border-black text-black text-xs font-bold px-3 py-1"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </NeoTiltCard>
      </section>

      {/* Newly confirmed work history */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 -rotate-0.5"
          intensity={12}
        >
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-black border-2 border-black p-1.5 rotate-2">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black">업무 연혁</h2>
          </div>
          <p className="text-sm sm:text-base text-gray-600 mb-5 leading-relaxed">
            노션과 Gmail 업무 기록을 대조해 확인한 공개 가능 프로젝트입니다.
          </p>
          <div className="overflow-x-auto -mx-2 px-2">
            <table className="w-full min-w-[620px] border-collapse text-left">
              <thead>
                <tr className="border-b-4 border-black">
                  <th className="px-3 py-3 text-xs sm:text-sm font-black w-28">연도</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-black w-44">기업명</th>
                  <th className="px-3 py-3 text-xs sm:text-sm font-black">한 일</th>
                </tr>
              </thead>
              <tbody>
                {workHistory.map((item) => (
                  <tr key={`${item.year}-${item.company}`} className="border-b-2 border-black/15 align-top">
                    <td className="px-3 py-3 text-xs sm:text-sm font-black whitespace-nowrap text-primary">
                      {item.year}
                    </td>
                    <td className="px-3 py-3 text-sm sm:text-base font-black text-black">
                      {item.company}
                    </td>
                    <td className="px-3 py-3 text-sm text-gray-600 leading-relaxed">
                      {item.work}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </NeoTiltCard>
      </section>

      {/* Why this work */}
      <section className="mb-12 sm:mb-16">
        <NeoTiltCard
          className="bg-white border-4 border-black p-6 sm:p-8 rotate-0.5"
          intensity={15}
        >
          <h2 className="text-xl sm:text-2xl font-black tracking-tight mb-6 border-b-4 border-black pb-2 flex items-center gap-3">
            <span className="w-4 h-4 bg-[#FF0033] inline-block" />
            이 일을 시작한 이유
          </h2>
          <div className="space-y-4 text-base sm:text-lg leading-relaxed text-gray-700">
            <p>
              광고를 집행하고, 콘텐츠를 만들고, 캠페인을 설계해왔습니다. 그러면서 매번 같은 질문을 받았습니다. 무엇이 실제로 바뀌었는지 묻는 질문이었습니다.
            </p>
            <p>
              광고비를 얼마 썼고 클릭이 몇 번 일어났는지는 답할 수 있었습니다. 그래서 매출이 늘었는지, 어떤 소재가 그 매출을 만들었는지는 답하지 못했습니다.
            </p>
            <p>
              GA4와 GTM으로 그 사이를 메우는 일을 시작한 것이 지금 하는 일의 출발점입니다. 이후 AI와 기술의 변화를 마케팅 실무에 연결하는 쪽으로 범위를 넓혔고, 이 사이트에는 그 과정에서 정리한 것을 올리고 있습니다.
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
          <div className="space-y-3">
            {workItems.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="bg-white border-2 border-black p-4 sm:p-5 flex gap-4 items-start"
                >
                  <span className="bg-primary text-white font-black text-sm px-2.5 py-1 border-2 border-black shrink-0 leading-none self-start mt-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 text-primary shrink-0" />
                      <h3 className="font-black text-sm sm:text-base">{item.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
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
                <span className="text-sm sm:text-base text-gray-700">{item.desc}</span>
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
