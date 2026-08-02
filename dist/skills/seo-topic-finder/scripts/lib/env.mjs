/**
 * Credential loader. Real environment variables win; otherwise values come from
 * a dotenv-style file.
 *
 * Lookup order: process.env > ./.env.local > ./.env > ~/.seo-title-advisor.env
 *
 * The home-directory file is the shared one: credentials placed there work from
 * any project, and it is also where the language choice is stored.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const FILES = [
  path.join(process.cwd(), ".env.local"),
  path.join(process.cwd(), ".env"),
  path.join(os.homedir(), ".seo-title-advisor.env"),
];

function parseEnvFile(text) {
  const out = {};
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (key) out[key] = value;
  }
  return out;
}

let cached = null;

export function loadEnv() {
  if (cached) return cached;
  const fromFiles = {};
  for (const file of [...FILES].reverse()) {
    try {
      if (fs.existsSync(file)) Object.assign(fromFiles, parseEnvFile(fs.readFileSync(file, "utf-8")));
    } catch {
      // An unreadable file is skipped rather than failing the whole load.
    }
  }
  cached = { ...fromFiles, ...process.env };
  return cached;
}

/** Drop the cache so the next loadEnv() re-reads the files. Call after writing a config file. */
export function resetEnvCache() {
  cached = null;
}

/** Parse a service account key. Accepts a base64 blob, raw JSON, or a file path. */
export function parseServiceAccount(raw) {
  if (!raw) return null;
  const value = raw.trim();
  try {
    if (value.startsWith("{")) return JSON.parse(value);
    if (fs.existsSync(value)) return JSON.parse(fs.readFileSync(value, "utf-8"));
    return JSON.parse(Buffer.from(value, "base64").toString("utf-8"));
  } catch {
    return null;
  }
}

/** Report which credentials are present. Never returns the values themselves. */
export function credentialStatus() {
  const env = loadEnv();
  const sa = parseServiceAccount(env.GSC_SERVICE_ACCOUNT_KEY || env.GA4_SERVICE_ACCOUNT_KEY);
  return {
    naver: {
      ready: Boolean(env.NAVER_AD_CUSTOMER_ID && env.NAVER_AD_API_KEY && env.NAVER_AD_SECRET_KEY),
      missing: ["NAVER_AD_CUSTOMER_ID", "NAVER_AD_API_KEY", "NAVER_AD_SECRET_KEY"].filter((k) => !env[k]),
    },
    gsc: {
      ready: Boolean(sa?.client_email && sa?.private_key && env.GSC_SITE_URL),
      missing: [
        ...(sa?.client_email ? [] : ["GSC_SERVICE_ACCOUNT_KEY"]),
        ...(env.GSC_SITE_URL ? [] : ["GSC_SITE_URL"]),
      ],
      serviceAccountEmail: sa?.client_email ?? null,
      siteUrl: env.GSC_SITE_URL ?? null,
    },
    serpapi: {
      ready: Boolean(env.SERPAPI_KEY),
      missing: env.SERPAPI_KEY ? [] : ["SERPAPI_KEY"],
    },
  };
}
