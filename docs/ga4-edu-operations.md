# GA4 Edu 배포 준비와 운영

튜토리얼 30편과 구독 게이트를 실제로 열기 전에 확인할 것을 모았습니다.
설계 배경은 `ga4-edu-design.md`에 있고, 이 문서는 배포와 운영 절차만 다룹니다.

## 1. 배포 전에 넣을 환경변수

Vercel 프로젝트 설정의 Environment Variables에 아래 두 개를 넣습니다. 로컬에서 확인하려면
`.env.local`에도 같은 이름으로 넣습니다.

| 이름 | 쓰임 | 값 |
|---|---|---|
| `GA4_EDU_SESSION_SECRET` | 로그인 쿠키 서명 키 | 32자 이상 무작위 문자열 |
| `STIBEE_WEBHOOK_SECRET` | 스티비 웹훅 주소의 `key` 값 | 20자 이상 무작위 문자열 |

`GA4_EDU_SESSION_SECRET`이 비어 있으면 운영 환경에서 서명이 만들어지지 않아 로그인이
성립하지 않습니다. 배포 전에 반드시 넣습니다.

`STIBEE_WEBHOOK_SECRET`이 비어 있으면 웹훅 주소를 아는 사람이 구독 상태를 바꿀 수 있습니다.
서버 기록에 경고가 남지만 요청 자체는 처리되므로, 이 값도 함께 넣습니다.

## 2. 스티비 주소록 웹훅 등록

주소록 설정의 웹훅에 아래 주소를 넣고 이벤트를 전부 선택합니다.

```
https://www.digitalmarketer.co.kr/api/stibee/webhook?key=STIBEE_WEBHOOK_SECRET에_넣은_값
```

이벤트는 구독, 정보변경, 수신거부, 수신거부 취소, 자동삭제, 완전삭제 여섯 가지입니다.
스티비 발신 IP는 52.78.132.66이고 실패하면 세 번까지 다시 보냅니다.

웹훅이 하는 일은 하나입니다. 스티비에서 일어난 구독과 해지를 Neon의
`newsletter_subscribers.status`에 옮겨 적습니다. 게이트는 실습을 열 때마다 그 값을 다시 읽으므로,
해지가 들어온 다음 요청부터 그 사람의 실습이 닫히고 로그인 쿠키도 지워집니다.

## 3. 기존 구독자 상태 맞추기

웹훅을 붙이기 전에 구독을 마친 사람은 원장에 `pending`으로 남아 있습니다. 게이트는
`subscribed`만 열어 주므로 이 사람들이 실습을 열지 못합니다. 웹훅을 등록한 직후에 한 번
동기화 스크립트를 돌립니다.

```bash
# 먼저 미리보기로 바뀔 항목을 확인합니다
npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts

# 확인한 다음 실제로 반영합니다
npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts --apply
```

`STIBEE_API_KEY`와 `DATABASE_URL`이 모두 필요합니다. 미리보기는 데이터베이스를 바꾸지 않습니다.

API 키가 없으면 스티비 화면에서 구독자 목록을 CSV로 내려받아 같은 일을 할 수 있습니다.

```bash
npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts --csv "내려받은파일.csv"
npx tsx --env-file=.env.local scripts/newsletter/002-sync-stibee-status.ts --csv "내려받은파일.csv" --apply
```

CSV의 이메일 수신 상태를 원장 status로 옮깁니다. 구독 중은 subscribed, 수신거부는 unsubscribed,
자동 삭제와 완전 삭제는 deleted가 됩니다. 2026-08-21에 이 방식으로 17명을 맞췄습니다.

## 4. 공개 범위와 색인 기준

| 항목 | 기준 |
|---|---|
| 실습 조작 | 초급 1번과 중급 1번은 누구나, 나머지 28편은 구독자만 |
| 설명, 단계, 자주 묻는 질문 | 30편 모두 공개 |
| 색인 | 완성된 30편 전부 색인하고 사이트맵에도 넣음 |

읽을 내용이 모두 열려 있어서 잠긴 편도 색인합니다. 검색으로 들어온 사람은 글을 끝까지 읽을 수
있고, 실습을 눌러 보려 할 때 구독 안내를 만납니다.

공개 편을 늘리거나 줄이려면 `src/app/ga4-edu/data.ts`에서 해당 튜토리얼의 `isOpen`을 바꿉니다.

## 5. 로그인과 해지 동작 확인

배포 후 아래 순서로 한 번 확인합니다. 사용하는 주소는 실제 구독자 주소여야 합니다.

1. 잠긴 튜토리얼을 열면 구독 안내가 나오는지
2. 구독한 주소를 넣으면 실습이 열리는지
3. 스티비에서 그 주소를 수신거부로 바꾸고 페이지를 새로 고치면 다시 잠기는지
4. 다시 구독하면 열리는지

3번이 동작하지 않으면 웹훅 주소의 `key` 값과 `STIBEE_WEBHOOK_SECRET`이 다른 경우가 대부분입니다.

## 6. HTML in Canvas 효과

목록 줄과 추천 카드의 호버 연출, 튜토리얼 이동 전환, 말풍선의 단계 반응은 크롬 실험 API인
`drawElementImage`를 씁니다. 이 API가 없는 브라우저에서는 효과만 빠지고 링크와 실습은 그대로
동작합니다. 효과를 담당하는 곳은 두 군데입니다.

| 파일 | 하는 일 |
|---|---|
| `src/components/ga4-edu/Ga4EduCanvasFx.tsx` | 목록과 카드의 호버, 튜토리얼 이동 전환 |
| `src/components/ga4-edu/app/tour.tsx` | 단계 통과, 오답, 완료, 다시 하기 |
