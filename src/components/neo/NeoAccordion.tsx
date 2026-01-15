"use client";

import { ReactNode, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface NeoAccordionProps {
    title: string;
    children: ReactNode;
    defaultOpen?: boolean;
    badge?: ReactNode;
    className?: string;
}

export function NeoAccordion({
    title,
    children,
    defaultOpen = false,
    badge,
    className,
}: NeoAccordionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div
            className={cn(
                "bg-white border-3 sm:border-4 border-black neo-shadow",
                className
            )}
        >
            {/* Accordion Header */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 sm:p-6 hover:bg-accent transition-colors group"
                aria-expanded={isOpen}
            >
                <div className="flex items-center gap-3">
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-200 flex-shrink-0",
                            isOpen && "rotate-180"
                        )}
                    />
                    <h3 className="text-lg sm:text-2xl font-black uppercase tracking-tight text-left">
                        {title}
                    </h3>
                </div>
                {badge && (
                    <div className="ml-2 flex-shrink-0">
                        {badge}
                    </div>
                )}
            </button>

            {/* Accordion Content */}
            <div
                className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isOpen ? "max-h-[5000px] opacity-100" : "max-h-0 opacity-0"
                )}
            >
                <div className="border-t-3 border-black p-4 sm:p-6 pt-4 sm:pt-6">
                    {children}
                </div>
            </div>
        </div>
    );
}
