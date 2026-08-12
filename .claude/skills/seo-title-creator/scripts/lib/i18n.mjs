/**
 * Language preference and message catalog.
 *
 * Resolution order (first hit wins):
 *   1. --lang <en|ko> on the command line
 *   2. SEO_TITLE_LANG from process.env or any .env file env.mjs reads
 *   3. unset -> the skill asks the user once, then persists the answer
 *
 * The chosen language is written to ~/.seo-title-advisor.env so it survives
 * across projects and sessions. It is never re-asked unless the user asks to
 * change it (`language.mjs --set ko`).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { loadEnv, resetEnvCache } from "./env.mjs";

export const LANGS = ["en", "ko"];
export const DEFAULT_LANG = "en";
export const LANG_KEY = "SEO_TITLE_LANG";
export const CONFIG_FILE = path.join(os.homedir(), ".seo-title-advisor.env");

/** Language explicitly asked for on the command line, or null. */
function langFromArgv(argv) {
  const i = argv.indexOf("--lang");
  if (i === -1) return null;
  const value = (argv[i + 1] ?? "").toLowerCase();
  return LANGS.includes(value) ? value : null;
}

/** Language stored in the environment or a .env file, or null. */
function langFromEnv() {
  const value = (loadEnv()[LANG_KEY] ?? "").toLowerCase();
  return LANGS.includes(value) ? value : null;
}

/** The resolved language, or null when the user has never chosen one. */
export function resolveLang(argv = process.argv) {
  return langFromArgv(argv) ?? langFromEnv();
}

/** True once a language has been chosen, so the skill stops asking. */
export function isLanguageSet(argv = process.argv) {
  return resolveLang(argv) !== null;
}

/** The language to render output in. Falls back to English before a choice is made. */
export function currentLang(argv = process.argv) {
  return resolveLang(argv) ?? DEFAULT_LANG;
}

/**
 * Persist the language choice, preserving every other line in the config file.
 * Credentials may live in this file, so lines are rewritten, never regenerated.
 */
export function setLanguage(lang) {
  if (!LANGS.includes(lang)) {
    throw new Error(`Unsupported language "${lang}". Expected one of: ${LANGS.join(", ")}`);
  }

  const existing = fs.existsSync(CONFIG_FILE) ? fs.readFileSync(CONFIG_FILE, "utf-8") : "";
  const kept = existing
    .split("\n")
    .filter((line) => !line.trim().startsWith(`${LANG_KEY}=`));

  // Drop trailing blank lines so the file does not grow on every write.
  while (kept.length > 0 && kept[kept.length - 1].trim() === "") kept.pop();

  const next = [...kept, `${LANG_KEY}=${lang}`, ""].join("\n");
  fs.writeFileSync(CONFIG_FILE, next, { encoding: "utf-8", mode: 0o600 });

  try {
    fs.chmodSync(CONFIG_FILE, 0o600);
  } catch {
    // A pre-existing file may be owned differently; the value is not a secret.
  }

  resetEnvCache();
  return { lang, file: CONFIG_FILE };
}

/**
 * Message catalog. Values are strings or functions of the interpolated values.
 * Keys are grouped by the script that owns them.
 */
const M = {
  // --- language.mjs ---
  "lang.current": {
    en: (l) => `Language: ${l}`,
    ko: (l) => `언어: ${l}`,
  },
  "lang.unset": {
    en: "Language: not chosen yet",
    ko: "언어: 아직 선택하지 않음",
  },
  "lang.saved": {
    en: (l, f) => `Language set to "${l}". Saved to ${f}. It stays fixed until you change it.`,
    ko: (l, f) => `언어를 "${l}"로 설정했습니다. ${f}에 저장했습니다. 변경 요청 전까지 고정됩니다.`,
  },
  "lang.usage": {
    en: "Usage: language.mjs --get | --set <en|ko>",
    ko: "사용법: language.mjs --get | --set <en|ko>",
  },

  // --- check-setup.mjs ---
  "setup.header": {
    en: "=== Data source status ===",
    ko: "=== 데이터 소스 연결 상태 ===",
  },
  "setup.connected": { en: "connected", ko: "연결됨" },
  "setup.notConfigured": { en: "not configured", ko: "미설정" },
  "setup.langLine": {
    en: (l) => `Output language: ${l}`,
    ko: (l) => `출력 언어: ${l}`,
  },
  "setup.langUnset": {
    en: 'Output language: NOT CHOSEN — ask the user for English or Korean, then run "language.mjs --set <en|ko>"',
    ko: '출력 언어: 미선택 — 사용자에게 영어/한국어를 물은 뒤 "language.mjs --set <en|ko>"를 실행하세요',
  },
  "setup.naverName": { en: "Naver Search Ad keyword tool", ko: "네이버 검색광고 키워드도구" },
  "setup.naverRole": {
    en: "Role: monthly search volume and competition for Korean queries. The only free official source of Korean search demand.",
    ko: "역할: 한국어 검색어의 월간 검색량과 경쟁 정도. 국내 검색 수요 판단의 유일한 무료 공식 소스",
  },
  "setup.gscRole": {
    en: "Role: queries your site already gets impressions for, and its ranking. Detects cannibalization and current authority.",
    ko: "역할: 내 사이트가 이미 노출을 받는 검색어와 순위. 자기잠식과 현재 권위 확인",
  },
  "setup.serpName": { en: "SERP check (SerpApi)", ko: "SERP 확인 (SerpApi)" },
  "setup.serpRole": {
    en: "Role: who occupies the top of the results. Competition strength.",
    ko: "역할: 검색 결과 상위를 누가 점유했는지 확인. 경쟁 강도 판단",
  },
  "setup.serpOptional": {
    en: "Recommended. The free tier is 250 searches per month. Not required: built-in web search substitutes for it with lower positional precision.",
    ko: "권장합니다. 무료 티어는 월 250건입니다. 필수는 아닙니다. 내장 웹 검색으로 대체되며 순위 정밀도만 낮아집니다.",
  },
  "setup.missing": {
    en: (keys) => `Missing: ${keys}`,
    ko: (keys) => `빠진 값: ${keys}`,
  },
  "setup.howTo": {
    en: (doc) => `Setup guide: ${doc}`,
    ko: (doc) => `발급 절차: ${doc}`,
  },
  "setup.serviceAccount": {
    en: (v) => `Service account: ${v}`,
    ko: (v) => `서비스 계정: ${v}`,
  },
  "setup.property": {
    en: (v) => `Property: ${v}`,
    ko: (v) => `대상 속성: ${v}`,
  },
  "setup.liveCall": {
    en: (v) => `Live call: ${v}`,
    ko: (v) => `실제 호출: ${v}`,
  },
  "setup.callOk": { en: "succeeded", ko: "호출 성공" },
  "setup.callFailed": {
    en: (s) => `failed (HTTP ${s})`,
    ko: (s) => `호출 실패 (HTTP ${s})`,
  },
  "setup.callError": {
    en: (m) => `failed (${m})`,
    ko: (m) => `실패 (${m})`,
  },
  "setup.tokenFailed": { en: "token request failed", ko: "토큰 발급 실패" },
  "setup.propertyFailed": {
    en: (m) => `property access failed: ${m}`,
    ko: (m) => `속성 접근 실패: ${m}`,
  },
  "setup.summary": {
    en: (n) => `=== Summary: ${n} of 3 connected ===`,
    ko: (n) => `=== 요약: 3개 중 ${n}개 연결됨 ===`,
  },
  // --- check-setup.mjs: the requirement gate ---
  "gate.header": {
    en: "=== Requirement gate ===",
    ko: "=== 진행 요건 ===",
  },
  "gate.gscRule": {
    en: "Google Search Console: REQUIRED, always. Without it there is no way to know this site's current position or whether an existing post already holds the query.",
    ko: "Google Search Console: 항상 필수. 이것이 없으면 이 사이트의 현재 순위도, 기존 글이 그 검색어를 이미 잡고 있는지도 알 수 없습니다.",
  },
  "gate.naverRule": {
    en: "Naver Search Ad: REQUIRED when the target queries are Korean. Excluded entirely when the target queries are English — the panel is domestic and the number would not measure English demand.",
    ko: "네이버 검색광고: 타깃 검색어가 한국어일 때 필수. 타깃이 영어면 아예 제외합니다. 패널이 국내라 영어 수요를 측정하지 못합니다.",
  },
  "gate.serpRule": {
    en: "SerpApi: recommended, free tier is 250 searches/month. Not a blocker — built-in web search substitutes for it.",
    ko: "SerpApi: 권장, 무료 티어 월 250건. 차단 조건은 아닙니다. 내장 웹 검색으로 대체합니다.",
  },
  "gate.blocked": {
    en: "VERDICT: BLOCKED — Google Search Console is not connected.",
    ko: "판정: 차단 — Google Search Console이 연결돼 있지 않습니다.",
  },
  "gate.blockedAction": {
    en: "Do not produce title candidates. Walk the user through references/setup-gsc.md step by step and stop there. If the user has no verified Search Console property for this site, tell them plainly that this skill is not usable for them.",
    ko: "제목 후보를 만들지 마세요. references/setup-gsc.md의 절차를 단계별로 안내하고 거기서 멈춥니다. 이 사이트의 Search Console 속성을 소유하고 있지 않다면, 이 스킬은 쓸 수 없다고 분명히 알리세요.",
  },
  "gate.readyEnOnly": {
    en: "VERDICT: READY for English target queries only.",
    ko: "판정: 영어 타깃 검색어에 한해 진행 가능",
  },
  "gate.koBlocked": {
    en: "Korean target queries are BLOCKED: Naver Search Ad is not connected. For Korean content, walk through references/setup-naver.md — issued instantly, no review, about five minutes — and stop there.",
    ko: "한국어 타깃 검색어는 차단입니다. 네이버 검색광고가 연결돼 있지 않습니다. 한국어 콘텐츠라면 references/setup-naver.md를 안내하고 거기서 멈춥니다. 심사 없이 즉시 발급되며 5분이면 됩니다.",
  },
  "gate.ready": {
    en: "VERDICT: READY — Korean and English targets both covered.",
    ko: "판정: 진행 가능 — 한국어·영어 타깃 모두 확인됩니다.",
  },
  "gate.serpNote": {
    en: "SerpApi is not connected. Proceed with built-in web search and record in the report that positions are approximate.",
    ko: "SerpApi는 연결돼 있지 않습니다. 내장 웹 검색으로 진행하고, 순위가 근사값이라는 점을 보고서에 남기세요.",
  },

  // --- naver-keywords.mjs ---
  "naver.needKeyword": {
    en: "Pass at least one keyword. Example: naver-keywords.mjs 구글애널리틱스",
    ko: "키워드를 1개 이상 넘겨주세요. 예: naver-keywords.mjs 구글애널리틱스",
  },
  "naver.tooMany": {
    en: (n) => `At most 5 hint keywords are allowed; got ${n}.`,
    ko: (n) => `힌트 키워드는 최대 5개입니다. ${n}개가 들어왔습니다.`,
  },
  "naver.noCreds": {
    en: "Naver Search Ad credentials are missing. Follow references/setup-naver.md.",
    ko: "네이버 검색광고 자격 증명이 없습니다. references/setup-naver.md의 발급 절차를 따르세요.",
  },
  "naver.needKeys": {
    en: "Required: NAVER_AD_CUSTOMER_ID, NAVER_AD_API_KEY, NAVER_AD_SECRET_KEY",
    ko: "필요한 값: NAVER_AD_CUSTOMER_ID, NAVER_AD_API_KEY, NAVER_AD_SECRET_KEY",
  },
  "naver.apiError": {
    en: (s, b) => `Naver API error ${s}: ${b}`,
    ko: (s, b) => `네이버 API 오류 ${s}: ${b}`,
  },
  "naver.authHint": {
    en: "Most likely a bad credential or signature. Re-check the API key and secret key.",
    ko: "자격 증명이나 서명이 잘못되었을 가능성이 큽니다. API 키와 비밀키를 다시 확인하세요.",
  },
  "naver.hintLine": {
    en: (k) => `Hint keywords: ${k}`,
    ko: (k) => `힌트 키워드: ${k}`,
  },
  "naver.countLine": {
    en: (shown, total) => `Top ${shown} by volume out of ${total} related keywords`,
    ko: (shown, total) => `연관 키워드 ${total}개 중 검색량 상위 ${shown}개`,
  },
  "naver.tableHead": {
    en: "keyword | monthly total | PC | mobile | competition",
    ko: "키워드 | 월간합계 | PC | 모바일 | 경쟁정도",
  },
  "naver.footnote": {
    en: 'Entries under 10 searches are reported as "< 10" by Naver and are shown here as 5.',
    ko: "검색량이 10 미만인 항목은 네이버가 정확한 수치를 주지 않아 5로 표시했습니다.",
  },

  // --- gsc-queries.mjs ---
  "gsc.noServiceAccount": {
    en: "No service account key. Follow references/setup-gsc.md.",
    ko: "서비스 계정 키가 없습니다. references/setup-gsc.md의 발급 절차를 따르세요.",
  },
  "gsc.needServiceAccount": {
    en: "Required: GSC_SERVICE_ACCOUNT_KEY",
    ko: "필요한 값: GSC_SERVICE_ACCOUNT_KEY",
  },
  "gsc.noSite": {
    en: "No target property. Set GSC_SITE_URL or pass --site.",
    ko: "대상 속성이 없습니다. GSC_SITE_URL을 설정하거나 --site 로 넘기세요.",
  },
  "gsc.siteFormat": {
    en: "Domain properties look like sc-domain:example.com; URL-prefix properties like https://example.com/.",
    ko: "도메인 속성은 sc-domain:example.com, URL 접두어 속성은 https://example.com/ 형식입니다.",
  },
  "gsc.needFilter": {
    en: "One of --contains or --page is required.",
    ko: "--contains 또는 --page 가운데 하나는 필요합니다.",
  },
  "gsc.tokenFailed": {
    en: (j) => `Token request failed: ${j}`,
    ko: (j) => `토큰 발급 실패: ${j}`,
  },
  "gsc.apiError": {
    en: (j) => `Search Console API error: ${j}`,
    ko: (j) => `Search Console API 오류: ${j}`,
  },
  "gsc.permissionHint": {
    en: (email) => `Check that ${email} was added as a user on this property.`,
    ko: (email) => `서비스 계정 ${email} 을(를) 이 속성의 사용자로 추가했는지 확인하세요.`,
  },
  "gsc.property": {
    en: (v) => `Property: ${v}`,
    ko: (v) => `속성: ${v}`,
  },
  "gsc.range": {
    en: (s, e, d) => `Range: ${s} to ${e} (${d} days)`,
    ko: (s, e, d) => `기간: ${s} ~ ${e} (${d}일)`,
  },
  "gsc.filterQuery": {
    en: (v) => `query contains "${v}"`,
    ko: (v) => `검색어에 "${v}" 포함`,
  },
  "gsc.filterPage": {
    en: (v) => `page contains "${v}"`,
    ko: (v) => `페이지에 "${v}" 포함`,
  },
  "gsc.filterLine": {
    en: (v) => `Filter: ${v}`,
    ko: (v) => `조건: ${v}`,
  },
  "gsc.dimension": {
    en: (v) => `Dimension: ${v}`,
    ko: (v) => `차원: ${v}`,
  },
  "gsc.noRows": {
    en: "No impressions recorded for this filter.",
    ko: "해당 조건으로 노출 기록이 없습니다.",
  },
  "gsc.noRowsMeaning": {
    en: "The site gets no impressions in this query cluster yet, which is itself evidence for the competition call.",
    ko: "이 검색어군에서 아직 노출을 받지 못하고 있다는 뜻이며, 경쟁력 판단의 근거가 됩니다.",
  },
  "gsc.tableHead": {
    en: (dim) => `${dim} | clicks | impressions | CTR | avg position`,
    ko: (dim) => `${dim} | 클릭 | 노출 | CTR | 평균순위`,
  },
  "gsc.totals": {
    en: (n, c, i) => `Total: ${n} rows, ${c} clicks, ${i} impressions`,
    ko: (n, c, i) => `합계: ${n}개 항목, 클릭 ${c}, 노출 ${i}`,
  },
};

/** Render a catalog key in the active language. */
export function t(key, ...args) {
  const entry = M[key];
  if (!entry) throw new Error(`Unknown message key: ${key}`);
  const value = entry[currentLang()] ?? entry[DEFAULT_LANG];
  return typeof value === "function" ? value(...args) : value;
}

/** Every catalog key, for the self-check in language.mjs. */
export function messageKeys() {
  return Object.keys(M);
}
