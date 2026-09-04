# 준이아빠블로그 BigQuery 데이터 마트

준이아빠블로그의 GA4 이벤트와 Search Console 검색 성과를 하나의 데이터셋에서 조회하는 마트다.

## 구성

- 프로젝트: `hong-project2511` (asia-northeast3)
- 원천: `analytics_520024278`(GA4 일별 내보내기), `searchconsole`(GSC 대량 내보내기)
- 마트: `analytics_dm`

| 테이블 | 파티션 | 클러스터 | 갱신 대상 | 예약 시각(UTC) |
|---|---|---|---|---|
| `events` | DAY(date) | event_name, user_pseudo_id | 전일 | 23:00 |
| `sessions` | DAY(date) | user_pseudo_id | 전일 | 23:20 |
| `content_daily` | DAY(date) | content_type, content_slug | 전일 | 23:40 |
| `search_content_daily` | DAY(date) | content_type, content_slug | 최근 10일 롤링 | 23:55 |

의존 순서는 `events` → `sessions` → `content_daily` → `search_content_daily`다. 예약 시각을 20분씩
띄운 이유가 이 순서 때문이므로 시각을 바꿀 때 순서를 깨지 않는다.

`search_content_daily`가 10일 롤링인 이유는 Search Console이 이미 내보낸 날짜의 수치를 나중에
보정하기 때문이다. 전일만 넣으면 보정분이 반영되지 않는다.

## 파생 규칙

- `content_type`, `content_slug`는 `page_location` 경로에서 만든다. `/insights/{slug}`는 insight,
  `/class/{course}/{slug}`는 class, `/class/{course}`는 course, `/ai-practice/{slug}`는 ai_practice,
  `/ga4-edu/{slug}`는 ga4_edu, `/tags/{tag}`는 tag다.
- `channel_group`은 UDF `analytics_dm.channel_group(source, medium)`이 만든다. 전 기간 유입
  인벤토리를 근거로 삼았고 AI 어시스턴트, 구글 자연검색, 네이버 자연검색, 기타 자연검색,
  자연 소셜, 메신저, 뉴스레터, 유료 검색, 유료 소셜, 추천, 직접으로 나눈다.
- `events`는 로컬 개발 트래픽까지 그대로 담고 `is_local_traffic`으로 표시한다. `sessions`,
  `content_daily`, `search_content_daily`는 이 트래픽을 제외한다.
- `web_avg_position`은 GSC 규칙에 따라 `SUM(sum_position)/SUM(impressions) + 1`로 계산한다.

## 파일

```
bigquery/dm/
├── udf_channel_group.sql          채널 분류 UDF
├── events.sql                     원본 SELECT (파라미터 @start_date, @end_date)
├── sessions.sql
├── content_daily.sql
├── search_content_daily.sql
├── scheduled/                     위 SELECT를 DELETE+INSERT 증분으로 바꾼 예약 쿼리 본문
└── register-scheduled-queries.sh  예약 쿼리 등록 스크립트
```

`scheduled/` 안의 파일은 원본 SQL에서 자동 생성한다. 로직을 고칠 때는 원본을 고친 뒤 다시
생성하고, 이미 등록된 예약 쿼리의 본문도 함께 갱신한다.

## 다시 채우기

```bash
# 특정 구간을 다시 만들 때 (테이블 전체를 교체한다)
{ echo "CREATE OR REPLACE TABLE \`hong-project2511.analytics_dm.events\`"
  echo "PARTITION BY date CLUSTER BY event_name, user_pseudo_id AS"
  cat bigquery/dm/events.sql; } > /tmp/x.sql
bq --project_id=hong-project2511 query --use_legacy_sql=false --format=none \
  --parameter=start_date:DATE:2026-03-01 --parameter=end_date:DATE:2026-09-02 < /tmp/x.sql
```

## 제약

- GA4 내보내기가 일별뿐이라 마트는 D-1이 상한이다. 스트리밍 내보내기는 붙어 있지 않다.
- GSC 대량 내보내기의 `url`이 비어 있는 행(익명 집계분)은 페이지 단위 조인에서 제외한다.
- 예약 쿼리는 등록한 주체의 자격증명으로 실행된다. 서비스 계정 소유로 등록하면 사람 계정
  토큰 만료와 무관하게 돌아간다.

## 대시보드

`bigquery/dm/dashboard/`에 마트를 읽어 화면으로 보여 주는 단일 HTML 파일이 있다.
서버가 필요 없고 브라우저로 바로 연다.

```bash
python3 bigquery/dm/dashboard/build.py        # 마트 전체 기간
python3 bigquery/dm/dashboard/build.py --start 2026-06-01 --end 2026-09-02
open bigquery/dm/dashboard/index.html
```

| 파일 | 내용 |
|---|---|
| `template.html` | 화면 구조, 스타일, 차트 코드. `__PAYLOAD__` 자리에 데이터가 들어간다 |
| `build.py` | 마트에서 집계 쿼리를 돌려 페이로드를 만들고 `index.html`을 쓴다 |
| `index.html` | 생성 결과. 데이터가 안에 들어 있어 파일 하나로 동작한다 |
| `robots.txt` | 배포본 색인 차단 |

### 배포

`index.html`을 고쳐서 main에 올리면 `.github/workflows/dashboard-pages.yml`이
GitHub Pages로 내보낸다. 워크플로는 이 폴더의 `index.html`과 `robots.txt`만 담고
저장소의 다른 파일은 올리지 않는다. `docs/`의 내부 문서가 함께 공개되지 않게 하려는
구성이다.

배포본에는 `noindex, nofollow` 메타와 `Disallow: /` robots.txt가 들어간다.
주소를 아는 사람은 볼 수 있으니 접근 제한이 필요하면 저장소를 비공개로 돌리거나
Pages를 끈다.

구간은 열 개다. 규모와 추세, 유입 채널, 검색 순위와 클릭, 콘텐츠 성과, 검색어,
읽힘 품질, 콘텐츠 수명, 검색면 구성, 최근 28일 증감, 방문 패턴 순이다.
모든 차트에 표 보기가 붙어 있어 수치를 그대로 확인할 수 있다.

### 색과 접근성

계열 색은 색각 이상 구분과 명도 대비를 검사한 팔레트를 쓴다. 라이트와 다크는 같은
색상을 각 배경에 맞게 다시 잡은 값이고 자동으로 바뀐다. 밝은 배경에서 대비가 3:1에
못 미치는 계열이 있어 모든 차트에 범례와 표 보기를 함께 둔다.

차트는 CSS 토큰에서 색을 읽기 때문에 테마가 바뀌면 다시 그린다.

### 수치를 읽을 때

`검색어` 구간의 합계는 페이지별 일간 상위 10개만 더한 값이라 전체 노출보다 작다.
익명 처리된 검색어는 페이지 합계에는 들어가고 검색어 표에서는 빠진다.
평균 순위는 노출 가중 평균이다.
