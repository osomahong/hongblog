"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import { NeoBadge } from "./neo";

interface PlaylistItem {
    id: string;
    slug: string;
    title: string;
    [key: string]: any;
}

interface PlaylistProgressProps {
    type: "series" | "course";
    id: string;
    items: PlaylistItem[];
    basePath: string;
    currentSlug?: string;
}

export function PlaylistProgress({
    type,
    id,
    items,
    basePath,
    currentSlug,
}: PlaylistProgressProps) {
    const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

    // Load progress from localStorage
    useEffect(() => {
        const storageKey = `${type}:${id}:progress`;
        const saved = localStorage.getItem(storageKey);
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                setCompletedItems(new Set(parsed));
            } catch (e) {
                console.error("Failed to parse progress data", e);
            }
        }
    }, [type, id]);

    // Save progress to localStorage
    const saveProgress = (newCompleted: Set<string>) => {
        const storageKey = `${type}:${id}:progress`;
        localStorage.setItem(storageKey, JSON.stringify(Array.from(newCompleted)));
        setCompletedItems(newCompleted);
    };

    const toggleComplete = (itemId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const newCompleted = new Set(completedItems);
        if (newCompleted.has(itemId)) {
            newCompleted.delete(itemId);
        } else {
            newCompleted.add(itemId);
        }
        saveProgress(newCompleted);
    };

    const completedCount = completedItems.size;
    const totalCount = items.length;
    const progressPercent = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

    return (
        <div className="space-y-4">
            {/* Progress Bar */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold uppercase">학습 진행률</span>
                    <span className="text-sm font-mono">
                        {completedCount}/{totalCount} ({Math.round(progressPercent)}%)
                    </span>
                </div>
                <div className="h-3 bg-gray-200 border-2 border-black relative overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 border-r-2 border-black"
                        style={{ width: `${progressPercent}%` }}
                    />
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-2">
                {items.map((item, index) => {
                    const isCompleted = completedItems.has(item.id);
                    const isCurrent = currentSlug === item.slug;

                    return (
                        <Link key={item.id} href={`${basePath}/${item.slug}`}>
                            <div
                                className={cn(
                                    "flex items-start gap-3 p-3 sm:p-4 border-2 border-black transition-all group",
                                    isCurrent
                                        ? "bg-yellow-100 border-yellow-600"
                                        : isCompleted
                                            ? "bg-green-50 hover:bg-green-100"
                                            : "bg-white hover:bg-accent"
                                )}
                            >
                                {/* Checkbox */}
                                <button
                                    onClick={(e) => toggleComplete(item.id, e)}
                                    className="flex-shrink-0 mt-0.5 hover:scale-110 transition-transform"
                                    aria-label={isCompleted ? "완료 취소" : "완료 표시"}
                                >
                                    {isCompleted ? (
                                        <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-600 fill-green-600" />
                                    ) : (
                                        <Circle className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
                                    )}
                                </button>

                                {/* Number */}
                                <div className="flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 bg-black text-white flex items-center justify-center font-bold text-xs sm:text-sm">
                                    {index + 1}
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <h4
                                        className={cn(
                                            "font-bold text-sm sm:text-base group-hover:text-primary transition-colors",
                                            isCompleted && "line-through text-muted-foreground"
                                        )}
                                    >
                                        {item.title}
                                    </h4>
                                    {isCurrent && (
                                        <NeoBadge variant="accent" className="mt-1 text-xs">
                                            현재 위치
                                        </NeoBadge>
                                    )}
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
