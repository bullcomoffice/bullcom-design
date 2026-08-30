# -*- coding: utf-8 -*-
"""
週報・月報の Markdown を PDF に変換する（bullcom.website / BULLCOM design）。

    python scripts/md2pdf.py _seo/reports/2026-08-30.md
    → D:/Data/Dropbox/BULLCOM/週報月報/bullcom.website_2026-08-30.pdf

週報は `YYYY-MM-DD.md`、月報は `YYYY-MM-monthly.md` の名前で _seo/reports/ に置くと
`<site>_<ファイル名>.pdf` の命名規則どおりになる。

出力先の既定は D:\\Data\\Dropbox\\BULLCOM\\週報月報 。
ファイル名は `<site>_<入力ファイル名>.pdf`（例: bullcom.org_2026-08-monthly.pdf）。

bullcom.org の md2pdf.py（seo-review フォルダ）を取り込み、配色だけ
BULLCOM design のブランドピンク（--pink #f0509e 系）へ変更したもの。

対応記法: 見出し(#〜####) / 段落 / **太字** / `コード` / 表 / 箇条書き / 番号付き /
引用(>) / 水平線 / コードフェンス。絵文字はフォントに字形が無いので文字ラベルに置換する。
"""
import argparse
import os
import re
import sys

from reportlab.lib import colors
from reportlab.lib.enums import TA_LEFT
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    BaseDocTemplate, Frame, HRFlowable, KeepTogether, PageTemplate,
    Paragraph, Spacer, Table, TableStyle,
)

DEFAULT_OUT_DIR = r"D:\Data\Dropbox\BULLCOM\週報月報"

# ===== フォント =====
FONT_DIR = r"C:\Windows\Fonts"
pdfmetrics.registerFont(TTFont("UD", os.path.join(FONT_DIR, "BIZ-UDGothicR.ttc"), subfontIndex=0))
pdfmetrics.registerFont(TTFont("UDB", os.path.join(FONT_DIR, "BIZ-UDGothicB.ttc"), subfontIndex=0))

# ===== ブランドカラー（globals.css の @theme に合わせる） =====
PRIMARY_DEEP = colors.HexColor("#db1374")
PRIMARY = colors.HexColor("#f0509e")
MINT = colors.HexColor("#fdf0f6")
PALE = colors.HexColor("#f9d8e8")
TEXT = colors.HexColor("#1f2937")
SUB = colors.HexColor("#4b5563")
MUTED = colors.HexColor("#9ca3af")
BORDER = colors.HexColor("#e5e7eb")

# ===== 絵文字 → 文字ラベル =====
# BIZ-UDGothic に字形が無く、そのまま出すと豆腐(□)になる。
EMOJI = {
    "✅": "[済]", "🟡": "[検証中]", "❌": "[不発]", "⏸": "[保留]", "⏳": "[待機]",
    "⚠️": "[注意]", "⚠": "[注意]", "🔴": "[最優先]", "🔵": "[検証中]", "📈": "",
    "▶": "→", "★": "*", "→": "→", "🎉": "", "⭐": "*", "✔": "[済]", "✓": "[済]",
}
EMOJI_RE = re.compile(
    "[\U0001F000-\U0001FAFF\U00002600-\U000027BF\U0000FE0F\U00002B00-\U00002BFF]"
)


def demoji(s: str) -> str:
    for k, v in EMOJI.items():
        s = s.replace(k, v)
    return EMOJI_RE.sub("", s)


def esc(s: str) -> str:
    return s.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(s: str) -> str:
    """**太字** と `コード` と [text](url) を reportlab のインラインタグに変換する。"""
    s = demoji(s)
    s = esc(s)
    s = re.sub(r"\[([^\]]+)\]\([^)]+\)", r"\1", s)          # リンクはテキストだけ残す
    s = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", s)
    s = re.sub(r"~~(.+?)~~", r"<strike>\1</strike>", s)
    s = re.sub(r"`([^`]+?)`", r'<font face="UDB" color="#db1374">\1</font>', s)
    return s


def st(name, size, leading=None, color=TEXT, font="UD", sa=0, sb=0, left=0):
    return ParagraphStyle(
        name, fontName=font, fontSize=size, leading=leading or size * 1.6,
        textColor=color, spaceAfter=sa, spaceBefore=sb, leftIndent=left, alignment=TA_LEFT,
    )


S = {
    "h1": st("h1", 17, 24, PRIMARY_DEEP, "UDB", sa=8, sb=2),
    "h2": st("h2", 13.5, 20, PRIMARY_DEEP, "UDB", sa=6, sb=12),
    "h3": st("h3", 11.5, 18, TEXT, "UDB", sa=4, sb=8),
    "h4": st("h4", 10.5, 16, SUB, "UDB", sa=3, sb=6),
    "p": st("p", 9.5, 16, SUB, sa=5),
    "li": st("li", 9.5, 15.5, SUB, sa=2, left=10),
    "quote": st("quote", 9, 15, SUB, sa=5, left=8),
    "code": st("code", 8.5, 13, TEXT, "UD", sa=5, left=6),
    "cell": st("cell", 8.5, 13, SUB),
    "cellh": st("cellh", 8.5, 13, colors.white, "UDB"),
    "meta": st("meta", 8.5, 13, MUTED, sa=2),
}


def parse(md: str):
    """Markdown を flowable の列に変換する。"""
    out = []
    lines = md.replace("\r\n", "\n").split("\n")
    i = 0
    while i < len(lines):
        ln = lines[i]

        # コードフェンス
        if ln.strip().startswith("```"):
            buf = []
            i += 1
            while i < len(lines) and not lines[i].strip().startswith("```"):
                buf.append(lines[i])
                i += 1
            i += 1
            if buf:
                body = "<br/>".join(esc(demoji(b)) or "&nbsp;" for b in buf)
                t = Table([[Paragraph(body, S["code"])]], colWidths=[165 * mm])
                t.setStyle(TableStyle([
                    ("BACKGROUND", (0, 0), (-1, -1), MINT),
                    ("BOX", (0, 0), (-1, -1), 0.5, PALE),
                    ("LEFTPADDING", (0, 0), (-1, -1), 8),
                    ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                    ("TOPPADDING", (0, 0), (-1, -1), 6),
                    ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
                ]))
                out.append(t)
                out.append(Spacer(1, 5))
            continue

        # 表
        if ln.strip().startswith("|") and i + 1 < len(lines) and re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[i + 1]):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                if re.match(r"^\s*\|[\s:|-]+\|\s*$", lines[i]):
                    i += 1
                    continue
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                rows.append(cells)
                i += 1
            if rows:
                out.append(build_table(rows))
                out.append(Spacer(1, 6))
            continue

        s = ln.strip()

        if not s:
            i += 1
            continue

        if re.match(r"^(---+|\*\*\*+|___+)$", s):
            out.append(Spacer(1, 4))
            out.append(HRFlowable(width="100%", thickness=0.6, color=BORDER))
            out.append(Spacer(1, 8))
            i += 1
            continue

        m = re.match(r"^(#{1,4})\s+(.*)$", s)
        if m:
            level = len(m.group(1))
            out.append(Paragraph(inline(m.group(2)), S[f"h{level}"]))
            if level == 1:
                out.append(HRFlowable(width="100%", thickness=1.4, color=PRIMARY))
                out.append(Spacer(1, 8))
            i += 1
            continue

        if s.startswith(">"):
            buf = []
            while i < len(lines) and lines[i].strip().startswith(">"):
                buf.append(lines[i].strip().lstrip(">").strip())
                i += 1
            body = Paragraph(inline(" ".join(x for x in buf if x)), S["quote"])
            t = Table([[body]], colWidths=[165 * mm])
            t.setStyle(TableStyle([
                ("BACKGROUND", (0, 0), (-1, -1), MINT),
                ("LINEBEFORE", (0, 0), (0, -1), 2.5, PRIMARY_DEEP),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
                ("RIGHTPADDING", (0, 0), (-1, -1), 8),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]))
            out.append(t)
            out.append(Spacer(1, 6))
            continue

        m = re.match(r"^([-*+]|\d+\.)\s+(.*)$", s)
        if m:
            bullet = "・" if not m.group(1)[0].isdigit() else m.group(1) + " "
            out.append(Paragraph(bullet + inline(m.group(2)), S["li"]))
            i += 1
            continue

        # 段落（連続行はまとめる）
        buf = [s]
        i += 1
        while i < len(lines):
            nxt = lines[i].strip()
            if (not nxt or nxt.startswith(("#", ">", "|", "```"))
                    or re.match(r"^([-*+]|\d+\.)\s+", nxt)
                    or re.match(r"^(---+|\*\*\*+|___+)$", nxt)):
                break
            buf.append(nxt)
            i += 1
        out.append(Paragraph(inline(" ".join(buf)), S["p"]))

    return out


def build_table(rows):
    ncol = max(len(r) for r in rows)
    rows = [r + [""] * (ncol - len(r)) for r in rows]

    # 1列目は広めに、以降は均等
    total = 165 * mm
    if ncol == 1:
        widths = [total]
    else:
        first = total * (0.34 if ncol >= 4 else 0.30)
        widths = [first] + [(total - first) / (ncol - 1)] * (ncol - 1)

    data = [[Paragraph(inline(c), S["cellh"] if ri == 0 else S["cell"]) for c in row]
            for ri, row in enumerate(rows)]

    t = Table(data, colWidths=widths, repeatRows=1)
    style = [
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY_DEEP),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("LEFTPADDING", (0, 0), (-1, -1), 6),
        ("RIGHTPADDING", (0, 0), (-1, -1), 6),
        ("TOPPADDING", (0, 0), (-1, -1), 5),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
        ("LINEBELOW", (0, 0), (-1, -1), 0.4, BORDER),
        ("BOX", (0, 0), (-1, -1), 0.5, BORDER),
    ]
    for r in range(1, len(data)):
        if r % 2 == 0:
            style.append(("BACKGROUND", (0, r), (-1, r), MINT))
    t.setStyle(TableStyle(style))
    return t


def build(md_path, out_path, site, title):
    md = open(md_path, encoding="utf-8").read()
    story = []

    story.append(Paragraph(esc(title), S["h1"]))
    story.append(HRFlowable(width="100%", thickness=1.4, color=PRIMARY))
    story.append(Spacer(1, 4))
    story.append(Paragraph(f"{esc(site)} ／ 出典: {esc(os.path.basename(md_path))}", S["meta"]))
    story.append(Spacer(1, 10))

    # 元ファイルの H1 は表紙で出しているので落とす
    body = re.sub(r"^#\s+.*?$", "", md, count=1, flags=re.M)
    story += parse(body)

    def page(canvas, doc):
        canvas.saveState()
        canvas.setFont("UD", 8)
        canvas.setFillColor(MUTED)
        canvas.drawString(20 * mm, 12 * mm, f"{site}　{title}")
        canvas.drawRightString(190 * mm, 12 * mm, f"- {doc.page} -")
        canvas.setStrokeColor(BORDER)
        canvas.line(20 * mm, 16 * mm, 190 * mm, 16 * mm)
        canvas.restoreState()

    doc = BaseDocTemplate(
        out_path, pagesize=A4,
        leftMargin=20 * mm, rightMargin=20 * mm, topMargin=18 * mm, bottomMargin=20 * mm,
        title=title, author="BULLCOM",
    )
    frame = Frame(20 * mm, 20 * mm, 170 * mm, 259 * mm, id="body",
                  leftPadding=0, rightPadding=0, topPadding=0, bottomPadding=0)
    doc.addPageTemplates([PageTemplate(id="main", frames=[frame], onPage=page)])
    doc.build(story)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("--site", default="bullcom.website")
    ap.add_argument("--title", default=None)
    ap.add_argument("--out", default=None)
    ap.add_argument("--out-dir", default=DEFAULT_OUT_DIR)
    a = ap.parse_args()

    if not os.path.exists(a.input):
        sys.exit(f"入力が見つかりません: {a.input}")

    base = os.path.splitext(os.path.basename(a.input))[0]
    out = a.out or os.path.join(a.out_dir, f"{a.site}_{base}.pdf")
    os.makedirs(os.path.dirname(out), exist_ok=True)

    title = a.title
    if not title:
        first = open(a.input, encoding="utf-8").readline().strip()
        title = demoji(first.lstrip("# ").strip()) if first.startswith("#") else base

    build(a.input, out, a.site, title)
    print(f"OK: {out} ({os.path.getsize(out):,} bytes)")


if __name__ == "__main__":
    main()
