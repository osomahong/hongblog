#!/usr/bin/env node
/**
 * Compute topic opportunities from Google Search Console.
 *
 * Five modes, each isolating a different signal. None of them invents a number:
 * every value printed came back from the API.
 *
 *   striking   queries that already earn impressions but rank outside the top
 *   rising     queries whose impressions grew between two consecutive windows
 *   gaps       queries a page picks up on the side while ranking well for its own subject
 *   cannibal   queries where two or more of the site's own pages compete
 *   cluster    total visibility the site holds inside one topic cluster
 *
 * Usage:
 *   node gsc-opportunities.mjs                                  striking, 90 days
 *   node gsc-opportunities.mjs --mode rising --window 28
 *   node gsc-opportunities.mjs --mode gaps --min-impressions 5
 *   node gsc-opportunities.mjs --mode cannibal
 *   node gsc-opportunities.mjs --mode cluster --contains "MCP"
 *
 * Shared options:
 *   --days <n>              lookback window (default 90; ignored by rising)
 *   --window <n>            window size for rising (default 28)
 *   --min-impressions <n>   impression floor (default 10)
 *   --contains <fragment>   restrict to queries containing this string
 *   --limit <n>             rows to print (default 30)
 *   --site <property>       override GSC_SITE_URL
 *   --lang <en|ko>          output language for this run
 *   --json                  raw rows instead of a table
 *
 * Mode-specific options:
 *   --pos-min <n> --pos-max <n>   striking band (default 5 to 20)
 *   --gap-pos <n>                 gaps: minimum position for the side query (default 8)
 *   --gap-best <n>                gaps: maximum position for the page's own subject (default 5)
 *   --gap-delta <n>               gaps: minimum distance between the two (default 5)
 *
 * Credentials: GSC_SERVICE_ACCOUNT_KEY (or GA4_SERVICE_ACCOUNT_KEY), GSC_SITE_URL
 */
import crypto from "node:crypto";
import { loadEnv, parseServiceAccount } from "./lib/env.mjs";
import { t } from "./lib/i18n.mjs";

const MODES = ["striking", "rising", "gaps", "cannibal", "cluster"];
const DAY = 86400000;

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

function num(name, fallback) {
  const raw = arg(name);
  if (raw === null) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

/** A date offset from the freshest day Search Console reliably has (today minus 3). */
function dayOffset(days) {
  return new Date(Date.now() - (3 + days) * DAY).toISOString().slice(0, 10);
}

function range(fromDaysAgo, toDaysAgo) {
  return { startDate: dayOffset(fromDaysAgo), endDate: dayOffset(toDaysAgo) };
}

/** Shorten a URL to its path so tables stay readable. */
function shortPath(url) {
  try {
    return new URL(url).pathname || url;
  } catch {
    return url;
  }
}

async function query(token, site, { dimensions, dates, contains, rowLimit = 5000 }) {
  const filters = contains ? [{ dimension: "query", operator: "contains", expression: contains }] : [];
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        ...dates,
        dimensions,
        rowLimit,
        dimensionFilterGroups: filters.length ? [{ filters }] : undefined,
      }),
    },
  );
  const json = await res.json();
  if (json.error) {
    console.error(t("gsc.apiError", JSON.stringify(json.error)));
    if (String(json.error.message ?? "").includes("permission")) {
      console.error(t("gsc.permissionHint", "the service account"));
    }
    process.exit(3);
  }
  return json.rows ?? [];
}

// --- modes -------------------------------------------------------------

async function modeStriking(ctx) {
  const { token, site, contains, minImp, limit, days } = ctx;
  const posMin = num("pos-min", 5);
  const posMax = num("pos-max", 20);
  const dates = range(days, 0);

  const rows = await query(token, site, { dimensions: ["query"], dates, contains });
  const hits = rows
    .filter((r) => r.impressions >= minImp && r.position >= posMin && r.position <= posMax)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);

  header(ctx, "striking", t("opp.strikingDesc"), dates, `min impressions ${minImp}, position ${posMin}-${posMax}`);
  if (ctx.asJson) return dump(hits.map((r) => ({ query: r.keys[0], ...pick(r) })));
  if (hits.length === 0) return console.log(t("opp.none"));

  console.log(t("opp.strikingHead"));
  for (const r of hits) {
    const read = r.position < 10 ? t("opp.readEdge") : r.position <= 20 ? t("opp.readSecond") : t("opp.readDeep");
    console.log(`${r.keys[0]} | ${r.impressions} | ${r.clicks} | ${r.position.toFixed(1)} | ${read}`);
  }
  footer(hits.length, t("opp.strikingNote"));
}

async function modeRising(ctx) {
  const { token, site, contains, limit } = ctx;
  const window = num("window", 28);
  const minImp = num("min-impressions", 5);
  const recent = range(window, 0);
  const previous = range(window * 2, window);

  const [now, before] = await Promise.all([
    query(token, site, { dimensions: ["query"], dates: recent, contains }),
    query(token, site, { dimensions: ["query"], dates: previous, contains }),
  ]);

  const prevMap = new Map(before.map((r) => [r.keys[0], r]));
  const hits = now
    .filter((r) => r.impressions >= minImp)
    .map((r) => {
      const prev = prevMap.get(r.keys[0]);
      return { row: r, prev: prev?.impressions ?? 0, delta: r.impressions - (prev?.impressions ?? 0) };
    })
    .filter((h) => h.delta > 0)
    .sort((a, b) => b.delta - a.delta)
    .slice(0, limit);

  header(ctx, "rising", t("opp.risingDesc"), null, `min recent impressions ${minImp}, window ${window} days`);
  console.log(t("opp.risingWindows", recent.startDate, recent.endDate, previous.startDate, previous.endDate));
  console.log("");
  if (ctx.asJson) {
    return dump(hits.map((h) => ({ query: h.row.keys[0], recent: h.row.impressions, previous: h.prev, delta: h.delta })));
  }
  if (hits.length === 0) return console.log(t("opp.none"));

  console.log(t("opp.risingHead"));
  for (const h of hits) {
    const change = h.prev === 0 ? t("opp.risingNew") : `+${h.delta}`;
    console.log(`${h.row.keys[0]} | ${h.row.impressions} | ${h.prev} | ${change} | ${h.row.position.toFixed(1)}`);
  }
  footer(hits.length, t("opp.risingNote"));
}

async function modeGaps(ctx) {
  const { token, site, contains, minImp, limit, days } = ctx;
  const gapPos = num("gap-pos", 8);
  const gapBest = num("gap-best", 5);
  const gapDelta = num("gap-delta", 5);
  const dates = range(days, 0);

  const rows = await query(token, site, { dimensions: ["query", "page"], dates, contains, rowLimit: 10000 });

  // A page's own subject is the query it earns the most impressions from, not
  // whatever it happens to rank highest for. Taking the minimum position instead
  // would let a single long-tail query at rank 1.0 stand in for the page's subject.
  const primaryByPage = new Map();
  for (const r of rows) {
    const page = r.keys[1];
    const current = primaryByPage.get(page);
    if (current === undefined || r.impressions > current.impressions) primaryByPage.set(page, r);
  }

  const hits = rows
    .map((r) => ({ row: r, primary: primaryByPage.get(r.keys[1]) }))
    .filter(
      (h) =>
        h.row.keys[0] !== h.primary.keys[0] &&
        h.row.impressions >= minImp &&
        h.row.position >= gapPos &&
        h.primary.position <= gapBest &&
        h.row.position - h.primary.position >= gapDelta,
    )
    .sort((a, b) => b.row.impressions - a.row.impressions);

  // One page with many side queries would otherwise fill the whole report and
  // hide every other page's gaps.
  const perPage = num("per-page", 3);
  const seen = new Map();
  const capped = hits
    .filter((h) => {
      const n = seen.get(h.row.keys[1]) ?? 0;
      if (n >= perPage) return false;
      seen.set(h.row.keys[1], n + 1);
      return true;
    })
    .slice(0, limit);

  header(
    ctx,
    "gaps",
    t("opp.gapsDesc"),
    dates,
    `min impressions ${minImp}, side position >= ${gapPos}, page primary <= ${gapBest}, gap >= ${gapDelta}`,
  );
  if (ctx.asJson) {
    return dump(
      capped.map((h) => ({
        query: h.row.keys[0],
        page: h.row.keys[1],
        impressions: h.row.impressions,
        position: h.row.position,
        primaryQuery: h.primary.keys[0],
        primaryPosition: h.primary.position,
      })),
    );
  }
  if (capped.length === 0) return console.log(t("opp.none"));

  console.log(t("opp.gapsHead"));
  for (const h of capped) {
    const gap = (h.row.position - h.primary.position).toFixed(1);
    console.log(`${h.row.keys[0]} | ${h.row.impressions} | ${h.row.position.toFixed(1)} | ${gap}`);
    console.log(
      `    ${shortPath(h.row.keys[1])} ${t("opp.gapsPrimary", h.primary.keys[0], h.primary.position.toFixed(1))}`,
    );
  }
  footer(capped.length, t("opp.gapsNote"));
}

async function modeCannibal(ctx) {
  const { token, site, contains, minImp, limit, days } = ctx;
  const dates = range(days, 0);
  const rows = await query(token, site, { dimensions: ["query", "page"], dates, contains, rowLimit: 10000 });

  const byQuery = new Map();
  for (const r of rows) {
    const q = r.keys[0];
    if (!byQuery.has(q)) byQuery.set(q, []);
    byQuery.get(q).push(r);
  }

  const hits = [...byQuery.entries()]
    .map(([q, list]) => ({
      query: q,
      pages: list,
      impressions: list.reduce((a, r) => a + r.impressions, 0),
      best: Math.min(...list.map((r) => r.position)),
    }))
    .filter((h) => h.pages.length >= 2 && h.impressions >= minImp)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit);

  header(ctx, "cannibal", t("opp.cannibalDesc"), dates, `min impressions ${minImp}, pages >= 2`);
  if (ctx.asJson) {
    return dump(
      hits.map((h) => ({
        query: h.query,
        impressions: h.impressions,
        best: h.best,
        pages: h.pages.map((r) => r.keys[1]),
      })),
    );
  }
  if (hits.length === 0) return console.log(t("opp.none"));

  console.log(t("opp.cannibalHead"));
  for (const h of hits) {
    console.log(`${h.query} | ${h.impressions} | ${h.pages.length} | ${h.best.toFixed(1)}`);
    for (const p of h.pages.sort((a, b) => a.position - b.position)) {
      console.log(`    ${shortPath(p.keys[1])} (${p.impressions} imp, ${p.position.toFixed(1)})`);
    }
  }
  footer(hits.length, t("opp.cannibalNote"));
}

async function modeCluster(ctx) {
  const { token, site, contains, limit, days } = ctx;
  if (!contains) {
    console.error(t("opp.needContains"));
    process.exit(1);
  }
  const dates = range(days, 0);
  const [queries, pages] = await Promise.all([
    query(token, site, { dimensions: ["query"], dates, contains }),
    query(token, site, { dimensions: ["page"], dates, contains }),
  ]);

  const totalImp = queries.reduce((a, r) => a + r.impressions, 0);
  const totalClick = queries.reduce((a, r) => a + r.clicks, 0);

  header(ctx, "cluster", t("opp.clusterDesc"), dates, `query contains "${contains}"`);
  if (ctx.asJson) {
    return dump({
      queries: queries.length,
      impressions: totalImp,
      clicks: totalClick,
      pages: pages.length,
      rows: queries.map((r) => ({ query: r.keys[0], ...pick(r) })),
    });
  }
  console.log(t("opp.clusterSummary", queries.length, totalImp, totalClick, pages.length));
  console.log(t("opp.clusterAuthority", totalImp));
  console.log("");
  if (queries.length === 0) return console.log(t("opp.none"));

  console.log(t("gsc.tableHead", "query"));
  for (const r of queries.sort((a, b) => b.impressions - a.impressions).slice(0, limit)) {
    console.log(
      `${r.keys[0]} | ${r.clicks} | ${r.impressions} | ${(r.ctr * 100).toFixed(2)}% | ${r.position.toFixed(1)}`,
    );
  }
  footer(queries.length, null);
}

// --- shared output -----------------------------------------------------

function pick(r) {
  return { impressions: r.impressions, clicks: r.clicks, ctr: r.ctr, position: r.position };
}

function dump(value) {
  console.log(JSON.stringify(value, null, 2));
}

function header(ctx, mode, desc, dates, thresholds) {
  if (ctx.asJson) return;
  console.log(t("gsc.property", ctx.site));
  console.log(t("opp.mode", mode, desc));
  if (dates) console.log(t("gsc.range", dates.startDate, dates.endDate, ctx.days));
  console.log(t("opp.thresholds", thresholds));
  if (ctx.contains) console.log(t("gsc.filterLine", t("gsc.filterQuery", ctx.contains)));
  console.log("");
}

function footer(count, note) {
  console.log(`\n${t("opp.total", count)}`);
  if (note) console.log(`\n${note}`);
  console.log(`\n${t("opp.measuredOnly")}`);
}

// --- entry -------------------------------------------------------------

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

  const mode = arg("mode", "striking");
  if (!MODES.includes(mode)) {
    console.error(t("opp.badMode", mode, MODES.join(", ")));
    process.exit(1);
  }

  const token = await getAccessToken(sa);
  const ctx = {
    token,
    site,
    days: num("days", 90),
    minImp: num("min-impressions", 10),
    limit: num("limit", 30),
    contains: arg("contains"),
    asJson: process.argv.includes("--json"),
  };

  const runners = {
    striking: modeStriking,
    rising: modeRising,
    gaps: modeGaps,
    cannibal: modeCannibal,
    cluster: modeCluster,
  };
  await runners[mode](ctx);
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
