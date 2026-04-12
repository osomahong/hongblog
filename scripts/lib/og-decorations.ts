/**
 * 콘텐츠 키워드 기반 아이콘 라이브러리
 * 제목+태그에서 핵심 키워드를 추출하고 flaticon 스타일 SVG 아이콘을 매칭
 */

type Category = "MARKETING" | "AI_TECH" | "DATA";

interface CategoryStyle {
  accent: string;
  badgeText: string;
  label: string;
}

export const CATEGORY_STYLES: Record<Category, CategoryStyle> = {
  MARKETING: { accent: "#FF0000", badgeText: "#FFFFFF", label: "마케팅" },
  AI_TECH: { accent: "#FFD700", badgeText: "#000000", label: "AI·테크" },
  DATA: { accent: "#0000FF", badgeText: "#FFFFFF", label: "데이터" },
};

// ─── 아이콘 라이브러리 (flaticon 스타일) ───

/** 코드 에디터 </> — 코딩, 개발, 바이브코딩 */
function iconCode(color: string): string {
  return `
      <!-- 모니터 -->
      <rect x="20" y="10" width="160" height="120" rx="0"
        fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 모니터 받침 -->
      <rect x="75" y="130" width="50" height="15" fill="#000" fill-opacity="0.15" stroke="#000" stroke-width="3"/>
      <rect x="55" y="145" width="90" height="8" fill="#000" fill-opacity="0.1" stroke="#000" stroke-width="3"/>
      <!-- 코드 라인들 -->
      <rect x="40" y="30" width="60" height="8" fill="${color}" fill-opacity="0.6" rx="0"/>
      <rect x="40" y="48" width="90" height="8" fill="#000" fill-opacity="0.2" rx="0"/>
      <rect x="55" y="66" width="70" height="8" fill="${color}" fill-opacity="0.4" rx="0"/>
      <rect x="55" y="84" width="50" height="8" fill="#000" fill-opacity="0.2" rx="0"/>
      <rect x="40" y="102" width="80" height="8" fill="${color}" fill-opacity="0.3" rx="0"/>
      <!-- </> 심볼 -->
      <text x="145" y="75" font-family="monospace" font-weight="900" font-size="28" fill="${color}" fill-opacity="0.8">&lt;/&gt;</text>`;
}

/** 타겟/과녁 — 광고, 리타게팅, 캠페인 */
function iconTarget(color: string): string {
  return `
      <!-- 외곽 원 -->
      <circle cx="100" cy="85" r="75" fill="none" stroke="${color}" stroke-opacity="0.25" stroke-width="4"/>
      <!-- 중간 원 -->
      <circle cx="100" cy="85" r="52" fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="4"/>
      <!-- 내부 원 -->
      <circle cx="100" cy="85" r="28" fill="${color}" fill-opacity="0.2" stroke="#000" stroke-width="3"/>
      <!-- 중심점 -->
      <circle cx="100" cy="85" r="8" fill="${color}" stroke="#000" stroke-width="3"/>
      <!-- 화살 -->
      <line x1="145" y1="40" x2="108" y2="77" stroke="#000" stroke-width="4" stroke-linecap="round"/>
      <path d="M145,40 L130,42 L143,55 Z" fill="#000"/>
      <!-- 십자선 -->
      <line x1="100" y1="0" x2="100" y2="25" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="100" y1="145" x2="100" y2="170" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="15" y1="85" x2="40" y2="85" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="160" y1="85" x2="185" y2="85" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>`;
}

/** 돋보기+차트 — GA4, 데이터 분석, 애널리틱스 */
function iconAnalytics(color: string): string {
  return `
      <!-- 돋보기 원 -->
      <circle cx="85" cy="75" r="60" fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 돋보기 손잡이 -->
      <line x1="128" y1="118" x2="170" y2="160" stroke="#000" stroke-width="8" stroke-linecap="round"/>
      <!-- 차트 내부 바 -->
      <rect x="50" y="90" width="18" height="30" fill="${color}" fill-opacity="0.4" stroke="#000" stroke-width="2"/>
      <rect x="76" y="65" width="18" height="55" fill="${color}" fill-opacity="0.6" stroke="#000" stroke-width="2"/>
      <rect x="102" y="78" width="18" height="42" fill="${color}" fill-opacity="0.5" stroke="#000" stroke-width="2"/>
      <!-- 상승 트렌드선 -->
      <polyline points="55,88 85,60 111,72" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 화살표 끝 -->
      <path d="M108,78 L115,68 L105,70" fill="none" stroke="#000" stroke-width="2.5" stroke-linecap="round"/>`;
}

/** 검색+별 — SEO, 검색 최적화 */
function iconSeo(color: string): string {
  return `
      <!-- 검색창 -->
      <rect x="10" y="50" width="170" height="50" fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 검색 텍스트 힌트 -->
      <rect x="25" y="68" width="80" height="12" fill="#000" fill-opacity="0.15" rx="0"/>
      <!-- 검색 버튼 -->
      <rect x="135" y="50" width="45" height="50" fill="${color}" fill-opacity="0.3" stroke="#000" stroke-width="4"/>
      <!-- 돋보기 in 버튼 -->
      <circle cx="155" cy="72" r="10" fill="none" stroke="#000" stroke-width="3"/>
      <line x1="162" y1="79" x2="170" y2="87" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <!-- 별 (1위 랭킹) -->
      <path d="M50,25 L55,15 L60,25 L70,27 L63,34 L65,45 L55,39 L45,45 L47,34 L40,27 Z"
        fill="${color}" stroke="#000" stroke-width="2.5"/>
      <!-- 순위 표시선 -->
      <rect x="25" y="115" width="140" height="8" fill="#000" fill-opacity="0.1"/>
      <rect x="25" y="115" width="120" height="8" fill="${color}" fill-opacity="0.3"/>
      <rect x="25" y="132" width="140" height="8" fill="#000" fill-opacity="0.1"/>
      <rect x="25" y="132" width="80" height="8" fill="${color}" fill-opacity="0.2"/>`;
}

/** 깔때기 — 퍼널, 전환 */
function iconFunnel(color: string): string {
  return `
      <!-- 깔때기 본체 -->
      <path d="M20,20 L180,20 L120,90 L120,145 L80,145 L80,90 Z"
        fill="${color}" fill-opacity="0.2" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
      <!-- 단계 구분선 -->
      <line x1="40" y1="45" x2="160" y2="45" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>
      <line x1="60" y1="70" x2="140" y2="70" stroke="#000" stroke-width="2" stroke-opacity="0.3"/>
      <!-- 유입 화살표 -->
      <path d="M65,5 L100,18" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <path d="M135,5 L100,18" fill="none" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <!-- 전환 체크 -->
      <circle cx="100" cy="165" r="15" fill="${color}" fill-opacity="0.3" stroke="#000" stroke-width="3"/>
      <polyline points="91,165 98,172 112,158" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** 대시보드 — 지표, KPI, 성과 측정 */
function iconDashboard(color: string): string {
  return `
      <!-- 프레임 -->
      <rect x="10" y="10" width="180" height="140" fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 상단 바 -->
      <rect x="10" y="10" width="180" height="25" fill="#000" fill-opacity="0.1"/>
      <!-- 게이지 (반원) -->
      <path d="M55,95 A40,40 0 0,1 135,95" fill="none" stroke="#000" stroke-opacity="0.2" stroke-width="8"/>
      <path d="M55,95 A40,40 0 0,1 115,62" fill="none" stroke="${color}" stroke-width="8"/>
      <!-- 게이지 바늘 -->
      <line x1="95" y1="95" x2="108" y2="68" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <circle cx="95" cy="95" r="5" fill="#000"/>
      <!-- 미니 수치 박스 -->
      <rect x="20" y="115" width="50" height="25" fill="${color}" fill-opacity="0.15" stroke="#000" stroke-width="2"/>
      <rect x="80" y="115" width="50" height="25" fill="${color}" fill-opacity="0.25" stroke="#000" stroke-width="2"/>
      <rect x="140" y="115" width="40" height="25" fill="${color}" fill-opacity="0.15" stroke="#000" stroke-width="2"/>`;
}

/** 톱니바퀴+번개 — 자동화, 노코드, 워크플로우 */
function iconAutomation(color: string): string {
  return `
      <!-- 톱니바퀴 외곽 -->
      <path d="M100,15 L108,35 L128,28 L125,50 L148,52 L137,70 L155,82 L138,92 L148,112
               L128,108 L125,130 L108,120 L100,140 L92,120 L72,130 L75,108 L52,112
               L62,92 L45,82 L62,70 L52,52 L75,50 L72,28 L92,35 Z"
        fill="${color}" fill-opacity="0.2" stroke="#000" stroke-width="3.5"/>
      <!-- 톱니바퀴 내부 원 -->
      <circle cx="100" cy="78" r="28" fill="#FFF" stroke="#000" stroke-width="3"/>
      <!-- 번개 -->
      <path d="M105,58 L95,78 L108,78 L95,100"
        fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 연결 점선 -->
      <line x1="155" y1="82" x2="185" y2="82" stroke="#000" stroke-width="2" stroke-dasharray="4,4"/>
      <circle cx="190" cy="82" r="4" fill="${color}" stroke="#000" stroke-width="2"/>`;
}

/** 확성기 — 마케팅 일반, 캠페인 실행 */
function iconMegaphone(color: string): string {
  return `
      <!-- 확성기 본체 -->
      <path d="M60,60 L140,25 L140,145 L60,110 Z"
        fill="${color}" fill-opacity="0.25" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
      <!-- 확성기 입구 -->
      <rect x="20" y="60" width="44" height="50" fill="${color}" fill-opacity="0.35" stroke="#000" stroke-width="4"/>
      <!-- 확성기 나팔 -->
      <path d="M140,18 Q195,45 195,85 Q195,125 140,152"
        fill="none" stroke="#000" stroke-width="4" stroke-linecap="round"/>
      <!-- 소리 파동 -->
      <path d="M165,40 Q205,65 205,85 Q205,105 165,130"
        fill="none" stroke="${color}" stroke-opacity="0.4" stroke-width="3" stroke-linecap="round"/>
      <!-- 손잡이 -->
      <rect x="30" y="110" width="20" height="40"
        fill="#000" fill-opacity="0.15" stroke="#000" stroke-width="3"/>`;
}

/** 전구+회로 — AI, 머신러닝, 테크 일반 */
function iconLightbulb(color: string): string {
  return `
      <!-- 전구 유리 -->
      <path d="M100,15 Q160,15 160,85 Q160,135 130,155 L70,155 Q40,135 40,85 Q40,15 100,15 Z"
        fill="${color}" fill-opacity="0.2" stroke="#000" stroke-width="4"/>
      <!-- 필라멘트 -->
      <path d="M80,65 L90,85 L110,55 L120,85"
        fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 소켓 -->
      <rect x="70" y="155" width="60" height="14" fill="#000" fill-opacity="0.2" stroke="#000" stroke-width="3"/>
      <rect x="75" y="169" width="50" height="10" fill="#000" fill-opacity="0.15" stroke="#000" stroke-width="3"/>
      <!-- 빛 발산 -->
      <line x1="100" y1="-5" x2="100" y2="-20" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="35" y1="40" x2="20" y2="30" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="165" y1="40" x2="180" y2="30" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="20" y1="85" x2="5" y2="85" stroke="${color}" stroke-width="3" stroke-linecap="round"/>
      <line x1="180" y1="85" x2="195" y2="85" stroke="${color}" stroke-width="3" stroke-linecap="round"/>`;
}

/** 연결/링크 — API, 연동, MCP, OAuth */
function iconLink(color: string): string {
  return `
      <!-- 왼쪽 고리 -->
      <path d="M75,55 Q35,55 35,85 Q35,115 75,115" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>
      <!-- 오른쪽 고리 -->
      <path d="M125,55 Q165,55 165,85 Q165,115 125,115" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round"/>
      <!-- 연결 부분 -->
      <line x1="60" y1="85" x2="140" y2="85" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
      <!-- 화살표 양쪽 -->
      <circle cx="55" cy="85" r="8" fill="${color}" fill-opacity="0.4" stroke="#000" stroke-width="2.5"/>
      <circle cx="145" cy="85" r="8" fill="${color}" fill-opacity="0.4" stroke="#000" stroke-width="2.5"/>
      <!-- 데이터 흐름 점 -->
      <circle cx="85" cy="85" r="4" fill="${color}"/>
      <circle cx="100" cy="85" r="4" fill="${color}" fill-opacity="0.7"/>
      <circle cx="115" cy="85" r="4" fill="${color}" fill-opacity="0.4"/>
      <!-- 작은 태그 표시 -->
      <path d="M80,35 L100,20 L100,50 Z" fill="${color}" fill-opacity="0.25" stroke="#000" stroke-width="2"/>
      <path d="M120,135 L100,150 L100,120 Z" fill="${color}" fill-opacity="0.25" stroke="#000" stroke-width="2"/>`;
}

/** 브라우저/웹 — 크롬 확장, 웹 크롤링, 리다이렉트 */
function iconBrowser(color: string): string {
  return `
      <!-- 브라우저 프레임 -->
      <rect x="10" y="10" width="180" height="145" fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 주소 바 -->
      <rect x="10" y="10" width="180" height="30" fill="#000" fill-opacity="0.08"/>
      <!-- 버튼 3개 -->
      <circle cx="28" cy="25" r="5" fill="${color}" fill-opacity="0.5"/>
      <circle cx="45" cy="25" r="5" fill="${color}" fill-opacity="0.3"/>
      <circle cx="62" cy="25" r="5" fill="#000" fill-opacity="0.15"/>
      <!-- URL 바 -->
      <rect x="75" y="18" width="100" height="14" fill="#000" fill-opacity="0.08" stroke="#000" stroke-width="1.5"/>
      <!-- 콘텐츠 라인 -->
      <rect x="25" y="55" width="100" height="10" fill="#000" fill-opacity="0.12"/>
      <rect x="25" y="75" width="150" height="10" fill="#000" fill-opacity="0.08"/>
      <rect x="25" y="95" width="130" height="10" fill="${color}" fill-opacity="0.2"/>
      <rect x="25" y="115" width="90" height="10" fill="#000" fill-opacity="0.08"/>
      <!-- 커서 -->
      <path d="M140,100 L140,130 L150,122 L160,135" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/** 메일/뉴스레터 — 이메일, Gmail API */
function iconMail(color: string): string {
  return `
      <!-- 봉투 -->
      <rect x="15" y="35" width="170" height="110" fill="#FFF" stroke="#000" stroke-width="4"/>
      <!-- 봉투 접힌 부분 -->
      <path d="M15,35 L100,100 L185,35" fill="none" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
      <!-- 봉투 안쪽 색 -->
      <path d="M20,40 L100,95 L180,40" fill="${color}" fill-opacity="0.15"/>
      <!-- @ 심볼 -->
      <circle cx="100" cy="25" r="15" fill="${color}" fill-opacity="0.3" stroke="#000" stroke-width="2.5"/>
      <text x="92" y="31" font-family="Pretendard" font-weight="800" font-size="18" fill="#000">@</text>`;
}

/** 태그 — GTM, 추적, 태깅 */
function iconTag(color: string): string {
  return `
      <!-- 태그 본체 -->
      <path d="M30,30 L120,30 L170,85 L120,140 L30,140 Z"
        fill="${color}" fill-opacity="0.2" stroke="#000" stroke-width="4" stroke-linejoin="round"/>
      <!-- 태그 구멍 -->
      <circle cx="60" cy="85" r="12" fill="#FFF" stroke="#000" stroke-width="3"/>
      <!-- 코드 힌트 { } -->
      <text x="90" y="95" font-family="monospace" font-weight="700" font-size="30" fill="#000" fill-opacity="0.5">{ }</text>
      <!-- 연결 끈 -->
      <path d="M30,60 L10,40" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <circle cx="8" cy="38" r="4" fill="${color}" stroke="#000" stroke-width="2"/>`;
}

/** 방패+자물쇠 — 보안, OAuth, 인증 */
function iconShield(color: string): string {
  return `
      <!-- 방패 -->
      <path d="M100,10 L170,40 L170,95 Q170,150 100,170 Q30,150 30,95 L30,40 Z"
        fill="${color}" fill-opacity="0.15" stroke="#000" stroke-width="4"/>
      <!-- 자물쇠 본체 -->
      <rect x="75" y="80" width="50" height="40" fill="${color}" fill-opacity="0.3" stroke="#000" stroke-width="3"/>
      <!-- 자물쇠 고리 -->
      <path d="M82,80 L82,65 Q82,50 100,50 Q118,50 118,65 L118,80"
        fill="none" stroke="#000" stroke-width="3.5"/>
      <!-- 열쇠 구멍 -->
      <circle cx="100" cy="97" r="6" fill="#000"/>
      <rect x="98" y="100" width="4" height="10" fill="#000"/>`;
}

/** 차트 상승 — 성과, 그로스, 마케팅 성과 */
function iconGrowth(color: string): string {
  return `
      <!-- Y축 -->
      <line x1="30" y1="10" x2="30" y2="155" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <!-- X축 -->
      <line x1="25" y1="150" x2="185" y2="150" stroke="#000" stroke-width="3" stroke-linecap="round"/>
      <!-- 영역 채우기 -->
      <path d="M30,150 L50,130 L80,110 L110,85 L140,60 L170,25 L170,150 Z"
        fill="${color}" fill-opacity="0.15"/>
      <!-- 꺾은선 -->
      <polyline points="30,140 50,130 80,110 110,85 140,60 170,25"
        fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 데이터 포인트 -->
      <circle cx="50" cy="130" r="5" fill="${color}" stroke="#000" stroke-width="2"/>
      <circle cx="80" cy="110" r="5" fill="${color}" stroke="#000" stroke-width="2"/>
      <circle cx="110" cy="85" r="5" fill="${color}" stroke="#000" stroke-width="2"/>
      <circle cx="140" cy="60" r="5" fill="${color}" stroke="#000" stroke-width="2"/>
      <circle cx="170" cy="25" r="5" fill="${color}" stroke="#000" stroke-width="2"/>
      <!-- 상승 화살표 -->
      <path d="M160,35 L172,20 L180,38" fill="none" stroke="#000" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>`;
}

// ─── 키워드 → 아이콘 매칭 ───

type IconKey =
  | "code"
  | "target"
  | "analytics"
  | "seo"
  | "funnel"
  | "dashboard"
  | "automation"
  | "megaphone"
  | "lightbulb"
  | "link"
  | "browser"
  | "mail"
  | "tag"
  | "shield"
  | "growth";

const ICON_RENDERERS: Record<IconKey, (color: string) => string> = {
  code: iconCode,
  target: iconTarget,
  analytics: iconAnalytics,
  seo: iconSeo,
  funnel: iconFunnel,
  dashboard: iconDashboard,
  automation: iconAutomation,
  megaphone: iconMegaphone,
  lightbulb: iconLightbulb,
  link: iconLink,
  browser: iconBrowser,
  mail: iconMail,
  tag: iconTag,
  shield: iconShield,
  growth: iconGrowth,
};

/** 키워드 패턴 → 아이콘 매핑 (우선순위 순) */
const KEYWORD_ICON_MAP: ReadonlyArray<{
  patterns: readonly string[];
  icon: IconKey;
}> = [
  {
    patterns: [
      "코딩",
      "바이브코딩",
      "CLI",
      "JavaScript",
      "React",
      "HTML",
      "CSS",
      "코드",
      "개발",
      "프로그래밍",
      "Cursor",
      "Claude Code",
      "Codex",
      "Markdown",
      "typescript",
    ],
    icon: "code",
  },
  {
    patterns: [
      "SEO",
      "AEO",
      "GEO",
      "검색 엔진",
      "검색 최적화",
      "제로클릭",
      "AI Overviews",
      "not provided",
    ],
    icon: "seo",
  },
  {
    patterns: [
      "GA4",
      "Google Analytics",
      "애널리틱스",
      "세션",
      "트래픽",
      "direct/none",
      "source/medium",
    ],
    icon: "analytics",
  },
  {
    patterns: [
      "GTM",
      "Google Tag",
      "태그 매니저",
      "태깅",
      "디버깅",
      "이벤트 추적",
    ],
    icon: "tag",
  },
  {
    patterns: [
      "리타게팅",
      "타겟팅",
      "Meta 광고",
      "Google 광고",
      "PMAX",
      "캠페인",
      "광고 세팅",
    ],
    icon: "target",
  },
  {
    patterns: ["퍼널", "전환", "CVR", "리드", "전환 캠페인"],
    icon: "funnel",
  },
  {
    patterns: [
      "CPC",
      "CPM",
      "CTR",
      "ROAS",
      "ROI",
      "CPA",
      "CAC",
      "LTV",
      "KPI",
      "지표",
      "성과 측정",
      "어트리뷰션 윈도우",
    ],
    icon: "dashboard",
  },
  {
    patterns: [
      "자동화",
      "노코드",
      "n8n",
      "MCP",
      "워크플로우",
      "자동",
    ],
    icon: "automation",
  },
  {
    patterns: [
      "OAuth",
      "보안",
      "인증",
      "credential",
      "비밀번호",
    ],
    icon: "shield",
  },
  {
    patterns: ["API", "연동", "연결", "LinkedIn", "통합"],
    icon: "link",
  },
  {
    patterns: [
      "크롤링",
      "스크래핑",
      "크롬 확장",
      "SPA",
      "리다이렉트",
      "redirect",
      "웹",
    ],
    icon: "browser",
  },
  {
    patterns: ["Gmail", "이메일", "메일"],
    icon: "mail",
  },
  {
    patterns: [
      "BigQuery",
      "데이터 분석",
      "시각화",
      "데이터 추적",
      "데이터 유실",
      "quota",
    ],
    icon: "growth",
  },
  {
    patterns: [
      "AI",
      "인공지능",
      "LLM",
      "GPT",
      "Gemini",
      "Claude",
      "생성형",
    ],
    icon: "lightbulb",
  },
  {
    patterns: ["마케팅 실무", "퍼포먼스", "마케팅", "마케터"],
    icon: "megaphone",
  },
];

/** 카테고리별 기본 아이콘 (매칭 실패 시 폴백) */
const CATEGORY_DEFAULT_ICON: Record<Category, IconKey> = {
  MARKETING: "megaphone",
  AI_TECH: "lightbulb",
  DATA: "growth",
};

/** 콘텐츠에서 핵심 키워드를 추출하여 아이콘 선택 */
export function selectIcon(
  title: string,
  tags: readonly string[],
  category: Category,
): IconKey {
  const searchText = `${title} ${tags.join(" ")}`;

  for (const { patterns, icon } of KEYWORD_ICON_MAP) {
    for (const pattern of patterns) {
      if (searchText.toLowerCase().includes(pattern.toLowerCase())) {
        return icon;
      }
    }
  }

  return CATEGORY_DEFAULT_ICON[category];
}

/** 선택된 아이콘을 SVG로 렌더링 (우측 영역에 배치) */
export function getDecoration(
  title: string,
  tags: readonly string[],
  category: Category,
): string {
  const iconKey = selectIcon(title, tags, category);
  const style = CATEGORY_STYLES[category];
  const renderer = ICON_RENDERERS[iconKey];
  return `<g transform="translate(800, 180) scale(1.15)">
    ${renderer(style.accent)}
  </g>`;
}

/** Neo-Brutalism 풀 프레임 — 다채로운 배경 레이어 */
export function cornerDecorations(accent: string): string {
  return `
    <!-- ═══ Layer 1: 대각선 스트라이프 패턴 (좌하, 우상) ═══ -->
    <defs>
      <pattern id="diagStripes" width="12" height="12" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="5" height="12" fill="${accent}" fill-opacity="0.08"/>
      </pattern>
    </defs>
    <!-- 좌하 스트라이프 영역 -->
    <rect x="0" y="440" width="300" height="190" fill="url(#diagStripes)"/>
    <!-- 우상 스트라이프 영역 -->
    <rect x="900" y="0" width="300" height="190" fill="url(#diagStripes)"/>

    <!-- ═══ Layer 2: 하프톤 도트 (코너 장식) ═══ -->
    <defs>
      <pattern id="halftone" width="18" height="18" patternUnits="userSpaceOnUse">
        <circle cx="9" cy="9" r="3" fill="${accent}" fill-opacity="0.12"/>
      </pattern>
    </defs>
    <!-- 우하단 하프톤 -->
    <rect x="850" y="470" width="350" height="160" fill="url(#halftone)"/>
    <!-- 좌상단 하프톤 -->
    <rect x="0" y="20" width="200" height="120" fill="url(#halftone)"/>

    <!-- ═══ Layer 3: 큰 기하학 블록들 ═══ -->
    <!-- 좌상: 기울어진 큰 사각형 -->
    <rect x="-40" y="-20" width="160" height="110"
      fill="${accent}" fill-opacity="0.18" stroke="#000" stroke-width="3"
      transform="rotate(-8 40 35)"/>
    <!-- 우하: 기울어진 큰 사각형 -->
    <rect x="1060" y="540" width="160" height="110"
      fill="${accent}" fill-opacity="0.18" stroke="#000" stroke-width="3"
      transform="rotate(8 1140 595)"/>
    <!-- 우상: 작은 정사각형 (살짝 기울어짐) -->
    <rect x="1100" y="30" width="60" height="60"
      fill="${accent}" fill-opacity="0.12" stroke="#000" stroke-width="2.5"
      transform="rotate(5 1130 60)"/>
    <!-- 좌하: 작은 정사각형 -->
    <rect x="40" y="540" width="50" height="50"
      fill="${accent}" fill-opacity="0.12" stroke="#000" stroke-width="2.5"
      transform="rotate(-5 65 565)"/>

    <!-- ═══ Layer 4: 상단 두꺼운 액센트 바 ═══ -->
    <rect x="0" y="0" width="1200" height="18" fill="${accent}"/>
    <!-- 하단 얇은 액센트 바 -->
    <rect x="0" y="622" width="1200" height="8" fill="${accent}" fill-opacity="0.6"/>

    <!-- ═══ Layer 5: 4코너 블록 (하드 섀도우) ═══ -->
    <!-- 좌상 코너 -->
    <rect x="18" y="30" width="28" height="28" fill="#000" fill-opacity="0.15"/>
    <rect x="15" y="27" width="28" height="28" fill="${accent}" stroke="#000" stroke-width="3"/>
    <!-- 우상 코너 -->
    <rect x="1158" y="30" width="28" height="28" fill="#000" fill-opacity="0.15"/>
    <rect x="1155" y="27" width="28" height="28" fill="${accent}" stroke="#000" stroke-width="3"/>
    <!-- 좌하 코너 -->
    <rect x="18" y="582" width="28" height="28" fill="#000" fill-opacity="0.15"/>
    <rect x="15" y="579" width="28" height="28" fill="${accent}" stroke="#000" stroke-width="3"/>
    <!-- 우하 코너 -->
    <rect x="1158" y="582" width="28" height="28" fill="#000" fill-opacity="0.15"/>
    <rect x="1155" y="579" width="28" height="28" fill="${accent}" stroke="#000" stroke-width="3"/>

    <!-- ═══ Layer 6: 사이드 액센트 스트라이프 ═══ -->
    <!-- 좌측 짧은 세로줄 -->
    <rect x="0" y="18" width="5" height="100" fill="${accent}" fill-opacity="0.4"/>
    <rect x="0" y="130" width="5" height="40" fill="${accent}" fill-opacity="0.2"/>
    <!-- 우측 짧은 세로줄 -->
    <rect x="1195" y="510" width="5" height="112" fill="${accent}" fill-opacity="0.4"/>
    <rect x="1195" y="460" width="5" height="40" fill="${accent}" fill-opacity="0.2"/>

    <!-- ═══ Layer 7: 떠다니는 작은 장식 도형들 ═══ -->
    <!-- 좌측 중간에 작은 원 -->
    <circle cx="25" cy="320" r="8" fill="none" stroke="${accent}" stroke-width="2.5" stroke-opacity="0.3"/>
    <!-- 우측 중간에 작은 다이아몬드 -->
    <rect x="1168" y="300" width="14" height="14" fill="none" stroke="${accent}" stroke-width="2" stroke-opacity="0.25"
      transform="rotate(45 1175 307)"/>
    <!-- 하단 중앙에 작은 삼각형 -->
    <path d="M580,608 L590,595 L600,608 Z" fill="${accent}" fill-opacity="0.2" stroke="#000" stroke-width="1.5"/>
    <!-- 상단 중앙 근처 작은 십자 -->
    <line x1="600" y1="25" x2="600" y2="45" stroke="${accent}" stroke-width="2.5" stroke-opacity="0.2"/>
    <line x1="590" y1="35" x2="610" y2="35" stroke="${accent}" stroke-width="2.5" stroke-opacity="0.2"/>`;
}

/** 배경 패턴 (현재 비활성) */
export function gridPattern(): string {
  return "";
}

/** 비콘텐츠 페이지용 Neo-Brutalism 프레임 (3색 활용, 중앙 정렬 레이아웃) */
export function defaultPageFrame(): string {
  return `
    <!-- 상단 3색 바 -->
    <rect x="0" y="0" width="400" height="16" fill="#FF0000"/>
    <rect x="400" y="0" width="400" height="16" fill="#FFD700"/>
    <rect x="800" y="0" width="400" height="16" fill="#0000FF"/>
    <!-- 하단 3색 바 (역순) -->
    <rect x="0" y="620" width="400" height="10" fill="#0000FF" fill-opacity="0.6"/>
    <rect x="400" y="620" width="400" height="10" fill="#FFD700" fill-opacity="0.6"/>
    <rect x="800" y="620" width="400" height="10" fill="#FF0000" fill-opacity="0.6"/>

    <!-- 4코너 블록 (하드 섀도우) -->
    <rect x="18" y="28" width="32" height="32" fill="#000" fill-opacity="0.15"/>
    <rect x="15" y="25" width="32" height="32" fill="#FF0000" stroke="#000" stroke-width="3"/>
    <rect x="1156" y="28" width="32" height="32" fill="#000" fill-opacity="0.15"/>
    <rect x="1153" y="25" width="32" height="32" fill="#0000FF" stroke="#000" stroke-width="3"/>
    <rect x="18" y="576" width="32" height="32" fill="#000" fill-opacity="0.15"/>
    <rect x="15" y="573" width="32" height="32" fill="#0000FF" stroke="#000" stroke-width="3"/>
    <rect x="1156" y="576" width="32" height="32" fill="#000" fill-opacity="0.15"/>
    <rect x="1153" y="573" width="32" height="32" fill="#FF0000" stroke="#000" stroke-width="3"/>

    <!-- 코너 기하학 블록 -->
    <rect x="-30" y="-10" width="140" height="100"
      fill="#FFD700" fill-opacity="0.15" stroke="#000" stroke-width="3"
      transform="rotate(-8 40 40)"/>
    <rect x="1090" y="540" width="140" height="100"
      fill="#FFD700" fill-opacity="0.15" stroke="#000" stroke-width="3"
      transform="rotate(8 1160 590)"/>
    <rect x="1100" y="30" width="55" height="55"
      fill="#FF0000" fill-opacity="0.1" stroke="#000" stroke-width="2.5"
      transform="rotate(5 1127 57)"/>
    <rect x="45" y="545" width="45" height="45"
      fill="#0000FF" fill-opacity="0.1" stroke="#000" stroke-width="2.5"
      transform="rotate(-5 67 567)"/>

    <!-- 하프톤 도트 -->
    <defs>
      <pattern id="defHalf" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="2.5" fill="#000" fill-opacity="0.06"/>
      </pattern>
    </defs>
    <rect x="900" y="460" width="300" height="160" fill="url(#defHalf)"/>
    <rect x="0" y="16" width="180" height="110" fill="url(#defHalf)"/>

    <!-- 사이드 액센트 -->
    <rect x="0" y="16" width="5" height="90" fill="#FF0000" fill-opacity="0.35"/>
    <rect x="1195" y="524" width="5" height="96" fill="#0000FF" fill-opacity="0.35"/>

    <!-- 떠다니는 장식 -->
    <circle cx="28" cy="310" r="7" fill="none" stroke="#FFD700" stroke-width="2.5" stroke-opacity="0.35"/>
    <rect x="1168" y="295" width="12" height="12" fill="none" stroke="#FF0000" stroke-width="2" stroke-opacity="0.25"
      transform="rotate(45 1174 301)"/>
    <path d="M590,600 L600,588 L610,600 Z" fill="#FFD700" fill-opacity="0.3" stroke="#000" stroke-width="1.5"/>`;
}
