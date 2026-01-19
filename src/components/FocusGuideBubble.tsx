"use client";

import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { NeoButton } from "./neo";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@/lib/gtm";

interface FocusGuideBubbleProps {
    onOpen: () => void;
    isVisible: boolean;
    onClose: () => void;
}

export function FocusGuideBubble({ onOpen, isVisible, onClose }: FocusGuideBubbleProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsMounted(true);
        }
    }, [isVisible]);

    const handleDontShowToday = () => {
        const today = new Date().toDateString();
        sessionStorage.setItem("hideFocusGuide", today);
        onClose();
    };

    if (!isVisible && !isMounted) return null;

    return (
        <div
            className={cn(
                "hidden lg:block fixed bottom-24 right-8 z-[60] w-72 transition-all duration-500 transform",
                isVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-4 scale-95 pointer-events-none"
            )}
        >
            {/* Bubble Tailwind CSS using custom neo styles if possible, else standard */}
            <div className="relative bg-white rounded-2xl p-5 neo-shadow-lg border border-gray-100">
                {/* Arrow */}
                <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-r border-b border-gray-100 transform rotate-45" />

                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <Sparkles className="w-5 h-5 fill-indigo-100" />
                        <span className="font-bold text-sm">추천 기능</span>
                    </div>
                    <button
                        onClick={() => {
                            sendGAEvent("click_expand_btn", { button_name: "닫기" });
                            onClose();
                        }}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="닫기"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                <div className="mb-4">
                    <h4 className="text-gray-900 font-bold text-base leading-tight">
                        더 편하게 읽어보실래요?
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                        우측 하단 버튼을 누르면 본문에만 집중할 수 있는 '집중 모드'가 켜집니다.
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <NeoButton
                        variant="primary"
                        size="sm"
                        className="w-full font-bold"
                        onClick={() => {
                            sendGAEvent("click_expand_btn", { button_name: "지금 사용해보기" });
                            onOpen();
                            onClose();
                        }}
                    >
                        지금 사용해보기
                    </NeoButton>
                    <button
                        onClick={() => {
                            sendGAEvent("click_expand_btn", { button_name: "오늘은 그만보기" });
                            handleDontShowToday();
                        }}
                        className="text-xs text-center text-gray-400 hover:text-gray-600 transition-colors py-1"
                    >
                        오늘은 그만 보기
                    </button>
                </div>
            </div>
        </div>
    );
}
