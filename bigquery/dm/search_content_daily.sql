-- analytics_dm.search_content_daily : Search Console 검색 성과 + GA4 온사이트 행동 (콘텐츠 단위 일별)
-- GSC는 사후 보정이 들어가므로 예약 쿼리는 최근 구간을 롤링으로 다시 만든다.
-- 파라미터: @start_date, @end_date
WITH gsc_raw AS (
  SELECT
    data_date AS date,
    IFNULL(NULLIF(REGEXP_REPLACE(REGEXP_EXTRACT(url, r'^https?://[^/]+([^?#]*)'), r'/+$', ''), ''), '/') AS page_path,
    search_type, device, country, query, is_anonymized_query,
    impressions, clicks, sum_position
  FROM `hong-project2511.searchconsole.searchdata_url_impression`
  WHERE data_date BETWEEN @start_date AND @end_date
    AND url IS NOT NULL
),
gsc_page AS (
  SELECT
    date, page_path,
    SUM(IF(search_type = 'WEB', impressions, 0)) AS web_impressions,
    SUM(IF(search_type = 'WEB', clicks, 0)) AS web_clicks,
    SAFE_DIVIDE(SUM(IF(search_type = 'WEB', sum_position, 0)), NULLIF(SUM(IF(search_type = 'WEB', impressions, 0)), 0)) + 1 AS web_avg_position,
    SUM(IF(search_type = 'IMAGE', impressions, 0)) AS image_impressions,
    SUM(IF(search_type = 'IMAGE', clicks, 0)) AS image_clicks,
    SUM(IF(search_type = 'DISCOVER', impressions, 0)) AS discover_impressions,
    SUM(IF(search_type = 'DISCOVER', clicks, 0)) AS discover_clicks,
    SUM(impressions) AS total_impressions,
    SUM(clicks) AS total_clicks,
    SUM(IF(is_anonymized_query, impressions, 0)) AS anonymized_impressions
  FROM gsc_raw
  GROUP BY 1, 2
),
gsc_device AS (
  SELECT date, page_path,
    ARRAY_AGG(STRUCT(device, impressions, clicks) ORDER BY impressions DESC) AS by_device
  FROM (
    SELECT date, page_path, device, SUM(impressions) AS impressions, SUM(clicks) AS clicks
    FROM gsc_raw WHERE search_type = 'WEB' GROUP BY 1, 2, 3
  )
  GROUP BY 1, 2
),
gsc_query AS (
  SELECT date, page_path,
    ARRAY_AGG(STRUCT(query, impressions, clicks, avg_position) ORDER BY impressions DESC LIMIT 10) AS top_queries
  FROM (
    SELECT date, page_path, query,
      SUM(impressions) AS impressions, SUM(clicks) AS clicks,
      ROUND(SAFE_DIVIDE(SUM(sum_position), NULLIF(SUM(impressions), 0)) + 1, 2) AS avg_position
    FROM gsc_raw
    WHERE search_type = 'WEB' AND NOT is_anonymized_query AND query IS NOT NULL
    GROUP BY 1, 2, 3
  )
  GROUP BY 1, 2
),
ga AS (
  SELECT
    date, page_path, content_type, content_slug, course_slug, content_name, page_title,
    page_views, users, sessions, entrances, new_user_entrances, engaged_entrances,
    engagement_time_sec, avg_engagement_sec_per_session,
    scroll_25, scroll_90, deep_read_rate,
    newsletter_clicks, shares, related_insight_clicks + related_class_clicks AS related_clicks,
    (SELECT IFNULL(SUM(c.entrances), 0) FROM UNNEST(entrances_by_channel) c WHERE c.channel_group = '구글 자연검색') AS google_organic_entrances,
    (SELECT IFNULL(SUM(c.entrances), 0) FROM UNNEST(entrances_by_channel) c WHERE c.channel_group = 'AI 어시스턴트') AS ai_assistant_entrances,
    (SELECT IFNULL(SUM(c.entrances), 0) FROM UNNEST(entrances_by_channel) c WHERE c.channel_group = '네이버 자연검색') AS naver_organic_entrances
  FROM `hong-project2511.analytics_dm.content_daily`
  WHERE date BETWEEN @start_date AND @end_date
)
SELECT
  COALESCE(g.date, a.date) AS date,
  COALESCE(a.content_type, CASE
    WHEN COALESCE(g.page_path, a.page_path) = '/' THEN 'home'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/insights/[^/]+$') THEN 'insight'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/class/[^/]+/[^/]+$') THEN 'class'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/class/[^/]+$') THEN 'course'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/ai-practice/[^/]+$') THEN 'ai_practice'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/ga4-edu/[^/]+$') THEN 'ga4_edu'
    WHEN REGEXP_CONTAINS(COALESCE(g.page_path, a.page_path), r'^/tags/[^/]+$') THEN 'tag'
    ELSE 'other' END) AS content_type,
  COALESCE(a.content_slug,
    REGEXP_EXTRACT(COALESCE(g.page_path, a.page_path), r'^/insights/([^/]+)$'),
    REGEXP_EXTRACT(COALESCE(g.page_path, a.page_path), r'^/class/[^/]+/([^/]+)$'),
    REGEXP_EXTRACT(COALESCE(g.page_path, a.page_path), r'^/ai-practice/([^/]+)$'),
    REGEXP_EXTRACT(COALESCE(g.page_path, a.page_path), r'^/ga4-edu/([^/]+)$')) AS content_slug,
  a.course_slug,
  COALESCE(g.page_path, a.page_path) AS page_path,
  a.content_name,
  a.page_title,

  -- Search Console
  IFNULL(g.web_impressions, 0) AS web_impressions,
  IFNULL(g.web_clicks, 0) AS web_clicks,
  ROUND(SAFE_DIVIDE(g.web_clicks, NULLIF(g.web_impressions, 0)), 4) AS web_ctr,
  ROUND(g.web_avg_position, 2) AS web_avg_position,
  IFNULL(g.image_impressions, 0) AS image_impressions,
  IFNULL(g.image_clicks, 0) AS image_clicks,
  IFNULL(g.discover_impressions, 0) AS discover_impressions,
  IFNULL(g.discover_clicks, 0) AS discover_clicks,
  IFNULL(g.total_impressions, 0) AS total_impressions,
  IFNULL(g.total_clicks, 0) AS total_clicks,
  ROUND(SAFE_DIVIDE(g.anonymized_impressions, NULLIF(g.total_impressions, 0)), 4) AS anonymized_impression_rate,
  IFNULL(q.top_queries, []) AS top_queries,
  IFNULL(d.by_device, []) AS impressions_by_device,

  -- GA4
  IFNULL(a.page_views, 0) AS page_views,
  IFNULL(a.users, 0) AS users,
  IFNULL(a.sessions, 0) AS sessions,
  IFNULL(a.entrances, 0) AS entrances,
  IFNULL(a.new_user_entrances, 0) AS new_user_entrances,
  IFNULL(a.engaged_entrances, 0) AS engaged_entrances,
  IFNULL(a.google_organic_entrances, 0) AS google_organic_entrances,
  IFNULL(a.naver_organic_entrances, 0) AS naver_organic_entrances,
  IFNULL(a.ai_assistant_entrances, 0) AS ai_assistant_entrances,
  a.engagement_time_sec,
  a.avg_engagement_sec_per_session,
  a.scroll_25, a.scroll_90, a.deep_read_rate,
  a.newsletter_clicks, a.shares, a.related_clicks,

  -- 정합 지표: GSC 클릭 대비 GA4 구글 자연검색 유입
  ROUND(SAFE_DIVIDE(a.google_organic_entrances, NULLIF(g.web_clicks, 0)), 4) AS ga_entrance_per_gsc_click,
  -- 노출 대비 실제 읽힘: 노출 1,000회당 90% 스크롤
  ROUND(SAFE_DIVIDE(a.scroll_90 * 1000, NULLIF(g.total_impressions, 0)), 2) AS deep_reads_per_1k_impressions
FROM gsc_page g
FULL OUTER JOIN ga a ON g.date = a.date AND g.page_path = a.page_path
LEFT JOIN gsc_query q ON q.date = g.date AND q.page_path = g.page_path
LEFT JOIN gsc_device d ON d.date = g.date AND d.page_path = g.page_path
