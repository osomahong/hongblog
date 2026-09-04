-- analytics_dm.content_daily : 콘텐츠(페이지) 단위 일별 성과
-- 파라미터: @start_date, @end_date
WITH ev AS (
  SELECT * FROM `hong-project2511.analytics_dm.events`
  WHERE date BETWEEN @start_date AND @end_date AND page_path IS NOT NULL
    AND NOT is_local_traffic
),
page AS (
  SELECT
    date,
    page_path,
    ANY_VALUE(content_type) AS content_type,
    ANY_VALUE(content_slug) AS content_slug,
    ANY_VALUE(page_course_slug) AS course_slug,
    ARRAY_AGG(params.content_name IGNORE NULLS ORDER BY event_timestamp DESC LIMIT 1)[SAFE_OFFSET(0)] AS content_name,
    ARRAY_AGG(page_title IGNORE NULLS ORDER BY event_timestamp DESC LIMIT 1)[SAFE_OFFSET(0)] AS page_title,

    COUNTIF(event_name = 'page_view') AS page_views,
    COUNTIF(event_name IN ('view_insights','view_class','view_ai_practice','view_about','view_tag')) AS content_views,
    COUNT(DISTINCT user_pseudo_id) AS users,
    COUNT(DISTINCT CONCAT(user_pseudo_id, '-', CAST(session_id AS STRING))) AS sessions,

    ROUND(SUM(params.engagement_time_msec) / 1000, 1) AS engagement_time_sec,

    COUNTIF(event_name = 'scroll' AND params.scroll_depth = 25) AS scroll_25,
    COUNTIF(event_name = 'scroll' AND params.scroll_depth = 50) AS scroll_50,
    COUNTIF(event_name = 'scroll' AND params.scroll_depth = 75) AS scroll_75,
    COUNTIF(event_name = 'scroll' AND params.scroll_depth = 90) AS scroll_90,

    COUNTIF(event_name = 'quiz_answer') AS quiz_answers,
    COUNTIF(event_name = 'quiz_answer' AND params.is_correct = 'true') AS quiz_correct,
    COUNTIF(event_name = 'quiz_retry') AS quiz_retries,
    COUNTIF(event_name = 'share') AS shares,
    COUNTIF(event_name = 'click_newsletter') AS newsletter_clicks,
    COUNTIF(event_name = 'related_insights') AS related_insight_clicks,
    COUNTIF(event_name = 'related_classes') AS related_class_clicks,
    COUNTIF(event_name IN ('click_expand','click_expand_btn')) AS expand_clicks,
    COUNTIF(event_name = 'click_curriculum') AS curriculum_clicks,
    COUNTIF(event_name = 'click_aipractice_start') AS aipractice_start_clicks,
    COUNTIF(event_name = 'aipbl_start') AS aipbl_start,
    COUNTIF(event_name = 'aipbl_mission_complete') AS aipbl_mission_complete,
    COUNTIF(event_name = 'aipbl_complete') AS aipbl_complete,
    COUNT(*) AS all_events
  FROM ev
  GROUP BY date, page_path
),
entrance_base AS (
  SELECT
    date,
    landing_page_path AS page_path,
    traffic.channel_group AS channel_group,
    COUNT(*) AS entrances,
    COUNTIF(is_first_visit) AS new_user_entrances,
    COUNTIF(is_engaged_session) AS engaged_entrances
  FROM `hong-project2511.analytics_dm.sessions`
  WHERE date BETWEEN @start_date AND @end_date AND landing_page_path IS NOT NULL
    AND NOT is_local_traffic
  GROUP BY 1, 2, 3
),
entrance AS (
  SELECT
    date,
    page_path,
    SUM(entrances) AS entrances,
    SUM(new_user_entrances) AS new_user_entrances,
    SUM(engaged_entrances) AS engaged_entrances,
    ARRAY_AGG(STRUCT(channel_group, entrances) ORDER BY entrances DESC) AS entrances_by_channel
  FROM entrance_base
  GROUP BY 1, 2
)
SELECT
  p.date,
  p.content_type,
  p.content_slug,
  p.course_slug,
  p.page_path,
  p.content_name,
  p.page_title,
  p.page_views,
  p.content_views,
  p.users,
  p.sessions,
  IFNULL(e.entrances, 0) AS entrances,
  IFNULL(e.new_user_entrances, 0) AS new_user_entrances,
  IFNULL(e.engaged_entrances, 0) AS engaged_entrances,
  IFNULL(e.entrances_by_channel, []) AS entrances_by_channel,
  p.engagement_time_sec,
  ROUND(SAFE_DIVIDE(p.engagement_time_sec, p.sessions), 1) AS avg_engagement_sec_per_session,
  p.scroll_25, p.scroll_50, p.scroll_75, p.scroll_90,
  ROUND(SAFE_DIVIDE(p.scroll_90, NULLIF(p.scroll_25, 0)), 4) AS deep_read_rate,
  p.quiz_answers, p.quiz_correct, p.quiz_retries,
  ROUND(SAFE_DIVIDE(p.quiz_correct, NULLIF(p.quiz_answers, 0)), 4) AS quiz_accuracy,
  p.shares,
  p.newsletter_clicks,
  p.related_insight_clicks,
  p.related_class_clicks,
  p.expand_clicks,
  p.curriculum_clicks,
  p.aipractice_start_clicks,
  p.aipbl_start, p.aipbl_mission_complete, p.aipbl_complete,
  p.all_events
FROM page p
LEFT JOIN entrance e USING (date, page_path)
