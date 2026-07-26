import { Info } from "lucide-react";
import type { UpdateNotice } from "@/lib/types";

interface ContentUpdateNoticeProps {
    notice: UpdateNotice;
}

/** "2026-07" 형식을 "2026년 07월"로 바꾼다. 형식이 다르면 원본을 그대로 쓴다. */
function formatNoticeDate(date: string): string {
    const matched = /^(\d{4})-(\d{2})$/.exec(date.trim());
    if (!matched) return date;
    return `${matched[1]}년 ${matched[2]}월`;
}

/**
 * 발행 후 사실이 달라져 본문을 고쳤을 때 글 상단에 남기는 변경 기록.
 * 무엇이 추가되고 삭제됐는지만 적고, 배경 설명은 본문에서 다룬다.
 */
export function ContentUpdateNotice({ notice }: ContentUpdateNoticeProps) {
    if (!notice.items || notice.items.length === 0) return null;

    return (
        <aside
            aria-label={`${formatNoticeDate(notice.date)} 업데이트 내역`}
            className="not-prose mb-6 sm:mb-8 border-2 border-black bg-[#F3F3F3] p-3 sm:p-4"
        >
            <div className="flex items-center gap-2 mb-2">
                <Info className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
                <span className="font-bold text-xs sm:text-sm tracking-tight">
                    {formatNoticeDate(notice.date)} 업데이트
                </span>
            </div>
            <ul className="space-y-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {notice.items.map((item, idx) => (
                    <li key={idx} className="flex gap-2">
                        <span aria-hidden="true" className="flex-shrink-0">
                            -
                        </span>
                        <span>{item}</span>
                    </li>
                ))}
            </ul>
        </aside>
    );
}
