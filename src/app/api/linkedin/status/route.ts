import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getLinkedInConnectionStatus } from "@/lib/linkedin";

export async function GET() {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const status = await getLinkedInConnectionStatus();
    return NextResponse.json(status);
  } catch (error) {
    console.error("LinkedIn status check failed:", error);
    return NextResponse.json({ connected: false });
  }
}
