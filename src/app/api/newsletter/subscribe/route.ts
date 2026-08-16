import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  CONSENT_VERSION,
  ETC_MAX_LENGTH,
  ETC_VALUE,
  INDUSTRY_OPTIONS,
  JOB_ROLE_OPTIONS,
  SIGNUP_SOURCES,
  YEARS_OPTIONS,
} from "@/lib/newsletter/options";

// 뉴스레터 가입 API.
// 1) Neon 원장에 저장 (동의 시각, 문구 버전 포함. 원본은 항상 우리 쪽)
// 2) 스티비 구독자 API로 추가 (SUBSCRIBER + confirmEmailYN=Y: 더블 옵트인)
// 스티비가 확인 메일을 보내고, 구독자가 메일의 버튼을 누르면 구독이 완료된다.
// 확인 완료는 이후 웹훅(/api/stibee/webhook)이 Neon에 반영한다.

const STIBEE_LIST_ID = 508786;
const STIBEE_API_BASE = "https://api.stibee.com/v1";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** 드롭다운 값 검증. 기타는 `etc:직접입력` 형태를 허용하고 길이를 자른다. */
function normalizeChoice(
  raw: unknown,
  options: { value: string }[],
  allowEtc: boolean
): string | null {
  if (typeof raw !== "string" || raw === "") return null;
  if (options.some((o) => o.value === raw && raw !== ETC_VALUE)) return raw;
  if (allowEtc && raw.startsWith(`${ETC_VALUE}:`)) {
    const text = raw
      .slice(ETC_VALUE.length + 1)
      .trim()
      .slice(0, ETC_MAX_LENGTH);
    return text ? `${ETC_VALUE}:${text}` : null;
  }
  return null;
}

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, message: "요청 형식이 잘못됐습니다." }, { status: 400 });
  }

  // 봇이 채우는 숨은 필드. 값이 있으면 조용히 성공으로 응답하고 버린다.
  if (typeof body.website === "string" && body.website !== "") {
    return NextResponse.json({ ok: true, message: "확인 메일을 보냈습니다." });
  }

  const email =
    typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json(
      { ok: false, message: "이메일 주소를 확인해 주세요." },
      { status: 400 }
    );
  }

  if (body.consent !== true) {
    return NextResponse.json(
      { ok: false, message: "수신 동의에 체크해 주세요." },
      { status: 400 }
    );
  }

  const industry = normalizeChoice(body.industry, INDUSTRY_OPTIONS, true);
  const jobRole = normalizeChoice(body.jobRole, JOB_ROLE_OPTIONS, true);
  const years = normalizeChoice(body.years, YEARS_OPTIONS, false);
  const signupSource = SIGNUP_SOURCES.includes(body.signupSource as never)
    ? (body.signupSource as string)
    : "unknown";

  const databaseUrl = process.env.DATABASE_URL;
  const stibeeKey = process.env.STIBEE_API_KEY;
  if (!databaseUrl || !stibeeKey) {
    console.error("newsletter/subscribe: 환경변수 누락", {
      hasDb: Boolean(databaseUrl),
      hasStibee: Boolean(stibeeKey),
    });
    return NextResponse.json(
      { ok: false, message: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  // 1) Neon 원장. 재가입이면 동의 기록과 선택 항목을 갱신한다.
  try {
    const sql = neon(databaseUrl);
    await sql`
      INSERT INTO newsletter_subscribers
        (email, status, signup_source, industry, job_role, years, consent_version, consented_at)
      VALUES
        (${email}, 'pending', ${signupSource}, ${industry}, ${jobRole}, ${years}, ${CONSENT_VERSION}, now())
      ON CONFLICT (email) DO UPDATE SET
        signup_source = EXCLUDED.signup_source,
        industry = COALESCE(EXCLUDED.industry, newsletter_subscribers.industry),
        job_role = COALESCE(EXCLUDED.job_role, newsletter_subscribers.job_role),
        years = COALESCE(EXCLUDED.years, newsletter_subscribers.years),
        consent_version = EXCLUDED.consent_version,
        consented_at = EXCLUDED.consented_at,
        status = CASE WHEN newsletter_subscribers.status = 'subscribed'
                      THEN 'subscribed' ELSE 'pending' END,
        updated_at = now()
    `;
  } catch (error) {
    console.error("newsletter/subscribe: Neon 저장 실패", error);
    return NextResponse.json(
      { ok: false, message: "일시적인 오류입니다. 잠시 후 다시 시도해 주세요." },
      { status: 500 }
    );
  }

  // 2) 스티비 추가. 더블 옵트인이라 확인 메일이 나간다.
  //    이미 구독 중인 주소는 update로 멱등 처리된다 (2026-08-17 실측).
  try {
    const res = await fetch(`${STIBEE_API_BASE}/lists/${STIBEE_LIST_ID}/subscribers`, {
      method: "POST",
      headers: {
        AccessToken: stibeeKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        eventOccuredBy: "SUBSCRIBER",
        confirmEmailYN: "Y",
        subscribers: [
          {
            email,
            signup_source: signupSource,
            ...(industry ? { industry } : {}),
            ...(jobRole ? { job_role: jobRole } : {}),
            ...(years ? { years } : {}),
          },
        ],
      }),
    });
    const data = (await res.json()) as { Ok?: boolean };
    if (!res.ok || data.Ok !== true) {
      console.error("newsletter/subscribe: 스티비 응답 이상", res.status, data);
    }
  } catch (error) {
    // Neon에는 저장됐으므로 구독 자체는 유실되지 않는다. 동기화만 뒤로 밀린다.
    console.error("newsletter/subscribe: 스티비 호출 실패", error);
  }

  return NextResponse.json({
    ok: true,
    message: "확인 메일을 보냈습니다. 메일함에서 구독을 완료해 주세요.",
  });
}
