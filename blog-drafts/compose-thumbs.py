# -*- coding: utf-8 -*-
"""生成画像に「バッジ + タイトル + ロゴ」を合成してブログサムネにする（bullcom.net の様式を踏襲）"""
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os, re, glob, io

SRC_DIR = r"D:/Data/Projects/Next/bullcom-design/blog-drafts/thumbs"
OUT_DIR = r"D:/Data/Projects/Next/bullcom-design/blog-drafts/thumbs-final"
LOGO = r"D:/Data/Dropbox/AI/Claude/code/design/logomoji-3d-pink.png"
BOLD = "C:/Windows/Fonts/YuGothB.ttc"
W, H = 1280, 720

# サムネに載せる短縮タイトル（記事タイトルは長いので表示用に圧縮）
TITLES = {
  "01": ["ホームページ制作の費用は", "何で決まる？"],
  "02": ["「おしゃれ」より", "「伝わる」サイト"],
  "03": ["制作会社と連絡が", "取れなくなったとき"],
  "04": ["なぜNext.jsで", "作るのか"],
  "05": ["「丸投げ」でも", "大丈夫？"],
  "06": ["「写真がない」と", "言われたときに"],
  "07": ["「更新できないまま", "3年」を防ぐには"],
  "08": ["WordPressで", "作らない理由"],
  "09": ["依頼する前に", "決めておく3つのこと"],
  "10": ["ファーストビューの", "決め方"],
  "11": ["公開後に必要になる", "作業の一覧"],
  "12": ["静的サイトが", "改ざんされにくい理由"],
  "13": ["相見積もりで", "金額以外に見るところ"],
  "14": ["ロゴがないまま", "サイトを作ると"],
  "15": ["問い合わせが来ないとき", "見直す3つの場所"],
  "16": ["スマホで崩れる", "サイトとの違い"],
  "17": ["「誰に、何を伝えるか」", "を先に決める"],
  "18": ["色は3色までに", "まとめると失敗しない"],
  "19": ["ドメインとサーバー", "費用の中身"],
  "20": ["サイトが重い原因は", "画像にある"],
}

logo_src = Image.open(LOGO).convert("RGBA")

def compose(n):
    im = Image.open(os.path.join(SRC_DIR, f"thumb-{n}.jpg")).convert("RGB")
    # 16:9 にカバー配置
    scale = max(W / im.width, H / im.height)
    im = im.resize((round(im.width * scale), round(im.height * scale)), Image.LANCZOS)
    im = im.crop(((im.width - W) // 2, (im.height - H) // 2,
                  (im.width - W) // 2 + W, (im.height - H) // 2 + H))

    # 左側を白でフェード（文字を確実に読ませる）
    veil = Image.new("L", (W, H), 0)
    d = ImageDraw.Draw(veil)
    for x in range(W):
        a = max(0, int(242 * (1 - x / (W * 0.66))))
        d.line([(x, 0), (x, H)], fill=a)
    im = Image.composite(Image.new("RGB", (W, H), (255, 253, 251)), im, veil)

    draw = ImageDraw.Draw(im)

    # 左上バッジ（ピンク→紫のピル）
    f_badge = ImageFont.truetype(BOLD, 25)
    label = "BULLCOM design Blog"
    tw = draw.textlength(label, font=f_badge)
    bx, by, bh = 56, 48, 52
    badge = Image.new("RGBA", (int(tw) + 52, bh), (0, 0, 0, 0))
    bd = ImageDraw.Draw(badge)
    for x in range(badge.width):  # 横グラデーション
        t = x / badge.width
        r = int(240 + (160 - 240) * t); g = int(80 + (107 - 80) * t); b = int(158 + (255 - 158) * t)
        bd.line([(x, 0), (x, bh)], fill=(r, g, b, 255))
    mask = Image.new("L", badge.size, 0)
    ImageDraw.Draw(mask).rounded_rectangle([0, 0, badge.width - 1, bh - 1], radius=bh // 2, fill=255)
    im.paste(badge, (bx, by), mask)
    draw.text((bx + 26, by + 12), label, font=f_badge, fill=(255, 255, 255))

    # タイトル（左に縦のアクセントバー＋濃色テキスト）
    lines = TITLES[n]
    f_size = 62 if max(len(l) for l in lines) <= 12 else 54
    f_title = ImageFont.truetype(BOLD, f_size)
    line_h = f_size + 26
    top = by + bh + 46
    bar_h = line_h * len(lines) - 20
    # 縦バー（ピンク→紫のグラデ）
    bar = Image.new("RGB", (7, bar_h))
    bdr = ImageDraw.Draw(bar)
    for y in range(bar_h):
        t = y / bar_h
        bdr.line([(0, y), (7, y)], fill=(int(240 + (160-240)*t), int(80 + (107-80)*t), int(158 + (255-158)*t)))
    im.paste(bar, (bx, top + 8))

    for i, line in enumerate(lines):
        draw.text((bx + 30, top + i * line_h), line, font=f_title, fill=(36, 34, 58))

    # 右下ロゴ（下地は敷かず、やわらかい影だけで背景から浮かせる）
    lw = 290
    logo = logo_src.resize((lw, round(logo_src.height * lw / logo_src.width)), Image.LANCZOS)
    px, py = W - logo.width - 54, H - logo.height - 44
    shadow = Image.new("RGBA", (logo.width + 40, logo.height + 40), (0, 0, 0, 0))
    shadow.paste((255, 255, 255, 150), (20, 20), logo.split()[3])
    shadow = shadow.filter(ImageFilter.GaussianBlur(12))
    im.paste(shadow, (px - 20, py - 20), shadow)
    im.paste(logo, (px, py), logo)

    os.makedirs(OUT_DIR, exist_ok=True)
    out = os.path.join(OUT_DIR, f"thumb-{n}.jpg")
    im.save(out, "JPEG", quality=88, optimize=True)
    return out, os.path.getsize(out) / 1024

total = 0
for n in sorted(TITLES):
    out, kb = compose(n)
    total += kb
    print(f"{os.path.basename(out)}  {kb:.0f}KB")
print(f"--- total {total/1024:.1f}MB")
