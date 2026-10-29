# -*- coding: utf-8 -*-
"""
LINE のネタ帳グループにユーザーが送ったネタを読み出す（bullcom-ai の workers/line-topics が受け取ってためたもの）。
Chrome で LINE 公式アカウントの管理画面を開かなくてよい。
同じスクリプトを BULLCOM の各サイトのリポジトリに置き、下の SITE / STATE だけ変えて使う
（ai=BULLCOM AI / repair=bullcom.jp / recycle=bullcom.org / security=bullcom.net / design=bullcom.website）。

使い方:
    python scripts/line-topics.py           # 前回読んだ後の新着だけ
    python scripts/line-topics.py --all     # ためてある全件
    python scripts/line-topics.py --mark    # 新着を表示して「ここまで読んだ」を記録（ネタ出しで使ったとき）

- Google AI モードの共有リンク（share.google/aimode/...）は、転送先の URL から「質問文」を取り出して表示する。
  回答の中身はブラウザでしか読めないが、ネタは必ず裏取りするので質問文で足りる
- 「ここまで読んだ」は scripts/line-topics-state.json に保存（コミットして、別セッションと共有する）
- 値は .env.local の LINE_TOPICS_URL / LINE_TOPICS_READ_TOKEN を使う（表示しない）
"""
import io
import json
import re
import sys
import urllib.parse
import urllib.request
from datetime import datetime, timedelta, timezone

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

SITE = "design"  # このリポジトリのサイト（ネタ帳グループ「デザインブログネタ」）
STATE = "scripts/line-topics-state.json"  # 「ここまで読んだ」の記録
JST = timezone(timedelta(hours=9))
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Safari/537.36"


def env():
    vals = {}
    for line in open(".env.local", encoding="utf-8"):
        if "=" in line and not line.lstrip().startswith("#"):
            k, v = line.split("=", 1)
            vals[k.strip()] = v.strip()
    return vals["LINE_TOPICS_URL"], vals["LINE_TOPICS_READ_TOKEN"]


def load_state():
    try:
        return json.load(open(STATE, encoding="utf-8"))
    except FileNotFoundError:
        return {"last_ts": 0}


def ai_mode_question(link):
    """share.google/aimode のリンクを転送先までたどり、検索の質問文（q）を返す。"""
    try:
        req = urllib.request.Request(link, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=15) as res:
            final = res.geturl()
        return urllib.parse.parse_qs(urllib.parse.urlparse(final).query).get("q", [None])[0]
    except Exception as e:  # 取れなくても一覧は出す
        return f"（質問文を取得できない: {e.__class__.__name__}）"


def main():
    args = sys.argv[1:]
    url, token = env()
    state = load_state()
    since = 0 if "--all" in args else state["last_ts"]
    req = urllib.request.Request(f"{url}/topics?site={SITE}&since={since}", headers={"Authorization": f"Bearer {token}", "User-Agent": UA})
    items = json.load(urllib.request.urlopen(req, timeout=20))["items"]
    if not items:
        print("新着なし" if since else "まだ何も届いていない")
        return
    for it in items:
        when = datetime.fromtimestamp(it["ts"] / 1000, JST).strftime("%m/%d %H:%M")
        if it["type"] != "text":
            print(f"[{when}] （{it['type']}{' ' + it['fileName'] if it.get('fileName') else ''}）")
            continue
        print(f"[{when}] {it['text']}")
        for link in re.findall(r"https://share\.google/aimode/\S+", it["text"]):
            print(f"         └ 質問: {ai_mode_question(link)}")
    if "--mark" in args:
        state["last_ts"] = max(it["ts"] for it in items)
        json.dump(state, open(STATE, "w", encoding="utf-8"), ensure_ascii=False)
        print(f"\n→ ここまで読んだ（{STATE} を更新。コミットしておく）")


if __name__ == "__main__":
    main()
