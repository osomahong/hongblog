---
slug: google-ads-api-data-for-non-developers
title: 비개발자도 쓰기 편하게 정리한 구글 Ads API 데이터
excerpt: >-
  구글 Ads API로 가져올 수 있는 필드, 마케터가 보는 지표와 API 필드명 매핑, 연결 과정, 주의사항, 그리고 AI로 쉽게 구현하는
  팁까지. 비개발자를 위한 실전 가이드.
category: MARKETING
tags:
  - Google 광고
  - API
  - 데이터 분석
  - AI
  - 마케팅 실무
publishedAt: '2026-02-23T09:50:36.903Z'
quiz:
  - options:
      - 'metrics.cost_micros 값을 1,000,000으로 나눠야 한다'
      - metrics.cost 값을 그대로 사용하면 된다
      - 'metrics.cost_micros 값을 1,000으로 나눠야 한다'
      - currency 필드를 별도로 조회해야 한다
    question: '구글 Ads API에서 광고 비용(cost) 데이터를 가져올 때, 실제 금액을 구하려면 어떤 처리가 필요할까요?'
    explanation: >-
      구글 Ads API는 비용을 마이크로(micro) 단위로 반환합니다. 예를 들어 10,000원이면 10,000,000,000
      마이크로로 표시됩니다. 실제 금액을 구하려면 반드시 1,000,000으로 나눠야 합니다. 이걸 모르고 데이터를 뽑으면 비용이 100만
      배로 보이는 사고가 발생합니다.
    correctIndex: 0
seriesSlug: digitalmarketing
seriesOrder: 9
metaTitle: 비개발자도 쓰기 편하게 정리한 구글 Ads API 데이터 | 실전 가이드
metaDescription: >-
  구글 Ads API 필드 구조, 마케팅 지표 매핑, 연결 과정, PMax, 디멘드젠 소재 성과 추출법, AI 프롬프트 활용 팁까지. 비개발자
  마케터를 위한 실전 정리.
ogTitle: 비개발자도 쓰기 편하게 정리한 구글 Ads API 데이터
ogDescription: '마케터가 알아야 할 구글 Ads API 핵심만 정리. 필드 매핑표, 연결 과정, PMax 소재 성과 추출, AI 활용 팁까지.'
ogImage: /og/google-ads-api-data-for-non-developers.png
---

## 구글 Ads API로 가져올 수 있는 데이터

구글 Ads API는 광고 계정의 거의 모든 데이터를 가져올 수 있습니다. 구글 Ads 대시보드에서 볼 수 있는 데이터는 대부분 API로도 조회가 가능합니다.

크게 세 가지로 나눠서 보면 이해가 쉽습니다.

### 1. 구조 데이터 (어디서 돌아가는 광고인지)

| 구분 | API 리소스 | 설명 |
|------|-----------|------|
| 캠페인 | campaign | 캠페인 이름, ID, 유형, 상태, 예산 등 |
| 광고그룹 | ad_group | 광고그룹 이름, ID, 상태, 입찰 전략 등 |
| 광고 소재 | ad_group_ad | 광고 제목, 설명, URL, 소재 유형 등 |
| 키워드 | ad_group_criterion | 키워드, 매치 타입, 품질점수 등 |
| 에셋 그룹 | asset_group | PMax 전용. 에셋 그룹 이름, 상태 등 |

### 2. 성과 데이터 (얼마나 잘 돌아가는지)

| 구분 | API 필드 | 설명 |
|------|---------|------|
| 노출수 | metrics.impressions | 광고가 노출된 횟수 |
| 클릭수 | metrics.clicks | 광고가 클릭된 횟수 |
| 비용 | metrics.cost_micros | 사용 금액 (마이크로 단위) |
| 전환수 | metrics.conversions | 전환 발생 횟수 |
| 전환가치 | metrics.conversions_value | 전환의 금전적 가치 |
| CTR | metrics.ctr | 클릭률 |
| 평균 CPC | metrics.average_cpc | 평균 클릭당 비용 |
| 전환당 비용 | metrics.cost_per_conversion | CPA |
| 노출 점유율 | metrics.search_impression_share | 검색 노출 점유율 |

### 3. 분류 데이터 (어떤 조건에서 발생했는지)

| 구분 | API 세그먼트 | 설명 |
|------|------------|------|
| 날짜 | segments.date | 일별 데이터 분리 |
| 기기 | segments.device | MOBILE, DESKTOP, TABLET |
| 네트워크 | segments.ad_network_type | 검색, 디스플레이, 유튜브 등 |
| 전환 액션 | segments.conversion_action | 어떤 전환인지 구분 |
| 시간대 | segments.hour | 시간대별 데이터 |

## 마케터가 보는 지표 vs API 필드 매핑

마케터가 리포트에서 쓰는 용어와 API 필드명이 다릅니다. 이 매핑을 모르면 AI에게 요청할 때도 엉뚱한 데이터를 받게 되어 반복해서 요청하는 경우가 빈번합니다.

| 마케터 용어 | API 필드명 | 주의사항 |
|------------|-----------|----------|
| 비용(Cost) | metrics.cost_micros | **1,000,000으로 나눠야 실제 금액.** 이게 가장 흔한 실수입니다 |
| 전환수 | metrics.conversions | 소수점이 나올 수 있음 (기여 모델에 따라) |
| 전환가치 | metrics.conversions_value | 이커머스 매출 등 |
| ROAS | 직접 계산 필요 | conversions_value ÷ (cost_micros ÷ 1,000,000) |
| CPA | metrics.cost_per_conversion | 마이크로 단위. 역시 나누기 필요 |
| CPC | metrics.average_cpc | 마이크로 단위 |
| CTR | metrics.ctr | 0~1 사이 소수 (0.05 = 5%) |
| 노출수 | metrics.impressions | 정수 |
| 클릭수 | metrics.clicks | 정수 |
| 품질점수 | ad_group_criterion.quality_info.quality_score | 1~10 사이 정수. 키워드 레벨에서만 조회 가능 |

> **핵심 포인트**: 구글 Ads API에서 금액 관련 필드는 전부 마이크로(micro) 단위입니다. 1원 = 1,000,000 마이크로. 이걸 빠뜨리면 데이터가 완전히 틀어집니다.

## API 연결 과정 (간단 요약)

구글 Ads API를 연결하는 과정은 크게 4단계입니다. 비개발자 입장에서 각 단계가 무엇을 하는 건지만 이해하면 됩니다.

### 1단계: Google Cloud Console에서 프로젝트 만들기

[Google Cloud Console](https://console.cloud.google.com)에서 새 프로젝트를 만들고, Google Ads API를 활성화합니다.

### 2단계: OAuth 2.0 인증 설정

API가 "이 사람이 이 계정 데이터를 볼 수 있는 사람인지" 확인하는 과정입니다. [OAuth 2.0](/class/vibe-coding-basics/what-is-authentication) 클라이언트 ID를 만들고, 동의 화면을 설정합니다.

여기서 받는 **Client ID**와 **Client Secret**은 나중에 코드에서 쓰이니 잘 보관해야 합니다.

### 3단계: 개발자 토큰 발급

구글 Ads 계정 > 도구 > API 센터에서 개발자 토큰을 발급받습니다.

처음에는 테스트 계정 전용 토큰이 나오고, 실제 계정에 쓰려면 기본 액세스 승인을 받아야 합니다. 승인은 보통 며칠 걸립니다.

### 4단계: GAQL로 데이터 요청

구글 Ads API는 **GAQL**(Google Ads Query Language)이라는 전용 쿼리 언어를 사용합니다. SQL과 비슷한 형태입니다.

```sql
SELECT
  campaign.name,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM campaign
WHERE segments.date DURING LAST_7_DAYS
```

위 쿼리를 해석하면, "지난 7일간 캠페인별 노출수, 클릭수, 비용, [전환](/class/digital-marketing-terms/what-is-conversion)수를 가져와라"입니다.

> **AI 활용 팁**: 이 GAQL 쿼리를 직접 작성할 필요가 없습니다. AI에게 "캠페인별 지난 30일 성과 데이터를 구글 Ads API GAQL로 작성해줘"라고 하면 바로 만들어줍니다.

## AI로 구글 Ads API 구현하기 (핵심)

비개발자가 API를 직접 다룰 수 있게 된 가장 큰 이유는 AI입니다. 코드를 몰라도, 원하는 데이터가 뭔지만 설명하면 AI가 코드를 작성해줍니다.

### 프롬프트 작성 요령

AI에게 코드를 요청할 때, 아래 구조로 말하면 정확도가 올라갑니다.

**프롬프트 템플릿:**

```
구글 Ads API를 사용해서 [원하는 데이터]를 가져오는 Python 코드를 작성해줘.

조건:
- 기간: [기간]
- 레벨: [캠페인/광고그룹/키워드]
- 필요한 지표: [노출수, 클릭수, 비용, 전환수 등]
- 출력 형식: [CSV/DataFrame/JSON]
- google-ads 라이브러리 사용
- 인증 정보는 yaml 파일에서 읽어오는 방식
```

**실전 예시:**

```
구글 Ads API를 사용해서 캠페인별 성과 데이터를 가져오는 Python 코드를 작성해줘.

조건:
- 기간: 최근 30일
- 레벨: 캠페인
- 필요한 지표: 캠페인명, 캠페인 유형, 노출수, 클릭수, 비용, 전환수, 전환가치
- 비용은 마이크로 단위를 원화로 변환해줘
- ROAS도 계산해서 추가해줘
- 결과를 pandas DataFrame으로 만들고 CSV로 저장
- google-ads 라이브러리 사용
```

이렇게 요청하면 AI가 인증 설정부터 데이터 가공까지 전체 코드를 생성해줍니다.

### GAQL 쿼리만 따로 요청하기

코드 전체가 아니라 GAQL 쿼리만 필요할 때도 있습니다. 구글 Ads API의 [쿼리 빌더](https://developers.google.com/google-ads/api/fields/v19/overview_query_builder)에 직접 붙여넣어서 테스트할 수 있습니다.

```
아래 조건으로 구글 Ads API GAQL 쿼리를 작성해줘.

- 리소스: ad_group (광고그룹 레벨)
- 필드: 캠페인명, 광고그룹명, 노출수, 클릭수, 비용, 전환수, CTR, CPC
- 기간: 2025-01-01 ~ 2025-01-31
- 조건: 노출수 100 이상인 것만
- 정렬: 비용 내림차순
```

### 에러 해결도 AI에게

가장 강력한 활용법은 에러 해결입니다. API를 쓰다 보면 에러 메시지가 자주 나오는데, 그 메시지를 그대로 AI에게 붙여넣으면 됩니다.

```
구글 Ads API에서 이런 에러가 나왔어:
"PERMISSION_DENIED: The caller does not have permission"

인증은 yaml 파일로 설정했고, 개발자 토큰은 테스트 계정용이야.
원인과 해결 방법을 알려줘.
```

AI는 에러 코드별 원인을 잘 알고 있어서, 대부분 정확한 해결책을 제시합니다.

---

## API 사용 시 주의할 점

### 1. 마이크로 단위 변환

앞서 강조했지만 다시 한번 말씀드립니다. **금액 관련 필드는 전부 마이크로 단위**입니다.

- `metrics.cost_micros` 값이 15,000,000,000이면 실제 비용은 15,000원
- 나누기 1,000,000을 빠뜨리면 리포트 숫자가 100만 배 뻥튀기됩니다

AI에게 코드를 요청할 때 "비용은 마이크로 단위를 실제 금액으로 변환해줘"를 반드시 포함하세요.

### 2. 전환수가 소수점으로 나온다

구글 Ads의 전환은 기여 모델([Attribution Model](/class/digital-marketing-terms/what-is-attribution))에 따라 소수점이 나올 수 있습니다. 예를 들어 데이터 기반 기여 모델에서는 하나의 전환이 여러 터치포인트에 분배되므로 0.3, 0.7 같은 값이 나옵니다.

정수로 맞추고 싶다면 `metrics.all_conversions`를 쓰거나, 전환 액션별로 따로 집계해야 합니다.

### 3. 날짜 범위와 타임존

구글 Ads API는 계정에 설정된 타임존 기준으로 데이터를 반환합니다. 다른 매체 API와 합칠 때 타임존이 다르면 날짜별 데이터가 안 맞을 수 있습니다.

### 4. API 할당량(Quota)

구글 Ads API에는 일일 요청 제한이 있습니다. 기본 액세스 기준으로 하루 15,000건 정도입니다. 계정이 많거나 세그먼트를 잘게 나눠서 요청하면 금방 소진될 수 있으니 주의해야 합니다.

### 5. 데이터 지연

당일 데이터는 실시간이 아닙니다. 보통 3시간 정도 지연이 있고, 전환 데이터는 전환 기간(Conversion Window) 설정에 따라 최대 90일까지 소급 반영될 수 있습니다.

## 캠페인 유형별 데이터 추출 주의사항

구글 Ads는 캠페인 유형에 따라 API로 가져올 수 있는 [데이터 구조](/class/digital-basic/what-is-json-and-data-structures)가 다릅니다. 이 부분이 비개발자에게 가장 혼란스러운 영역입니다.

### 검색(Search) / 디스플레이(Display) 캠페인

가장 표준적인 구조입니다. 캠페인 → 광고그룹 → 광고 소재(키워드) 순으로 데이터를 내려갈 수 있고, 각 레벨에서 성과 지표를 모두 조회할 수 있습니다.

```
캠페인 레벨: campaign + metrics.*
광고그룹 레벨: ad_group + metrics.*
키워드 레벨: ad_group_criterion + metrics.*
소재 레벨: ad_group_ad + metrics.*
```

### Performance Max (PMax)

PMax는 구조가 다릅니다. **광고그룹이 없고, 에셋 그룹(Asset Group)이라는 단위를 씁니다.**

| 레벨 | 가능 여부 | 비고 |
|------|----------|------|
| 캠페인 | O | 전체 성과 확인 가능 |
| 에셋 그룹 | O | campaign.advertising_channel_type = PERFORMANCE_MAX 필터 필요 |
| 개별 소재 성과 | **제한적** | 에셋별 성과등급(BEST/GOOD/LOW)만 제공. 에셋별 클릭수, 전환수는 없음 |
| 채널별 분리 | **불가** | 검색/디스플레이/유튜브 어디서 노출됐는지 분리 불가 |

**PMax 소재 성과를 최대한 파악하는 방법:**

에셋 그룹 레벨의 성과는 아래 GAQL로 가져올 수 있습니다.

```sql
SELECT
  campaign.name,
  asset_group.name,
  metrics.impressions,
  metrics.clicks,
  metrics.cost_micros,
  metrics.conversions
FROM asset_group
WHERE campaign.advertising_channel_type = 'PERFORMANCE_MAX'
  AND segments.date DURING LAST_30_DAYS
```

개별 에셋(이미지, 텍스트 등)의 성과 등급은 아래로 조회합니다.

```sql
SELECT
  campaign.name,
  asset_group.name,
  asset_group_asset.asset,
  asset_group_asset.performance_label,
  asset_group_asset.field_type
FROM asset_group_asset
WHERE campaign.advertising_channel_type = 'PERFORMANCE_MAX'
```

`performance_label`은 BEST, GOOD, LOW, LEARNING, PENDING 중 하나입니다. 숫자 지표는 제공되지 않습니다.

> **AI 활용 팁**: AI에게 "PMax 캠페인의 에셋 그룹별 성과와 에셋별 성과 등급을 한 번에 가져오는 코드를 작성해줘. 두 개의 GAQL 쿼리 결과를 하나의 리포트로 합쳐줘"라고 요청하면 됩니다.

### 디멘드젠(Demand Gen)

디멘드젠도 PMax와 비슷하게 일부 제약이 있습니다.

| 레벨 | 가능 여부 | 비고 |
|------|----------|------|
| 캠페인 | O | 전체 성과 확인 가능 |
| 광고그룹 | O | 일반 광고그룹 구조 사용 |
| 소재 레벨 | **제한적** | 이미지/동영상 에셋 조합별 성과 분리가 어려움 |

디멘드젠에서 소재별 성과를 보려면 광고 단위(`ad_group_ad`)에서 조회해야 하지만, 여러 에셋이 조합되어 노출되므로 "이 이미지가 성과를 냈다"고 단정짓기 어렵습니다.

### 앱 캠페인(App Campaign)

앱 캠페인은 API로 볼 수 있는 데이터가 가장 제한적입니다.

| 레벨 | 가능 여부 | 비고 |
|------|----------|------|
| 캠페인 | O | 전체 성과 확인 가능 |
| 광고그룹 | O | 광고그룹 레벨 데이터 제공 |
| 소재 레벨 | **매우 제한적** | 에셋 성과 등급만 제공. PMax와 유사 |
| 타겟팅 상세 | **불가** | 어떤 앱/사이트에 노출됐는지 확인 불가 |

## 다른 매체 API와 합칠 때 주의사항

구글 Ads API 데이터를 Meta, 네이버, 카카오 등 다른 매체 데이터와 합쳐서 통합 리포트를 만들 때가 많습니다. 이때 자주 발생하는 문제들을 정리합니다.

### 1. 레벨 통일하기

매체마다 계층 구조가 다릅니다.

| 구글 Ads | Meta Ads | 네이버 검색광고 |
|---------|---------|---------------|
| 캠페인 | 캠페인 | 캠페인 |
| 광고그룹 | 광고세트 | 광고그룹 |
| 광고 | 광고 | 소재 |
| 키워드 | - | 키워드 |
| 에셋 그룹(PMax) | - | - |

같은 "캠페인 레벨"이라도 매체마다 포함하는 범위가 다를 수 있습니다. 통합 리포트를 만들 때는 반드시 어떤 레벨로 맞출지 먼저 정하고 시작해야 합니다.

> **AI 활용 팁**: "구글 Ads API와 Meta Marketing API에서 캠페인 레벨 데이터를 각각 가져와서, 날짜 + 캠페인명 기준으로 하나의 DataFrame에 합치는 코드를 작성해줘. 컬럼명은 한국어로 통일해줘"라고 요청하면 됩니다.

### 2. 지표 정의 차이

같은 이름이라도 매체마다 계산 방식이 다릅니다.

| 지표 | 구글 Ads | Meta Ads |
|------|---------|----------|
| 전환 | 설정한 전환 액션 기준, 기여 모델 적용 | 기본 1일 뷰 / 7일 클릭 기여 |
| ROAS | 직접 계산 | 구매 이벤트 가치 ÷ 비용 |
| 비용 | 마이크로 단위 (÷1,000,000) | 일반 단위 (그대로 사용) |
| CTR | 소수점 (0.05 = 5%) | 소수점 (0.05 = 5%) |
| CPC | 마이크로 단위 | 일반 단위 |

**가장 흔한 실수**: 구글은 마이크로 단위 변환을 해야 하고 Meta는 그대로 쓰면 됩니다. 이걸 깜빡하면 구글 비용만 100만 배로 잡힙니다.

### 3. 전환 기여 기간(Attribution Window)

구글과 Meta의 기본 전환 기여 기간이 다릅니다. 동일한 기준으로 맞추지 않으면 매체별 성과 비교 자체가 의미가 없어집니다.

- **구글 Ads**: 기본 30일 클릭, 1일 뷰 (설정에 따라 다름)
- **Meta Ads**: 기본 7일 클릭, 1일 뷰

### 4. PMax ,  디멘드젠 데이터의 한계 인식

PMax와 디멘드젠은 소재 레벨 성과가 제한적이기 때문에, 통합 리포트에서 "소재별 성과 비교"를 할 때 구글 쪽 데이터가 빈약해 보일 수 있습니다.

이런 경우 구글 측은 에셋 그룹 레벨까지만 비교하고, 소재 상세 비교는 Meta 등 데이터가 충분한 매체 중심으로 진행하는 것이 현실적입니다.


## AI 활용 프롬프트 모음 (바로 복사해서 쓰세요)

### 기본 데이터 추출

```
구글 Ads API(Python google-ads 라이브러리)로
[캠페인/광고그룹/키워드] 레벨의 최근 [기간] 성과 데이터를 가져오는 코드를 작성해줘.

필요한 지표: 노출수, 클릭수, 비용(원화), 전환수, ROAS
bigquery가 아니라 google-ads 라이브러리 사용.
cost_micros는 원화로 변환.
결과는 pandas DataFrame → CSV 저장.
```

### PMax 소재 성과 분석

```
구글 Ads API로 Performance Max 캠페인의
에셋 그룹별 성과 + 에셋별 성과 등급을 가져오는 코드를 작성해줘.

두 개의 GAQL 쿼리를 실행해서:
1) 에셋 그룹별 노출수, 클릭수, 비용, 전환수
2) 에셋별 performance_label, field_type

두 결과를 에셋 그룹 기준으로 합쳐서 하나의 리포트로 만들어줘.
```

### 통합 리포트 생성

```
구글 Ads API와 Meta Marketing API에서 각각
캠페인 레벨 일별 성과 데이터를 가져와서 통합 리포트를 만드는 코드를 작성해줘.

컬럼: 날짜, 매체, 캠페인명, 노출수, 클릭수, 비용(원), 전환수, ROAS
구글은 cost_micros 변환 필요.
두 매체 데이터를 concat해서 하나의 CSV로 저장.
```

### 에러 해결

```
구글 Ads API 호출 시 아래 에러가 발생했어:
[에러 메시지 전체 복사]

환경: Python, google-ads 라이브러리, yaml 인증 방식
원인과 해결 방법을 단계별로 알려줘.
```


## 정리

| 항목 | 핵심 |
|------|------|
| 가져올 수 있는 데이터 | 구조(캠페인/광고그룹/소재), 성과(지표), 분류(날짜/기기/네트워크) |
| 금액 데이터 | 마이크로 단위. 반드시 ÷1,000,000 |
| 전환수 | 소수점 가능 (기여 모델 때문) |
| PMax 소재 성과 | 에셋 그룹까지는 숫자 지표 가능. 개별 에셋은 등급(BEST/GOOD/LOW)만 |
| 디멘드젠, 앱 캠페인 | 소재 단위 성과 제한적 |
| 다른 매체와 합칠 때 | 레벨 통일, 마이크로 단위 변환, 전환 기여 기간 차이 확인 |
| AI 활용 | GAQL 생성, 코드 작성, 에러 해결까지 전부 가능. 조건을 명확하게 쓰는 게 핵심 |
