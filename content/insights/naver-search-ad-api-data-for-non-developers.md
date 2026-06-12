---
slug: naver-search-ad-api-data-for-non-developers
title: 비개발자도 쓰기 편하게 정리한 네이버 검색광고 API 데이터
excerpt: >-
  네이버 검색광고 데이터를 API로 직접 가져오고 싶은 마케터를 위한 가이드입니다. HMAC 인증 방식, 마스터 데이터와 통계 데이터의 분리
  구조, 다른 매체와 필드가 다른 이유, 그리고 구글·메타 데이터와 합칠 때의 주의점까지 — 네이버 API만의 특이점을 중심으로 정리했습니다.
category: MARKETING
tags:
  - 광고
  - API
  - 데이터 분석
  - 자동화
  - 퍼포먼스마케팅
publishedAt: '2026-02-24T08:29:37.751Z'
highlights:
  - 네이버 API는 마스터 데이터와 통계 데이터가 분리되어 있어 JOIN이 필수 — 구글·메타와 가장 큰 구조적 차이
  - 'ROAS 단위 함정: 네이버 ror은 % 단위(350)이고 구글·메타는 배수(3.5) — 통합 시 반드시 ÷100 변환 필요'
  - 'HMAC-SHA256 인증, 92일 조회 제한, 평균 노출순위(avgRnk) 등 네이버 고유 특성과 AI 프롬프트 모음'
quiz:
  - options:
      - 350 — 세 매체 모두 동일한 단위를 사용하므로 변환 불필요
      - 3.5 — 네이버는 % 단위(350%)이므로 100으로 나눠야 배수(3.5배) 단위가 됨
      - 35 — 네이버는 10배 단위이므로 10으로 나눠야 함
      - '0.35 — 네이버는 1,000 단위이므로 1,000으로 나눠야 함'
    question: '네이버 검색광고 API의 ROAS 필드(ror)가 350을 반환했을 때, 구글·메타의 ROAS와 동일한 기준으로 환산하면 얼마일까요?'
    explanation: >-
      네이버의 ror은 퍼센트(%) 단위로 350이 ROAS 350%를 의미합니다. 구글과 메타는 배수 단위로 동일한 값을 3.5로
      표현합니다. 통합 리포트에서 네이버 ror을 100으로 나누지 않으면 ROAS가 100배 부풀려 보이는 실수가 발생합니다.
    correctIndex: 1
seriesSlug: digitalmarketing
seriesOrder: 6
metaTitle: 비개발자를 위한 네이버 검색광고 API 가이드 — 필드 매핑·통합 리포트 주의점
metaDescription: >-
  네이버 검색광고 API 키 발급, HMAC 인증, 통계 필드 매핑, 구글·메타와 통합 시 주의점까지. 비개발자 마케터를 위한 네이버 API
  실전 가이드입니다.
ogTitle: 비개발자도 쓰기 편하게 정리한 네이버 검색광고 API 데이터
ogDescription: '네이버 검색광고 API 인증부터 필드 매핑, 구글·메타 통합 주의점까지. 네이버 API만의 특이점을 중심으로 정리했습니다.'
ogImage: /og/naver-search-ad-api-data-for-non-developers.png
---

## 네이버 검색광고 API, 왜 따로 정리가 필요할까요

[구글 Ads API 가이드](/insights/google-ads-api-data-for-non-developers), [Meta Ads API 가이드](/insights/meta-ads-api-data-for-non-developers)에 이어 네이버 검색광고 API를 정리합니다.

네이버 검색광고 API는 구글·메타와 **구조가 상당히 다릅니다.** 인증 방식이 [OAuth](/class/vibe-coding-basics/what-is-authentication)가 아닌 HMAC 서명 방식이고, 성과 데이터에 캠페인 이름이 포함되지 않아 별도로 조인해야 하며, [ROAS](/class/digital-marketing-terms/what-is-roas) 단위가 배수가 아닌 퍼센트입니다. 이런 차이를 모르고 통합 리포트를 만들면 숫자가 안 맞는 상황이 생깁니다.

이 글에서는 네이버 API만의 특이점을 중심으로, **다른 매체 데이터와 합칠 때 반드시 알아야 할 포인트**를 정리합니다.


## API 접근 준비 — 구글·메타보다 간단합니다

### API 키 발급 (심사 없이 즉시 발급)

구글과 메타는 앱 생성, 권한 신청, 비즈니스 인증 등 여러 단계를 거쳐야 합니다. 반면 네이버 검색광고 API는 **약관 동의만 하면 즉시 발급**됩니다.

**발급 경로:**
![image](https://avqz4vnz10fk0ilw.public.blob.vercel-storage.com/uploads/1771857717126-5zn673.png)

1. [searchad.naver.com](https://searchad.naver.com) 로그인
2. 상단 메뉴: **도구 > API 사용 관리**
3. "네이버 검색광고 API 서비스 신청" → 약관 동의 → 저장

별도의 심사나 승인 절차가 없습니다. 광고주 본인이 직접 신청할 수 있고, 대행사가 고객사 계정에 접근하려면 해당 계정에서 권한 위임을 설정하면 됩니다.

### 발급되는 3가지 크리덴셜

| 크리덴셜 | 설명 | 용도 |
|---------|------|------|
| **CUSTOMER_ID** | 광고주 계정 고유 ID | 모든 API 요청의 헤더에 포함 |
| **API Key (액세스 라이선스)** | API 인증용 키 | 모든 API 요청의 헤더에 포함 |
| **Secret Key (비밀키)** | HMAC-SHA256 서명 생성용 | 서명 생성에만 사용, 전송하지 않음 |

### 인증 방식 — HMAC-SHA256 서명

구글·메타는 OAuth 2.0 토큰을 헤더에 넣어 보내지만, 네이버는 **매 요청마다 HMAC-SHA256 서명을 직접 생성**해서 보내야 합니다.

서명 생성 로직:

```python
import hmac, hashlib, base64, time

def make_signature(timestamp, method, uri, secret_key):
    message = f"{timestamp}.{method}.{uri}"
    raw = hmac.new(
        secret_key.encode("utf-8"),
        message.encode("utf-8"),
        hashlib.sha256
    ).digest()
    return base64.b64encode(raw).decode("utf-8")
```

매 요청에 다음 4개 헤더를 포함합니다.

```
X-API-KEY: {API Key}
X-CUSTOMER: {CUSTOMER_ID}
X-Timestamp: {밀리초 타임스탬프}
X-Signature: {위에서 생성한 서명}
```

비개발자 입장에서 직접 구현할 필요는 없지만, AI에게 코드를 요청할 때 **"네이버 검색광고 API는 HMAC-SHA256 서명 방식"**이라고 명시해야 올바른 코드가 나옵니다.


## 네이버 API의 가장 큰 특이점 — 마스터 데이터와 통계 데이터가 분리되어 있습니다

이것이 네이버 API에서 가장 많이 혼란을 주는 부분입니다.

구글·메타 API는 하나의 요청으로 **캠페인 이름과 성과 데이터를 함께** 가져올 수 있습니다.

```
# 구글: 한 번에 이름 + 성과 조회
SELECT campaign.name, metrics.impressions, metrics.clicks
FROM campaign

# 메타: 한 번에 이름 + 성과 조회
fields=campaign_name,impressions,clicks
```

하지만 네이버는 **성과 데이터(`/stats`)에 ID만 있고 이름이 없습니다.** 캠페인명을 얻으려면 마스터 데이터를 별도로 가져와서 조인해야 합니다.

```
[Step 1] 마스터 데이터 조회
GET /ncc/campaigns → {nccCampaignId: "cmp-xxx", campaignName: "브랜드_캠페인"}

[Step 2] 통계 데이터 조회
GET /stats?ids=["cmp-xxx"] → {id: "cmp-xxx", impCnt: 1000, clkCnt: 50, ...}

[Step 3] 조인
nccCampaignId를 키로 마스터 + 통계를 JOIN → 최종 리포트
```

이 2단계 구조를 모르면 API에서 캠페인명이 안 나온다는 문제에 빠질 수 있습니다.


## 마케터 용어 vs API 필드 매핑

### 기본 통계 필드 (`/stats` 엔드포인트)

| 마케터 용어 | 네이버 API 필드 | 구글 대응 | Meta 대응 | 주의사항 |
|-----------|-------------|---------|---------|--------|
| 노출수 | `impCnt` | `impressions` | `impressions` | 동일 개념 |
| 클릭수 | `clkCnt` | `clicks` | `inline_link_clicks` | 네이버는 과금 클릭 기준 |
| 광고비 | `salesAmt` | `cost_micros` | `spend` | **원화 정수** (변환 불필요) |
| 클릭률 | `ctr` | `ctr` | `ctr` | 동일 개념 |
| 평균 CPC | `cpc` | `average_cpc` | `cpc` | 원화 정수 |
| **평균 노출순위** | **`avgRnk`** | **(없음)** | **(없음)** | **네이버 고유 지표** |
| 전환수 | `ccnt` | `conversions` | `actions` (파싱) | 네이버는 단일 숫자 |
| 전환율 | `crto` | 직접 계산 | 직접 계산 | % 단위 |
| 전환매출 | `convAmt` | `conversions_value` | `action_values` (파싱) | 원화 정수 |
| **ROAS** | **`ror`** | `roas` | 직접 계산 | **네이버는 % 단위!** (아래 설명) |

### 네이버만 있는 고유 지표

| 필드 | 설명 | 활용 |
|------|------|------|
| `avgRnk` | 평균 노출순위 | 파워링크 입찰 최적화 (구글은 2019년 폐기, 메타는 해당 없음) |
| `recentAvgRnk` | 최근 28일 평균 순위 | 순위 트렌드 모니터링 |
| `recentAvgCpc` | 최근 28일 평균 CPC | CPC 트렌드 모니터링 |
| `drtCrto` | 직접 전환율 | 어시스트 전환 제외한 직접 기여만 |


## 통합 리포트 만들 때 반드시 주의할 3가지

### 1. 비용 단위가 다릅니다

```python
# 네이버: 원화 정수 → 그대로 사용
naver_cost = 150000  # 150,000원

# 구글: 마이크로 단위 → 1,000,000으로 나누기
google_cost = 150000000000 / 1_000_000  # → 150,000원

# Meta: 원화 그대로 (해외 계정은 USD → 환율 변환 필요)
meta_cost = 150000  # 150,000원
```

### 2. ROAS 단위가 다릅니다

```python
# 네이버 ror: % 단위 (350 = 350%)
naver_roas = 350 / 100  # → 3.5 (배수로 변환)

# 구글 roas: 배수 (3.5 = 350%)
google_roas = 3.5  # 그대로 사용

# Meta: 직접 계산 (purchase_value / spend)
meta_roas = purchase_value / spend  # 배수
```

**네이버의 `ror`을 다른 매체의 ROAS와 합칠 때는 반드시 100으로 나눠서 배수 단위로 통일해야 합니다. **이걸 빠뜨리면 네이버만 ROAS가 100배 부풀려 보입니다.

### 3. 클릭 기준이 다릅니다

| 매체 | "클릭" 필드 | 포함 범위 |
|------|-----------|--------|
| 네이버 | `clkCnt` | 과금 클릭 (광고 클릭) |
| 구글 | `clicks` | 링크 클릭 |
| Meta | `clicks` | **모든 클릭** (좋아요·공유 포함) |
| Meta | `inline_link_clicks` | 링크 클릭 (구글과 동일) |

통합 리포트에서 "클릭수"를 비교하려면, Meta는 `inline_link_clicks`를 사용해야 네이버·구글과 동일한 기준이 됩니다.

## 통계 데이터 조회 상세

### 엔드포인트와 파라미터

```
GET https://api.naver.com/stats
```

| 파라미터 | 설명 | 예시 |
|---------|------|------|
| `ids` | 조회 대상 ID (JSON 문자열) | `'["cmp-a001-01-000000001234567"]'` |
| `fields` | 조회할 필드 (JSON 문자열) | `'["impCnt","clkCnt","salesAmt"]'` |
| `timeRange` | 조회 기간 (JSON 문자열) | `'{"since":"2025-01-01","until":"2025-01-31"}'` |
| `timeIncrement` | 집계 단위 | `"1"` (일별) |

**핵심 제약사항:**

| 항목 | 내용 |
|------|------|
| 한 번에 조회 가능한 최대 기간 | **92일** (약 3개월) |
| 과거 데이터 보관 기간 | **365일** |
| ID 타입 혼용 | **불가** — 캠페인 ID만 OR 광고그룹 ID만 (섞으면 400 에러) |
| fields 파라미터 형식 | Python 리스트가 아닌 **JSON 문자열**로 전달 (가장 흔한 에러) |
| 당일 데이터 | 실시간 증가 중 → **전일 데이터 기준 수집 권장** |

> **흔히 알려진 "하루씩만 조회 가능"에 대한 오해**
>
> `timeRange`에 날짜 범위를 지정하면 여러 날을 한 번에 조회할 수 있습니다. 다만 최대 92일 제한이 있고, `timeIncrement: "1"`로 설정하면 일별 행으로 반환됩니다. 3개월 이상의 데이터가 필요하면 92일씩 나눠서 여러 번 호출해야 합니다.


## Python 코드 예시 — 일별 캠페인 데이터 추출

```python
import hmac, hashlib, base64, json, time, csv
from datetime import date, timedelta
import requests

# 설정
API_KEY = "your_access_license"
SECRET_KEY = "your_secret_key"
CUSTOMER_ID = "your_customer_id"
BASE = "https://api.naver.com"

def get_headers(method, uri):
    ts = str(round(time.time() * 1000))
    msg = f"{ts}.{method}.{uri}"
    sig = base64.b64encode(
        hmac.new(SECRET_KEY.encode(), msg.encode(), hashlib.sha256).digest()
    ).decode()
    return {
        "X-API-KEY": API_KEY,
        "X-CUSTOMER": CUSTOMER_ID,
        "X-Timestamp": ts,
        "X-Signature": sig,
        "Content-Type": "application/json; charset=UTF-8",
    }

# Step 1: 캠페인 마스터 데이터
def get_campaigns():
    uri = "/ncc/campaigns"
    resp = requests.get(BASE + uri, headers=get_headers("GET", uri))
    resp.raise_for_status()
    return {c["nccCampaignId"]: c["campaignName"] for c in resp.json()}

# Step 2: 캠페인 통계 데이터
def get_stats(campaign_id, target_date):
    uri = "/stats"
    d = target_date.strftime("%Y-%m-%d")
    params = {
        "ids": json.dumps([campaign_id]),
        "fields": json.dumps(["impCnt","clkCnt","salesAmt","ctr","cpc","avgRnk","ccnt","convAmt","ror"]),
        "timeRange": json.dumps({"since": d, "until": d}),
    }
    resp = requests.get(BASE + uri, headers=get_headers("GET", uri), params=params)
    if resp.status_code == 429:
        time.sleep(1)
        return get_stats(campaign_id, target_date)
    resp.raise_for_status()
    return resp.json()

# Step 3: 마스터 + 통계 조인
yesterday = date.today() - timedelta(days=1)
campaign_map = get_campaigns()

results = []
for cid, cname in campaign_map.items():
    for stat in get_stats(cid, yesterday):
        results.append({
            "날짜": yesterday.isoformat(),
            "캠페인명": cname,
            "노출수": stat.get("impCnt", 0),
            "클릭수": stat.get("clkCnt", 0),
            "광고비": stat.get("salesAmt", 0),
            "평균순위": stat.get("avgRnk", 0),
            "전환수": stat.get("ccnt", 0),
            "전환매출": stat.get("convAmt", 0),
            "ROAS(%)": stat.get("ror", 0),
            "ROAS(배수)": round(stat.get("ror", 0) / 100, 2),  # 타 매체 통일 기준
        })
    time.sleep(0.4)  # Rate Limit 방지

# CSV 저장
if results:
    with open("naver_report.csv", "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(f, fieldnames=results[0].keys())
        writer.writeheader()
        writer.writerows(results)
    print(f"{len(results)}개 캠페인 데이터 저장 완료")
```


## 통합 리포트 공통 스키마 — 구글·Meta·네이버를 하나로

세 매체의 데이터를 하나의 테이블로 합치려면, **공통 스키마**를 먼저 정의하고 각 매체의 값을 변환해서 넣어야 합니다.

```python
unified = {
    "date": "2025-01-15",
    "media": "naver",            # "google" | "meta" | "naver"
    "campaign_name": "브랜드_캠페인",
    "impressions": 10000,
    "clicks": 300,               # Meta는 inline_link_clicks 사용
    "cost_krw": 150000,          # 구글은 ÷1,000,000, Meta USD면 환율 변환
    "ctr_pct": 3.0,
    "cpc_krw": 500,
    "conversions": 15,           # Meta는 actions에서 파싱
    "conversion_value_krw": 525000,
    "roas": 3.5,                 # 네이버는 ror ÷ 100
    "avg_position": 1.8,         # 네이버만 존재 (타 매체: None)
}
```


## AI로 네이버 API 구현하기 — 프롬프트 모음

### 기본 데이터 추출

```
네이버 검색광고 API를 사용해서 Python 코드를 작성해줘.
- 인증: HMAC-SHA256 서명 방식 (X-API-KEY, X-CUSTOMER, X-Timestamp, X-Signature)
- Base URL: https://api.naver.com
- 먼저 /ncc/campaigns로 캠페인 목록을 가져오고
- /stats로 전일 통계 데이터를 가져온 뒤
- nccCampaignId를 키로 캠페인명과 통계를 조인
- 필드: impCnt, clkCnt, salesAmt, ctr, cpc, avgRnk, ccnt, convAmt, ror
- fields 파라미터는 JSON 문자열로 전달 (Python 리스트 아님!)
- 결과를 CSV로 저장
```

### 3개월 데이터 일괄 수집

```
네이버 검색광고 API로 최근 3개월 일별 데이터를 수집하는 코드를 작성해줘.
- timeRange 최대 92일 제한 있으니 기간을 분할해서 조회
- timeIncrement: "1"로 일별 집계
- Rate Limit 주의: 요청 간 0.5초 간격
- 캠페인 마스터는 1번만 조회하고 캐싱
```

### 통합 리포트 (구글 + Meta + 네이버)

```
구글 Ads API, Meta Ads API, 네이버 검색광고 API 데이터를 하나로 합치는 코드를 작성해줘.
단위 변환 주의:
- 구글 비용: cost_micros ÷ 1,000,000
- Meta 비용: spend 그대로
- 네이버 비용: salesAmt 그대로
- Meta 클릭: inline_link_clicks 사용 (clicks 아님)
- 네이버 ROAS: ror ÷ 100 (% → 배수 변환)
- 통합 컬럼: 매체명, 날짜, 캠페인명, 노출수, 클릭수, 광고비(원), 전환수, ROAS(배수)
```
