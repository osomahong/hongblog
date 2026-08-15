"use client";

/**
 * GA4 탐색 화면 껍데기와 탐색 분석 홈.
 *
 * 탐색은 보고서와 화면 구성이 다르다. 왼쪽 보고서 트리 대신 변수 목록과 탭 설정이 들어오고,
 * 처음 들어가면 만들 기법을 고르는 템플릿 목록이 먼저 나온다.
 * 템플릿 카드의 미리보기는 실제 화면처럼 표, 막대, 수형도 모양을 그려서 넣는다.
 * 상단바와 아이콘 줄은 보고서 화면과 같은 것을 쓴다.
 */

import type { ReactNode } from "react";
import { UserRound, Search, ChevronRight, ArrowDown, EllipsisVertical } from "lucide-react";
import { Ga4TopBar, Ga4IconRail } from "./Ga4Chrome";
import { useRing } from "./tour";

interface Ga4ExploreShellProps {
  account: string;
  property: string;
  searchHint: string;
  pinned: boolean;
  onTogglePin: () => void;
  children: ReactNode;
}

export function Ga4ExploreShell({
  account,
  property,
  searchHint,
  pinned,
  onTogglePin,
  children,
}: Ga4ExploreShellProps) {
  return (
    <div className="ga4-app">
      <Ga4TopBar
        account={account}
        property={property}
        searchHint={searchHint}
        pinned={pinned}
        onTogglePin={onTogglePin}
      />
      <div className="ga4-app-body">
        <Ga4IconRail section="explore" />
        <div className="ga4-explore">{children}</div>
      </div>
    </div>
  );
}

/* ===================== 템플릿 미리보기 ===================== */

const BLUE = "#4285f4";
const BLUE_MID = "#8ab4f8";
const BLUE_SOFT = "#c6dafc";
const GRAY = "#dadce0";
const GRAY_SOFT = "#f1f3f4";

/** 새로 만들기. 구글 네 가지 색으로 그린 더하기 표시 */
function BlankMock() {
  return (
    <svg viewBox="0 0 260 150" className="ga4-tpl-svg" aria-hidden>
      <rect x="120" y="45" width="20" height="20" fill="#ea4335" />
      <rect x="140" y="65" width="20" height="20" fill={BLUE} />
      <rect x="120" y="85" width="20" height="20" fill="#34a853" />
      <rect x="100" y="65" width="20" height="20" fill="#fbbc04" />
      <rect x="120" y="65" width="20" height="20" fill={BLUE} />
    </svg>
  );
}

/** 자유 형식. 행과 열이 있는 표에 값 칸이 파랗게 채워진 모양 */
function FreeFormMock() {
  const rows = [46, 66, 86, 106, 126];
  const bars: [number, number, number][] = [
    // [행 y, 시작 x, 너비]
    [46, 78, 34],
    [46, 186, 44],
    [66, 78, 44],
    [66, 130, 36],
    [66, 186, 30],
    [86, 78, 26],
    [86, 130, 44],
    [106, 78, 40],
    [106, 186, 38],
    [126, 130, 30],
  ];
  return (
    <svg viewBox="0 0 260 150" className="ga4-tpl-svg" aria-hidden>
      <rect x="126" y="14" width="52" height="126" fill={GRAY_SOFT} />
      {[22, 78, 134, 196].map((x) => (
        <rect key={x} x={x} y="20" width="30" height="6" rx="3" fill={GRAY} />
      ))}
      <line x1="18" y1="36" x2="242" y2="36" stroke={GRAY} strokeWidth="1" />
      {rows.map((y) => (
        <rect key={y} x="22" y={y} width="42" height="7" rx="3.5" fill={GRAY} />
      ))}
      {bars.map(([y, x, w], i) => (
        <rect
          key={`${y}-${x}`}
          x={x}
          y={y - 3}
          width={w}
          height="13"
          rx="2"
          fill={i % 3 === 0 ? BLUE : i % 3 === 1 ? BLUE_MID : BLUE_SOFT}
        />
      ))}
    </svg>
  );
}

/** 유입경로 탐색. 단계마다 줄어드는 막대와 그 뒤에 남는 회색 자국 */
function FunnelMock() {
  const heights = [92, 78, 60, 46, 32, 22];
  const base = 118;
  return (
    <svg viewBox="0 0 260 150" className="ga4-tpl-svg" aria-hidden>
      {heights.map((h, i) => {
        const x = 26 + i * 36;
        const prev = i === 0 ? h : heights[i - 1];
        return (
          <g key={x}>
            <polygon
              points={`${x},${base - prev} ${x + 26},${base - h} ${x + 26},${base} ${x},${base}`}
              fill={GRAY_SOFT}
            />
            <rect x={x} y={base - h} width="26" height={h} fill={i < 3 ? BLUE : BLUE_MID} />
            <rect x={x + 4} y={base + 10} width="18" height="5" rx="2.5" fill={GRAY} />
          </g>
        );
      })}
    </svg>
  );
}

/** 경로 탐색. 한 화면에서 뻗어 나가는 다음 화면들을 수형도로 그린 모양 */
function PathMock() {
  const branches = [
    { y1: 52, y2: 40 },
    { y1: 66, y2: 62 },
    { y1: 80, y2: 86 },
    { y1: 94, y2: 108 },
  ];
  return (
    <svg viewBox="0 0 260 150" className="ga4-tpl-svg" aria-hidden>
      {[22, 88, 154, 206].map((x) => (
        <rect key={x} x={x} y="18" width="30" height="6" rx="3" fill={GRAY} />
      ))}
      {branches.map((b) => (
        <path
          key={b.y1}
          d={`M114,${b.y1} C126,${b.y1} 124,${b.y2} 136,${b.y2}`}
          fill="none"
          stroke={BLUE_SOFT}
          strokeWidth="8"
        />
      ))}
      <rect x="22" y="36" width="28" height="76" fill={BLUE} />
      <rect x="88" y="42" width="26" height="64" fill={BLUE_MID} />
      <path d="M50,74 C68,74 70,74 88,74" fill="none" stroke={BLUE_SOFT} strokeWidth="26" />
      {branches.map((b) => (
        <rect key={b.y2} x="136" y={b.y2 - 5} width="24" height="10" fill={BLUE_MID} />
      ))}
      {[40, 62, 86, 108].map((y) => (
        <g key={y}>
          <rect x="196" y={y - 3} width="16" height="6" rx="3" fill={BLUE_SOFT} />
          <rect x="218" y={y - 3} width="10" height="6" rx="3" fill={BLUE_SOFT} />
        </g>
      ))}
    </svg>
  );
}

/* ===================== 탐색 홈 ===================== */

interface Template {
  id: string;
  label: string;
  sub: string;
  mock: ReactNode;
}

const TEMPLATES: Template[] = [
  { id: "blank", label: "비어 있음", sub: "새 탐색 분석 만들기", mock: <BlankMock /> },
  {
    id: "free-form",
    label: "자유 형식",
    sub: "맞춤 차트와 표를 사용하여 얻을 수 있는 유용한 정보에는 무엇이 있나요?",
    mock: <FreeFormMock />,
  },
  {
    id: "funnel",
    label: "유입경로 탐색 분석",
    sub: "여러 단계로 구성된 유입경로를 사용하여 분석, 분류, 세분화할 수 있는 사용자 여정에는 무엇이 있나요?",
    mock: <FunnelMock />,
  },
  {
    id: "path",
    label: "경로 탐색 분석",
    sub: "수형도를 사용하여 파악할 수 있는 사용자 여정에는 무엇이 있나요?",
    mock: <PathMock />,
  },
];

interface RecentRow {
  name: string;
  owner: string;
  edited: string;
}

const RECENT: RecentRow[] = [
  { name: "제목 없는 탐색 분석", owner: "준준상점 운영", edited: "2026. 8. 12." },
  { name: "8월 기획전 유입경로", owner: "준준상점 운영", edited: "2026. 8. 6." },
  { name: "재방문 사용자 동질 집단", owner: "준준상점 운영", edited: "2026. 7. 29." },
];

interface Ga4ExploreHomeProps {
  onOpenTemplate: (id: string) => void;
  /** 표의 속성 열에 적히는 이름 */
  propertyName: string;
}

export function Ga4ExploreHome({ onOpenTemplate, propertyName }: Ga4ExploreHomeProps) {
  return (
    <div className="ga4-explore-home">
      <div className="ga4-explore-inner">
        <h2 className="ga4-explore-h1">탐색 분석</h2>

        <div className="ga4-explore-start">
          <h3 className="ga4-explore-h2">새 탐색 분석 시작하기</h3>
          <span className="ga4-explore-gallery">템플릿 갤러리</span>
        </div>

        <div className="ga4-explore-templates">
          {TEMPLATES.map((t) => (
            <TemplateCard key={t.id} template={t} onOpen={onOpenTemplate} />
          ))}
          <span className="ga4-explore-next" aria-hidden>
            <ChevronRight className="w-5 h-5" strokeWidth={2} />
          </span>
        </div>

        <table className="ga4-explore-recent">
          <thead>
            <tr>
              <th scope="col" className="ga4-explore-recent-kind">
                유형
              </th>
              <th scope="col">
                이름 <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </th>
              <th scope="col">소유자</th>
              <th scope="col">
                최종 수정 날짜 <ArrowDown className="w-3.5 h-3.5" strokeWidth={2} aria-hidden />
              </th>
              <th scope="col">속성</th>
              <th scope="col" className="ga4-explore-recent-end">
                <Search className="w-4 h-4" strokeWidth={1.8} aria-hidden />
                <span className="sr-only">검색</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {RECENT.map((r) => (
              <tr key={r.name}>
                <td className="ga4-explore-recent-kind">
                  <UserRound className="w-4 h-4" strokeWidth={1.8} aria-hidden />
                </td>
                <td>{r.name}</td>
                <td>{r.owner}</td>
                <td>{r.edited}</td>
                <td>{propertyName}</td>
                <td className="ga4-explore-recent-end">
                  <EllipsisVertical className="w-4 h-4" strokeWidth={1.8} aria-hidden />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TemplateCard({
  template,
  onOpen,
}: {
  template: Template;
  onOpen: (id: string) => void;
}) {
  const ring = useRing(`template:${template.id}`);
  return (
    <button
      type="button"
      data-tour={`template:${template.id}`}
      onClick={() => onOpen(template.id)}
      className="ga4-explore-template"
    >
      <span className={`ga4-explore-template-canvas${ring}`}>{template.mock}</span>
      <span className="ga4-explore-template-label">{template.label}</span>
      <span className="ga4-explore-template-sub">{template.sub}</span>
    </button>
  );
}
