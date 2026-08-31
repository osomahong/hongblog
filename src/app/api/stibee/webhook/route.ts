import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import { EMAIL_RE, normalizeEmail } from "@/lib/ga4-edu/session";

/**
 * 스티비 주소록 웹훅 수신.
 *
 * 구독과 수신거부가 스티비에서 일어나면 이 라우트가 Neon 원장의 status를 맞춘다.
 * GA4 Edu 게이트는 실습을 열 때마다 그 status를 다시 읽으므로, 해지가 여기 반영되는 순간
 * 그 사람의 실습 화면도 함께 닫힌다.
 *
 * 등록 위치: 스티비 주소록 > 웹훅
 * 요청 형식: POST JSON { id, action, eventOccurredBy, subscribers: [{ email, ... }] }
 * 이벤트: SUBSCRIBED, UPDATED, UNSUBSCRIBED, RESUBSCRIBED, DELETED, PURGED
 *
 * 스티비는 서명 헤더를 보내지 않는다. 그래서 URL 쿼리의 공유 비밀로 확인한다.
 * STIBEE_WEBHOOK_SECRET을 설정해 두고 웹훅 주소를 `...?key=값` 형태로 등록한다.
 */

type StibeeAction =
  | "SUBSCRIBED"
  | "UPDATED"
  | "UNSUBSCRIBED"
  | "RESUBSCRIBED"
  | "DELETED"
  | "PURGED";

/** 스티비 이벤트를 우리 원장의 status로 옮긴다 */
const STATUS_BY_ACTION: Record<StibeeAction, string | null> = {
  SUBSCRIBED: "subscribed",
  RESUBSCRIBED: "subscribed",
  UNSUBSCRIBED: "unsubscribed",
  DELETED: "deleted",
  PURGED: "deleted",
  // 정보 변경은 상태를 바꾸지 않는다. 이메일이 바뀐 경우만 아래에서 따로 처리한다
  UPDATED: null,
};

export async function POST(request: Request) {
  const secret = process.env.STIBEE_WEBHOOK_SECRET;
  if (secret) {
    const key = new URL(request.url).searchParams.get("key");
    if (key !== secret) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }
  } else if (process.env.NODE_ENV === "production") {
    // 비밀이 없으면 아무나 상태를 바꿀 수 있다. 처리는 하되 기록을 남긴다
    console.warn("stibee/webhook: STIBEE_WEBHOOK_SECRET 미설정 상태로 수신");
  }

  let body: {
    action?: string;
    subscribers?: Record<string, unknown>[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "잘못된 형식" }, { status: 400 });
  }

  const action = body.action as StibeeAction | undefined;
  if (!action || !(action in STATUS_BY_ACTION)) {
    // 모르는 이벤트는 조용히 받아 넘긴다. 200을 돌려주지 않으면 스티비가 재시도한다
    return NextResponse.json({ ok: true, skipped: true });
  }

  const rows = Array.isArray(body.subscribers) ? body.subscribers : [];
  if (rows.length === 0) return NextResponse.json({ ok: true, updated: 0 });

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("stibee/webhook: DATABASE_URL 누락");
    return NextResponse.json({ ok: false }, { status: 500 });
  }
  const sql = neon(databaseUrl);

  let updated = 0;
  for (const row of rows) {
    const email = normalizeEmail(row.email);
    if (!EMAIL_RE.test(email)) continue;

    try {
      if (action === "UPDATED") {
        const oldEmail = normalizeEmail(row.old_email);
        if (oldEmail && oldEmail !== email && EMAIL_RE.test(oldEmail)) {
          await sql`
            UPDATE newsletter_subscribers
            SET email = ${email}, updated_at = now()
            WHERE email = ${oldEmail}
          `;
          updated += 1;
        }
        continue;
      }

      const status = STATUS_BY_ACTION[action];
      if (!status) continue;

      // 스티비에만 있고 우리 원장에 없는 주소도 들어올 수 있어서 upsert로 받는다.
      // consent_version과 consented_at은 NOT NULL이라 값을 반드시 채운다. 비워 두면
      // 새 주소는 물론이고 이미 있는 주소의 갱신까지 제약 위반으로 막힌다.
      await sql`
        INSERT INTO newsletter_subscribers
          (email, status, signup_source, consent_version, consented_at)
        VALUES (${email}, ${status}, 'stibee-webhook', 'stibee-webhook', now())
        ON CONFLICT (email) DO UPDATE SET
          status = EXCLUDED.status,
          stibee_synced_at = now(),
          updated_at = now()
      `;
      updated += 1;
    } catch (error) {
      console.error("stibee/webhook: 반영 실패", action, error);
    }
  }

  return NextResponse.json({ ok: true, action, updated });
}
