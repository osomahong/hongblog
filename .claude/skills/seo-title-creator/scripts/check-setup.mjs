#!/usr/bin/env node
/**
 * Report the status of the three data sources, plus the output-language choice.
 * Always the first thing the skill runs. Credential values are never printed,
 * only whether they are present.
 *
 * Usage:
 *   node check-setup.mjs              presence check only, returns immediately
 *   node check-setup.mjs --live       also calls each API to prove the credentials work
 *   node check-setup.mjs --lang ko    render this run's output in Korean
 */
import crypto from "node:crypto";
import { credentialStatus, loadEnv, parseServiceAccount } from "./lib/env.mjs";
import { isLanguageSet, resolveLang, t } from "./lib/i18n.mjs";

const live = process.argv.includes("--live");

function mark(ready) {
  return ready ? t("setup.connected") : t("setup.notConfigured");
}

async function testNaver(env) {
  const path = "/keywordstool";
  const ts = Date.now().toString();
  const sig = crypto.createHmac("sha256", env.NAVER_AD_SECRET_KEY).update(`${ts}.GET.${path}`).digest("base64");
  const res = await fetch(`https://api.searchad.naver.com${path}?hintKeywords=%ED%85%8C%EC%8A%A4%ED%8A%B8&showDetail=0`, {
    headers: {
      "X-Timestamp": ts,
      "X-API-KEY": env.NAVER_AD_API_KEY,
      "X-CUSTOMER": String(env.NAVER_AD_CUSTOMER_ID),
      "X-Signature": sig,
    },
  });
  return res.ok ? t("setup.callOk") : t("setup.callFailed", res.status);
}

async function testGsc(env) {
  const sa = parseServiceAccount(env.GSC_SERVICE_ACCOUNT_KEY || env.GA4_SERVICE_ACCOUNT_KEY);
  const b64url = (i) => Buffer.from(i).toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const now = Math.floor(Date.now() / 1000);
  const h = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const p = b64url(
    JSON.stringify({
      iss: sa.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      exp: now + 3600,
      iat: now,
    }),
  );
  const signer = crypto.createSign("RSA-SHA256");
  signer.update(`${h}.${p}`);
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: `${h}.${p}.${b64url(signer.sign(sa.private_key))}`,
    }),
  });
  const tokenJson = await tokenRes.json();
  if (!tokenJson.access_token) return t("setup.tokenFailed");

  const site = env.GSC_SITE_URL;
  const end = new Date(Date.now() - 3 * 86400000).toISOString().slice(0, 10);
  const start = new Date(Date.now() - 33 * 86400000).toISOString().slice(0, 10);
  const res = await fetch(
    `https://www.googleapis.com/webmasters/v3/sites/${encodeURIComponent(site)}/searchAnalytics/query`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${tokenJson.access_token}`, "Content-Type": "application/json" },
      body: JSON.stringify({ startDate: start, endDate: end, dimensions: ["query"], rowLimit: 1 }),
    },
  );
  const json = await res.json();
  if (json.error) return t("setup.propertyFailed", json.error.message);
  return t("setup.callOk");
}

async function main() {
  const env = loadEnv();
  const s = credentialStatus();

  console.log(`${t("setup.header")}\n`);

  // The language gate comes first: the skill must resolve it before reporting anything else.
  console.log(isLanguageSet() ? t("setup.langLine", resolveLang()) : t("setup.langUnset"));
  console.log("");

  console.log(`1. ${t("setup.naverName")}: ${mark(s.naver.ready)}`);
  console.log(`   ${t("setup.naverRole")}`);
  if (!s.naver.ready) {
    console.log(`   ${t("setup.missing", s.naver.missing.join(", "))}`);
    console.log(`   ${t("setup.howTo", "references/setup-naver.md")}`);
  } else if (live) {
    console.log(`   ${t("setup.liveCall", await testNaver(env).catch((e) => t("setup.callError", e.message)))}`);
  }

  console.log(`\n2. Google Search Console: ${mark(s.gsc.ready)}`);
  console.log(`   ${t("setup.gscRole")}`);
  if (!s.gsc.ready) {
    console.log(`   ${t("setup.missing", s.gsc.missing.join(", "))}`);
    console.log(`   ${t("setup.howTo", "references/setup-gsc.md")}`);
  } else {
    console.log(`   ${t("setup.serviceAccount", s.gsc.serviceAccountEmail)}`);
    console.log(`   ${t("setup.property", s.gsc.siteUrl)}`);
    if (live) {
      console.log(`   ${t("setup.liveCall", await testGsc(env).catch((e) => t("setup.callError", e.message)))}`);
    }
  }

  console.log(`\n3. ${t("setup.serpName")}: ${mark(s.serpapi.ready)}`);
  console.log(`   ${t("setup.serpRole")}`);
  if (!s.serpapi.ready) {
    console.log(`   ${t("setup.serpOptional")}`);
    console.log(`   ${t("setup.howTo", "references/setup-serp.md")}`);
  }

  const readyCount = [s.naver.ready, s.gsc.ready, s.serpapi.ready].filter(Boolean).length;
  console.log(`\n${t("setup.summary", readyCount)}`);

  // The gate. GSC is a hard requirement; Naver is required only for Korean
  // target queries. The script cannot know the target language, so it reports
  // the rule and lets the skill apply it to the content at hand.
  console.log(`\n${t("gate.header")}\n`);
  console.log(t("gate.gscRule"));
  console.log(t("gate.naverRule"));
  console.log(t("gate.serpRule"));
  console.log("");

  if (!s.gsc.ready) {
    console.log(t("gate.blocked"));
    console.log(t("gate.blockedAction"));
  } else if (!s.naver.ready) {
    console.log(t("gate.readyEnOnly"));
    console.log(t("gate.koBlocked"));
  } else {
    console.log(t("gate.ready"));
  }

  if (s.gsc.ready && !s.serpapi.ready) console.log(t("gate.serpNote"));
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
