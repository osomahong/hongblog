import Link from "next/link";
import { ArrowRight, Sparkles, Database, TrendingUp } from "lucide-react";
import {
    NeoCardHeader,
    NeoCardTitle,
    NeoCardDescription,
    NeoCardContent,
    NeoCardFooter,
} from "@/components/neo";
import { NeoBadge } from "@/components/neo";
import { NeoTagBadge } from "@/components/neo";
import { getPublishedLogs } from "@/lib/queries";
import { NeoTiltCard } from "@/components/neo";

const categoryIcons = {
    AI_TECH: Sparkles,
    DATA: Database,
    MARKETING: TrendingUp,
};

const categoryLabels = {
    AI_TECH: "AI & Tech",
    DATA: "Data",
    MARKETING: "Marketing",
};

export default async function LogsPage() {
    const logs = await getPublishedLogs();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12">
            {/* Hero Section */}
            <section className="mb-6 sm:mb-12">
                <NeoTiltCard className="bg-gradient-to-br from-purple-600 to-indigo-600 border-3 sm:border-4 border-black p-4 sm:p-8 md:p-12 sm:-rotate-1 halftone-corner speed-lines text-left" intensity={20} shadowIntensity={10}>
                    <h1 className="text-2xl sm:text-4xl md:text-6xl font-black uppercase text-white tracking-tighter mb-2 sm:mb-4 relative z-10 comic-emphasis leading-tight">
                        Logs
                    </h1>
                    <p className="text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl relative z-10 leading-relaxed">
                        컨설팅 로그 및 업무 다이어리
                    </p>
                </NeoTiltCard>
            </section>

            {/* Results Count */}
            <div className="mb-3 sm:mb-6">
                <span className="font-mono text-[10px] sm:text-sm text-muted-foreground">
                    {logs.length}개의 로그
                </span>
            </div>

            {/* Logs Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                {logs.map((log) => {
                    const Icon = categoryIcons[log.category as keyof typeof categoryIcons] || Sparkles;
                    return (
                        <Link key={log.id} href={`/logs/${log.slug}`}>
                            <NeoTiltCard className="h-full">
                                <NeoCardHeader>
                                    <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3 flex-wrap">
                                        <NeoBadge
                                            variant={
                                                log.category === "AI_TECH"
                                                    ? "ai"
                                                    : log.category === "DATA"
                                                        ? "data"
                                                        : "marketing"
                                            }
                                        >
                                            <span className="flex items-center gap-1">
                                                {Icon && <Icon className="w-3 h-3" />}
                                                {categoryLabels[log.category as keyof typeof categoryLabels] || log.category}
                                            </span>
                                        </NeoBadge>
                                    </div>
                                    <NeoCardTitle className="text-base sm:text-2xl leading-snug">
                                        {log.title}
                                    </NeoCardTitle>
                                    {log.location && (
                                        <NeoCardDescription className="text-xs sm:text-base">
                                            📍 {log.location}
                                        </NeoCardDescription>
                                    )}
                                </NeoCardHeader>
                                <NeoCardContent>
                                    <div className="flex flex-wrap gap-1">
                                        {log.tags.slice(0, 3).map((tag) => (
                                            <NeoTagBadge key={tag} tag={tag} clickable={false} className="text-[9px] sm:text-[10px] px-1.5 sm:px-2 py-0.5" />
                                        ))}
                                    </div>
                                </NeoCardContent>
                                <NeoCardFooter className="flex items-center justify-between">
                                    <span className="text-[10px] sm:text-xs font-mono text-muted-foreground">
                                        {log.visitedAt
                                            ? new Date(log.visitedAt).toLocaleDateString("ko-KR")
                                            : log.createdAt.toLocaleDateString("ko-KR")}
                                    </span>
                                    <span className="flex items-center gap-1 text-xs sm:text-sm font-bold uppercase">
                                        Read <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
                                    </span>
                                </NeoCardFooter>
                            </NeoTiltCard>
                        </Link>
                    );
                })}
            </section>

            {logs.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                    <p className="text-sm sm:text-base text-muted-foreground">아직 작성된 로그가 없습니다.</p>
                </div>
            )}
        </div>
    );
}
