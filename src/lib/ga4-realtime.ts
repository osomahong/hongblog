/**
 * GA4 Data API 실시간 조회 (서버 전용).
 *
 * 서비스 계정 키를 쓰므로 이 모듈은 클라이언트 번들에 들어가면 안 된다.
 * Route Handler(src/app/api/ga4/realtime/route.ts)에서만 import한다.
 *
 * 실시간 API는 일반 리포트와 지원 항목이 다르다. 이 속성에서 확인한 사용 가능 항목은
 *   dimension: minutesAgo, country, city, deviceCategory, platform, unifiedScreenName,
 *              eventName, audienceName, streamName
 *   metric:    activeUsers, screenPageViews, eventCount, keyEvents, conversions
 * firstUserSource와 totalUsers는 실시간에서 지원하지 않는다.
 */
import crypto from "node:crypto";
import {
  REALTIME_WINDOW_MINUTES,
  type DimensionRow,
  type RealtimeCard,
  type RealtimeSnapshot,
} from "@/lib/ga4-types";

const TOKEN_ENDPOINT = "https://oauth2.googleapis.com/token";
const DATA_API_BASE = "https://analyticsdata.googleapis.com/v1beta";
const SCOPE = "https://www.googleapis.com/auth/analytics.readonly";
/**
 * 카드 하나에 실어 보내는 최대 행 수.
 * 화면에는 6줄씩 보여주고 나머지는 카드 안에서 넘겨 본다.
 */
const MAX_ROWS_PER_CARD = 30;

interface ServiceAccountKey {
  client_email: string;
  private_key: string;
}

interface Ga4Row {
  dimensionValues?: { value: string }[];
  metricValues?: { value: string }[];
}

interface Ga4RealtimeResponse {
  rows?: Ga4Row[];
  rowCount?: number;
  error?: { message: string };
}

function b64url(input: string | Buffer): string {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function readKey(): ServiceAccountKey {
  const raw = process.env.GA4_SERVICE_ACCOUNT_KEY;
  if (!raw) throw new Error("GA4_SERVICE_ACCOUNT_KEY가 설정되지 않았습니다");
  const parsed = JSON.parse(Buffer.from(raw, "base64").toString("utf-8")) as ServiceAccountKey;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GA4_SERVICE_ACCOUNT_KEY에 client_email 또는 private_key가 없습니다");
  }
  return parsed;
}

function readPropertyId(): string {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error("GA4_PROPERTY_ID가 설정되지 않았습니다");
  return id;
}

/** 액세스 토큰은 1시간짜리라 만료 1분 전까지 재사용한다 */
let cachedToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  if (cachedToken && cachedToken.expiresAt > now + 60) return cachedToken.token;

  const key = readKey();
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: key.client_email,
      scope: SCOPE,
      aud: TOKEN_ENDPOINT,
      exp: now + 3600,
      iat: now,
    }),
  );
  const signed = `${header}.${payload}`;
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(signed);
  const assertion = `${signed}.${b64url(signer.sign(key.private_key))}`;

  const res = await fetch(TOKEN_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
    cache: "no-store",
  });
  const json = (await res.json()) as {
    access_token?: string;
    expires_in?: number;
    error_description?: string;
  };
  if (!json.access_token) {
    throw new Error(`GA4 토큰 발급 실패: ${json.error_description ?? "unknown"}`);
  }
  cachedToken = { token: json.access_token, expiresAt: now + (json.expires_in ?? 3600) };
  return json.access_token;
}

interface RealtimeQuery {
  dimensions: string[];
  metrics: string[];
  limit?: number;
  orderByMetric?: string;
}

async function runRealtimeReport(
  token: string,
  propertyId: string,
  query: RealtimeQuery,
): Promise<Ga4RealtimeResponse> {
  const body: Record<string, unknown> = {
    dimensions: query.dimensions.map((name) => ({ name })),
    metrics: query.metrics.map((name) => ({ name })),
    limit: query.limit ?? 10,
  };
  if (query.orderByMetric) {
    body.orderBys = [{ metric: { metricName: query.orderByMetric }, desc: true }];
  }

  const res = await fetch(`${DATA_API_BASE}/properties/${propertyId}:runRealtimeReport`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });
  const json = (await res.json()) as Ga4RealtimeResponse;
  if (json.error) {
    throw new Error(`GA4 실시간 조회 실패 (${query.dimensions.join(",")}): ${json.error.message}`);
  }
  return json;
}

/** 여러 dimension 값을 카드 표에 쓸 한 줄짜리 라벨로 합친다 */
function joinLabel(values: string[]): string {
  const cleaned = values.filter((v) => v && v !== "(not set)");
  return cleaned.length > 0 ? cleaned.join(", ") : "(not set)";
}

/**
 * [dimension..., minutesAgo] 교차 응답을 라벨별 분당 배열로 편다.
 * GA4는 값이 있는 분만 돌려주므로 빠진 분은 0으로 메워야 막대 간격이 일정해진다.
 * 결과 배열의 마지막 칸이 "방금 1분"이다.
 */
function toSparklineMap(res: Ga4RealtimeResponse, dimensionCount: number): Map<string, number[]> {
  const map = new Map<string, number[]>();
  for (const row of res.rows ?? []) {
    const values = (row.dimensionValues ?? []).map((d) => d.value);
    const label = joinLabel(values.slice(0, dimensionCount));
    const minutesAgo = Number(values[dimensionCount] ?? -1);
    if (Number.isNaN(minutesAgo) || minutesAgo < 0 || minutesAgo >= REALTIME_WINDOW_MINUTES) continue;

    const series = map.get(label) ?? new Array<number>(REALTIME_WINDOW_MINUTES).fill(0);
    series[REALTIME_WINDOW_MINUTES - 1 - minutesAgo] = Number(row.metricValues?.[0]?.value ?? 0);
    map.set(label, series);
  }
  return map;
}

/** 교차 응답을 라벨별로 합산해 표를 만든다. 합산이 성립하는 지표에만 쓴다 */
function sumByLabel(res: Ga4RealtimeResponse, dimensionCount: number): DimensionRow[] {
  const totals = new Map<string, number>();
  for (const row of res.rows ?? []) {
    const label = joinLabel((row.dimensionValues ?? []).map((d) => d.value).slice(0, dimensionCount));
    totals.set(label, (totals.get(label) ?? 0) + Number(row.metricValues?.[0]?.value ?? 0));
  }
  return [...totals.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

/** minutesAgo 없는 단일 응답을 표로 만든다 */
function toRows(res: Ga4RealtimeResponse): DimensionRow[] {
  return (res.rows ?? []).map((row) => ({
    label: joinLabel((row.dimensionValues ?? []).map((d) => d.value)),
    value: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}

interface CardSpec {
  dimensions: string[];
  metric: string;
  /**
   * 지표를 분 단위로 쪼갠 뒤 다시 더해도 값이 맞는지 여부.
   * eventCount처럼 세는 지표는 true, activeUsers처럼 비중복 사용자를 세는 지표는 false다.
   * false면 표 값을 얻기 위해 분 구분 없는 조회를 한 번 더 한다.
   */
  additive: boolean;
}

/**
 * 카드 하나를 채운다.
 * 표는 정확한 값을, 스파크라인은 1위 항목의 실제 분당 추이를 쓴다.
 */
async function fetchCard(
  token: string,
  propertyId: string,
  spec: CardSpec,
): Promise<RealtimeCard> {
  const run = (query: RealtimeQuery) => runRealtimeReport(token, propertyId, query);

  const crossPromise = run({
    dimensions: [...spec.dimensions, "minutesAgo"],
    metrics: [spec.metric],
    limit: 5000,
  });
  // 비중복 지표는 분 단위 합산이 실제 값과 어긋나므로 표용 조회를 따로 던진다
  const totalsPromise = spec.additive
    ? null
    : run({
        dimensions: spec.dimensions,
        metrics: [spec.metric],
        orderByMetric: spec.metric,
        limit: 50,
      });

  const [cross, totals] = await Promise.all([crossPromise, totalsPromise]);

  const allRows = totals ? toRows(totals) : sumByLabel(cross, spec.dimensions.length);
  const rows = allRows.slice(0, MAX_ROWS_PER_CARD);
  const sparklines = toSparklineMap(cross, spec.dimensions.length);
  const topLabel = allRows[0]?.label;

  return {
    rows,
    totalRows: allRows.length,
    total: allRows.reduce((sum, row) => sum + row.value, 0),
    topSparkline:
      (topLabel ? sparklines.get(topLabel) : undefined) ??
      new Array<number>(REALTIME_WINDOW_MINUTES).fill(0),
  };
}

/**
 * 실시간 보고서 한 화면 분량을 한 번에 조회한다.
 * 카드마다 요청이 따로 나가므로 병렬로 던진다.
 */
export async function fetchRealtimeSnapshot(): Promise<RealtimeSnapshot> {
  const propertyId = readPropertyId();
  const token = await getAccessToken();
  const card = (spec: CardSpec) => fetchCard(token, propertyId, spec);

  const [overall, perMinute, devices, countries, audiences, pages, events, keyEvents] =
    await Promise.all([
      runRealtimeReport(token, propertyId, { dimensions: [], metrics: ["activeUsers"] }),
      runRealtimeReport(token, propertyId, {
        dimensions: ["minutesAgo"],
        metrics: ["activeUsers"],
        limit: 60,
      }),
      card({ dimensions: ["deviceCategory"], metric: "activeUsers", additive: false }),
      card({ dimensions: ["country", "city"], metric: "activeUsers", additive: false }),
      card({ dimensions: ["audienceName"], metric: "activeUsers", additive: false }),
      card({ dimensions: ["unifiedScreenName"], metric: "screenPageViews", additive: true }),
      card({ dimensions: ["eventName"], metric: "eventCount", additive: true }),
      card({ dimensions: ["eventName"], metric: "keyEvents", additive: true }),
    ]);

  const perMinuteBuckets = new Array<number>(REALTIME_WINDOW_MINUTES).fill(0);
  for (const row of perMinute.rows ?? []) {
    const minutesAgo = Number(row.dimensionValues?.[0]?.value ?? -1);
    if (Number.isNaN(minutesAgo) || minutesAgo < 0 || minutesAgo >= REALTIME_WINDOW_MINUTES) continue;
    perMinuteBuckets[REALTIME_WINDOW_MINUTES - 1 - minutesAgo] = Number(
      row.metricValues?.[0]?.value ?? 0,
    );
  }

  return {
    fetchedAt: new Date().toISOString(),
    activeUsers: Number(overall.rows?.[0]?.metricValues?.[0]?.value ?? 0),
    perMinute: perMinuteBuckets,
    devices,
    countries,
    audiences,
    pages,
    events,
    keyEvents,
  };
}
