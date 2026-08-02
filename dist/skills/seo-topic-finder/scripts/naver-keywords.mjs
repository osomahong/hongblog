#!/usr/bin/env node
/**
 * Query the Naver Search Ad keyword tool for Korean monthly search volume and
 * competition. This is the only free official source of Korean search demand.
 *
 * Usage:
 *   node naver-keywords.mjs kw1 kw2 ...        up to 5 hint keywords
 *   node naver-keywords.mjs --json kw1         raw JSON
 *   node naver-keywords.mjs --limit 30 kw1     related-keyword rows to show (default 20)
 *   node naver-keywords.mjs --lang en kw1      render this run's output in English
 *
 * Keywords are usually Korean: 구글애널리틱스, 카페24 GA4 세팅, and so on. The
 * tool rejects spaces, so spaces inside a keyword are stripped before the call.
 *
 * Credentials: NAVER_AD_CUSTOMER_ID, NAVER_AD_API_KEY, NAVER_AD_SECRET_KEY
 */
import crypto from "node:crypto";
import { loadEnv } from "./lib/env.mjs";
import { t } from "./lib/i18n.mjs";

const BASE = "https://api.searchad.naver.com";
const PATH = "/keywordstool";

/** Flags that consume the following argv entry, so it is not mistaken for a keyword. */
const VALUE_FLAGS = new Set(["--limit", "--lang"]);

function sign(timestamp, method, uri, secretKey) {
  return crypto.createHmac("sha256", secretKey).update(`${timestamp}.${method}.${uri}`).digest("base64");
}

/** Naver returns the string "< 10" instead of a number for volumes under 10. */
function toCount(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.includes("<")) return 5;
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

async function main() {
  const args = process.argv.slice(2);
  const asJson = args.includes("--json");
  const limitIdx = args.indexOf("--limit");
  const limit = limitIdx !== -1 ? Number(args[limitIdx + 1]) : 20;
  const keywords = args.filter((a, i) => !a.startsWith("--") && !VALUE_FLAGS.has(args[i - 1]));

  if (keywords.length === 0) {
    console.error(t("naver.needKeyword"));
    process.exit(1);
  }
  if (keywords.length > 5) {
    console.error(t("naver.tooMany", keywords.length));
    process.exit(1);
  }

  const env = loadEnv();
  const { NAVER_AD_CUSTOMER_ID: customerId, NAVER_AD_API_KEY: apiKey, NAVER_AD_SECRET_KEY: secretKey } = env;
  if (!customerId || !apiKey || !secretKey) {
    console.error(t("naver.noCreds"));
    console.error(t("naver.needKeys"));
    process.exit(2);
  }

  // The keyword tool rejects spaces and punctuation, so strip whitespace first.
  const hint = keywords.map((k) => k.replace(/\s+/g, "")).join(",");
  const timestamp = Date.now().toString();
  const url = `${BASE}${PATH}?hintKeywords=${encodeURIComponent(hint)}&showDetail=1`;

  const res = await fetch(url, {
    headers: {
      "X-Timestamp": timestamp,
      "X-API-KEY": apiKey,
      "X-CUSTOMER": String(customerId),
      "X-Signature": sign(timestamp, "GET", PATH, secretKey),
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error(t("naver.apiError", res.status, body.slice(0, 400)));
    if (res.status === 401 || res.status === 403) {
      console.error(t("naver.authHint"));
    }
    process.exit(3);
  }

  const data = await res.json();
  if (asJson) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  const rows = (data.keywordList ?? [])
    .map((r) => {
      const pc = toCount(r.monthlyPcQcCnt);
      const mo = toCount(r.monthlyMobileQcCnt);
      return { keyword: r.relKeyword, pc, mo, total: pc + mo, comp: r.compIdx ?? "-" };
    })
    .sort((a, b) => b.total - a.total);

  console.log(t("naver.hintLine", keywords.join(", ")));
  console.log(`${t("naver.countLine", Math.min(limit, rows.length), rows.length)}\n`);
  console.log(t("naver.tableHead"));
  for (const r of rows.slice(0, limit)) {
    console.log(`${r.keyword} | ${r.total.toLocaleString()} | ${r.pc.toLocaleString()} | ${r.mo.toLocaleString()} | ${r.comp}`);
  }
  console.log(`\n${t("naver.footnote")}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
