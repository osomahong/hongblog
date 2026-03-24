/**
 * GA4 Data API 타입 정의
 */

export interface DateRange {
  startDate: string; // "YYYY-MM-DD" or "NdaysAgo"
  endDate: string;   // "YYYY-MM-DD" or "today"
}

export interface GA4ReportConfig {
  dimensions: string[];
  metrics: string[];
  dateRange: DateRange;
  limit?: number;
  dimensionFilter?: {
    fieldName: string;
    stringFilter: { matchType: "EXACT" | "CONTAINS"; value: string };
  };
  orderBys?: Array<{
    metric?: { metricName: string };
    dimension?: { dimensionName: string };
    desc?: boolean;
  }>;
}

export interface GA4Row {
  dimensions: Record<string, string>;
  metrics: Record<string, string>;
}

export interface GA4ReportResponse {
  rows: GA4Row[];
  rowCount: number;
  metadata: {
    dateRange: DateRange;
    dimensions: string[];
    metrics: string[];
  };
}

export interface PageReport {
  pagePath: string;
  pageTitle: string;
  sessions: number;
  screenPageViews: number;
  averageSessionDuration: number;
  engagementRate: number;
}

export interface TrafficSourceReport {
  sessionDefaultChannelGroup: string;
  sessions: number;
  newUsers: number;
  engagementRate: number;
}

export interface ContentPerformanceReport {
  slug: string;
  contentType: string;
  title: string;
  category?: string;
  ga4Sessions: number;
  ga4PageViews: number;
  ga4EngagementRate: number;
  internalViewCount: number;
}

export interface CategoryStatsReport {
  category: string;
  postCount: number;
  totalSessions: number;
  totalPageViews: number;
  avgSessionsPerPost: number;
}

export interface QuickReport {
  totalSessions: number;
  totalPageViews: number;
  totalUsers: number;
  avgEngagementRate: number;
  avgSessionDuration: number;
  topPages: PageReport[];
  trafficSources: TrafficSourceReport[];
  dateRange: DateRange;
}
