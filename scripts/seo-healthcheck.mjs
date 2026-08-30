/**
 * seo-healthcheck.mjs
 * bullcom.website（BULLCOM design）のSEO/GEOシグナルを外形監視。
 * 依存なし・Node18+ の global fetch のみで動く。
 *
 * 使い方:
 *   node scripts/seo-healthcheck.mjs            # レポートを標準出力
 *   node scripts/seo-healthcheck.mjs --append   # _seo/health-log.md にも追記
 *
 * 判定は「実装が生きているか」の外形チェック。検索順位・表示回数など
 * GSC由来の指標は含まない（週次・月次の手動確認で見る）。
 *
 * ⚠️ このサイトの正規形は **末尾スラッシュ無し**（next.config.ts に trailingSlash 未指定、
 *    canonical も `/faq` `/blog/{id}` の形）。姉妹サイト bullcom.net は逆なので混同しないこと。
 */
import { writeFileSync, readFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const BASE = "https://bullcom.website";
const HOST = "bullcom.website";
const BLOG_SAMPLE = "0q17ybkcytm"; // 構造化データ・description確認用のサンプル記事
const SERVICE_SAMPLE = "web"; // サービス個別ページのサンプル
// app/layout.tsx の title.template が "%s｜BULLCOM design"
const TITLE_SUFFIX = "｜BULLCOM design";
// app/layout.tsx の既定 description（各ページが固有descriptionを持っているかの判定に使う）
const DEFAULT_DESC_HEAD = "全国対応のホームページ制作・デザインスタジオ BULLCOM design";

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOG_PATH = join(__dirname, "..", "_seo", "health-log.md");

const results = [];
function check(name, ok, detail = "") {
  results.push({ name, ok, detail });
}

async function fetchRaw(url, { redirect = "manual" } = {}) {
  const res = await fetch(url, {
    redirect,
    headers: { "User-Agent": "bullcom-design-seo-healthcheck" },
  });
  return { status: res.status, location: res.headers.get("location"), body: await res.text() };
}
const get = (path, opts) => fetchRaw(BASE + path, opts);

/** 1つのチェックを実行し、例外は失敗として記録する */
async function guard(name, fn) {
  try {
    await fn();
  } catch (e) {
    check(name, false, e.message);
  }
}

/**
 * robots.txt を User-agent グループに分解する。
 *
 * ⚠️ ボット名が「書かれているか」だけを見てはいけない。Cloudflare の
 *    Managed robots.txt は GPTBot / ClaudeBot 等を **Disallow で列挙する**ため、
 *    名前の有無で判定すると「許可されている」と誤判定する。
 *    グループを解決して、実際に `/` を取得してよいかまで見る。
 */
function parseRobots(body) {
  const groups = [];
  let current = null;
  for (const rawLine of body.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line) continue;
    const m = line.match(/^([A-Za-z-]+)\s*:\s*(.*)$/);
    if (!m) continue;
    const field = m[1].toLowerCase();
    const value = m[2].trim();
    if (field === "user-agent") {
      // 直前もUser-agent行なら同じグループに宛先を足す（連続宣言）
      if (current && current.justDeclared) current.agents.push(value.toLowerCase());
      else groups.push((current = { agents: [value.toLowerCase()], rules: [], justDeclared: true }));
      continue;
    }
    if (!current) continue;
    current.justDeclared = false;
    if (field === "allow" || field === "disallow") current.rules.push({ field, value });
  }
  return groups;
}

/** 指定ボットがパス path を取得してよいか（最長一致。同長なら Allow 優先） */
function robotsAllows(groups, bot, path = "/") {
  const name = bot.toLowerCase();
  const group =
    groups.find((g) => g.agents.includes(name)) || groups.find((g) => g.agents.includes("*"));
  if (!group) return true; // 該当グループが無ければ制限なし
  let best = null;
  for (const rule of group.rules) {
    if (rule.value === "") continue; // 空のDisallowは「全許可」の意味
    if (!path.startsWith(rule.value)) continue;
    const longer = !best || rule.value.length > best.value.length;
    const sameLenAllow =
      best && rule.value.length === best.value.length && rule.field === "allow";
    if (longer || sameLenAllow) best = rule;
  }
  return !best || best.field === "allow";
}

async function run() {
  await guard("トップ 200応答", async () => {
    const r = await get("/", { redirect: "follow" });
    check("トップ 200応答", r.status === 200, `HTTP ${r.status}`);
  });

  await guard("www→非www 301", async () => {
    const r = await fetchRaw(`https://www.${HOST}/`);
    const ok = r.status === 301 && (r.location || "").startsWith(BASE);
    check("www→非www 301", ok, `HTTP ${r.status} -> ${r.location || "(なし)"}`);
  });

  await guard("http→https 301", async () => {
    const r = await fetchRaw(`http://${HOST}/`);
    const ok = r.status === 301 && (r.location || "").startsWith(BASE);
    check("http→https 301", ok, `HTTP ${r.status} -> ${r.location || "(なし)"}`);
  });

  // 末尾スラッシュ付きは非スラッシュへ「301（恒久）」で寄せたい。
  // 307（一時）だとGoogleが評価を統合せず、同一ページが2URLでインデックスされうる。
  await guard("末尾スラッシュ 301正規化", async () => {
    const r = await get(`/blog/${BLOG_SAMPLE}/`);
    const ok = r.status === 301 && (r.location || "").endsWith(`/blog/${BLOG_SAMPLE}`);
    check("末尾スラッシュ 301正規化", ok, `HTTP ${r.status} -> ${r.location || "(なし)"}`);
  });

  await guard("トップ canonical", async () => {
    const r = await get("/", { redirect: "follow" });
    const href = r.body.match(/<link rel="canonical" href="([^"]+)"/)?.[1] || "";
    check("トップ canonical", href === BASE, href || "(なし)");
  });

  await guard("sitemap.xml", async () => {
    const r = await get("/sitemap.xml", { redirect: "follow" });
    const count = (r.body.match(/<loc>/g) || []).length;
    const withSlash = (r.body.match(/<loc>[^<]*\/<\/loc>/g) || []).length;
    check("sitemap.xml", r.status === 200 && count > 0, `HTTP ${r.status} / ${count} URL`);
    check(
      "sitemap 末尾スラッシュ混入なし",
      r.status === 200 && withSlash === 0,
      r.status !== 200 ? "sitemap自体が取得不可" : withSlash === 0 ? "0件" : `${withSlash}件混入`
    );
  });

  await guard("robots.txt AIボット許可", async () => {
    const r = await get("/robots.txt", { redirect: "follow" });
    const groups = parseRobots(r.body);
    const bots = ["GPTBot", "OAI-SearchBot", "ClaudeBot", "PerplexityBot", "Google-Extended"];
    const blocked = bots.filter((b) => !robotsAllows(groups, b));
    check(
      "robots.txt AIボット許可",
      r.status === 200 && blocked.length === 0,
      blocked.length
        ? `ブロック中: ${blocked.join(",")}`
        : "GPTBot/OAI/Claude/Perplexity/Google-Extended 全て許可"
    );
    check(
      "robots.txt Sitemap行",
      r.body.includes(`Sitemap: ${BASE}/sitemap.xml`),
      r.body.includes("Sitemap:") ? "あり" : "なし"
    );
  });

  await guard("llms.txt 設置", async () => {
    const r = await get("/llms.txt", { redirect: "follow" });
    check("llms.txt 設置", r.status === 200 && r.body.length > 100, `HTTP ${r.status} / ${r.body.length}字`);
  });

  await guard("トップ LocalBusiness", async () => {
    const r = await get("/", { redirect: "follow" });
    // 現状は ProfessionalService 単体。LocalBusiness の配列形式へ変えても通るようにしてある
    const ok = /"@type":\s*(\[[^\]]*"(LocalBusiness|ProfessionalService)"|"(LocalBusiness|ProfessionalService)")/.test(
      r.body
    );
    check("トップ LocalBusiness", ok, ok ? "検出（ProfessionalService）" : "未検出");
  });

  await guard("/faq FAQPage構造化データ", async () => {
    const r = await get("/faq", { redirect: "follow" });
    const hasFaq = r.body.includes('"@type":"FAQPage"');
    const desc = r.body.match(/<meta name="description" content="([^"]+)"/)?.[1] || "";
    check("/faq FAQPage構造化データ", hasFaq, hasFaq ? "検出" : "未検出");
    check(
      "/faq 固有meta description",
      desc.length > 30 && !desc.startsWith(DEFAULT_DESC_HEAD),
      desc ? `${desc.slice(0, 24)}…` : "(なし)"
    );
  });

  await guard("サービス個別ページ 固有meta description", async () => {
    const r = await get(`/services/${SERVICE_SAMPLE}`, { redirect: "follow" });
    const desc = r.body.match(/<meta name="description" content="([^"]+)"/)?.[1] || "";
    const ok = desc.length > 30 && !desc.startsWith(DEFAULT_DESC_HEAD);
    check("サービス個別ページ 固有meta description", ok, desc ? `${desc.slice(0, 24)}…` : "(なし)");
  });

  await guard("ブログ 構造化データ", async () => {
    const r = await get(`/blog/${BLOG_SAMPLE}`, { redirect: "follow" });
    const hasArticle = r.body.includes('"@type":"Article"');
    const hasCrumb = r.body.includes('"@type":"BreadcrumbList"');
    check("ブログ Article構造化データ", hasArticle, hasArticle ? "検出" : "未検出");
    check("ブログ BreadcrumbList", hasCrumb, hasCrumb ? "検出" : "未検出");
  });

  // 記事の description がタイトルと同一だと、検索結果のスニペットがタイトルの繰り返しになる。
  await guard("ブログ description がタイトルと別文", async () => {
    const r = await get(`/blog/${BLOG_SAMPLE}`, { redirect: "follow" });
    // ⚠️ 記事タイトル自体に「｜」が含まれることがあるので、先頭の区切りで分割してはいけない。
    //    title テンプレートのサイト名サフィックスだけを末尾から取り除いて比較する。
    const rawTitle = (r.body.match(/<title>([^<]*)<\/title>/)?.[1] || "").trim();
    const title = rawTitle.endsWith(TITLE_SUFFIX)
      ? rawTitle.slice(0, -TITLE_SUFFIX.length).trim()
      : rawTitle;
    const desc = r.body.match(/<meta name="description" content="([^"]+)"/)?.[1] || "";
    const ok = desc.length > 30 && desc !== title;
    check("ブログ description がタイトルと別文", ok, ok ? `${desc.length}字` : "タイトルと同一/空");
  });

  // ---- レポート生成 ----
  const now = new Date().toISOString().slice(0, 16).replace("T", " ") + " UTC";
  const passed = results.filter((r) => r.ok).length;
  const total = results.length;
  const allOk = passed === total;

  let md = `\n## ${now} — ${passed}/${total} PASS ${allOk ? "✅" : "⚠️ 要確認"}\n\n`;
  md += `| 項目 | 判定 | 詳細 |\n|---|---|---|\n`;
  for (const r of results) {
    md += `| ${r.name} | ${r.ok ? "✅" : "❌"} | ${r.detail} |\n`;
  }
  if (!allOk) {
    md += `\n**要対応:** ${results
      .filter((r) => !r.ok)
      .map((r) => r.name)
      .join(" / ")}\n`;
  }

  console.log(md);

  if (process.argv.includes("--append")) {
    mkdirSync(dirname(LOG_PATH), { recursive: true });
    const SENTINEL = "<!-- 最新を上に追記 -->";
    const defaultHeader =
      `# bullcom.website SEO/GEO ヘルスチェック履歴\n\n` +
      `外形の自動チェック履歴（新しい順）。GSC由来の指標（検索順位・表示回数・インデックス数）は週次・月次の手動確認で別途記録する。\n\n` +
      `${SENTINEL}\n`;
    const current = existsSync(LOG_PATH) ? readFileSync(LOG_PATH, "utf8") : defaultHeader;
    const marker = current.includes(SENTINEL) ? SENTINEL : "\n\n";
    const idx = current.indexOf(marker) + marker.length;
    const updated = current.slice(0, idx) + "\n" + md.trimStart() + "\n" + current.slice(idx);
    writeFileSync(LOG_PATH, updated, "utf8");
    console.log(`\n(→ ${LOG_PATH} に追記しました)`);
  }

  // CIで使えるよう、失敗があれば非0終了
  process.exitCode = allOk ? 0 : 1;
}

run();
