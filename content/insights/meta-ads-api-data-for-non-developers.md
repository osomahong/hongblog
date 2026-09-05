---
slug: meta-ads-api-data-for-non-developers
title: '비개발자를 위한 Meta Ads API 가이드: 필드 매핑부터 코드 예시까지'
excerpt: >-
  Meta(Facebook/Instagram) 광고 데이터를 API로 직접 가져오고 싶은 마케터를 위한 가이드입니다. 앱 생성부터 시스템 유저
  토큰 발급, Insights API 필드 매핑, 전환 데이터 파싱까지: 비개발자가 AI에게 코드를 맡기기 전에 알아야 할 핵심을
  정리했습니다.
category: MARKETING
tags:
  - Meta 광고
  - API
  - 데이터 분석
  - 자동화
  - 퍼포먼스마케팅
publishedAt: '2026-02-24T08:29:43.724Z'
updatedAt: '2026-07-23T00:00:00.000Z'
highlights:
  - 'Meta API의 clicks에는 좋아요, 공유까지 포함됩니다': 웹사이트 유입은 반드시 inline_link_clicks를 사용하세요
  - 전환 데이터가 단일 숫자가 아닌 actions 배열로 반환되는 Meta API의 구조와 파싱 방법
  - '시스템 유저 토큰 발급부터 Insights API 호출, CSV 저장까지 전체 Python 코드 예시'
quiz:
  - options:
      - 'clicks: 광고에서 일어난 모든 클릭을 집계하는 표준 지표'
      - 'inline_link_clicks: 랜딩페이지로 이동하는 클릭만 집계하는 지표'
      - 'outbound_clicks: 외부 URL로 이동하는 클릭을 집계하는 지표'
      - 'link_click: actions 배열 내의 링크 클릭 action_type'
    question: Meta Ads API에서 웹사이트 방문 클릭수를 정확히 측정하려면 어떤 필드를 사용해야 할까요?
    explanation: >-
      Meta의 clicks 필드에는 좋아요, 공유, 댓글, 프로필 방문 등 모든 클릭이 포함되어 있어 웹사이트 유입 측정에 적합하지
      않습니다. inline_link_clicks가 랜딩페이지로 이동하는 클릭만 집계하므로, 구글 Ads의 clicks와 동일한 비교
      기준으로 사용해야 합니다.
    correctIndex: 1
seriesSlug: digitalmarketing
seriesOrder: 8
metaTitle: '비개발자를 위한 Meta Ads API 가이드: 필드 매핑부터 코드 예시까지'
metaDescription: >-
  Meta Marketing API 접근 방법, Insights 필드 매핑, 전환 데이터 파싱, Python 코드 예시까지. 비개발자 마케터를
  위한 Meta Ads API 실전 가이드입니다.
ogDescription: >-
  Meta Marketing API 접근부터 Insights 필드 매핑, 전환 데이터 파싱, 코드 예시까지. 마케터가 알아야 할 핵심을
  정리했습니다.
ogImage: /og/meta-ads-api-data-for-non-developers.png
summary3:
  - 'Meta Ads API로 가져오는 데이터는 캠페인 설정인 구조와 노출과 비용인 성과, 연령과 지면 같은 분류 세 종류입니다.'
  - >-
    읽기만 할 때는 ads_read 권한이면 되고 Advanced Access가 필요하면 비즈니스 인증에 사업자 서류를 내고 며칠을
    기다립니다.
  - 전환은 단일 숫자가 아니라 actions 배열로 오기 때문에 필요한 전환 유형을 골라 꺼내는 처리가 따로 필요합니다.
---

## Meta 광고 데이터, 왜 API로 가져와야 할까요

메타 광고 관리자(Ads Manager)에서 리포트를 다운로드할 수 있지만, 매번 수작업으로 내려받아 정리하는 건 한계가 있습니다. 여러 광고 계정을 관리하거나, 구글, 네이버 데이터와 통합 리포트를 만들거나, 자동으로 대시보드를 업데이트하고 싶다면 **API를 통한 자동화**가 필요합니다.

이 글은 [구글 Ads API 가이드](/insights/google-ads-api-data-for-non-developers)의 후속편으로, 직접 코드를 작성하지 않더라도 AI에게 올바른 요청을 하기 위해 알아야 할 **Meta Ads API의 핵심 개념**을 정리합니다.


## Meta Ads API로 가져올 수 있는 데이터

크게 세 가지로 나눠서 보면 이해가 쉽습니다.

| 데이터 유형 | 포함 내용 | 예시 |
|-----------|---------|------|
| **구조 데이터** | 캠페인, 광고세트, 광고의 설정 정보 | 캠페인명, 목표, 예산, 상태 |
| **성과 데이터 (Insights)** | 노출, 클릭, 비용, 전환 지표 | 노출수, 클릭수, 광고비, 구매 전환수 |
| **분류 데이터 (Breakdowns)** | 성과를 세분화하는 차원 | 연령, 성별, 디바이스, 지면(피드, 스토리, 릴스) |

성과 데이터가 이 글의 핵심입니다. Meta에서는 이를 **Insights API**라고 부릅니다.


## API 접근 준비: 4단계

구글 Ads API와 달리 Meta API는 **Meta 자체 개발자 플랫폼**에서 앱을 생성하고 권한을 관리합니다.

### Step 1. Meta 개발자 앱 생성
![image](https://avqz4vnz10fk0ilw.public.blob.vercel-storage.com/uploads/1771858413062-whhl2l.png)

[developers.facebook.com](https://developers.facebook.com)에서 앱을 생성합니다.
- 앱 유형: **"Business"** 선택
- 앱에 **Marketing API** 제품을 추가

### Step 2. 권한(Permission) 확인

데이터를 **읽기만** 하려면 `ads_read` 권한이 필요합니다.

| 권한 | 용도 | 접근 수준 |
|------|------|--------|
| `ads_read` | 광고 성과 데이터 조회 (읽기 전용) | Standard → Advanced |
| `ads_management` | 캠페인 생성, 수정, 삭제 | Advanced |
| `business_management` | Business Manager 계정 관리 | Advanced |

**Standard Access**는 본인 계정 데이터만 접근 가능하고, 앱 검수(App Review)가 불필요합니다. 클라이언트 광고 계정 데이터에 접근하려면 **Advanced Access**가 필요하며, **비즈니스 인증(Business Verification)**과 **앱 검수**를 통과해야 합니다.

### Step 3. 비즈니스 인증

Advanced Access가 필요한 경우, Business Manager > 비즈니스 설정 > 보안 센터에서 비즈니스 [인증](/class/vibe-coding-basics/what-is-authentication)을 진행합니다. 사업자 등록증이나 법인 서류를 제출하며, 보통 수 영업일 내에 처리됩니다.

### Step 4. 시스템 유저 토큰 발급 (가장 중요)
![image](https://avqz4vnz10fk0ilw.public.blob.vercel-storage.com/uploads/1771858560677-p3hfg9.png)

API 호출에는 **액세스 토큰(Access Token)**이 필요합니다. 토큰 유형에 따라 유효 기간이 크게 다릅니다.

| 토큰 유형 | 유효 기간 | 용도 |
|----------|---------|------|
| 단기 사용자 토큰 | 1~2시간 | 테스트용 |
| 장기 사용자 토큰 | 최대 60일 | 소규모 개인 사용 |
| **시스템 유저 토큰** | **영구 (수동 갱신 불필요)** | **자동화, 운영 환경 (강력 권장)** |

자동화 환경에서는 반드시 **시스템 유저 토큰**을 사용해야 합니다. 개인 사용자 토큰은 60일마다 만료되어, 자동화 파이프라인이 갑자기 멈추는 원인이 됩니다.

**시스템 유저 토큰 발급 경로:**

```
Business Manager
 → 비즈니스 설정 > 사용자 > 시스템 사용자
 → "시스템 사용자 추가" 클릭 (역할: Admin)
 → 자산 추가: 해당 광고계정 연결
 → "토큰 생성": ads_read 등 필요 권한 선택 후 생성
```


## 마케터 용어 vs API 필드 매핑

이 섹션이 실무에서 가장 중요합니다. Meta API의 필드명은 구글과 상당히 다르고, **특히 클릭과 [전환](/class/digital-marketing-terms/what-is-conversion) 지표에서 혼동이 잦습니다.**

### 기본 지표

| 마케터 용어 | API 필드 | 주의사항 |
|-----------|---------|--------|
| 노출수 | `impressions` | 중복 노출 포함 |
| 도달수 | `reach` | 중복 제외 순 사용자 수. **구글에는 없는 지표** |
| 빈도 | `frequency` | impressions ÷ reach |
| **클릭수** | **`inline_link_clicks`** | **`clicks`가 아닙니다!** (아래 설명) |
| 클릭률(CTR) | `inline_link_click_ctr` | 링크 클릭 기준 CTR |
| 광고비 | `spend` | **원화 그대로 사용** (구글처럼 마이크로 단위 변환 불필요) |
| CPC | `cpc` | 모든 클릭 기준. 링크 클릭 기준 CPC는 직접 계산 필요 |
| CPM | `cpm` | 1,000회 노출당 비용 |

> **가장 흔한 실수: `clicks` vs `inline_link_clicks`**
>
> Meta의 `clicks`에는 랜딩페이지 클릭뿐 아니라 **좋아요, 공유, 댓글, 프로필 방문** 등 모든 클릭이 포함됩니다. 웹사이트 유입을 측정하려면 반드시 `inline_link_clicks`를 사용해야 합니다. 구글 Ads의 `clicks`와 동일한 개념은 Meta에서는 `inline_link_clicks`입니다.

### 전환 지표: Meta API에서 가장 까다로운 부분

구글 Ads는 `conversions`라는 단일 숫자를 반환합니다. 하지만 Meta는 **`actions`라는 배열**로 전환 데이터를 반환합니다. 이 배열 안에 구매, 리드, 장바구니 추가 등 각 이벤트가 `action_type`별로 들어 있습니다.

| 마케터 용어 | API 필드 | action_type 값 |
|-----------|---------|---------------|
| 구매 전환수 | `actions` 배열에서 추출 | `offsite_conversion.fb_pixel_purchase` |
| 리드 전환수 | `actions` 배열에서 추출 | `offsite_conversion.fb_pixel_lead` |
| 장바구니 담기 | `actions` 배열에서 추출 | `offsite_conversion.fb_pixel_add_to_cart` |
| 구매 전환가치 | `action_values` 배열에서 추출 | `offsite_conversion.fb_pixel_purchase` |
| 링크 클릭 | `actions` 배열에서 추출 | `link_click` |
| 랜딩페이지 조회 | `actions` 배열에서 추출 | `landing_page_view` |

**[ROAS](/class/digital-marketing-terms/what-is-roas) 계산도 직접 해야 합니다:**

```python
# 구글: conversion_value / cost 로 바로 계산
# Meta: actions 배열을 파싱해서 구매 전환가치를 추출한 뒤 계산
purchase_value = sum(
    float(av["value"]) for av in row["action_values"]
    if av["action_type"] == "offsite_conversion.fb_pixel_purchase"
)
roas = purchase_value / float(row["spend"])
```

> **"결과(Results)"와 "전환(Conversions)"의 차이**
>
> 광고 관리자에서 보이는 "결과" 수치는 캠페인 목표에 따라 다른 이벤트를 집계합니다. 트래픽 캠페인의 "결과"는 링크 클릭이고, 전환 캠페인의 "결과"는 구매 이벤트입니다. API에서는 이 자동 매핑이 없으므로, 원하는 `action_type`을 직접 지정해서 추출해야 합니다.

### Breakdown(세분화) 차원

| 마케터 관점 | API 파라미터 | 값 예시 |
|-----------|-----------|--------|
| 연령별 | `breakdowns=["age"]` | 18-24, 25-34, 35-44 등 |
| 성별 | `breakdowns=["gender"]` | male, female, unknown |
| 매체별 | `breakdowns=["publisher_platform"]` | facebook, instagram, messenger |
| 지면별 | `breakdowns=["platform_position"]` | feed, story, reels, right_column |
| 디바이스별 | `breakdowns=["impression_device"]` | mobile, desktop |

주의: Breakdown을 여러 개 조합할수록 행 수가 기하급수적으로 증가합니다. age(6) × gender(3) × publisher_platform(4) = **72행**이 한 캠페인에서 나옵니다.

### 전환 귀속 기간(Attribution Window)

Meta의 기본 귀속 기간은 **"클릭 후 7일 + 조회 후 1일"**입니다. API에서 이를 명시적으로 지정하지 않으면 광고 관리자 UI와 숫자가 다를 수 있습니다.

```python
params = {
    "action_attribution_windows": '["7d_click", "1d_view"]',  # 기본값과 동일하게 지정
}
```

| 귀속 옵션 | 의미 |
|----------|------|
| `1d_click` | 클릭 후 1일 이내 전환 |
| `7d_click` | 클릭 후 7일 이내 전환 (기본값) |
| `1d_view` | 광고 조회 후 1일 이내 전환 (기본값) |
| `28d_click` | 클릭 후 28일 이내 전환 |


## API 연결 구조: 비개발자가 이해할 핵심

Meta Ads API 호출은 다음 구조를 따릅니다.

```
GET https://graph.facebook.com/v24.0/{광고계정ID}/insights
  ?level=campaign
  &date_preset=last_30d
  &fields=campaign_name,impressions,inline_link_clicks,spend,actions,action_values
  &access_token=YOUR_TOKEN
```

| 요소 | 설명 |
|------|------|
| `v24.0` | API 버전 (2025년 10월 기준 최신) |
| `{광고계정ID}` | `act_` 접두사 포함 (예: `act_123456789`) |
| `level` | 집계 수준: campaign, adset, ad |
| `date_preset` | 기간: last_7d, last_30d, this_month 등 |
| `fields` | 가져올 필드 (쉼표 구분) |

커스텀 날짜 범위가 필요하면 `date_preset` 대신 `time_range`를 사용합니다.

```python
params = {
    "time_range": '{"since": "2025-01-01", "until": "2025-01-31"}',
}
```


## Python 코드 예시: 캠페인 성과 데이터 추출

```python
from facebook_business.api import FacebookAdsApi
from facebook_business.adobjects.adaccount import AdAccount
import json, csv

# 1. 인증
FacebookAdsApi.init(
    app_id="your_app_id",
    app_secret="your_app_secret",
    access_token="your_system_user_token",  # 시스템 유저 토큰 권장
)
account = AdAccount("act_123456789")

# 2. 필드 정의
fields = [
    "campaign_id", "campaign_name", "date_start", "date_stop",
    "impressions", "reach", "inline_link_clicks",
    "spend", "cpm", "actions", "action_values",
]

# 3. 파라미터
params = {
    "level": "campaign",
    "date_preset": "last_30d",
    "action_attribution_windows": '["7d_click", "1d_view"]',
    "sort": ["spend_descending"],
    "limit": 100,
}

# 4. 데이터 조회 (자동 페이지네이션)
insights = account.get_insights(fields=fields, params=params)

# 5. 전환 데이터 파싱 함수
def get_action(actions, action_type):
    if not actions:
        return 0
    for a in actions:
        if a.get("action_type") == action_type:
            return float(a.get("value", 0))
    return 0

# 6. 결과 정리
results = []
for row in insights:
    d = dict(row)
    spend = float(d.get("spend", 0))
    purchases = get_action(d.get("actions"), "offsite_conversion.fb_pixel_purchase")
    purchase_val = get_action(d.get("action_values"), "offsite_conversion.fb_pixel_purchase")

    results.append({
        "캠페인명": d.get("campaign_name"),
        "시작일": d.get("date_start"),
        "종료일": d.get("date_stop"),
        "노출수": int(d.get("impressions", 0)),
        "도달수": int(d.get("reach", 0)),
        "링크클릭수": int(d.get("inline_link_clicks", 0)),
        "광고비": spend,
        "구매전환수": purchases,
        "구매전환가치": purchase_val,
        "ROAS": round(purchase_val / spend, 2) if spend > 0 else 0,
    })

# 7. CSV 저장
if results:
    with open("meta_report.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
    print(f"{len(results)}개 캠페인 데이터 저장 완료")
```


## 주의사항 5가지

### 1. `clicks`가 아니라 `inline_link_clicks`를 쓰세요

반복하지만 가장 흔한 실수입니다. Meta의 `clicks`에는 좋아요, 공유, 댓글 클릭이 포함됩니다. 웹사이트 유입 기준이라면 반드시 `inline_link_clicks`를 사용해야 합니다.

### 2. 전환 데이터는 배열 파싱이 필수입니다

구글은 `conversions = 15`처럼 단일 숫자를 반환하지만, Meta는 `actions: [{action_type: "purchase", value: "15"}, ...]` 형태의 배열을 반환합니다. 원하는 전환 유형의 `action_type`을 지정하여 추출해야 합니다.

### 3. 귀속 기간을 명시적으로 지정하세요

`action_attribution_windows`를 지정하지 않으면 API 기본값과 광고 관리자 UI 설정이 다를 수 있습니다. 항상 `["7d_click", "1d_view"]`처럼 명시적으로 지정하는 것이 안전합니다.

### 4. Breakdown + Reach 데이터는 13개월 제한

2025년 6월 10일부터 연령/성별/지면 등 Breakdown과 함께 `reach` 데이터를 조회하면, **13개월 이전 데이터는 조회가 불가능**합니다. 과거 데이터가 필요하다면 주기적으로 백업해두는 것이 좋습니다.

### 5. API 버전을 관리하세요

Meta는 연 2회 새 API 버전을 출시하며, 오래된 버전은 약 2년 후 차단됩니다. 2025년 9월 9일부터 **v22.0 미만은 완전 차단**되었습니다. 코드 내 버전 번호를 하드코딩하지 말고 상수로 관리하는 것을 권장합니다.


## 구글 Ads API와 핵심 차이 요약

| 항목 | 구글 Ads API | Meta Ads API |
|------|-----------|----------|
| 인증 방식 | OAuth 2.0 + Developer Token | OAuth 2.0 + 시스템 유저 토큰 |
| 쿼리 언어 | GAQL (SQL 유사) | REST 파라미터 |
| 비용 단위 | **마이크로 (÷1,000,000)** | **원화 그대로** |
| 클릭 | `clicks` = 광고 클릭 | `clicks` = 모든 클릭, **`inline_link_clicks` = 광고 클릭** |
| 전환 | `conversions` (단일 숫자) | `actions` (배열, 파싱 필요) |
| ROAS | `metrics.conversions_value / metrics.cost_micros` | 직접 계산 필요 |
| 도달(Reach) | 없음 | `reach` 제공 |
| 페이지네이션 | 자동 (GAQL) | 커서 기반 (25건씩, `paging.next` 사용) |


## AI로 Meta Ads API 구현하기: 프롬프트 모음

### 기본 데이터 추출

```
Meta Marketing API를 사용해서 Python 코드를 작성해줘.
- facebook_business SDK 사용
- 시스템 유저 토큰으로 인증
- 광고 계정 ID: act_123456789
- 캠페인 레벨, 최근 30일 데이터
- 필드: campaign_name, impressions, reach, inline_link_clicks, spend, actions, action_values
- 귀속 기간: 7d_click + 1d_view
- actions에서 purchase 전환수와 전환가치를 추출하고, ROAS를 계산
- 결과를 CSV로 저장
```

### 연령/성별 분석

```
Meta Ads API에서 연령/성별 breakdown 데이터를 가져오는 Python 코드를 작성해줘.
- breakdowns: age, gender
- 캠페인별로 연령/성별 조합의 노출수, 링크클릭수, 광고비, 구매전환수를 추출
- 피벗테이블 형태로 정리 (행: 연령, 열: 성별)
- pandas DataFrame으로 처리
```

### 통합 리포트 (구글 + Meta)

```
구글 Ads API와 Meta Ads API 데이터를 하나의 통합 리포트로 만드는 Python 코드를 작성해줘.
주의사항:
- 구글 비용은 cost_micros를 1,000,000으로 나눠야 함
- Meta 비용(spend)은 그대로 사용
- 구글 클릭은 clicks, Meta 클릭은 inline_link_clicks 사용
- 구글 전환은 conversions, Meta 전환은 actions에서 purchase 추출
- 컬럼명 통일: 매체명, 캠페인명, 노출수, 클릭수, 광고비, 전환수, ROAS
```
