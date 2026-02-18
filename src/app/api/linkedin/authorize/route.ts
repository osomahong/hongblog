import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { getAuthorizationUrl } from "@/lib/linkedin";
import crypto from "crypto";

export async function GET() {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const state = crypto.randomBytes(16).toString("hex");
  const authUrl = getAuthorizationUrl(state);

  return NextResponse.redirect(authUrl);
}
