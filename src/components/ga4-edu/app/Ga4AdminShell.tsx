"use client";

/**
 * GA4 관리 화면 껍데기.
 *
 * 보고서, 탐색과 달리 왼쪽에 설정 메뉴가 들어온다. 계정 묶음과 속성 묶음으로 나뉘고,
 * 속성 묶음 안에 데이터 수집 및 수정, 데이터 표시, 제품 링크가 놓인다.
 * 상단바와 아이콘 줄은 다른 화면과 같은 것을 쓴다.
 */

import type { ReactNode } from "react";
import { ChevronDown, Search } from "lucide-react";
import { Ga4TopBar, Ga4IconRail, type Ga4Section } from "./Ga4Chrome";
import { useRing } from "./tour";

export interface AdminNode {
  id: string;
  label: string;
  children?: AdminNode[];
}

/** 실제 관리 화면의 메뉴 구성을 따른다. 이 편이 다루는 항목만 눌린다 */
export const ADMIN_TREE: AdminNode[] = [
  {
    id: "account",
    label: "계정",
    children: [
      { id: "account-settings", label: "계정 설정" },
      { id: "account-access", label: "계정 액세스 관리" },
    ],
  },
  {
    id: "property",
    label: "속성",
    children: [
      { id: "property-settings", label: "속성 설정" },
      { id: "data-streams", label: "데이터 스트림" },
      { id: "events", label: "이벤트" },
      { id: "key-events", label: "주요 이벤트" },
      { id: "audiences", label: "잠재고객" },
      { id: "custom-definitions", label: "맞춤 정의" },
      { id: "product-links", label: "제품 링크" },
    ],
  },
];

const ADMIN_TITLE: Record<string, string> = {
  "account-settings": "계정 설정",
  "account-access": "계정 액세스 관리",
  "property-settings": "속성 설정",
  "data-streams": "데이터 스트림",
  events: "이벤트",
  "key-events": "주요 이벤트",
  audiences: "잠재고객",
  "custom-definitions": "맞춤 정의",
  "product-links": "제품 링크",
};

/** 학습자가 메뉴에서 고른 항목의 이름. 제목과 선택이 어긋나지 않게 한다 */
export function adminTitleOf(id: string): string {
  return ADMIN_TITLE[id] ?? "관리";
}

/** 이 편이 다루지 않는 설정 화면으로 옮겼을 때 보여 주는 안내 */
export function Ga4OtherAdmin({ label }: { label: string }) {
  return (
    <div className="ga4-other-report">
      <p className="ga4-other-report-title">{label}</p>
      <p className="ga4-other-report-desc">
        이 편에서는 이 설정을 다루지 않습니다. 왼쪽 메뉴에서 이벤트를 다시 누르면 하던 자리에서
        이어집니다.
      </p>
    </div>
  );
}

interface Ga4AdminShellProps {
  account: string;
  property: string;
  searchHint: string;
  pinned: boolean;
  onTogglePin: () => void;
  /** 지금 열려 있는 설정 항목 */
  page: string;
  onOpenPage: (id: string) => void;
  /** 아이콘 줄에서 영역을 옮길 때 */
  onOpenSection?: (section: Ga4Section) => void;
  /** 이벤트 만들기 패널. 열려 있을 때만 넘긴다 */
  panel?: ReactNode;
  children: ReactNode;
}

export function Ga4AdminShell({
  account,
  property,
  searchHint,
  pinned,
  onTogglePin,
  page,
  onOpenPage,
  onOpenSection,
  panel,
  children,
}: Ga4AdminShellProps) {
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
        <Ga4IconRail section="admin" onOpenSection={onOpenSection} />

        <nav className="ga4-adminnav" aria-label="관리 메뉴">
          <p className="ga4-adminnav-title">관리</p>
          <span className="ga4-adminnav-search" aria-hidden>
            <Search className="w-4 h-4" strokeWidth={1.8} />
            <span>검색</span>
          </span>
          {ADMIN_TREE.map((group) => (
            <div key={group.id} className="ga4-adminnav-group">
              <p className="ga4-adminnav-grouphead">
                {group.label}
                <ChevronDown className="w-4 h-4" strokeWidth={2} aria-hidden />
              </p>
              {group.children?.map((node) => (
                <AdminItem key={node.id} node={node} current={page} onOpen={onOpenPage} />
              ))}
            </div>
          ))}
        </nav>

        <div className="ga4-adminmain">{children}</div>
        {panel}
      </div>
    </div>
  );
}

function AdminItem({
  node,
  current,
  onOpen,
}: {
  node: AdminNode;
  current: string;
  onOpen: (id: string) => void;
}) {
  const ring = useRing(`admin:${node.id}`);
  return (
    <button
      type="button"
      data-tour={`admin:${node.id}`}
      onClick={() => onOpen(node.id)}
      className={`ga4-adminnav-item${current === node.id ? " ga4-adminnav-on" : ""}${ring}`}
      aria-current={current === node.id}
    >
      {node.label}
    </button>
  );
}
