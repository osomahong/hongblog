"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";

export type SidebarItemType = "insight" | "class" | "course";

export interface SidebarListItem {
  /** GA4 content_id로 보내는 슬러그 */
  id: string;
  href: string;
  title: string;
  /** 한 줄로 잘려 나오는 보조 설명 */
  description?: string;
  contentType: SidebarItemType;
}

export interface SidebarListGroup {
  title: string;
  items: SidebarListItem[];
  /** 그룹 아래에 붙이는 더 보기 링크 */
  more?: { href: string; label: string };
}

interface SidebarContentListProps {
  groups: SidebarListGroup[];
}

/**
 * 본문 옆에 두는 콘텐츠 목록.
 * 카드 대신 얇은 줄로 쌓아 같은 높이에 더 많은 글을 노출한다. 항목 수는 호출부에서
 * 정하되 한 화면에 14개를 넘기지 않는다. 그보다 늘리면 본문 집중도가 떨어지고
 * 페이지당 링크가 과도해진다.
 */
export function SidebarContentList({ groups }: SidebarContentListProps) {
  const visible = groups.filter((group) => group.items.length > 0);
  if (visible.length === 0) return null;

  return (
    <div className="space-y-5 sm:space-y-6">
      {visible.map((group) => (
        <section key={group.title}>
          <h2 className="text-xs sm:text-sm font-black uppercase tracking-wider border-b-4 border-black pb-1.5 mb-1">
            {group.title}
          </h2>

          <ul className="divide-y divide-gray-200">
            {group.items.map((item, index) => (
              <li key={`${item.contentType}-${item.id}`}>
                <Link
                  href={item.href}
                  onClick={() =>
                    sendGAEvent("click_sidebar_list", {
                      content_id: item.id,
                      content_name: item.title,
                      content_type: item.contentType,
                      position: index + 1,
                    })
                  }
                  className="block py-2 group"
                >
                  <span className="block text-[13px] sm:text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#FF0033] transition-colors">
                    {item.title}
                  </span>
                  {item.description && (
                    <span className="block text-[11px] sm:text-xs text-muted-foreground line-clamp-1 mt-0.5">
                      {item.description}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {group.more && (
            <Link
              href={group.more.href}
              onClick={() =>
                sendGAEvent("click_sidebar_list", {
                  content_id: "more",
                  content_name: group.more!.label,
                  content_type: "course",
                  position: 0,
                })
              }
              className="inline-flex items-center gap-1 mt-2 text-[11px] sm:text-xs font-bold text-[#FF0033] hover:underline"
            >
              {group.more.label}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </section>
      ))}
    </div>
  );
}
