import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import {
  exchangeCodeForTokens,
  getLinkedInProfile,
  saveTokens,
} from "@/lib/linkedin";

export async function GET(request: NextRequest) {
  const session = await getServerSession();
  const allowedEmail = process.env.ALLOWED_GOOGLE_ID;

  if (!session || session.user?.email !== allowedEmail) {
    return NextResponse.redirect(new URL("/hong?linkedin=unauthorized", request.url));
  }

  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");

  if (error || !code) {
    const errorDesc =
      request.nextUrl.searchParams.get("error_description") || "인증이 거부되었습니다.";
    console.error("LinkedIn OAuth error:", error, errorDesc);
    return NextResponse.redirect(
      new URL(`/hong?linkedin=error&message=${encodeURIComponent(errorDesc)}`, request.url),
    );
  }

  try {
    const tokenData = await exchangeCodeForTokens(code);
    const profile = await getLinkedInProfile(tokenData.access_token);

    await saveTokens({
      personUrn: profile.personUrn,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresIn: tokenData.expires_in,
      refreshTokenExpiresIn: tokenData.refresh_token_expires_in,
      scopes: tokenData.scope,
      linkedinName: profile.name,
    });

    return NextResponse.redirect(new URL("/hong?linkedin=connected", request.url));
  } catch (err) {
    console.error("LinkedIn OAuth callback failed:", err);
    return NextResponse.redirect(
      new URL("/hong?linkedin=error&message=토큰+교환+실패", request.url),
    );
  }
}
