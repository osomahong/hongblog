#!/usr/bin/env node
/**
 * Read who occupies the top of the search results for a candidate query, and
 * label the occupant so the competition call is made from the same table every
 * time rather than from impression.
 *
 * Occupant labels come from a domain list. That is a heuristic, printed as one,
 * and the script says so on every run. Anything that decides a topic should be
 * opened and read.
 *
 * Usage:
 *   node serp-check.mjs "MCP 뜻"
 *   node serp-check.mjs "MCP 뜻" "클로드 MCP"        one SerpApi search each
 *   node serp-check.mjs --top 5 --json "MCP 뜻"
 *   node serp-check.mjs --gl us --hl en "what is mcp"
 *
 * Credentials: SERPAPI_KEY (optional; the skill falls back to web search)
 * Free tier is 250 searches per month, so spend it on queries that will decide
 * a topic and leave exploratory variants to built-in web search.
 */
import { loadEnv } from "./lib/env.mjs";
import { t } from "./lib/i18n.mjs";

/** Domain fragments by occupant type. First match in this order wins. */
const CLASSES = [
  [
    "vendor",
    [
      "cloud.google.com", "developers.google.com", "support.google.com", "ibm.com", "cloudflare.com",
      "elastic.co", "microsoft.com", "learn.microsoft.com", "aws.amazon.com", "docs.",
      "developer.", "support.", "anthropic.com", "openai.com", "modelcontextprotocol.io",
      "help.", "workato.com", "atlassian.com", "hubspot.com", "salesforce.com",
    ],
  ],
  [
    "publisher",
    [
      "namu.wiki", "wikipedia.org", "yozm.wishket.com", "zdnet.co.kr", "etnews.com",
      "chosun.com", "hankyung.com", "mk.co.kr", "techcrunch.com", "theverge.com",
      "linkedin.com", "wikidocs.net", "itworld.co.kr", "bloter.net",
    ],
  ],
  [
    "community",
    [
      "reddit.com", "stackoverflow.com", "stackexchange.com", "quora.com", "kin.naver.com",
      "okky.kr", "clien.net", "dcinside.com", "ppomppu.co.kr", "inven.co.kr",
      "github.com/issues", "discuss.", "forum.", "community.",
    ],
  ],
  [
    "blog",
    [
      "tistory.com", "blog.naver.com", "m.blog.naver.com", "velog.io", "brunch.co.kr",
      "medium.com", "github.io", "oopy.io", "notion.site", "substack.com", "post.naver.com",
    ],
  ],
];

const LABEL = {
  vendor: "serp.classVendor",
  publisher: "serp.classPublisher",
  community: "serp.classCommunity",
  blog: "serp.classBlog",
  own: "serp.classOwn",
  other: "serp.classOther",
};

function arg(name, fallback = null) {
  const i = process.argv.indexOf(`--${name}`);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

/** The bare host of the property being analysed, so its own results stand out. */
function ownHost(env) {
  const raw = env.GSC_SITE_URL ?? "";
  const stripped = raw.replace(/^sc-domain:/, "").replace(/^https?:\/\//, "").replace(/\/$/, "");
  return stripped.replace(/^www\./, "") || null;
}

function classify(link, own) {
  let host;
  try {
    host = new URL(link).hostname;
  } catch {
    return "other";
  }
  if (own && host.replace(/^www\./, "").endsWith(own)) return "own";
  for (const [name, fragments] of CLASSES) {
    if (fragments.some((f) => link.includes(f))) return name;
  }
  return "other";
}

/** The competition call, made from the same rules on every query. */
function verdict(results) {
  if (results.some((r) => r.type === "own")) return "serp.verdictOwned";
  const topThree = results.slice(0, 3);
  const topFive = results.slice(0, 5);
  const closed = topThree.filter((r) => r.type === "vendor" || r.type === "publisher").length;
  const open = topFive.filter((r) => r.type === "community" || r.type === "blog").length;
  if (closed >= 2) return "serp.verdictClosed";
  if (open >= 2) return "serp.verdictOpen";
  return "serp.verdictCrowded";
}

async function search(query, { key, gl, hl, top }) {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("q", query);
  url.searchParams.set("gl", gl);
  url.searchParams.set("hl", hl);
  url.searchParams.set("api_key", key);

  const res = await fetch(url);
  const json = await res.json();
  if (json.error) {
    console.error(t("serp.error", json.error));
    return null;
  }
  return (json.organic_results ?? []).slice(0, top);
}

async function main() {
  const env = loadEnv();
  const key = env.SERPAPI_KEY;
  if (!key) {
    console.error(t("serp.noKey"));
    process.exit(2);
  }

  const gl = arg("gl", "kr");
  const hl = arg("hl", "ko");
  const top = Number(arg("top", "10"));
  const asJson = process.argv.includes("--json");
  const valueFlags = new Set(["--gl", "--hl", "--top"]);
  const queries = process.argv
    .slice(2)
    .filter((a, i, all) => !a.startsWith("--") && !valueFlags.has(all[i - 1]));

  if (queries.length === 0) {
    console.error('Usage: serp-check.mjs "검색어" ["검색어2" ...]');
    process.exit(1);
  }

  const own = ownHost(env);
  const report = [];

  for (const q of queries) {
    const raw = await search(q, { key, gl, hl, top });
    if (raw === null) continue;

    const results = raw.map((r) => ({
      position: r.position,
      link: r.link,
      title: r.title ?? "",
      type: classify(r.link ?? "", own),
    }));

    if (asJson) {
      report.push({ query: q, verdict: verdict(results), results });
      continue;
    }

    console.log(t("serp.header", q, gl, hl));
    if (results.length === 0) {
      console.log(t("serp.empty"));
      console.log("");
      continue;
    }
    console.log(t("serp.head"));
    for (const r of results) {
      const host = (() => {
        try {
          return new URL(r.link).hostname;
        } catch {
          return r.link;
        }
      })();
      console.log(`${r.position} | ${t(LABEL[r.type])} | ${host} | ${r.title.slice(0, 45)}`);
    }
    console.log(`\n${t(verdict(results))}`);
    console.log("");
  }

  if (asJson) {
    console.log(JSON.stringify(report, null, 2));
    return;
  }
  console.log(t("serp.heuristicNote"));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
