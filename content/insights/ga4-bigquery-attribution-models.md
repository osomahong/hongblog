---
slug: ga4-bigquery-attribution-models
title: 빅쿼리로 내보낸 GA4 로우데이터에 직접 어트리뷰션을 적용해보기
excerpt: >-
  GA4 로우데이터를 빅쿼리로 내보내면 기본 보고서에서 제공하지 않는 커스텀 어트리뷰션 분석이 가능합니다. 세션 기반 데이터마트를 만들고,
  라스트클릭·퍼스트터치·선형 모델을 직접 SQL로 구현하는 방법을 쿼리 예시와 함께 정리했습니다.
category: DATA
tags:
  - GA4
  - BigQuery
  - 어트리뷰션
  - 데이터 분석
highlights:
  - >-
    GA4 빅쿼리 로우데이터에서 세션 단위 데이터마트를 구성하는 것이 어트리뷰션 분석의 첫 단계이며, user_pseudo_id와
    ga_session_id 조합으로 세션을 정의한다
  - >-
    라스트클릭, 퍼스트터치, 선형 모델은 각각 SQL의 LAST_VALUE, FIRST_VALUE, 1/COUNT 방식으로 구현하며, 같은
    전환 데이터에 세 가지 관점을 동시에 적용할 수 있다
  - 'GA4 기본 보고서의 채널별 전환 수치와 커스텀 어트리뷰션 결과를 비교하면, 실제 기여 채널이 과소평가되고 있는지 확인할 수 있다'
quiz:
  - options:
      - '라스트클릭 모델 — 현재 GA4 기본 보고서와 비교하기 쉽고, 전환 직전 채널의 역할을 명확히 파악할 수 있다'
      - 퍼스트터치 모델 — 신규 유입 채널의 가치를 제대로 평가해야 상단 퍼널 투자 판단이 가능하다
      - 선형 모델 — 모든 터치포인트에 균등하게 기여를 배분하여 편향 없이 전체 여정을 파악할 수 있다
      - 세 가지를 동시에 적용 — 모델 간 차이를 비교해야 각 채널의 과대/과소평가 여부를 판단할 수 있다
    question: '마케팅 예산 배분을 위해 GA4 빅쿼리 데이터로 어트리뷰션 분석을 할 때, 가장 먼저 적용해볼 모델은 무엇이라고 생각하시나요?'
    explanation: >-
      이 글에서 다룬 것처럼, 단일 모델만으로는 편향된 결론을 내릴 수 있습니다. 라스트클릭은 하단 퍼널을, 퍼스트터치는 상단 퍼널을,
      선형 모델은 전체 여정을 각각 강조하므로, 세 가지를 동시에 비교하는 것이 채널별 실제 기여도를 가장 균형 있게 파악하는 방법입니다.
    correctIndex: 3
metaTitle: 'GA4 빅쿼리 어트리뷰션 분석: 라스트클릭·퍼스트터치·선형 모델 SQL 쿼리 가이드'
metaDescription: >-
  GA4 로우데이터를 빅쿼리로 내보낸 뒤, 세션 데이터마트 구성부터 라스트클릭·퍼스트터치·선형 어트리뷰션 모델까지 실제 SQL 쿼리로 구현하는
  방법을 단계별로 정리했습니다.
ogTitle: GA4 빅쿼리 로우데이터로 직접 어트리뷰션 분석하기 — 3가지 모델 SQL 쿼리 포함
ogDescription: >-
  GA4 기본 보고서만으로는 부족한 어트리뷰션 분석을 빅쿼리 SQL로 직접 구현합니다. 라스트클릭, 퍼스트터치, 선형 모델 쿼리를 단계별로
  안내합니다.
ogImage: /og/ga4-bigquery-attribution-models.png
---

## GA4 기본 보고서로는 어트리뷰션 분석이 부족한 이유

GA4의 트래픽 획득 보고서를 열면 채널별 세션 수, 전환 수를 확인할 수 있습니다. 하지만 이 보고서가 보여주는 숫자는 대부분 **라스트클릭(Last Click) 기준의 단일 관점**입니다. 사용자가 전환에 도달하기까지 여러 채널을 거쳤더라도, 마지막 터치포인트에만 전환 공을 돌리는 방식입니다.

문제는 실제 고객 여정이 단순하지 않다는 점입니다. 블로그 검색으로 브랜드를 알게 되고, 소셜 미디어 광고를 통해 관심이 높아진 뒤, 이메일 프로모션을 보고 최종 구매하는 경우를 생각해보겠습니다. 라스트클릭 모델에서는 이메일이 전환의 100%를 가져갑니다. 블로그 SEO와 소셜 광고의 기여는 보이지 않습니다.

이 한계를 넘으려면 GA4 로우데이터를 빅쿼리로 내보내서 직접 어트리뷰션 모델을 적용해야 합니다. 이 글에서는 세션 기반 데이터마트를 간단히 구성한 뒤, **라스트클릭, 퍼스트터치, 선형 모델**을 각각 SQL 쿼리로 구현하는 방법을 다룹니다.

## 사전 준비: 세션 기반 데이터마트 만들기

어트리뷰션 분석의 출발점은 **세션 단위 데이터마트**입니다. GA4 빅쿼리 테이블(`events_*`)은 이벤트 단위 로우데이터이므로, 이를 세션 단위로 집계해야 "어떤 소스/매체를 통해 들어왔는지"를 분석할 수 있습니다.

세션 데이터마트 구축은 그 자체로 깊이 있는 주제이므로 별도의 글에서 상세히 다루겠습니다. 여기서는 어트리뷰션 분석에 필요한 최소한의 구조만 빠르게 만들어보겠습니다.

### 핵심 개념: GA4에서 세션 식별하기

GA4 빅쿼리 테이블에서 세션을 구분하는 키는 두 가지입니다.

- **`user_pseudo_id`**: 기기별 익명 사용자 ID
- **`ga_session_id`**: 이벤트 파라미터에 포함된 세션 ID (`event_params` 내 `ga_session_id` 키)

이 두 값을 조합하면 하나의 세션을 고유하게 식별할 수 있습니다.

### 세션 데이터마트 쿼리

아래 쿼리는 GA4 이벤트 테이블에서 세션별로 소스/매체, 캠페인, 랜딩 페이지, 전환 여부를 추출합니다.

```sql
-- 세션 기반 데이터마트 (간소화 버전)
CREATE OR REPLACE TABLE `your_project.analytics.session_mart` AS
WITH session_base AS (
  SELECT
    user_pseudo_id,
    (SELECT value.int_value FROM UNNEST(event_params) WHERE key = 'ga_session_id') AS session_id,
    TIMESTAMP_MICROS(event_timestamp) AS event_time,
    -- 소스/매체 정보
    traffic_source.source AS first_source,
    traffic_source.medium AS first_medium,
    traffic_source.name AS first_campaign,
    -- 세션 내 전환 이벤트 여부
    IF(event_name = 'purchase', 1, 0) AS is_purchase,
    -- 랜딩 페이지
    IF(
      event_name = 'session_start',
      (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location'),
      NULL
    ) AS landing_page
  FROM
    `your_project.analytics_XXXXXX.events_*`
  WHERE
    _TABLE_SUFFIX BETWEEN '20250101' AND '20250228'
)
SELECT
  user_pseudo_id,
  session_id,
  MIN(event_time) AS session_start,
  -- 세션의 소스/매체 (첫 이벤트 기준)
  ARRAY_AGG(first_source IGNORE NULLS ORDER BY event_time LIMIT 1)[SAFE_OFFSET(0)] AS source,
  ARRAY_AGG(first_medium IGNORE NULLS ORDER BY event_time LIMIT 1)[SAFE_OFFSET(0)] AS medium,
  ARRAY_AGG(first_campaign IGNORE NULLS ORDER BY event_time LIMIT 1)[SAFE_OFFSET(0)] AS campaign,
  ARRAY_AGG(landing_page IGNORE NULLS ORDER BY event_time LIMIT 1)[SAFE_OFFSET(0)] AS landing_page,
  MAX(is_purchase) AS has_conversion
FROM session_base
WHERE session_id IS NOT NULL
GROUP BY user_pseudo_id, session_id;
```

이 쿼리의 결과는 **세션 한 건이 한 행**인 테이블입니다. 각 행에는 소스/매체, 캠페인, 전환 여부가 포함되어 있으며, 이 테이블이 이후 어트리뷰션 분석의 기반이 됩니다.

**참고:** 위 쿼리에서 `traffic_source`는 사용자의 첫 유입 소스를 나타내며, 세션별 정확한 소스/매체가 필요하면 `collected_traffic_source` 필드나 `session_start` 이벤트의 파라미터를 활용해야 합니다. 이 부분의 자세한 처리는 세션 데이터마트 전용 글에서 다루겠습니다.

## 전환 경로 테이블 만들기

어트리뷰션 분석을 하려면 "하나의 전환에 기여한 모든 터치포인트"를 묶어야 합니다. 전환이 발생한 사용자의 **전환 이전 세션들**을 시간순으로 나열하는 테이블을 만들겠습니다.

```sql
-- 전환 경로 테이블: 전환 사용자의 모든 이전 세션을 시간순 정렬
CREATE OR REPLACE TABLE `your_project.analytics.conversion_paths` AS
WITH converters AS (
  -- 전환이 발생한 세션 식별
  SELECT
    user_pseudo_id,
    session_id AS conversion_session_id,
    session_start AS conversion_time
  FROM `your_project.analytics.session_mart`
  WHERE has_conversion = 1
),
all_touchpoints AS (
  -- 전환 사용자의 전환 이전(포함) 모든 세션
  SELECT
    c.user_pseudo_id,
    c.conversion_session_id,
    c.conversion_time,
    s.session_id,
    s.session_start,
    IFNULL(s.source, 'direct') AS source,
    IFNULL(s.medium, '(none)') AS medium,
    s.campaign,
    -- 터치포인트 순서 (시간순)
    ROW_NUMBER() OVER (
      PARTITION BY c.user_pseudo_id, c.conversion_session_id
      ORDER BY s.session_start
    ) AS touchpoint_order,
    -- 전체 터치포인트 수
    COUNT(*) OVER (
      PARTITION BY c.user_pseudo_id, c.conversion_session_id
    ) AS total_touchpoints
  FROM converters c
  JOIN `your_project.analytics.session_mart` s
    ON c.user_pseudo_id = s.user_pseudo_id
    AND s.session_start <= c.conversion_time
)
SELECT * FROM all_touchpoints
ORDER BY user_pseudo_id, conversion_session_id, touchpoint_order;
```

이 테이블의 한 행은 "특정 전환에 기여한 하나의 터치포인트"를 의미합니다. `touchpoint_order`는 시간순 순서이고, `total_touchpoints`는 해당 전환까지의 총 터치포인트 수입니다. 이 두 값이 어트리뷰션 모델 적용의 핵심입니다.

## 라스트클릭(Last Click) 모델

### 개념

라스트클릭 모델은 **전환 직전 마지막 터치포인트에 100% 기여를 부여**하는 방식입니다. GA4 기본 보고서에서 사용하는 방식과 가장 가깝습니다. 구현이 단순하고 직관적이지만, 상단 퍼널(인지·관심 단계)의 채널을 과소평가하는 경향이 있습니다.

### 쿼리

```sql
-- 라스트클릭 어트리뷰션: 마지막 터치포인트에 100% 기여
SELECT
  source,
  medium,
  -- 라스트클릭으로 귀속된 전환 수
  COUNT(*) AS last_click_conversions,
  -- 전체 전환 대비 비중
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 1) AS pct_of_total
FROM `your_project.analytics.conversion_paths`
WHERE touchpoint_order = total_touchpoints  -- 마지막 터치포인트만
GROUP BY source, medium
ORDER BY last_click_conversions DESC;
```

`touchpoint_order = total_touchpoints` 조건 하나로 마지막 터치포인트를 필터링합니다. 결과를 보면 direct, cpc, organic 등 채널별로 "최종 전환을 이끌어낸 횟수"가 나옵니다.

### 해석 시 주의점

라스트클릭 결과에서 특정 채널(예: 이메일, 리타게팅 광고)의 전환 수가 유독 높다면, 해당 채널이 전환 **마무리** 역할을 잘하고 있다는 의미입니다. 하지만 이 숫자만 보고 "이메일이 가장 효과적인 채널"이라고 결론 내리면, 인지 단계에서 사용자를 끌어온 SEO나 소셜 광고의 기여가 무시됩니다.

## 퍼스트터치(First Touch) 모델

### 개념

퍼스트터치 모델은 라스트클릭과 정반대입니다. **사용자가 처음 유입된 채널에 100% 기여를 부여**합니다. "이 사용자를 처음 데려온 채널이 어디인가"에 초점을 맞추므로, 신규 사용자 획득 채널의 가치를 평가하는 데 유용합니다.

### 쿼리

```sql
-- 퍼스트터치 어트리뷰션: 첫 번째 터치포인트에 100% 기여
SELECT
  source,
  medium,
  COUNT(*) AS first_touch_conversions,
  ROUND(COUNT(*) / SUM(COUNT(*)) OVER () * 100, 1) AS pct_of_total
FROM `your_project.analytics.conversion_paths`
WHERE touchpoint_order = 1  -- 첫 번째 터치포인트만
GROUP BY source, medium
ORDER BY first_touch_conversions DESC;
```

`touchpoint_order = 1`로 첫 번째 터치포인트만 선택합니다. 결과에서 organic search나 소셜 미디어의 비중이 라스트클릭보다 높게 나온다면, 해당 채널이 신규 사용자 유입에 크게 기여하고 있다는 신호입니다.

### 해석 시 주의점

퍼스트터치 모델은 **상단 퍼널 채널을 과대평가**할 수 있습니다. 사용자가 처음 유입된 이후 전환까지 수개월이 걸렸다면, 첫 터치포인트의 실질적 기여도가 얼마나 되는지는 별도 판단이 필요합니다. 분석 기간(lookback window)을 적절히 설정하는 것이 중요합니다.

## 선형(Linear) 모델

### 개념

선형 모델은 **모든 터치포인트에 동일한 기여를 배분**합니다. 전환까지 3개의 터치포인트가 있었다면, 각 터치포인트에 1/3(약 33.3%)씩 기여를 나눕니다. 특정 채널을 편향적으로 높이거나 낮추지 않으므로 전체 고객 여정을 균형 있게 파악하는 데 적합합니다.

### 쿼리

```sql
-- 선형 어트리뷰션: 모든 터치포인트에 균등 기여 배분
SELECT
  source,
  medium,
  -- 각 터치포인트의 기여 = 1 / 총 터치포인트 수
  ROUND(SUM(1.0 / total_touchpoints), 2) AS linear_conversions,
  ROUND(
    SUM(1.0 / total_touchpoints) / SUM(SUM(1.0 / total_touchpoints)) OVER () * 100,
    1
  ) AS pct_of_total
FROM `your_project.analytics.conversion_paths`
GROUP BY source, medium
ORDER BY linear_conversions DESC;
```

핵심은 `1.0 / total_touchpoints`입니다. 터치포인트가 4개인 전환이라면 각 터치포인트에 0.25를 배분하고, 이를 채널별로 합산합니다. 결과가 소수점으로 나오는 것이 정상이며, 모든 채널의 `linear_conversions`를 합하면 총 전환 수와 일치합니다.

### 해석 시 주의점

선형 모델은 공평하다는 장점이 있지만, 실제로는 모든 터치포인트가 동일한 영향력을 가지지는 않습니다. 브랜드 검색으로 유입된 세션과 리타게팅 광고를 통한 세션의 기여가 같다고 보기 어려운 경우도 있습니다. 그래서 선형 모델은 **다른 모델과의 비교 기준점**으로 활용하는 것이 효과적입니다.

## 세 가지 모델을 한눈에 비교하기

개별 모델의 결과를 따로 보는 것도 좋지만, **세 가지를 나란히 비교**해야 각 채널이 어느 단계에서 기여하는지 입체적으로 파악할 수 있습니다.

```sql
-- 세 가지 어트리뷰션 모델 비교 (채널별)
WITH last_click AS (
  SELECT source, medium, COUNT(*) AS conversions
  FROM `your_project.analytics.conversion_paths`
  WHERE touchpoint_order = total_touchpoints
  GROUP BY source, medium
),
first_touch AS (
  SELECT source, medium, COUNT(*) AS conversions
  FROM `your_project.analytics.conversion_paths`
  WHERE touchpoint_order = 1
  GROUP BY source, medium
),
linear AS (
  SELECT source, medium, ROUND(SUM(1.0 / total_touchpoints), 2) AS conversions
  FROM `your_project.analytics.conversion_paths`
  GROUP BY source, medium
)
SELECT
  COALESCE(lc.source, ft.source, ln.source) AS source,
  COALESCE(lc.medium, ft.medium, ln.medium) AS medium,
  IFNULL(ft.conversions, 0) AS first_touch,
  IFNULL(ln.conversions, 0) AS linear,
  IFNULL(lc.conversions, 0) AS last_click,
  -- 퍼스트터치 대비 라스트클릭 차이 (양수면 하단퍼널 강세)
  IFNULL(lc.conversions, 0) - IFNULL(ft.conversions, 0) AS lc_vs_ft_diff
FROM last_click lc
FULL OUTER JOIN first_touch ft USING (source, medium)
FULL OUTER JOIN linear ln USING (source, medium)
ORDER BY linear DESC;
```

### 결과 읽는 법

이 비교 테이블에서 주목할 패턴은 다음과 같습니다.

- **`lc_vs_ft_diff`가 양수인 채널**: 전환 마무리(하단 퍼널)에 강한 채널입니다. 이메일, 리타게팅, 브랜드 검색이 여기에 해당하는 경우가 많습니다.
- **`lc_vs_ft_diff`가 음수인 채널**: 신규 유입(상단 퍼널)에 강한 채널입니다. 디스플레이 광고, 소셜 미디어, 비브랜드 검색이 대표적입니다.
- **세 모델의 수치가 비슷한 채널**: 전환 여정 전반에 걸쳐 꾸준히 기여하는 채널입니다.

예를 들어, 소셜 미디어 광고(facebook/cpc)의 `first_touch`는 50인데 `last_click`은 15라면, 이 채널은 신규 사용자를 끌어오는 데 큰 역할을 하지만 전환 마무리는 다른 채널이 담당하고 있다는 뜻입니다. 라스트클릭만 보면 이 기여가 완전히 보이지 않습니다.

## 실무에서 활용하는 팁

### 분석 기간(Lookback Window) 설정

전환 경로 테이블을 만들 때 **분석 기간을 제한**하는 것이 중요합니다. 전환 시점으로부터 30일 이전의 터치포인트까지만 포함하는 것이 일반적입니다.

```sql
-- 전환 경로 테이블에서 lookback window 적용
...
  JOIN `your_project.analytics.session_mart` s
    ON c.user_pseudo_id = s.user_pseudo_id
    AND s.session_start <= c.conversion_time
    AND s.session_start >= TIMESTAMP_SUB(c.conversion_time, INTERVAL 30 DAY)
...
```

제품 특성에 따라 이 기간은 달라져야 합니다. 즉석 구매 상품이라면 7일이면 충분하고, B2B 솔루션이라면 90일까지 넓혀야 할 수도 있습니다.

### direct / (none) 처리

어트리뷰션 분석에서 direct/(none) 트래픽은 늘 고민거리입니다. 북마크, 주소창 직접 입력 등 소스 정보가 없는 세션이 터치포인트에 포함되면 분석 결과가 흐려집니다. 실무에서는 두 가지 접근이 있습니다.

1. **direct를 포함하되 별도 표시**: 현재 쿼리 그대로 사용합니다. direct의 비중이 높다면 UTM 관리를 개선해야 한다는 신호입니다.
2. **direct를 제외하고 분석**: `WHERE source != 'direct'` 조건을 추가하여 마케팅 채널의 기여만 비교합니다. 단, 이 경우 터치포인트가 하나인 전환이 누락될 수 있으므로 주의가 필요합니다.

### GA4 기본 보고서와 비교하기

커스텀 어트리뷰션 결과를 GA4 기본 보고서의 수치와 비교해보면 인사이트가 더 선명해집니다. GA4 기본 보고서의 채널별 전환 수(라스트클릭 기준)와 퍼스트터치 모델의 전환 수를 나란히 놓으면, 어떤 채널이 기본 보고서에서 과소평가되고 있는지 바로 확인할 수 있습니다.

## 정리

GA4 빅쿼리 로우데이터를 활용한 어트리뷰션 분석의 핵심을 정리하면 다음과 같습니다.

1. **세션 기반 데이터마트가 출발점입니다.** `user_pseudo_id`와 `ga_session_id`로 세션을 정의하고, 세션별 소스/매체와 전환 여부를 집계합니다. (세션 데이터마트 상세 구축은 다음 글에서 다루겠습니다.)
2. **라스트클릭, 퍼스트터치, 선형 모델은 각각 다른 관점을 제공합니다.** 라스트클릭은 전환 마무리, 퍼스트터치는 신규 유입, 선형은 전체 여정의 기여를 보여줍니다.
3. **세 가지 모델을 비교해야 편향을 줄일 수 있습니다.** 채널별 `lc_vs_ft_diff` 값을 통해 각 채널이 퍼널의 어느 단계에서 역할을 하는지 파악하고, 이를 기반으로 예산 배분 의사결정을 내릴 수 있습니다.

어트리뷰션 분석은 한 번 쿼리를 만들어두면 정기적으로 재활용할 수 있습니다. 월간 또는 분기별로 모델 간 비교 결과를 트래킹하면, 채널 전략의 변화가 실제 전환 기여에 어떤 영향을 미치는지 데이터로 확인할 수 있습니다.
