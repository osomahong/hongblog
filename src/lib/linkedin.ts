import { AuthClient } from "linkedin-api-client";
import { db } from "./db";
import { linkedinTokens } from "./schema";
import { eq } from "drizzle-orm";

const LINKEDIN_SCOPES = ["openid", "profile", "w_member_social"];

function getAuthClient() {
  return new AuthClient({
    clientId: process.env.LINKEDIN_CLIENT_ID!,
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
    redirectUrl: process.env.LINKEDIN_REDIRECT_URI!,
  });
}

/** OAuth2 인증 URL 생성 */
export function getAuthorizationUrl(state: string): string {
  const authClient = getAuthClient();
  return authClient.generateMemberAuthorizationUrl(LINKEDIN_SCOPES, state);
}

/** 인증 코드 → 토큰 교환 */
export async function exchangeCodeForTokens(code: string) {
  const authClient = getAuthClient();
  return authClient.exchangeAuthCodeForAccessToken(code);
}

/** LinkedIn 프로필 조회 (OpenID Connect /userinfo) */
export async function getLinkedInProfile(accessToken: string) {
  const response = await fetch("https://api.linkedin.com/v2/userinfo", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!response.ok) {
    throw new Error(`LinkedIn profile fetch failed: ${response.status}`);
  }
  const data = await response.json();
  return {
    personUrn: `urn:li:person:${data.sub}`,
    name: data.name || data.given_name || "LinkedIn User",
  };
}

/** DB에 토큰 저장 (단일 관리자 — 기존 행 삭제 후 삽입) */
export async function saveTokens(data: {
  personUrn: string;
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  refreshTokenExpiresIn?: number;
  scopes: string;
  linkedinName: string;
}) {
  const now = new Date();
  const accessTokenExpiresAt = new Date(now.getTime() + data.expiresIn * 1000);
  const refreshTokenExpiresAt = data.refreshTokenExpiresIn
    ? new Date(now.getTime() + data.refreshTokenExpiresIn * 1000)
    : null;

  await db.delete(linkedinTokens);
  await db.insert(linkedinTokens).values({
    personUrn: data.personUrn,
    accessToken: data.accessToken,
    refreshToken: data.refreshToken ?? null,
    accessTokenExpiresAt,
    refreshTokenExpiresAt,
    scopes: data.scopes,
    linkedinName: data.linkedinName,
    updatedAt: now,
  });
}

/** 유효한 액세스 토큰 반환 (만료 임박 시 자동 갱신) */
export async function getValidAccessToken(): Promise<{
  accessToken: string;
  personUrn: string;
} | null> {
  const tokens = await db.select().from(linkedinTokens).limit(1);
  if (tokens.length === 0) return null;

  const token = tokens[0];
  const now = new Date();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;

  // 만료까지 7일 이상 → 그대로 사용
  if (token.accessTokenExpiresAt.getTime() - now.getTime() > sevenDaysMs) {
    return { accessToken: token.accessToken, personUrn: token.personUrn };
  }

  // 리프레시 토큰으로 갱신 시도
  if (
    token.refreshToken &&
    token.refreshTokenExpiresAt &&
    token.refreshTokenExpiresAt > now
  ) {
    try {
      const authClient = getAuthClient();
      const refreshed = await authClient.exchangeRefreshTokenForAccessToken(
        token.refreshToken,
      );

      const newExpiresAt = new Date(
        now.getTime() + refreshed.expires_in * 1000,
      );
      const newRefreshExpiresAt = refreshed.refresh_token_expires_in
        ? new Date(now.getTime() + refreshed.refresh_token_expires_in * 1000)
        : token.refreshTokenExpiresAt;

      await db
        .update(linkedinTokens)
        .set({
          accessToken: refreshed.access_token,
          refreshToken: refreshed.refresh_token || token.refreshToken,
          accessTokenExpiresAt: newExpiresAt,
          refreshTokenExpiresAt: newRefreshExpiresAt,
          updatedAt: now,
        })
        .where(eq(linkedinTokens.id, token.id));

      return { accessToken: refreshed.access_token, personUrn: token.personUrn };
    } catch (error) {
      console.error("LinkedIn token refresh failed:", error);
      // 갱신 실패해도 아직 유효하면 사용
    }
  }

  // 아직 만료 안 됐으면 그대로 사용
  if (token.accessTokenExpiresAt > now) {
    return { accessToken: token.accessToken, personUrn: token.personUrn };
  }

  return null;
}

/** LinkedIn Posts API로 텍스트 게시 */
export async function postToLinkedIn(
  text: string,
): Promise<{ success: boolean; postUrn?: string; error?: string }> {
  const tokenData = await getValidAccessToken();
  if (!tokenData) {
    return {
      success: false,
      error: "LinkedIn 연결이 필요합니다. 다시 연결해주세요.",
    };
  }

  if (text.length > 3000) {
    return { success: false, error: "3,000자를 초과했습니다." };
  }

  try {
    const body = JSON.stringify({
      author: tokenData.personUrn,
      commentary: text,
      visibility: "PUBLIC",
      distribution: {
        feedDistribution: "MAIN_FEED",
        targetEntities: [],
        thirdPartyDistributionChannels: [],
      },
      lifecycleState: "PUBLISHED",
      isReshareDisabledByAuthor: false,
    });

    const response = await fetch("https://api.linkedin.com/rest/posts", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${tokenData.accessToken}`,
        "Content-Type": "application/json; charset=UTF-8",
        "LinkedIn-Version": "202601",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("LinkedIn post failed:", response.status, errorData);
      const message = errorData?.message || `LinkedIn API 오류 (${response.status})`;
      return { success: false, error: message };
    }

    const postUrn = response.headers.get("x-restli-id") || undefined;
    return { success: true, postUrn };
  } catch (error: unknown) {
    console.error("LinkedIn post failed:", error);
    const message = error instanceof Error ? error.message : "LinkedIn 게시 중 오류가 발생했습니다.";
    return { success: false, error: message };
  }
}

/** 연결 상태 조회 */
export async function getLinkedInConnectionStatus(): Promise<{
  connected: boolean;
  name?: string;
  expiresAt?: string;
  needsReconnect?: boolean;
}> {
  const tokens = await db.select().from(linkedinTokens).limit(1);
  if (tokens.length === 0) {
    return { connected: false };
  }

  const token = tokens[0];
  const now = new Date();
  const hasValidRefresh =
    token.refreshToken &&
    token.refreshTokenExpiresAt &&
    token.refreshTokenExpiresAt > now;

  if (token.accessTokenExpiresAt <= now && !hasValidRefresh) {
    return {
      connected: false,
      needsReconnect: true,
      name: token.linkedinName || undefined,
    };
  }

  return {
    connected: true,
    name: token.linkedinName || undefined,
    expiresAt: token.accessTokenExpiresAt.toISOString(),
    needsReconnect: token.accessTokenExpiresAt <= now,
  };
}
