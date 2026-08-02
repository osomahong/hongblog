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
    en: "Role: threshold queries, coverage gaps, rising queries, cannibalization. Four of the five opportunity signals are computed here.",
    ko: "역할: 문턱 검색어, 커버리지 갭, 급상승, 자기잠식. 기회 신호 다섯 개 가운데 넷이 여기서 계산됩니다",
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
    en: "Google Search Console: REQUIRED, always. Four of the five opportunity signals are computed from it. Without it there is nothing left but guessing which topic is worth writing.",
    ko: "Google Search Console: 항상 필수. 기회 신호 다섯 개 가운데 넷이 여기서 계산됩니다. 이것이 없으면 어떤 주제가 쓸 만한지 짐작하는 일만 남습니다.",
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
    en: "Do not produce topic candidates. Walk the user through references/setup-gsc.md step by step and stop there. If the user has no verified Search Console property for this site, tell them plainly that this skill is not usable for them.",
    ko: "주제 후보를 만들지 마세요. references/setup-gsc.md의 절차를 단계별로 안내하고 거기서 멈춥니다. 이 사이트의 Search Console 속성을 소유하고 있지 않다면, 이 스킬은 쓸 수 없다고 분명히 알리세요.",
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
    en: "VERDICT: READY. Korean and English targets are both covered.",
    ko: "판정: 진행 가능. 한국어와 영어 타깃 모두 확인됩니다.",
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

  // --- gsc-opportunities.mjs ---
  "opp.badMode": {
    en: (m, list) => `Unknown mode "${m}". Expected one of: ${list}`,
    ko: (m, list) => `알 수 없는 모드 "${m}". 사용 가능: ${list}`,
  },
  "opp.needContains": {
    en: "Mode cluster needs --contains <fragment>.",
    ko: "cluster 모드에는 --contains <조각>이 필요합니다.",
  },
  "opp.mode": {
    en: (m, desc) => `Mode: ${m} (${desc})`,
    ko: (m, desc) => `모드: ${m} (${desc})`,
  },
  "opp.thresholds": {
    en: (s) => `Thresholds: ${s}`,
    ko: (s) => `임계값: ${s}`,
  },
  "opp.none": {
    en: "Nothing met the thresholds. Lower --min-impressions, widen --days, or read this as the site having no measurable opportunity of this kind yet.",
    ko: "임계값을 넘는 항목이 없습니다. --min-impressions를 낮추거나 --days를 늘리세요. 또는 이 종류의 기회가 아직 측정되지 않는다는 뜻으로 읽으세요.",
  },
  "opp.total": {
    en: (n) => `Total: ${n} rows`,
    ko: (n) => `합계: ${n}건`,
  },
  "opp.measuredOnly": {
    en: "Every number above is measured. Naver volume and SERP occupancy are NOT included here — collect them separately before ranking any topic.",
    ko: "위 수치는 전부 측정값입니다. 네이버 검색량과 SERP 점유는 여기 포함되지 않습니다. 주제 순위를 매기기 전에 따로 수집하세요.",
  },
  "opp.strikingDesc": {
    en: "queries that already earn impressions but sit outside the top of page one",
    ko: "이미 노출은 받는데 1페이지 상단 밖에 있는 검색어",
  },
  "opp.strikingHead": {
    en: "query | impressions | clicks | avg position | read",
    ko: "검색어 | 노출 | 클릭 | 평균순위 | 판독",
  },
  "opp.strikingNote": {
    en: "Demand and topical relevance are both already proven for these. A dedicated page usually moves them faster than anything written from scratch.",
    ko: "이 검색어들은 수요와 주제 관련성이 이미 증명된 상태입니다. 전용 페이지를 만들면 백지에서 쓴 글보다 대체로 빨리 움직입니다.",
  },
  "opp.readEdge": { en: "page-one edge", ko: "1페이지 경계" },
  "opp.readSecond": { en: "page two", ko: "2페이지" },
  "opp.readDeep": { en: "deep", ko: "그 아래" },
  "opp.risingDesc": {
    en: "queries whose impressions grew between the two most recent windows",
    ko: "최근 두 구간 사이에 노출이 늘어난 검색어",
  },
  "opp.risingHead": {
    en: "query | recent imp | previous imp | change | recent position",
    ko: "검색어 | 최근 노출 | 직전 노출 | 증감 | 최근 순위",
  },
  "opp.risingWindows": {
    en: (a, b, c, d) => `Recent window: ${a} to ${b} | Previous window: ${c} to ${d}`,
    ko: (a, b, c, d) => `최근 구간: ${a} ~ ${b} | 직전 구간: ${c} ~ ${d}`,
  },
  "opp.risingNew": { en: "new", ko: "신규" },
  "opp.risingNote": {
    en: "Growth over two windows is a trend of two points. Treat a single spike as noise until Naver volume confirms standing demand.",
    ko: "두 구간 비교는 점 두 개짜리 추세입니다. 네이버 검색량으로 상시 수요가 확인되기 전까지 한 번의 급등은 잡음으로 취급하세요.",
  },
  "opp.gapsDesc": {
    en: "queries a page picks up on the side while ranking well for its own subject",
    ko: "어떤 페이지가 자기 주제로는 상위에 있으면서 곁다리로 잡고 있는 검색어",
  },
  "opp.gapsHead": {
    en: "query | impressions | position here | gap  (page and its primary query on the next line)",
    ko: "검색어 | 노출 | 이 검색어 순위 | 격차  (다음 줄에 페이지와 그 페이지의 주력 검색어)",
  },
  "opp.gapsPrimary": {
    en: (q, pos) => `(primary: "${q}" at ${pos})`,
    ko: (q, pos) => `(주력: "${q}" ${pos}위)`,
  },
  "opp.gapsNote": {
    en: "A wide gap means the query has no page of its own. Splitting it out is the opportunity and the cannibalization risk at the same time: the new page has to answer something the existing one does not, or the two will divide the impressions.",
    ko: "격차가 크다는 것은 그 검색어에 전용 페이지가 없다는 뜻입니다. 떼어내는 것이 기회인 동시에 자기잠식 위험입니다. 새 페이지가 기존 페이지에 없는 답을 담지 못하면 노출만 둘로 나뉩니다.",
  },
  "opp.cannibalDesc": {
    en: "queries where two or more of the site's own pages compete",
    ko: "자사 페이지 둘 이상이 겹쳐 노출되는 검색어",
  },
  "opp.cannibalHead": {
    en: "query | impressions | pages | best position",
    ko: "검색어 | 노출 | 경쟁 페이지 수 | 최고순위",
  },
  "opp.cannibalNote": {
    en: "These are the topics NOT to write again. Adding a third page lowers the combined impressions rather than raising them.",
    ko: "여기 나온 주제는 새로 쓰지 않아야 할 자리입니다. 세 번째 페이지를 얹으면 합산 노출이 오르는 대신 내려갑니다.",
  },
  "opp.clusterDesc": {
    en: "total visibility this site holds inside one topic cluster",
    ko: "한 주제 클러스터에서 이 사이트가 가진 노출 총량",
  },
  "opp.clusterSummary": {
    en: (q, imp, clk, pages) =>
      `Cluster totals: ${q} queries, ${imp} impressions, ${clk} clicks, spread over ${pages} pages`,
    ko: (q, imp, clk, pages) =>
      `클러스터 합계: 검색어 ${q}개, 노출 ${imp}, 클릭 ${clk}, 페이지 ${pages}개에 분산`,
  },
  "opp.clusterAuthority": {
    en: (imp) =>
      imp < 100
        ? `Under 100 impressions. Treat the site as having no authority in this cluster yet and keep head queries out of the candidate list.`
        : `${imp} impressions. The site has a measurable foothold in this cluster.`,
    ko: (imp) =>
      imp < 100
        ? `노출 100 미만입니다. 이 클러스터에서는 아직 권위가 없는 것으로 보고, 헤드 검색어는 후보에서 뺍니다.`
        : `노출 ${imp}. 이 클러스터에 측정 가능한 발판이 있습니다.`,
  },

  // --- serp-check.mjs ---
  "serp.noKey": {
    en: "SERPAPI_KEY is not set. This source never blocks the skill: fall back to built-in web search and record that positions are approximate.",
    ko: "SERPAPI_KEY가 없습니다. 이 소스는 스킬을 막지 않습니다. 내장 웹 검색으로 대체하고 순위가 근사값임을 기록하세요.",
  },
  "serp.header": {
    en: (q, gl, hl) => `Query: ${q}  (gl=${gl}, hl=${hl})`,
    ko: (q, gl, hl) => `검색어: ${q}  (gl=${gl}, hl=${hl})`,
  },
  "serp.head": {
    en: "position | occupant | domain | title",
    ko: "순위 | 점유 성격 | 도메인 | 제목",
  },
  "serp.error": {
    en: (m) => `SerpApi error: ${m}`,
    ko: (m) => `SerpApi 오류: ${m}`,
  },
  "serp.empty": {
    en: "No organic results came back. Demand is unconfirmed for this query.",
    ko: "자연 검색 결과가 없습니다. 이 검색어의 수요는 확인되지 않았습니다.",
  },
  "serp.classVendor": { en: "vendor docs", ko: "벤더 공식 문서" },
  "serp.classPublisher": { en: "publisher/wiki", ko: "대형 매체/위키" },
  "serp.classCommunity": { en: "Q&A community", ko: "Q&A 커뮤니티" },
  "serp.classBlog": { en: "personal blog", ko: "개인 블로그" },
  "serp.classOwn": { en: "THIS SITE", ko: "내 사이트" },
  "serp.classOther": { en: "unclassified", ko: "미분류" },
  "serp.verdictClosed": {
    en: "VERDICT: effectively closed. Vendor documentation or a wiki holds the top. Do not target this query head-on.",
    ko: "판정: 사실상 닫힘. 벤더 공식 문서나 위키가 상위를 잡고 있습니다. 이 검색어를 정면으로 노리지 마세요.",
  },
  "serp.verdictOpen": {
    en: "VERDICT: opportunity. Community threads or personal blogs hold the top, so the question exists and no organized answer does.",
    ko: "판정: 기회. 커뮤니티 스레드나 개인 블로그가 상위를 잡고 있습니다. 질문은 있는데 정리된 답이 없다는 뜻입니다.",
  },
  "serp.verdictCrowded": {
    en: "VERDICT: crowded but open. Win on specificity and evidence rather than breadth.",
    ko: "판정: 혼잡하지만 열려 있음. 넓이가 아니라 구체성과 근거로 이기세요.",
  },
  "serp.verdictOwned": {
    en: "VERDICT: already taken by this site. Writing another page here splits the impressions.",
    ko: "판정: 이미 내 사이트가 잡고 있음. 여기에 페이지를 더 얹으면 노출이 나뉩니다.",
  },
  "serp.heuristicNote": {
    en: "Occupant labels come from a domain list, not from reading the pages. Check anything that matters before acting on it.",
    ko: "점유 성격은 도메인 목록으로 붙인 것이지 페이지를 읽고 판단한 것이 아닙니다. 중요한 항목은 직접 확인하세요.",
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
