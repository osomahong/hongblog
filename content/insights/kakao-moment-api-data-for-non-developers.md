---
slug: kakao-moment-api-data-for-non-developers
title: 비개발자도 쓰기 편하게 정리한 카카오모먼트 API 데이터
excerpt: >-
  카카오모먼트 광고 데이터를 API로 가져오고 싶은 마케터를 위한 가이드입니다. 공식대행사 전용 권한 신청, 비즈 앱 전환 심사, 비즈니스
  토큰 인증, 보고서 API의 metricsGroup 구조까지: 카카오모먼트 API의 진입 장벽과 실전 사용법을 정리했습니다.
category: MARKETING
tags:
  - 광고
  - API
  - 데이터 분석
  - 자동화
  - 퍼포먼스마케팅
publishedAt: '2026-03-04T06:16:42.250Z'
highlights:
  - 카카오모먼트 API는 공식대행사 또는 사전 협의된 광고주만 권한 신청이 가능: 4개 매체 중 진입 장벽이 가장 높음
  - 비즈 앱 전환 심사 + 비즈니스 토큰 인증 + metricsGroup 기반 보고서 구조: 카카오 API만의 고유한 체계
  - '4개 매체(구글, 메타, 네이버, 카카오) API 접근 난이도, 비용 단위, 전환 구조, Rate Limit 비교표'
quiz:
  - options:
      - Kakao Developers에서 앱을 생성하면 누구나 바로 사용할 수 있다
      - 카카오 광고 공식대행사이거나 카카오 담당자와 사전 협의된 광고주만 권한을 받을 수 있다
      - 네이버처럼 약관 동의만 하면 즉시 키가 발급된다
      - 구글처럼 Developer Token만 신청하면 접근할 수 있다
    question: 카카오모먼트 API의 접근 권한에 대한 설명으로 가장 정확한 것은 무엇일까요?
    explanation: >-
      카카오모먼트 오픈 API는 공식 문서에 명시된 대로 '카카오 광고 공식대행사와 사전에 협의된 광고주에 한하여 권한을 부여'합니다.
      일반 개발자나 소규모 광고주는 직접 신청할 수 없으며, 비즈 앱 전환 심사도 별도로 통과해야 합니다.
    correctIndex: 1
seriesSlug: digitalmarketing
seriesOrder: 5
metaTitle: '비개발자를 위한 카카오모먼트 API 가이드: 권한 신청, 심사부터 코드 예시까지'
metaDescription: >-
  카카오모먼트 API 권한 신청 조건, 비즈 앱 전환, 비즈니스 토큰 발급, 보고서 API 필드 매핑까지. 비개발자 마케터를 위한 카카오모먼트
  API 실전 가이드입니다.
ogTitle: 비개발자도 쓰기 편하게 정리한 카카오모먼트 API 데이터
ogDescription: '카카오모먼트 API 권한 신청부터 보고서 조회, 필드 매핑, 코드 예시까지. 진입 장벽이 높은 카카오 API의 핵심을 정리했습니다.'
ogImage: /og/kakao-moment-api-data-for-non-developers.png
---

## 카카오모먼트 API, 시작하기 전에 알아야 할 것

[구글 Ads API](/insights/google-ads-api-data-for-non-developers), [Meta Ads API](/insights/meta-ads-api-data-for-non-developers), [네이버 검색광고 API](/insights/naver-search-ad-api-data-for-non-developers)에 이어 카카오모먼트 API를 정리합니다.

카카오모먼트 API는 네 매체 중 진입 장벽이 가장 높다고 볼 수 있습니다. 구글, 메타는 개발자 앱을 만들면 바로 데이터에 접근할 수 있고, 네이버도 약관 동의만으로 즉시 키가 발급됩니다. 하지만 카카오모먼트 API는 **카카오 공식대행사이거나, 심의를 통해 카카오와 사전 협의된 광고주만 권한을 받을 수 있습니다.**

이 글에서는 권한 신청 과정의 현실적인 과정부터 시작해서, 실제 데이터를 가져오는 방법까지 정리합니다.


## API 접근 준비: 6단계 (심사 포함)

### 누가 신청할 수 있나요?

카카오모먼트 공식 고객센터 문서의 원문은 이렇습니다.

> "모먼트 오픈API는 카카오 광고 공식대행사와 사전에 협의된 광고주에 한하여 권한을 부여하고, 해당 권한이 있어야 사용할 수 있습니다."

| 대상 | 신청 가능 여부 | 경로 |
|--------|---------------|------|
| 카카오 광고 공식대행사 | O | 카카오 채널 담당자 또는 통합 에이전시 문의게시판 |
| **일반 개발자, 소규모 광고주** | **X** | **담당 카카오 마케터를 통해 신청** |

이 점이 구글, 메타, 네이버와 가장 크게 다릅니다. API를 사용하려면 먼저 카카오에 신청하여 심사에 통과되어야 합니다.

### Step 1~6 전체 과정

| 단계 | 내용 | 소요 시간 |
|------|------|--------|
| Step 1 | 카카오 계정 본인인증 | 즉시 |
| Step 2 | [developers.kakao.com](https://developers.kakao.com)에서 앱 생성 | 10분 |
| Step 3 | **비즈 앱으로 전환 신청 (심사)** | **수 영업일** |
| Step 4 | 카카오비즈니스 이용약관 동의 | 즉시 |
| Step 5 | 비즈니스 인증 설정 (Redirect URI, Client Secret) | 10분 |
| Step 6 | **모먼트 API 권한 신청 (별도 승인)** | **카카오 확인 후** |

가장 시간이 걸리는 단계는 **Step 3 (비즈 앱 전환 심사)**과 **Step 6 (API 권한 승인)**입니다.

### Step 3: 비즈 앱 전환: 무엇을 심사하나요?

Kakao Developers에서 만든 일반 앱을 **비즈 앱(Biz App)**으로 전환해야 합니다. 이 과정에서 카카오가 심사하는 항목은 다음과 같습니다.

- 등록한 서비스와 앱의 일치 여부
- 카카오 운영정책 준수 여부
- 비즈니스 정보의 정확성

비즈 앱 전환이 승인되어야 비즈니스 인증([OAuth](/class/vibe-coding-basics/what-is-authentication))과 모먼트 API 권한 신청이 가능합니다.

### Step 5: 비즈니스 인증 설정

카카오모먼트 API는 일반 카카오 로그인 토큰이 아닌 **비즈니스 토큰(Business Token)**을 사용합니다. 이를 위해 앱 설정에서 다음을 완료해야 합니다.

- **Redirect URI 등록**: 토큰 발급 시 인가 코드를 수신할 URL
- **Client Secret 활성화**: [REST API](/class/digital-basic/what-is-api) 키와 함께 사용
- **비즈니스 동의항목 설정**: `moment_management` 등 필요 스코프 선택

## 인증: 비즈니스 토큰 발급 흐름

구글, 메타의 OAuth와 유사하지만, **비즈니스 전용 엔드포인트**를 사용하는 점이 다릅니다.

```
1. 인가 코드 요청 (브라우저에서 사용자 동의)
   GET https://kauth.kakao.com/oauth/business/authorize
     ?client_id={REST_API_KEY}
     &redirect_uri={REDIRECT_URI}
     &response_type=code
     &scope=moment_management

2. 인가 코드 → 비즈니스 토큰 교환
   POST https://kauth.kakao.com/oauth/business/token
     grant_type=authorization_code
     &client_id={REST_API_KEY}
     &client_secret={CLIENT_SECRET}
     &redirect_uri={REDIRECT_URI}
     &code={AUTH_CODE}

3. API 호출 시 헤더
   Authorization: Bearer {BUSINESS_ACCESS_TOKEN}
   adAccountId: {AD_ACCOUNT_ID}
```

일반 카카오 로그인(`/oauth/authorize`)이 아닌 **`/oauth/business/authorize`**를 사용해야 합니다. 이 차이를 놓치면 토큰은 발급되지만 모먼트 API에 접근할 수 없습니다.


## 카카오모먼트 API로 가져올 수 있는 데이터

### 보고서 API 엔드포인트

| 엔드포인트 | 수준 | 한 번에 최대 | Rate Limit |
|----------|------|-----------|----------|
| `/openapi/v4/adAccounts/report` | 광고계정 | 5개 | 5초에 1회 |
| `/openapi/v4/campaigns/report` | 캠페인 | 5개 | 5초에 1회 |
| `/openapi/v4/adGroups/report` | 광고그룹 | 40개 | 1초에 1회 |
| `/openapi/v4/creatives/report` | 소재 | 100개 | 5초에 1회 |

**주의:** 캠페인 보고서는 한 번에 **최대 5개**만 조회 가능합니다. 캠페인이 20개면 4번 호출해야 하고, 각 호출 사이에 5초를 기다려야 합니다. 이 점이 구글, 메타, 네이버와 비교해서 데이터 수집 속도가 느린 가장 큰 원인입니다.

### metricsGroup: 카카오만의 지표 분류 체계

카카오모먼트 API는 필드를 개별 지정하는 것이 아니라, **metricsGroup(지표 그룹)**을 선택하는 방식입니다.

| metricsGroup | 포함 지표 | 용도 |
|-------------|---------|------|
| `BASIC` | 노출(imp), 클릭(click), CTR, 비용(cost) | 기본 성과 |
| `ADDITION` | 도달(reach), CPM, CPC, CPR | 추가 효율 지표 |
| `VIDEO` | 재생수, 3s/5s/10s/25%/50%/75%/100% 재생, VTR | 영상 캠페인 |
| `MESSAGE` | 발송수, 열람수, 클릭수, 발송실패수 | 메시지 캠페인 |
| `PIXEL_SDK_CONVERSION` | 구매, 회원가입, 장바구니 등 (1일/7일 기여) | 전환 추적 |
| `BIZ_BOARD` | 비즈보드 확장 영역 노출, 클릭 | 비즈보드 전용 |

여러 그룹을 쉼표로 함께 요청할 수 있습니다.

```
metricsGroup=BASIC,ADDITION,PIXEL_SDK_CONVERSION
```

> **메시지 캠페인 주의:** 메시지 캠페인은 `BASIC`이나 `ADDITION` 그룹을 지원하지 않습니다. 반드시 `MESSAGE,MESSAGE_ADDITION` 그룹을 사용해야 합니다.

### 조회 기간 제한

| 항목 | 제한 |
|------|------|
| 최대 조회 기간 | **31일** (start/end 직접 지정 시) |
| 날짜 형식 | `yyyyMMdd` (예: `20250115`) |
| 전일 데이터 확정 시간 | 매일 **오전 5시** 이후 |

### Breakdown(세분화) 차원

| dimension 값 | 설명 |
|-------------|------|
| `CREATIVE_FORMAT` | 소재 형식별 |
| `PLACEMENT` | 게재 지면별 |
| `AGE_BAND` | 연령대별 |
| `GENDER` | 성별 |
| `AGE_BAND_GENDER` | 연령대+성별 |
| `DEVICE_TYPE` | 기기 유형별 |
| `LOCATION` | 지역별 |

한 번에 **1개의 dimension만** 선택할 수 있습니다 (구글, 메타와 달리 조합 불가).


## 마케터 용어 vs API 필드 매핑

| 마케터 용어 | 카카오 필드 | 구글 대응 | Meta 대응 | 네이버 대응 |
|-----------|----------|---------|---------|----------|
| 노출수 | `imp` | `impressions` | `impressions` | `impCnt` |
| 클릭수 | `click` | `clicks` | `inline_link_clicks` | `clkCnt` |
| 클릭률 | `ctr` | `ctr` | `inline_link_click_ctr` | `ctr` |
| 광고비 | `cost` | `cost_micros` (÷1M) | `spend` | `salesAmt` |
| 도달수 | `reach` |: | `reach` |: |
| CPC | `cost_per_click` | `average_cpc` | `cpc` | `cpc` |
| CPM | `cost_per_imp` |: | `cpm` |: |
| 영상 완료 재생 | `video_play_100p` | `video_quartile_p100_rate` | `video_p100_watched_actions` |: |
| 구매 전환 (1일) | `pixel_purchase_1d` | `conversions` | `actions` (파싱) | `ccnt` |
| 구매 전환 (7일) | `pixel_purchase_7d` |: |: |: |

**비용 단위:** 카카오는 네이버와 동일하게 **원화 정수**입니다. 구글처럼 마이크로 단위 변환이 필요 없습니다.

**전환 지표:** 카카오는 기여 기간(1일/7일)이 필드명에 포함되어 있어, 구글, 메타처럼 귀속 기간을 파라미터로 조정하는 것이 아니라 **원하는 기간의 필드를 직접 선택**하는 방식입니다.


## Python 코드 예시: 캠페인 성과 데이터 추출

```python
import requests
import time
from datetime import datetime, timedelta

BASE = "https://apis.moment.kakao.com/openapi/v4"
TOKEN = "your_business_access_token"
AD_ACCOUNT_ID = "your_ad_account_id"

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "adAccountId": str(AD_ACCOUNT_ID),
}

# 1. 캠페인 목록 조회
def get_campaigns():
    resp = requests.get(f"{BASE}/campaigns", headers=HEADERS)
    resp.raise_for_status()
    return resp.json().get("data", [])

# 2. 캠페인 보고서 조회 (최대 5개씩, 5초 간격)
def get_campaign_report(campaign_ids, start_date, end_date):
    params = {
        "campaignId": ",".join(str(c) for c in campaign_ids),
        "start": start_date,
        "end": end_date,
        "metricsGroup": "BASIC,ADDITION",
        "level": "CAMPAIGN",
    }
    resp = requests.get(f"{BASE}/campaigns/report", headers=HEADERS, params=params)
    if resp.status_code == 429:
        time.sleep(10)
        return get_campaign_report(campaign_ids, start_date, end_date)
    resp.raise_for_status()
    return resp.json().get("data", [])

# 3. 전체 캠페인 보고서 수집
def fetch_all(start_date, end_date):
    campaigns = get_campaigns()
    ids = [c["id"] for c in campaigns]
    name_map = {c["id"]: c.get("name", "") for c in campaigns}

    # 5개씩 분할
    chunks = [ids[i:i+5] for i in range(0, len(ids), 5)]
    all_data = []

    for i, chunk in enumerate(chunks):
        print(f"  [{i+1}/{len(chunks)}] 조회 중...")
        rows = get_campaign_report(chunk, start_date, end_date)
        for row in rows:
            metrics = row.get("metrics", {})
            dims = row.get("dimensions", {})
            if not metrics:
                continue
            all_data.append({
                "시작일": row.get("start"),
                "종료일": row.get("end"),
                "캠페인ID": dims.get("campaign_id"),
                "캠페인명": name_map.get(int(dims.get("campaign_id", 0)), ""),
                "노출수": metrics.get("imp", 0),
                "클릭수": metrics.get("click", 0),
                "CTR": metrics.get("ctr", 0),
                "광고비": metrics.get("cost", 0),
                "도달수": metrics.get("reach", 0),
                "CPC": metrics.get("cost_per_click", 0),
                "CPM": metrics.get("cost_per_imp", 0),
            })
        if i < len(chunks) - 1:
            time.sleep(5)  # Rate Limit 준수

    return all_data

# 실행: 최근 7일
end = datetime.today()
start = end - timedelta(days=7)
result = fetch_all(start.strftime("%Y%m%d"), end.strftime("%Y%m%d"))

for r in result:
    print(f"{r['시작일']} | {r['캠페인명']} | 노출 {r['노출수']:,} | 클릭 {r['클릭수']:,} | 비용 {r['광고비']:,.0f}원")
```


## 주의사항 5가지

### 1. 직접 API 작업을 위한 신청이 까다롭습니다

카카오모먼트 API는 구글, 메타, 네이버와 달리 **누구나 신청할 수 없습니다.** 공식대행사이거나 카카오 담당자와 사전 협의된 광고주만 권한을 받을 수 있습니다. 소규모 광고주라면 대행사를 통하거나, 카카오 비즈니스 영업팀에 문의해야 합니다.

### 2. 비즈 앱 전환 심사가 반드시 필요합니다

일반 카카오 개발자 앱으로는 모먼트 API에 접근할 수 없습니다. **비즈 앱 전환 심사**를 통과해야 하며, 서비스-앱 일치 여부와 운영정책 준수 여부를 검토합니다. 심사 기간은 수 영업일이 소요됩니다.

### 3. Rate Limit이 매우 엄격합니다

캠페인 보고서가 **5초에 1회**, 한 번에 **최대 5개 캠페인**만 조회 가능합니다. 캠페인 50개의 일별 데이터를 수집하려면 최소 50초가 걸립니다. 구글이나 메타에 비해 데이터 수집 속도가 상당히 느리므로, 자동화 스케줄링 시 충분한 시간을 확보해야 합니다.

### 4. 메시지 캠페인은 별도 지표 그룹을 사용합니다

카카오톡 메시지 캠페인의 성과를 조회할 때 `metricsGroup=BASIC`을 사용하면 데이터가 반환되지 않습니다. 반드시 **`MESSAGE`, `MESSAGE_ADDITION`** 그룹을 사용해야 합니다.

### 5. Dimension은 1개만 선택 가능합니다

구글, 메타는 연령+성별+디바이스를 동시에 Breakdown할 수 있지만, 카카오는 **한 번에 1개의 dimension만** 선택 가능합니다. 연령+성별 조합이 필요하면 `AGE_BAND_GENDER`라는 전용 dimension을 사용합니다.


## 4개 매체 API 접근 난이도 비교

| 항목 | 구글 Ads | Meta Ads | 네이버 검색광고 | 카카오모먼트 |
|------|---------|---------|------------|----------|
| 키/토큰 발급 | Developer Token + OAuth | 앱 생성 + 시스템 유저 토큰 | **약관 동의로 즉시** | 비즈 앱 심사 + 담당자 승인 |
| 심사 필요 여부 | Developer Token 신청 | Advanced Access 시 앱 검수 | **없음** | **비즈 앱 심사 + API 권한 승인** |
| 진입 난이도 | 중간 | 중간 | **낮음** | **높음** |
| 비용 단위 | 마이크로 (÷1,000,000) | 원화 그대로 | 원화 그대로 | 원화 그대로 |
| 전환 데이터 | 단일 숫자 | 배열 파싱 필요 | 단일 숫자 | 필드명에 기여기간 포함 |
| ROAS | 배수 (3.5) | 직접 계산 | **% 단위 (350)** | 직접 계산 |
| 한 번 최대 조회 기간 | 제한 없음 | 제한 없음 | 92일 | **31일** |
| Rate Limit 체감 | 넉넉함 | 보통 | 보통 | **엄격함** |


## AI로 카카오모먼트 API 구현하기: 프롬프트 모음

### 기본 데이터 추출

```
카카오모먼트 API를 사용해서 Python 코드를 작성해줘.
- Base URL: https://apis.moment.kakao.com/openapi/v4
- 인증: 비즈니스 토큰 (Authorization: Bearer {token})
- 헤더에 adAccountId 포함 필수
- 먼저 /campaigns로 캠페인 목록 조회
- /campaigns/report로 보고서 조회 (최대 5개씩, 5초 간격)
- metricsGroup: BASIC,ADDITION
- 기간: 최근 7일 (yyyyMMdd 형식)
- 캠페인명과 보고서 데이터를 조인해서 CSV 저장
```

### 전환 데이터 포함

```
카카오모먼트 API에서 전환 데이터를 가져오는 코드를 작성해줘.
- metricsGroup에 PIXEL_SDK_CONVERSION 추가
- 구매 전환: pixel_purchase_1d (1일 기여), pixel_purchase_7d (7일 기여)
- 회원가입 전환: pixel_complete_registration_1d
- ROAS 계산: pixel_purchase_value / cost
```

### 4개 매체 통합 리포트

```
구글 Ads, Meta Ads, 네이버 검색광고, 카카오모먼트 데이터를 하나의 통합 리포트로 만드는 코드를 작성해줘.
단위 변환 주의:
- 구글 비용: cost_micros ÷ 1,000,000
- Meta/네이버/카카오 비용: 그대로 사용
- Meta 클릭: inline_link_clicks 사용
- 네이버 ROAS: ror ÷ 100
- 카카오 ROAS: 직접 계산 (conversion_value / cost)
- 통합 컬럼: 매체명, 날짜, 캠페인명, 노출수, 클릭수, 광고비(원), 전환수, ROAS(배수)
```
