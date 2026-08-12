"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@/lib/gtm";

interface ContentFocusLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    contentTitle?: string;
    /**
     * 포커스 모드에서 사이드바 대신 본문 아래에 놓을 내용.
     * 포커스 모드 진입은 집중해서 읽겠다는 신호라, 이 자리에 다음 학습 경로를 둔다.
     * 넘기지 않으면 기존처럼 sidebar를 그대로 내려 보여준다.
     */
    focusSidebar?: React.ReactNode;
}

export function ContentFocusLayout({ children, sidebar, contentTitle, focusSidebar }: ContentFocusLayoutProps) {
    const [isFocusMode, setIsFocusMode] = useState(false);

    const usesFocusSidebar = isFocusMode && Boolean(focusSidebar);

    const toggleFocusMode = () => {
        const willExpand = !isFocusMode;
        setIsFocusMode(willExpand);

        if (contentTitle) {
            sendGAEvent(willExpand ? "click_expand" : "click_compress", { content_name: contentTitle });
        }
    };

    return (
        <div className="relative min-h-[50vh]">
            {/* Layout Content */}
            <div className={cn(
                "grid gap-4 sm:gap-8 transition-all duration-300 ease-in-out max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
                isFocusMode
                    ? "grid-cols-1"
                    : "grid-cols-1 lg:grid-cols-3"
            )}>
                {/* Main Article Area */}
                <div className={cn(
                    "transition-all duration-300",
                    isFocusMode ? "w-full" : "lg:col-span-2"
                )}>
                    {/*
                      본문 오른쪽 위에 붙여 두는 넓게 보기 버튼.
                      화면 오른쪽 아래는 구글 동의 위젯과 애드센스 앵커 광고가 차지하는 자리라
                      그곳에 띄우면 가려진다. 스크롤을 내려도 따라오도록 sticky로 둔다.
                    */}
                    <div className="hidden lg:flex justify-end sticky top-20 z-30 mb-2">
                        <NeoButton
                            variant="outline"
                            size="sm"
                            onClick={toggleFocusMode}
                            className="bg-white flex items-center gap-1.5 text-xs"
                        >
                            {isFocusMode ? (
                                <>
                                    <Minimize2 className="w-4 h-4" />
                                    원래대로
                                </>
                            ) : (
                                <>
                                    <Maximize2 className="w-4 h-4" />
                                    넓게 보기
                                </>
                            )}
                        </NeoButton>
                    </div>

                    {children}
                </div>

                {/* Sidebar Area */}
                <div className={cn(
                    "transition-all duration-300",
                    usesFocusSidebar
                        ? "block w-full mt-12 sm:mt-16 border-t-2 border-dashed border-gray-200 pt-8"
                        : isFocusMode
                            ? "block opacity-100 scale-100 mt-12 sm:mt-16 w-full border-t-2 border-dashed border-gray-200 pt-8 [&>div]:grid [&>div]:grid-cols-1 [&>div]:md:grid-cols-2 [&>div]:gap-6 [&>div>*:not(:first-child)]:mt-0 [&>div>*]:h-full"
                            : "block opacity-100 scale-100 lg:col-span-1 mt-4 lg:mt-0"
                )}>
                    {usesFocusSidebar ? focusSidebar : sidebar}
                </div>
            </div>
        </div>
    );
}
