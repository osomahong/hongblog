#!/usr/bin/env node
/**
 * Query Google Search Console performance data. Answers two questions: which
 * queries the site already gets impressions for, and which page currently owns
 * a given query (cannibalization).
 *
 * Usage:
 *   node gsc-queries.mjs --contains <fragment>          queries containing that fragment
 *   node gsc-queries.mjs --page <slug fragment>         queries that page receives
 *   node gsc-queries.mjs --contains <q> --by page       which page owns that query
 *   Shared options: --days 180, --limit 25, --site <property>, --lang <en|ko>
 *
 * Fragments are usually Korean: --contains "전자상거래 이벤트".
 *
 * Credentials: GSC_SERVICE_ACCOUNT_KEY (or GA4_SERVICE_ACCOUNT_KEY), GSC_SITE_URL
 */
import crypto from "node:crypto";
import { loadEnv, parseServiceAccount } from "./lib/env.mjs";
import { t } from "./lib/i18n.mjs";

function b64url(input) {
  return Buffer.from(input).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(sa) {
  const now = Math.floor(Date.now() / 1000);
  const header = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${header}.${payload}`);
  const assertion = `${header}.${payload}.${b64url(signer.sign(sa.private_key))}`;

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer", assertion }),
  });
  const json = await res.json();
  if (!json.access_token) throw new Error(t("gsc.tokenFailed", JSON.stringify(json)));
  return json.access_token;
}

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

async function main() {
  const env = loadEnv();
  const sa = parseServiceAccount(env.GSC_SERVICE_ACCOUNT_KEY || env.GA4_SERVICE_ACCOUNT_KEY);
  const site = arg("site", env.GSC_SITE_URL);

  if (!sa?.client_email) {
    console.error(t("gsc.noServiceAccount"));
    console.error(t("gsc.needServiceAccount"));
    process.exit(2);
  }
  if (!site) {
    console.error(t("gsc.noSite"));
    console.error(t("gsc.siteFormat"));
    process.exit(2);
  }

  const contains = arg("contains");
  const page = arg("page");
  const by = arg("by", contains && !page ? "query" : "query");
  const days = Number(arg("days", "180"));
  const limit = Number(arg("limit", "25"));

  if (!contains && !page) {
    console.error(t("gsc.needFilter"));
    process.exit(1);
  }

  const end = new Date(Date.now() - 3 * 86400000);
  const start = new Date(end.getTime() - days * 86400000);
  const range = { startDate: start.toISOString().slice(0, 10), endDate: end.toISOString().slice(0, 10) };

  const filters = [];
  if (contains) filters.push({ dimension: "query", operator: "contains", expression: contains });
  if (page) filters.push({ dimension: "page", operator: "contains", expression: page });

  const token = await getAccessToken(sa);
  const api = `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`;
  const res = await fetch(api, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      ...range,
      dimensions: [by],
      rowLimit: limit,
      dimensionFilterGroups: filters.length ? [{ filters }] : undefined,
    }),
  });

  const json = await res.json();
  if (json.error) {
    console.error(t("gsc.apiError", JSON.stringify(json.error)));
    if (String(json.error.message ?? "").includes("permission")) {
      console.error(t("gsc.permissionHint", sa.client_email));
    }
    process.exit(3);
  }

  const rows = json.rows ?? [];
  const filterParts = [
    ...(contains ? [t("gsc.filterQuery", contains)] : []),
    ...(page ? [t("gsc.filterPage", page)] : []),
  ];

  console.log(t("gsc.property", site));
  console.log(t("gsc.range", range.startDate, range.endDate, days));
  console.log(t("gsc.filterLine", filterParts.join(", ")));
  console.log(`${t("gsc.dimension", by)}\n`);

  if (rows.length === 0) {
    console.log(t("gsc.noRows"));
    console.log(t("gsc.noRowsMeaning"));
    return;
  }

  const totalImp = rows.reduce((a, r) => a + r.impressions, 0);
  const totalClick = rows.reduce((a, r) => a + r.clicks, 0);
  console.log(t("gsc.tableHead", by));
  for (const r of rows) {
    console.log(`${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(2)}% | ${r.position.toFixed(1)}`);
  }
  console.log(`\n${t("gsc.totals", rows.length, totalClick, totalImp)}`);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
