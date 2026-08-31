"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { dissolvePageAndNavigate } from "@/lib/canvas-fx";
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
  const router = useRouter();
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
                  onClick={(e) => {
                    sendGAEvent("click_sidebar_list", {
                      content_id: item.id,
                      content_name: item.title,
                      content_type: item.contentType,
                      position: index + 1,
                    });
                    // HTML in Canvas 지원 브라우저에서는 화면이 픽셀로
                    // 흩어진 뒤 이동한다. 새 탭 열기(수정키)는 그대로 둔다.
                    if (!e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0) {
                      e.preventDefault();
                      void dissolvePageAndNavigate(() => router.push(item.href));
                    }
                  }}
                  className="block py-2 group"
                >
                  {/* 제목은 줄바꿈 없이 한 줄에서 말줄임(...)으로 자른다 */}
                  <span className="block text-[13px] sm:text-sm font-bold leading-snug truncate group-hover:text-[#FF0033] transition-colors">
                    {item.title}
                  </span>
                  {/* line-clamp가 display:-webkit-box를 쓰므로 block을 같이 두면 클램프가 풀린다 */}
                  {item.description && (
                    <span className="line-clamp-2 text-[11px] sm:text-xs text-muted-foreground mt-0.5">
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
