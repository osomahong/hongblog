// 일회성: 뉴스레터 구독자 원장 테이블 생성 (추가 전용, 기존 테이블 무변경)
import { neon } from "@neondatabase/serverless";

const sql = neon(process.env.DATABASE_URL!);

const run = async () => {
  await sql`
    CREATE TABLE IF NOT EXISTS newsletter_subscribers (
      id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      status TEXT NOT NULL DEFAULT 'pending',
      signup_source TEXT,
      goal TEXT,
      industry TEXT,
      job_role TEXT,
      years TEXT,
      consent_version TEXT NOT NULL,
      consented_at TIMESTAMPTZ NOT NULL,
      stibee_synced_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  const cols = await sql`
    SELECT column_name, data_type FROM information_schema.columns
    WHERE table_name = 'newsletter_subscribers' ORDER BY ordinal_position
  `;
  console.log("newsletter_subscribers 컬럼:");
  for (const c of cols) console.log(" -", c.column_name, `(${c.data_type})`);
};

run().then(() => process.exit(0)).catch((e) => { console.error(e); process.exit(1); });
