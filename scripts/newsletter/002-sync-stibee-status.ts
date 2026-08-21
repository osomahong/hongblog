// 스티비 주소록의 구독 상태를 Neon 원장에 맞춘다.
//
// 웹훅(/api/stibee/webhook)을 붙이기 전에 스티비에서 구독을 마친 사람들은
// 원장에 pending으로 남아 있다. GA4 Edu 게이트는 subscribed만 열어 주므로
// 이 사람들이 실습을 못 연다. 웹훅을 등록하는 시점에 한 번 돌려 상태를 맞춘다.
//
// 기본은 미리보기다. 실제로 쓰려면 --apply를 붙인다.
//
//   npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts
//   npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts --apply
//
// API 키가 없으면 스티비에서 내려받은 구독자 CSV로도 맞출 수 있다.
//
//   npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts --csv "경로.csv"
//
// 필요한 환경변수: DATABASE_URL, 그리고 CSV를 쓰지 않을 때만 STIBEE_API_KEY

import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";

const LIST_ID = 508786;
const API_BASE = "https://api.stibee.com/v2";
const PAGE_SIZE = 100;

/** 스티비 상태를 원장 status로 옮긴다. ready는 확인 메일을 아직 안 누른 상태다 */
const STATUS_MAP: Record<string, string> = {
  subscribed: "subscribed",
  ready: "pending",
  unsubscribed: "unsubscribed",
  deleted: "deleted",
};

/** 스티비 화면에서 내려받은 CSV의 한국어 상태값 */
const CSV_STATUS_MAP: Record<string, string> = {
  "구독 중": "subscribed",
  "대기 중": "pending",
  "수신거부": "unsubscribed",
  "자동 삭제": "deleted",
  "완전 삭제": "deleted",
  "삭제됨": "deleted",
};

/** 큰따옴표로 감싼 칸까지 다루는 최소한의 CSV 파서 */
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let quoted = false;
  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') { cell += '"'; i += 1; }
      else if (ch === '"') quoted = false;
      else cell += ch;
      continue;
    }
    if (ch === '"') quoted = true;
    else if (ch === ",") { row.push(cell); cell = ""; }
    else if (ch === "\n") { row.push(cell); rows.push(row); row = []; cell = ""; }
    else if (ch !== "\r") cell += ch;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows.filter((r) => r.some((c) => c.trim() !== ""));
}

/** CSV에서 이메일과 상태를 읽는다. 모르는 상태값은 건너뛰고 이름을 돌려준다 */
function readCsv(path: string): { rows: { email: string; status: string }[]; unknown: Set<string> } {
  const text = readFileSync(path, "utf-8").replace(/^\uFEFF/, "");
  const parsed = parseCsv(text);
  const header = parsed[0].map((h) => h.trim());
  const emailAt = header.findIndex((h) => h.includes("이메일 주소"));
  const statusAt = header.findIndex((h) => h.includes("수신 상태"));
  if (emailAt < 0 || statusAt < 0) throw new Error("CSV에 이메일 주소와 이메일 수신 상태 열이 필요합니다");

  const rows: { email: string; status: string }[] = [];
  const unknown = new Set<string>();
  for (const line of parsed.slice(1)) {
    const email = (line[emailAt] ?? "").trim().toLowerCase();
    const label = (line[statusAt] ?? "").trim();
    const status = CSV_STATUS_MAP[label];
    if (!email) continue;
    if (!status) { unknown.add(label); continue; }
    rows.push({ email, status });
  }
  return { rows, unknown };
}

interface StibeeSubscriber {
  email?: string;
  status?: string;
}

async function fetchPage(key: string, offset: number): Promise<StibeeSubscriber[]> {
  const url = `${API_BASE}/lists/${LIST_ID}/subscribers?offset=${offset}&limit=${PAGE_SIZE}`;
  const res = await fetch(url, { headers: { AccessToken: key } });
  if (!res.ok) throw new Error(`스티비 목록 조회 실패 ${res.status}`);
  const data = (await res.json()) as {
    Value?: { items?: StibeeSubscriber[]; subscribers?: StibeeSubscriber[] };
    value?: { items?: StibeeSubscriber[]; subscribers?: StibeeSubscriber[] };
    items?: StibeeSubscriber[];
  };
  const box = data.Value ?? data.value ?? data;
  const rows = (box as { items?: StibeeSubscriber[]; subscribers?: StibeeSubscriber[] });
  return rows.items ?? rows.subscribers ?? [];
}

const run = async () => {
  const apply = process.argv.includes("--apply");
  const csvAt = process.argv.indexOf("--csv");
  const csvPath = csvAt >= 0 ? process.argv[csvAt + 1] : null;
  const key = process.env.STIBEE_API_KEY;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error("DATABASE_URL이 필요합니다.");
    process.exit(1);
  }
  if (!csvPath && !key) {
    console.error("STIBEE_API_KEY가 없으면 --csv로 내려받은 구독자 파일을 넘겨야 합니다.");
    process.exit(1);
  }

  // 1) 스티비 쪽 구독자 목록을 읽는다. CSV를 넘기면 그 파일을, 아니면 API를 쓴다
  const remote: { email: string; status: string }[] = [];
  if (csvPath) {
    const { rows, unknown } = readCsv(csvPath);
    remote.push(...rows);
    if (unknown.size > 0) console.log(`모르는 상태값이라 건너뛴 값: ${[...unknown].join(", ")}`);
    console.log(`CSV에서 구독자 ${remote.length}명을 읽었습니다.`);
  } else {
    for (let offset = 0; ; offset += PAGE_SIZE) {
      const page = await fetchPage(key as string, offset);
      for (const row of page) {
        const email = (row.email ?? "").trim().toLowerCase();
        const status = STATUS_MAP[(row.status ?? "").toLowerCase()];
        if (email && status) remote.push({ email, status });
      }
      if (page.length < PAGE_SIZE) break;
    }
    console.log(`스티비 구독자 ${remote.length}명을 읽었습니다.`);
  }

  // 2) 원장의 현재 상태와 견준다
  const sql = neon(databaseUrl);
  const localRows = (await sql`
    SELECT email, status FROM newsletter_subscribers
  `) as { email: string; status: string }[];
  const local = new Map(localRows.map((r) => [r.email, r.status]));

  const changes = remote.filter((r) => local.get(r.email) !== r.status);
  console.log(`원장 ${localRows.length}건 가운데 바꿀 항목 ${changes.length}건`);
  for (const c of changes) {
    const before = local.get(c.email) ?? "(없음)";
    console.log(` - ${c.email.replace(/^(.{2}).*(@.*)$/, "$1***$2")}: ${before} -> ${c.status}`);
  }

  if (!apply) {
    console.log("\n미리보기입니다. 실제로 반영하려면 --apply를 붙여 다시 실행하세요.");
    return;
  }

  // 3) 반영. 원장에 없는 주소는 새로 넣는다
  for (const c of changes) {
    await sql`
      INSERT INTO newsletter_subscribers (email, status, signup_source, consent_version, consented_at)
      VALUES (${c.email}, ${c.status}, 'stibee-sync', 'stibee-import', now())
      ON CONFLICT (email) DO UPDATE SET
        status = EXCLUDED.status,
        stibee_synced_at = now(),
        updated_at = now()
    `;
  }
  console.log(`반영 완료: ${changes.length}건`);
};

run()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
