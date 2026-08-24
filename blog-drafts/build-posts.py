# -*- coding: utf-8 -*-
"""blog-drafts の Markdown を microCMS 投入用の JSON に変換する"""
import json, re, glob, io, os
from datetime import datetime, timedelta

DRAFTS = r"D:/Data/Projects/Next/bullcom-design/blog-drafts"
CATEGORY_ID = {
    "費用と依頼": "esos-pueb",
    "デザイン": "41w1mai42x",
    "運用・保守": "19k0gc2dp0",
    "つくりの話": "3f4h6zg8ua2",
}
BASE = datetime(2026, 7, 1, 9, 45)   # 1本目の公開日時（JST）
media = json.load(open("media-urls.json", encoding="utf-8"))

def md_to_html(body: str) -> str:
    """## 見出し と 段落 だけの単純な変換（本文はこの2種類しか使っていない）"""
    out = []
    for block in [b.strip() for b in body.split("\n\n") if b.strip()]:
        if block.startswith("## "):
            out.append(f"<h2>{block[3:].strip()}</h2>")
        else:
            text = " ".join(line.strip() for line in block.split("\n"))
            out.append(f"<p>{text}</p>")
    return "".join(out)

posts = []
for f in sorted(glob.glob(os.path.join(DRAFTS, "[0-9][0-9]-*.md"))):
    t = io.open(f, encoding="utf-8").read()
    fm = t.split("---")[1]
    order = int(re.search(r"order: (\d+)", fm).group(1))
    cat = re.search(r"category: (.+)", fm).group(1).strip()
    title = re.search(r"title: (.+)", fm).group(1).strip()
    body, sns = t.split("## SNS投稿")
    body = body.split("---")[2]
    # JST 9:45 → UTC 0:45
    dt = BASE + timedelta(weeks=order - 1)
    utc = dt - timedelta(hours=9)
    posts.append({
        "order": order,
        "file": os.path.basename(f),
        "jst": dt.strftime("%Y-%m-%d %H:%M"),
        "publishedAt": utc.strftime("%Y-%m-%dT%H:%M:%S.000Z"),
        "title": title,
        "content": md_to_html(body),
        "category": CATEGORY_ID[cat],
        "eyecatch": media[f"{order:02d}"],
        "sns": sns.strip(),
    })

json.dump(posts, open("posts.json", "w", encoding="utf-8"), ensure_ascii=False, indent=1)
now = datetime(2026, 8, 24, 12, 0)
past = [p for p in posts if datetime.strptime(p["jst"], "%Y-%m-%d %H:%M") < now]
print(f"変換 {len(posts)} 本 / 過去 {len(past)} 本・未来 {len(posts)-len(past)} 本")
print("先頭:", posts[0]["jst"], posts[0]["title"][:26])
print("末尾:", posts[-1]["jst"], posts[-1]["title"][:26])
print("HTML例:", posts[0]["content"][:120], "...")
