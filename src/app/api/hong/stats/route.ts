import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { contentDailyStats } from "@/lib/schema";
import { sql, and, eq, gte, inArray } from "drizzle-orm";

// 콘텐츠별 조회수 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const contentType = searchParams.get("contentType"); // "post" | "faq" | null (전체)
    const days = parseInt(searchParams.get("days") || "30", 10);
    const ids = searchParams.get("ids"); // 쉼표로 구분된 ID 목록 (선택)

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateStr = startDate.toISOString().split("T")[0];

    // 조건 빌드
    const conditions = [gte(contentDailyStats.date, startDateStr)];

    if (contentType) {
      conditions.push(eq(contentDailyStats.contentType, contentType as "post" | "faq"));
    }

    if (ids) {
      const idList = ids.split(",").map(Number).filter(n => !isNaN(n));
      if (idList.length > 0) {
        conditions.push(inArray(contentDailyStats.contentId, idList));
      }
    }

    const result = await db
      .select({
        contentType: contentDailyStats.contentType,
        contentId: contentDailyStats.contentId,
        totalViews: sql<number>`SUM(${contentDailyStats.viewCount})`.as("total_views"),
      })
      .from(contentDailyStats)
      .where(and(...conditions))
      .groupBy(contentDailyStats.contentType, contentDailyStats.contentId);

    // Map 형태로 변환하여 반환
    const statsMap: Record<string, Record<number, number>> = {
      post: {},
      faq: {},
      class: {},
      lifelog: {},
    };

    for (const row of result) {
      // contentType이 없으면 초기화
      if (!statsMap[row.contentType]) {
        statsMap[row.contentType] = {};
      }
      statsMap[row.contentType][row.contentId] = Number(row.totalViews);
    }

    return NextResponse.json(statsMap);
  } catch (error) {
    console.error("Error fetching stats:", error);
    console.error("Error details:", JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
    return NextResponse.json(
      { error: "Failed to fetch stats", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
