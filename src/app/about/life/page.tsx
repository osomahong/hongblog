import { Metadata } from "next";
import Link from "next/link";
import { 
  Utensils, 
  GraduationCap, 
  Palette, 
  Plane, 
  Coffee,
  MapPin,
  Calendar,
  Star,
  ArrowLeft
} from "lucide-react";
import { db } from "@/lib/db";
import { lifeLogs, LifeLogCategory } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Life Log | About",
  description: "일상의 기록들 - 맛집, 강의, 문화생활, 여행 등",
};

const categoryConfig: Record<LifeLogCategory, { icon: typeof Utensils; label: string; color: string }> = {
  FOOD: { icon: Utensils, label: "맛집", color: "bg-orange-500" },
  LECTURE: { icon: GraduationCap, label: "강의", color: "bg-blue-500" },
  CULTURE: { icon: Palette, label: "문화생활", color: "bg-purple-500" },
  TRAVEL: { icon: Plane, label: "여행", color: "bg-green-500" },
  DAILY: { icon: Coffee, label: "일상", color: "bg-gray-500" },
};

async function getPublishedLifeLogs() {
  return db.query.lifeLogs.findMany({
    where: eq(lifeLogs.isPublished, true),
    orderBy: [desc(lifeLogs.visitedAt), desc(lifeLogs.createdAt)],
  });
}

export default async function LifeLogPage() {
  const logs = await getPublishedLifeLogs();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
      {/* Back to About */}
      <Link 
        href="/about" 
        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-6 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        About으로 돌아가기
      </Link>

      {/* Hero */}
      <section className="mb-12">
        <div className="bg-accent border-4 border-black neo-shadow-lg p-6 sm:p-10 -rotate-1">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-white border-3 border-black p-2 rotate-3">
              <Coffee className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
            </div>
            <span className="text-black/70 font-mono text-sm uppercase tracking-wider">Life Log</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black leading-tight mb-2">
            일상의 기록들
          </h1>
          <p className="text-gray-700">
            맛집 탐방, 강의 후기, 문화생활, 여행 등 개인적인 일상을 기록합니다.
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="mb-8">
        <div className="flex flex-wrap gap-2">
          {Object.entries(categoryConfig).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <span
                key={key}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-bold text-white border-2 border-black ${config.color}`}
              >
                <Icon className="w-4 h-4" />
                {config.label}
              </span>
            );
          })}
        </div>
      </section>

      {/* Life Logs Grid */}
      {logs.length === 0 ? (
        <div className="bg-white border-4 border-black neo-shadow p-8 text-center">
          <Coffee className="w-12 h-12 mx-auto mb-4 text-gray-400" />
          <p className="text-gray-500">아직 기록된 일상이 없습니다.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {logs.map((log: typeof logs[number], index: number) => {
            const config = categoryConfig[log.category as LifeLogCategory];
            const Icon = config?.icon || Coffee;
            const rotations = ["rotate-0.5", "-rotate-0.5", "rotate-0"];
            
            return (
              <Link key={log.id} href={`/about/life/${log.slug}`}>
                <article 
                  className={`bg-white border-4 border-black neo-shadow p-5 sm:p-6 ${rotations[index % 3]} hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all group`}
                >
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Thumbnail */}
                    {log.thumbnailUrl && (
                      <div className="w-full sm:w-32 h-32 border-2 border-black overflow-hidden flex-shrink-0">
                        <img 
                          src={log.thumbnailUrl} 
                          alt={log.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs font-bold text-white border-2 border-black ${config?.color || "bg-gray-500"}`}>
                          <Icon className="w-3 h-3" />
                          {config?.label || log.category}
                        </span>
                        {log.visitedAt && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Calendar className="w-3 h-3" />
                            {new Date(log.visitedAt).toLocaleDateString("ko-KR")}
                          </span>
                        )}
                        {log.location && (
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <MapPin className="w-3 h-3" />
                            {log.location}
                          </span>
                        )}
                      </div>
                      
                      <h2 className="text-lg sm:text-xl font-black mb-2 group-hover:text-primary transition-colors">
                        {log.title}
                      </h2>
                      
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {log.content.replace(/[#*`]/g, "").slice(0, 150)}...
                      </p>
                      
                      {log.rating && (
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`w-4 h-4 ${i < log.rating! ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`} 
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
