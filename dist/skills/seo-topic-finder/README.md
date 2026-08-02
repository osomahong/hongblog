# seo-topic-finder

사이트가 이미 받고 있는 검색 데이터에서 **아직 글이 없는 자리**를 찾아, 근거와 약점을 붙인 주제 후보로 만드는 Claude Code 스킬.

규칙 하나 위에 서 있다. **직감으로 추천하지 않는다.** 검색량, 현재 순위, 경쟁 점유는 측정하는 것이지 짐작하는 것이 아니다. 필수 소스가 없으면 후보를 하나도 만들지 않는다. 무엇이 없는지 알리고, 설정 절차를 안내하고, 멈춘다.

그 거절이 기능이다. 이 스킬의 근거 형식을 두른 추천은 어떤 단서를 달아도 측정한 것으로 읽힌다. 그래서 부분 실행을 제공하지 않는다.

`seo-title-creator`의 자매 스킬이다. 이쪽이 **무엇을 쓸지**를 정하고, 그쪽이 **뭐라고 부를지**를 정한다. 자격증명 파일을 공유하므로 한쪽을 설정했다면 다른 쪽은 추가 설정이 없다.

---

## 하는 일

| 범위 안 | 범위 밖 |
|---|---|
| 주제 후보 3~7개, 각각 근거와 약점 포함 | 본문 작성, 개요 작성 |
| 타깃 검색어 묶음 | 제목 추천 (`seo-title-creator`) |
| 검색량, 현재 순위, 경쟁 점유 | 기존 글 보강 방안 |
| 자기잠식 판정과 **쓰지 말아야 할 자리** 목록 | 내부 링크, 이미지, 메타 필드 |
| 후보 사이 우선순위 판단 | 발행 일정, 편집 캘린더 |

무엇을 쓸지만 알려 주고 무엇을 쓰면 안 되는지 빼면 사용자는 다음 주에 자기잠식을 만든다. 그래서 금지 목록이 선택이 아니라 출력의 일부다.

---

## 다섯 가지 기회 신호

| 신호 | 뜻 | 강도 |
|---|---|---|
| **문턱 검색어** | 노출은 이미 받는데 순위가 5~20위 | 가장 강함 |
| **커버리지 갭** | 어떤 페이지가 자기 주제로는 상위인데 곁다리로 잡고 있는 검색어 | 강함 |
| **급상승** | 최근 구간에서 노출이 늘어난 검색어 | 중간, 확인 필요 |
| **수요 공백** | 검색량은 있는데 노출이 0이고 상위가 개인 블로그나 커뮤니티 | 중간 |
| **자기잠식** | 자사 페이지 둘 이상이 같은 검색어에 노출 | **역신호** |

앞의 둘이 강한 이유는 같다. 그 검색어에 수요가 있다는 것과 이 사이트가 관련 있다는 것이 **둘 다 이미 측정됐기** 때문이다. 백지에서 고른 주제는 둘 다 가정이다.

---

## 요건

| 소스 | 요건 | 비용 | 설정 |
|---|---|---|---|
| **Google Search Console** | **항상 필수.** 없으면 후보도 없음 | 무료 | `references/setup-gsc.md`, 15분, 서비스 계정 |
| **네이버 검색광고 키워드도구** | **한국어 타깃에 필수.** 영어 타깃에는 제외 | 무료 | `references/setup-naver.md`, 5분, 심사 없이 즉시 발급 |
| SerpApi | 권장, 차단하지 않음 | 무료 티어 월 250건 | `references/setup-serp.md`, 건너뛰면 내장 웹 검색이 대신함 |

**Search Console만 면제가 없다.** 다섯 신호 가운데 넷이 거기서 계산된다. 그것이 없으면 남는 것은 시장 수요 숫자뿐이고, 그 수요를 이 사이트가 가져올 수 있는지는 아무것도 모르는 상태가 된다.

설치 전에 알아 둘 결론이 있다. **글을 발행하는 사이트의 검증된 Search Console 속성을 갖고 있지 않다면 이 스킬은 쓸 수 없다.** 축소판이 있는 것이 아니라, 아예 없다.

**영어 타깃에 네이버를 빼는 것은 의도된 동작이다.** 패널이 국내라서 영어 검색어를 넣으면 거의 아무것도 측정하지 못한 숫자가 나온다. 무의미한 숫자를 근거로 보고하느니 칸을 비우고 이유를 밝힌다.

런타임: **Node.js 18 이상**과 네트워크 접근. 설치할 의존성은 없다. 스크립트는 Node 내장 기능만 쓴다.

---

## 설치

`seo-topic-finder` 디렉터리를 둘 중 한 곳에 복사한다.

```bash
# 개인용, 모든 프로젝트에서 사용 가능
~/.claude/skills/seo-topic-finder/

# 프로젝트 범위, 저장소와 함께 공유
<project>/.claude/skills/seo-topic-finder/
```

확인한다.

```bash
node ~/.claude/skills/seo-topic-finder/scripts/check-setup.mjs
```

마지막 줄이 `판정`이다. `차단`이면 Search Console이 연결될 때까지 스킬이 추천을 거부한다.

---

## 자격증명

아래 순서로 읽고, 먼저 발견된 값이 이긴다.

1. 실제 환경변수
2. `./.env.local`
3. `./.env`
4. `~/.seo-title-advisor.env` (공유 파일. 어느 프로젝트에서든 동작)

```bash
# Google Search Console (필수)
GSC_SERVICE_ACCOUNT_KEY=<base64 문자열, 원본 JSON, 또는 JSON 파일 경로>
GSC_SITE_URL=sc-domain:example.com          # 또는 https://example.com/

# 네이버 검색광고 (한국어 타깃에 필수)
NAVER_AD_CUSTOMER_ID=1234567
NAVER_AD_API_KEY=0100000000...
NAVER_AD_SECRET_KEY=AQAAAAA...

# SerpApi (선택)
SERPAPI_KEY=...
```

GA4 분석에 이미 서비스 계정을 쓰고 있다면 `GA4_SERVICE_ACCOUNT_KEY`를 자동으로 집어 온다. 그 경우 남는 일은 그 계정을 Search Console 속성 사용자로 추가하는 것뿐이다.

값이 있기만 한 것이 아니라 실제로 동작하는지 확인한다.

```bash
node scripts/check-setup.mjs --live
```

**이 패키지에는 자격증명이 들어 있지 않다.** `env.example`을 복사해서 채운다.

```bash
cp env.example ~/.seo-title-advisor.env
chmod 600 ~/.seo-title-advisor.env
```

`.env`나 `.env.local`에 값을 넣을 거라면 `.gitignore`에 먼저 추가한다.

---

## 언어

첫 실행에서 한국어와 영어 중 무엇을 쓸지 한 번 묻고, `~/.seo-title-advisor.env`에 영구 저장한다. `seo-title-creator`와 같은 파일이므로 한쪽에서 정했다면 다시 묻지 않는다.

```bash
node scripts/language.mjs --get
node scripts/language.mjs --set ko    # 또는 --set en
```

인터페이스 언어는 콘텐츠 언어를 바꾸지 않는다. **설정과 무관하게 한국어 검색어와 주제는 한국어로 남는다.** 옮긴 검색어는 다른 검색어이고, 측정한 대상과 더는 맞지 않는다.

---

## 사용법

```
/seo-topic-finder                    # 사이트 전체에서 발굴
/seo-topic-finder MCP                # 클러스터 지정
/seo-topic-finder 클로드 코드 5개      # 개수 지정
```

이미 정한 주제를 주면 그 주제를 먼저 데이터로 평가하고, 그다음에 대안을 낸다.

---

## 스크립트 단독 사용

스킬을 거치지 않고 스크립트만 써도 된다.

```bash
# 자사 페이지끼리 겹쳐 노출되는 검색어 (새 글의 자리가 아닌 곳)
node scripts/gsc-opportunities.mjs --mode cannibal

# 노출은 받는데 순위가 5~20위인 검색어
node scripts/gsc-opportunities.mjs --mode striking --min-impressions 20

# 어떤 페이지가 곁다리로 잡고 있는 검색어 (전용 페이지가 없는 자리)
node scripts/gsc-opportunities.mjs --mode gaps --per-page 2

# 최근 28일과 직전 28일 노출 비교
node scripts/gsc-opportunities.mjs --mode rising --window 28

# 한 클러스터에서 이 사이트가 가진 노출 총량
node scripts/gsc-opportunities.mjs --mode cluster --contains "MCP"

# 월간 검색량 (힌트 5개까지)
node scripts/naver-keywords.mjs "MCP 뜻" "클로드 MCP"

# 상위를 누가 점유했는지와 경쟁 판정
node scripts/serp-check.mjs "MCP 뜻"
```

모든 모드에 `--contains`, `--days`, `--limit`, `--json`, `--lang`을 쓸 수 있다.

---

## 판단 순서

1. **게이트**: 자격증명을 확인하고, 필수가 빠졌으면 여기서 멈춘다
2. **금지 목록 먼저**: 자기잠식을 먼저 계산한다. 순서를 뒤집으면 매력적인 후보를 만든 뒤에 버려야 한다
3. **신호 수집**: 문턱, 갭, 급상승
4. **묶기**: 표기만 다른 검색어를 묶고, 그 사람이 무엇을 하려다 막혔는지 한 문장으로 쓴다. 그 문장이 주제다
5. **대조**: 그 주제를 다루는 페이지가 이미 있는지 확인한다
6. **수요**: 네이버 월간 검색량. 연관 키워드에 무관한 단어가 섞이면 그 표현의 수요가 갈라져 있다는 신호다
7. **경쟁**: 순위 숫자가 아니라 상위를 점유한 주체의 성격으로 판단한다
8. **티어**: A, B, C로 나누고, 무엇부터 쓸지 한 문단으로 정한다

방법은 `references/opportunity-method.md`에 있다. 예시를 한국어로 둔 것은 의도적이다. 이 방법이 푸는 문제, 곧 한 대상이 여러 표기로 갈라지는 현상 자체가 번역하면 보이지 않게 된다.

---

## 파일

```
seo-topic-finder/
├── SKILL.md                      워크플로우와 판단 규칙
├── README.md                     이 파일
├── env.example                   자격증명 서식 (값 없음)
├── references/
│   ├── opportunity-method.md     데이터가 후보가 되는 과정
│   ├── setup-gsc.md              Search Console 설정
│   ├── setup-naver.md            네이버 검색광고 설정
│   └── setup-serp.md             SERP 확인 세 가지 방법
└── scripts/
    ├── check-setup.mjs           자격증명 상태와 요건 게이트
    ├── language.mjs              출력 언어 조회와 설정
    ├── gsc-opportunities.mjs     다섯 기회 신호 계산
    ├── gsc-queries.mjs           검색어와 페이지 단위 드릴다운
    ├── naver-keywords.mjs        월간 검색량
    ├── serp-check.mjs            상위 점유 성격과 경쟁 판정
    └── lib/
        ├── env.mjs               자격증명 로더. 값을 출력하지 않음
        └── i18n.mjs              한국어와 영어 메시지 카탈로그
```

---

## 알아 둘 한계

- 네이버 검색량은 **네이버의 것**이지 구글의 것이 아니다. 개발자와 실무자 주제에서는 구글 수요가 더 큰 경우가 많고, 이 숫자는 그만큼 과소평가한다.
- GSC는 **16개월**을 보관하고 노출이 아주 적은 검색어를 숨긴다. 행 합계가 보고된 총합과 맞지 않는 이유다.
- **급상승은 점 두 개짜리 추세다.** 한 번의 급등은 상시 수요가 확인되기 전까지 잡음으로 취급한다.
- `serp-check.mjs`가 붙이는 점유 성격은 **도메인 목록 기반 추정**이다. 페이지를 읽고 판단한 것이 아니므로, 주제를 결정하는 항목은 링크를 직접 연다.
- 이 스킬은 주제를 정한다. 이미 검색어를 잡고 있는 기존 글을 어떻게 고칠지는 범위 밖이다.

## 라이선스

MIT
