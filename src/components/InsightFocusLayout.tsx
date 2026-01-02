"use client";

import { useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { NeoButton } from "@/components/neo";
import { cn } from "@/lib/utils";

interface InsightFocusLayoutProps {
    children: React.ReactNode;
    sidebar: React.ReactNode;
}

export function InsightFocusLayout({ children, sidebar }: InsightFocusLayoutProps) {
    const [isFocusMode, setIsFocusMode] = useState(false);

    const toggleFocusMode = () => {
        setIsFocusMode(!isFocusMode);
    };

    return (
        <div className="relative min-h-[50vh]">
            {/* Layout Content */}
            <div className={cn(
                "grid gap-4 sm:gap-8 transition-all duration-300 ease-in-out",
                isFocusMode
                    ? "grid-cols-1 max-w-4xl mx-auto"
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
                        ? "block opacity-100 scale-100 mt-12 sm:mt-16 max-w-4xl mx-auto w-full border-t-2 border-dashed border-gray-200 pt-8 [&>div]:grid [&>div]:grid-cols-1 [&>div]:md:grid-cols-2 [&>div]:gap-6 [&>div>*:not(:first-child)]:mt-0 [&>div>*]:h-full"
                        : "block opacity-100 scale-100 lg:col-span-1 mt-4 lg:mt-0"
                )}>
                    {sidebar}
                </div>
            </div>

            {/* Floating Action Button */}
            <div className="fixed bottom-8 right-8 z-50">
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
