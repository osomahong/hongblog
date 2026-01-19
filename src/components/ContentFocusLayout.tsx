"use client";

import { useState, useEffect, useCallback } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { NeoButton } from "@/components/neo";
import { FocusGuideBubble } from "./FocusGuideBubble";
import { cn } from "@/lib/utils";
import { sendGAEvent } from "@/lib/gtm";

interface ContentFocusLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
    contentTitle?: string;
}

export function ContentFocusLayout({ children, sidebar, contentTitle }: ContentFocusLayoutProps) {
    const [isFocusMode, setIsFocusMode] = useState(false);
    const [showGuide, setShowGuide] = useState(false);
    const [hasDismissed, setHasDismissed] = useState(false);

    const toggleFocusMode = useCallback(() => {
        const willExpand = !isFocusMode;
        setIsFocusMode(willExpand);
        setShowGuide(false);

        // Send GTM event based on action
        if (contentTitle) {
            const eventName = willExpand ? "click_expand" : "click_compress";
            sendGAEvent(eventName, { content_title: contentTitle });
        }
    }, [isFocusMode, contentTitle]);

    useEffect(() => {
        const checkVisibility = () => {
            // Only for PC (lg breakpoint: 1024px)
            if (window.innerWidth < 1024 || isFocusMode || hasDismissed) {
                setShowGuide(false);
                return;
            }

            const hideFocusGuide = sessionStorage.getItem("hideFocusGuide");
            if (hideFocusGuide === new Date().toDateString()) {
                setHasDismissed(true);
                setShowGuide(false);
                return;
            }

            const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercentage = (window.scrollY / scrollHeight) * 100;

            if (scrollPercentage > 60) {
                setShowGuide(true);
            } else {
                setShowGuide(false);
            }
        };

        window.addEventListener("scroll", checkVisibility);
        window.addEventListener("resize", checkVisibility);
        // Initial check
        checkVisibility();

        return () => {
            window.removeEventListener("scroll", checkVisibility);
            window.removeEventListener("resize", checkVisibility);
        };
    }, [isFocusMode, hasDismissed]);

    const handleCloseGuide = () => {
        setShowGuide(false);
        setHasDismissed(true);
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
                    {children}
                </div>

                {/* Sidebar Area */}
                <div className={cn(
                    "transition-all duration-300",
                    isFocusMode
                        ? "block opacity-100 scale-100 mt-12 sm:mt-16 w-full border-t-2 border-dashed border-gray-200 pt-8 [&>div]:grid [&>div]:grid-cols-1 [&>div]:md:grid-cols-2 [&>div]:gap-6 [&>div>*:not(:first-child)]:mt-0 [&>div>*]:h-full"
                        : "block opacity-100 scale-100 lg:col-span-1 mt-4 lg:mt-0"
                )}>
                    {sidebar}
                </div>
            </div>

            {/* Focus Guide Bubble */}
            <FocusGuideBubble
                isVisible={showGuide}
                onOpen={toggleFocusMode}
                onClose={handleCloseGuide}
            />

            {/* Floating Action Button */}
            <div className="hidden lg:block fixed bottom-8 right-8 z-50">
                <NeoButton
                    variant="primary"
                    onClick={toggleFocusMode}
                    className="rounded-full w-12 h-12 sm:w-14 sm:h-14 p-0 flex items-center justify-center neo-shadow-lg hover:rotate-12 transition-transform duration-200"
                    title={isFocusMode ? "Exit Focus Mode" : "Enter Focus Mode"}
                >
                    {isFocusMode ? (
                        <Minimize2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    ) : (
                        <Maximize2 className="w-6 h-6 sm:w-7 sm:h-7" />
                    )}
                </NeoButton>
            </div>
        </div>
    );
}
