/**
 * GA4 Data API 클라이언트
 *
 * 환경 변수:
 *   GA4_PROPERTY_ID - GA4 속성 ID (예: "123456789")
 *   GA4_SERVICE_ACCOUNT_KEY - 서비스 계정 JSON (base64 인코딩)
 *
 * 사용법:
 *   import { getTopPages, getTrafficSources, getQuickReport } from '@/lib/ga4';
 */
import { BetaAnalyticsDataClient } from "@google-analytics/data";
import type {
  GA4ReportConfig,
  GA4ReportResponse,
  GA4Row,
  PageReport,
  TrafficSourceReport,
  DateRange,
  QuickReport,
} from "./ga4-types";

// Lazy-initialized client
let _client: BetaAnalyticsDataClient | null = null;

function getClient(): BetaAnalyticsDataClient {
  if (!_client) {
    const keyJson = process.env.GA4_SERVICE_ACCOUNT_KEY;
    if (!keyJson) {
      throw new Error("GA4_SERVICE_ACCOUNT_KEY 환경 변수가 설정되지 않았습니다.");
    }
    const credentials = JSON.parse(Buffer.from(keyJson, "base64").toString("utf-8"));
    _client = new BetaAnalyticsDataClient({ credentials });
  }
  return _client;
}

function getPropertyId(): string {
  const id = process.env.GA4_PROPERTY_ID;
  if (!id) throw new Error("GA4_PROPERTY_ID 환경 변수가 설정되지 않았습니다.");
  return id;
}

function defaultDateRange(days: number = 30): DateRange {
  return { startDate: `${days}daysAgo`, endDate: "today" };
}

// 기본 리포트 실행
export async function runGA4Report(config: GA4ReportConfig): Promise<GA4ReportResponse> {
  const client = getClient();
  const propertyId = getPropertyId();

  const [response] = await client.runReport({
    property: `properties/${propertyId}`,
    dimensions: config.dimensions.map((d) => ({ name: d })),
    metrics: config.metrics.map((m) => ({ name: m })),
    dateRanges: [{ startDate: config.dateRange.startDate, endDate: config.dateRange.endDate }],
    limit: config.limit || 100,
    orderBys: config.orderBys?.map((ob) => ({
      metric: ob.metric ? { metricName: ob.metric.metricName } : undefined,
      dimension: ob.dimension ? { dimensionName: ob.dimension.dimensionName } : undefined,
      desc: ob.desc ?? true,
    })),
  });

  const rows: GA4Row[] = (response.rows || []).map((row) => {
    const dimensions: Record<string, string> = {};
    const metrics: Record<string, string> = {};

    (row.dimensionValues || []).forEach((val, i) => {
      dimensions[config.dimensions[i]] = val.value || "";
    });
    (row.metricValues || []).forEach((val, i) => {
      metrics[config.metrics[i]] = val.value || "0";
    });

    return { dimensions, metrics };
  });

  return {
    rows,
    rowCount: Number(response.rowCount || rows.length),
    metadata: {
      dateRange: config.dateRange,
      dimensions: config.dimensions,
      metrics: config.metrics,
    },
  };
}

// 상위 페이지 조회
export async function getTopPages(days: number = 30, limit: number = 20): Promise<PageReport[]> {
  const report = await runGA4Report({
    dimensions: ["pagePath", "pageTitle"],
    metrics: ["sessions", "screenPageViews", "averageSessionDuration", "engagementRate"],
    dateRange: defaultDateRange(days),
    limit,
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  return report.rows.map((row) => ({
    pagePath: row.dimensions.pagePath,
    pageTitle: row.dimensions.pageTitle,
    sessions: Number(row.metrics.sessions),
    screenPageViews: Number(row.metrics.screenPageViews),
    averageSessionDuration: Number(row.metrics.averageSessionDuration),
    engagementRate: Number(row.metrics.engagementRate),
  }));
}

// 트래픽 소스 조회
export async function getTrafficSources(days: number = 30): Promise<TrafficSourceReport[]> {
  const report = await runGA4Report({
    dimensions: ["sessionDefaultChannelGroup"],
    metrics: ["sessions", "newUsers", "engagementRate"],
    dateRange: defaultDateRange(days),
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });

  return report.rows.map((row) => ({
    sessionDefaultChannelGroup: row.dimensions.sessionDefaultChannelGroup,
    sessions: Number(row.metrics.sessions),
    newUsers: Number(row.metrics.newUsers),
    engagementRate: Number(row.metrics.engagementRate),
  }));
}

// 빠른 리포트 (핵심 지표 요약)
export async function getQuickReport(days: number = 30): Promise<QuickReport> {
  // 전체 지표
  const totals = await runGA4Report({
    dimensions: [],
    metrics: ["sessions", "screenPageViews", "totalUsers", "engagementRate", "averageSessionDuration"],
    dateRange: defaultDateRange(days),
  });

  const totalRow = totals.rows[0] || { dimensions: {}, metrics: {} };

  // 상위 페이지
  const topPages = await getTopPages(days, 10);

  // 트래픽 소스
  const trafficSources = await getTrafficSources(days);

  return {
    totalSessions: Number(totalRow.metrics.sessions || 0),
    totalPageViews: Number(totalRow.metrics.screenPageViews || 0),
    totalUsers: Number(totalRow.metrics.totalUsers || 0),
    avgEngagementRate: Number(totalRow.metrics.engagementRate || 0),
    avgSessionDuration: Number(totalRow.metrics.averageSessionDuration || 0),
    topPages,
    trafficSources,
    dateRange: defaultDateRange(days),
  };
}

// 콘텐츠 그룹별 성과
export async function getContentGroupPerformance(days: number = 30): Promise<GA4ReportResponse> {
  return runGA4Report({
    dimensions: ["pagePathPlusQueryString"],
    metrics: ["sessions", "screenPageViews", "engagementRate", "averageSessionDuration"],
    dateRange: defaultDateRange(days),
    limit: 200,
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
}
