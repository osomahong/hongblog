-- events 증분 적재. 상류가 비어 있으면 DELETE 없이 실패시켜 데이터 유실을 막는다.
DECLARE target_start DATE DEFAULT DATE_SUB(@run_date, INTERVAL 1 DAY);
DECLARE target_end   DATE DEFAULT DATE_SUB(@run_date, INTERVAL 1 DAY);
DECLARE upstream_rows INT64;

SET upstream_rows = (SELECT COUNT(*) FROM `hong-project2511.analytics_520024278.events_*` WHERE _TABLE_SUFFIX = FORMAT_DATE('%Y%m%d', target_start));

IF upstream_rows = 0 THEN
  SELECT ERROR(FORMAT(
    'GA4 일별 내보내기 테이블에 %t ~ %t 구간 데이터가 없어 중단합니다. 대상 테이블은 그대로 둡니다.',
    target_start, target_end));
END IF;

DELETE FROM `hong-project2511.analytics_dm.events` WHERE date BETWEEN target_start AND target_end;

INSERT INTO `hong-project2511.analytics_dm.events`
-- analytics_dm.events : GA4 이벤트 평탄화 (블로그 전용 파라미터 포함)
-- 파라미터: target_start, target_end (해당 구간의 GA4 일별 테이블을 읽음)
WITH base AS (
  SELECT
    PARSE_DATE('%Y%m%d', event_date) AS date,
    event_timestamp,
    event_name,
    user_pseudo_id,
    user_id,
    user_first_touch_timestamp,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_number') AS session_number,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_title') AS page_title,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_referrer') AS page_referrer,
    device, geo, platform, stream_id, is_active_user,
    traffic_source, session_traffic_source_last_click, collected_traffic_source,
    event_params
  FROM `hong-project2511.analytics_520024278.events_*`
  WHERE _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', target_start) AND FORMAT_DATE('%Y%m%d', target_end)
),
pathed AS (
  SELECT
    *,
    IFNULL(NULLIF(REGEXP_REPLACE(REGEXP_EXTRACT(page_location, r'^https?://[^/]+([^?#]*)'), r'/+$', ''), ''), '/') AS page_path,
    REGEXP_EXTRACT(page_location, r'\?([^#]*)') AS page_query,
    REGEXP_EXTRACT(page_location, r'^https?://([^/]+)') AS page_host
  FROM base
),
typed AS (
  SELECT
    *,
    CASE
      WHEN page_path = '/' THEN 'home'
      WHEN REGEXP_CONTAINS(page_path, r'^/insights/[^/]+$') THEN 'insight'
      WHEN page_path = '/insights' THEN 'insight_list'
      WHEN REGEXP_CONTAINS(page_path, r'^/class/[^/]+/[^/]+$') THEN 'class'
      WHEN REGEXP_CONTAINS(page_path, r'^/class/[^/]+$') THEN 'course'
      WHEN page_path = '/class' THEN 'class_list'
      WHEN REGEXP_CONTAINS(page_path, r'^/ai-practice/[^/]+$') THEN 'ai_practice'
      WHEN page_path = '/ai-practice' THEN 'ai_practice_list'
      WHEN REGEXP_CONTAINS(page_path, r'^/ga4-edu/[^/]+$') THEN 'ga4_edu'
      WHEN page_path = '/ga4-edu' THEN 'ga4_edu_list'
      WHEN REGEXP_CONTAINS(page_path, r'^/tags/[^/]+$') THEN 'tag'
      WHEN page_path = '/tags' THEN 'tag_list'
      WHEN page_path = '/about' THEN 'about'
      WHEN page_path = '/search' THEN 'search'
      WHEN page_path IS NULL THEN NULL
      ELSE 'other'
    END AS content_type
  FROM pathed
)
SELECT
  date,
  event_timestamp,
  event_name,
  user_pseudo_id,
  user_id,
  session_id,
  session_number,
  page_location,
  page_path,
  page_query,
  page_host,
  IF(REGEXP_CONTAINS(IFNULL(page_host,''), r'^(localhost|127\.0\.0\.1)'), TRUE, FALSE) AS is_local_traffic,
  page_title,
  page_referrer,
  content_type,
  CASE content_type
    WHEN 'insight'     THEN REGEXP_EXTRACT(page_path, r'^/insights/([^/]+)$')
    WHEN 'class'       THEN REGEXP_EXTRACT(page_path, r'^/class/[^/]+/([^/]+)$')
    WHEN 'course'      THEN REGEXP_EXTRACT(page_path, r'^/class/([^/]+)$')
    WHEN 'ai_practice' THEN REGEXP_EXTRACT(page_path, r'^/ai-practice/([^/]+)$')
    WHEN 'ga4_edu'     THEN REGEXP_EXTRACT(page_path, r'^/ga4-edu/([^/]+)$')
    WHEN 'tag'         THEN REGEXP_EXTRACT(page_path, r'^/tags/([^/]+)$')
    ELSE NULL
  END AS content_slug,
  REGEXP_EXTRACT(page_path, r'^/class/([^/]+)/[^/]+$') AS page_course_slug,

  STRUCT(
    device.category AS category,
    device.operating_system AS operating_system,
    device.operating_system_version AS operating_system_version,
    device.mobile_brand_name AS mobile_brand_name,
    device.mobile_model_name AS mobile_model_name,
    device.language AS language,
    device.web_info.browser AS browser,
    device.web_info.browser_version AS browser_version,
    device.web_info.hostname AS hostname
  ) AS device_info,

  STRUCT(geo.continent AS continent, geo.country AS country, geo.region AS region, geo.city AS city) AS geo,

  STRUCT(
    session_traffic_source_last_click.cross_channel_campaign.source AS source,
    session_traffic_source_last_click.cross_channel_campaign.medium AS medium,
    session_traffic_source_last_click.cross_channel_campaign.campaign_name AS campaign_name,
    session_traffic_source_last_click.manual_campaign.term AS term,
    session_traffic_source_last_click.manual_campaign.content AS content,
    session_traffic_source_last_click.cross_channel_campaign.default_channel_group AS ga_default_channel_group,
    `hong-project2511.analytics_dm.channel_group`(
      session_traffic_source_last_click.cross_channel_campaign.source,
      session_traffic_source_last_click.cross_channel_campaign.medium
    ) AS channel_group
  ) AS traffic,

  STRUCT(
    COALESCE(
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'content_id'),
      CAST((SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'content_id') AS STRING)
    ) AS content_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'content_name') AS content_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'content_type') AS content_type_param,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'item_id') AS item_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'course_slug') AS course_slug,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'menu_name') AS menu_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'location') AS location,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'button_name') AS button_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'mission_name') AS mission_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'method') AS method,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'share_transport') AS share_transport,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'is_correct') AS is_correct,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'is_new_course') AS is_new_course,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'scroll_depth') AS scroll_depth,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'quiz_score') AS quiz_score,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'selected_option') AS selected_option,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'position') AS position,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'engagement_time_msec') AS engagement_time_msec,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'percent_scrolled') AS percent_scrolled
  ) AS params,

  platform,
  stream_id,
  is_active_user,
  user_first_touch_timestamp
FROM typed
