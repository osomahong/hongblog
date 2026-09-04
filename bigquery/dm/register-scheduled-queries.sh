#!/usr/bin/env bash
# hongblog 데이터 마트 예약 쿼리 등록
# 선행 조건: gcloud auth login (hong@oso.ma)
set -euo pipefail

PROJECT=hong-project2511
LOCATION=asia-northeast3
SA=joonfather@hong-project2511.iam.gserviceaccount.com
DIR="$(cd "$(dirname "$0")" && pwd)/scheduled"

ACTIVE=$(gcloud config get-value account 2>/dev/null)
echo "인증 계정: $ACTIVE"
case "$ACTIVE" in
  *gserviceaccount.com) echo "사용자 계정으로 로그인이 필요합니다: gcloud auth login"; exit 1 ;;
esac

# 1) SA가 자기 자신으로 실행할 수 있도록 actAs 부여 (실패해도 사용자 소유로 진행)
USE_SA=1
if gcloud iam service-accounts add-iam-policy-binding "$SA" \
     --member="serviceAccount:$SA" --role="roles/iam.serviceAccountUser" \
     --project="$PROJECT" >/dev/null 2>&1; then
  echo "actAs 부여 완료. 예약 쿼리를 서비스 계정 소유로 만듭니다."
else
  echo "actAs 부여 실패. 예약 쿼리를 사용자 계정 소유로 만듭니다."
  USE_SA=0
fi

TOKEN=$(gcloud auth print-access-token)
BASE="https://bigquerydatatransfer.googleapis.com/v1/projects/$PROJECT/locations/$LOCATION/transferConfigs"

register() {
  local name="$1" display="$2" schedule="$3"
  local body; body=$(python3 -c "
import json,sys
q=open('$DIR/$name.sql').read()
print(json.dumps({'displayName':'$display','dataSourceId':'scheduled_query',
                  'schedule':'$schedule','params':{'query':q}}, ensure_ascii=False))
")
  local url="$BASE"
  [ "$USE_SA" = "1" ] && url="$BASE?serviceAccountName=$SA"
  echo "$body" | curl -s -X POST -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" "$url" -d @- \
  | python3 -c "
import json,sys
d=json.load(sys.stdin)
if 'error' in d: print('  실패:', d['error'].get('message')[:300]); sys.exit(1)
print('  등록:', d['name'].split('/')[-1], '|', d.get('schedule'), '| 다음 실행', d.get('nextRunTime'))
"
}

echo "[1/4] dm.events";               register events               "[hongblog] dm.events 일별 적재"               "every day 23:00"
echo "[2/4] dm.sessions";             register sessions             "[hongblog] dm.sessions 일별 적재"             "every day 23:20"
echo "[3/4] dm.content_daily";        register content_daily        "[hongblog] dm.content_daily 일별 적재"        "every day 23:40"
echo "[4/4] dm.search_content_daily"; register search_content_daily "[hongblog] dm.search_content_daily 10일 롤링" "every day 23:55"

echo
echo "등록 결과 확인:"
curl -s -H "Authorization: Bearer $TOKEN" "$BASE" | python3 -c "
import json,sys
for c in json.load(sys.stdin).get('transferConfigs',[]):
    print(' -', c.get('displayName'), '|', c.get('schedule'), '| 다음', c.get('nextRunTime'))
"
