/**
 * GA4 Edu 학습 세션.
 *
 * 비밀번호 없이 뉴스레터 구독 이메일로 여는 세션이다. 쿠키에는 이메일과 만료 시각만 담고
 * HMAC 서명을 붙여 위조를 막는다. 구독 상태 자체는 쿠키에 담지 않는다.
 *
 * 구독을 해지한 사람이 쿠키를 그대로 들고 있어도 막혀야 하므로, 실습을 열 때마다
 * Neon 원장에서 상태를 다시 확인한다. 쿠키는 "이 사람이 이 이메일의 주인이다"까지만 증명한다.
 *
 * 관련 문서: docs/newsletter-plan.md 5절, docs/ga4-edu-design.md 1절
 */

export const GA4_EDU_COOKIE = "ga4edu_session";

/** 세션 유지 기간. 설계 문서가 정한 30일 */
export const SESSION_MAX_AGE_SEC = 60 * 60 * 24 * 30;

interface SessionPayload {
  /** 정규화된 이메일 (소문자, 공백 제거) */
  email: string;
  /** 만료 시각. Unix seconds */
  exp: number;
}

/**
 * 서명 키. 배포 환경에는 GA4_EDU_SESSION_SECRET을 반드시 넣는다.
 * 없으면 로컬 개발용 고정 키로 떨어지고, 그 사실을 서버 로그에 남긴다.
 */
function getSecret(): string {
  const secret = process.env.GA4_EDU_SESSION_SECRET;
  if (secret && secret.length >= 16) return secret;
  if (process.env.NODE_ENV === "production") {
    console.error("ga4-edu/session: GA4_EDU_SESSION_SECRET 누락. 세션을 발급하지 않는다");
    return "";
  }
  return "local-development-only-secret-key";
}

function base64UrlEncode(bytes: Uint8Array): string {
  let binary = "";
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(text: string): Uint8Array {
  const padded = text.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded + "=".repeat((4 - (padded.length % 4)) % 4));
  return Uint8Array.from(binary, (c) => c.charCodeAt(0));
}

async function hmac(message: string, secret: string): Promise<Uint8Array> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(message));
  return new Uint8Array(sig);
}

/** 길이가 같은 두 문자열을 시간 차이 없이 비교한다 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

export function normalizeEmail(raw: unknown): string {
  return typeof raw === "string" ? raw.trim().toLowerCase() : "";
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 세션 쿠키 값을 만든다. 형식은 `payload.signature` */
export async function createSessionToken(email: string): Promise<string> {
  const secret = getSecret();
  if (!secret) throw new Error("세션 서명 키가 없습니다");

  const payload: SessionPayload = {
    email,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SEC,
  };
  const body = base64UrlEncode(new TextEncoder().encode(JSON.stringify(payload)));
  const signature = base64UrlEncode(await hmac(body, secret));
  return `${body}.${signature}`;
}

/**
 * 쿠키 값을 검증한다. 서명이 맞고 만료 전이면 이메일을 돌려준다.
 * 구독 상태는 여기서 보지 않는다. 호출한 쪽이 Neon에서 다시 확인한다.
 */
export async function readSessionToken(token: string | undefined): Promise<string | null> {
  if (!token) return null;
  const secret = getSecret();
  if (!secret) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  let expected: string;
  try {
    expected = base64UrlEncode(await hmac(body, secret));
  } catch {
    return null;
  }
  if (!timingSafeEqual(signature, expected)) return null;

  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(body))) as SessionPayload;
    if (typeof payload.email !== "string" || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload.email;
  } catch {
    return null;
  }
}
