import { NextResponse } from "next/server";
import { getPublishedLogs } from "@/lib/queries";

// GET: 발행된 로그 목록 조회 (Public API)
export async function GET() {
    try {
        const logs = await getPublishedLogs();
        return NextResponse.json(logs);
    } catch (error) {
        console.error("Failed to fetch logs:", error);
        return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
    }
}
