-- analytics_dm.sessions : 세션 단위 집계 (원천 analytics_dm.events)
-- 파라미터: @start_date, @end_date
SELECT
  date,
  user_pseudo_id,
  MAX(user_id) AS user_id,
  session_id,
  MAX(session_number) AS session_number,

  MIN(event_timestamp) AS session_start_time,
  MAX(event_timestamp) AS session_end_time,
  ROUND((MAX(event_timestamp) - MIN(event_timestamp)) / 1000000, 1) AS session_duration_sec,
  ROUND(SUM(params.engagement_time_msec) / 1000, 1) AS engagement_time_sec,

  ARRAY_AGG(page_path IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS landing_page_path,
  ARRAY_AGG(page_title IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS landing_page_title,
  ARRAY_AGG(content_type IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS landing_content_type,
  ARRAY_AGG(content_slug IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS landing_content_slug,
  ARRAY_AGG(page_referrer IGNORE NULLS ORDER BY event_timestamp LIMIT 1)[SAFE_OFFSET(0)] AS landing_page_referrer,
  ARRAY_AGG(page_path IGNORE NULLS ORDER BY event_timestamp DESC LIMIT 1)[SAFE_OFFSET(0)] AS exit_page_path,

  COUNT(DISTINCT page_path) AS distinct_pages,
  COUNT(DISTINCT IF(content_type IN ('insight','class','course','ai_practice','ga4_edu'), content_slug, NULL)) AS distinct_contents,

  STRUCT(
    MAX(device_info.category) AS category,
    MAX(device_info.operating_system) AS operating_system,
    MAX(device_info.browser) AS browser,
    MAX(device_info.mobile_brand_name) AS mobile_brand_name,
    MAX(device_info.language) AS language
  ) AS device_info,

  STRUCT(MAX(geo.country) AS country, MAX(geo.region) AS region, MAX(geo.city) AS city) AS geo,

  STRUCT(
    MAX(traffic.source) AS source,
    MAX(traffic.medium) AS medium,
    MAX(traffic.campaign_name) AS campaign_name,
    MAX(traffic.term) AS term,
    MAX(traffic.ga_default_channel_group) AS ga_default_channel_group,
    MAX(traffic.channel_group) AS channel_group
  ) AS traffic,

  STRUCT(
    COUNTIF(event_name = 'page_view') AS page_view,
    COUNTIF(event_name = 'scroll') AS scroll,
    COUNTIF(event_name = 'view_insights') AS view_insights,
    COUNTIF(event_name = 'view_class') AS view_class,
    COUNTIF(event_name = 'view_ai_practice') AS view_ai_practice,
    COUNTIF(event_name = 'view_about') AS view_about,
    COUNTIF(event_name = 'view_tag') AS view_tag,
    COUNTIF(event_name IN ('view_insights_list','view_class_list','view_ai_practice_list','view_tags_list')) AS view_list,
    COUNTIF(event_name = 'click_nav') AS click_nav,
    COUNTIF(event_name = 'click_footer') AS click_footer,
    COUNTIF(event_name = 'click_newsletter') AS click_newsletter,
    COUNTIF(event_name = 'share') AS share,
    COUNTIF(event_name IN ('related_insights','related_classes')) AS click_related,
    COUNTIF(event_name IN ('click_main_trendingnow','click_main_latestinsights','click_main_browsebycategory')) AS click_main,
    COUNTIF(event_name = 'quiz_answer') AS quiz_answer,
    COUNTIF(event_name = 'quiz_answer' AND params.is_correct = 'true') AS quiz_correct,
    COUNTIF(event_name = 'quiz_retry') AS quiz_retry,
    COUNTIF(event_name = 'aipbl_start') AS aipbl_start,
    COUNTIF(event_name = 'aipbl_mission_complete') AS aipbl_mission_complete,
    COUNTIF(event_name = 'aipbl_complete') AS aipbl_complete,
    COUNTIF(event_name = 'click_aipractice_start') AS click_aipractice_start,
    COUNTIF(event_name = 'click_resume_learning') AS click_resume_learning,
    COUNTIF(event_name = 'click_copy_template') AS click_copy_template,
    COUNTIF(event_name IN ('click_expand','click_expand_btn')) AS click_expand,
    COUNT(*) AS all_events
  ) AS events,

  MAX(IF(event_name = 'scroll', params.scroll_depth, NULL)) AS max_scroll_depth,
  IF(COUNTIF(event_name = 'first_visit') > 0, TRUE, FALSE) AS is_first_visit,
  IF(COUNTIF(event_name = 'user_engagement') > 0 OR (MAX(event_timestamp) - MIN(event_timestamp)) / 1000000 >= 10, TRUE, FALSE) AS is_engaged_session,
  LOGICAL_OR(is_active_user) AS is_active_user,
  LOGICAL_OR(is_local_traffic) AS is_local_traffic
FROM `hong-project2511.analytics_dm.events`
WHERE date BETWEEN @start_date AND @end_date
  AND session_id IS NOT NULL
GROUP BY date, user_pseudo_id, session_id
