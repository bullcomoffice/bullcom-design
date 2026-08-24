#!/bin/bash
# 過去分(order<=8) = 下書き / 未来分(order>=9) = 下書き＋予約公開
KEY=$(grep '^MICROCMS_API_KEY=' "D:/Data/Projects/Next/bullcom-design/.env.local" | sed 's/^MICROCMS_API_KEY=//' | tr -d '\r')
CMS="https://bullcom-design.microcms.io/api/v1"
MGMT="https://bullcom-design.microcms-management.io/api/v1"

for i in $(seq 1 27); do
  # 9本目はテスト投入済みなのでスキップ
  [ "$i" = "9" ] && { echo "09 skip (投入済み)"; continue; }
  n=$(printf '%02d' $i)
  python - "$i" <<'PY'
import json, sys
o = int(sys.argv[1])
p = next(x for x in json.load(open('posts.json', encoding='utf-8')) if x['order'] == o)
json.dump({'title': p['title'], 'content': p['content'],
           'category': p['category'], 'eyecatch': p['eyecatch']},
          open('body.json','w',encoding='utf-8'), ensure_ascii=False)
open('pub.txt','w').write(p['publishedAt'])
PY
  # 下書きとして作成
  code=$(curl -s -o created.json -w "%{http_code}" -X POST "$CMS/blogs?status=draft" \
    -H "X-MICROCMS-API-KEY: $KEY" -H "Content-Type: application/json" --data-binary @body.json)
  if [ "$code" != "201" ]; then echo "$n CREATE FAILED ($code)"; sleep 5; continue; fi
  id=$(python -c "import json;print(json.load(open('created.json',encoding='utf-8'))['id'])")

  if [ "$i" -ge 9 ]; then
    pub=$(cat pub.txt)
    printf '{"publishTime":"%s"}' "$pub" > sched.json
    scode=$(curl -s -o sres.json -w "%{http_code}" -X PUT "$MGMT/contents/blogs/$id/reservation" \
      -H "X-MICROCMS-API-KEY: $KEY" -H "Content-Type: application/json" --data-binary @sched.json)
    echo "$n $id 予約 $pub -> $scode"
  else
    echo "$n $id 下書き"
  fi
  echo "$n $id" >> posted-ids.txt
  sleep 2
done
