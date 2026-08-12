#!/usr/bin/env node
/**
 * SNS 카피 생성 이력 기록기. 어떤 콘텐츠의 SNS를 이미 만들었는지 남겨,
 * 주간 루틴이 같은 콘텐츠를 다시 후보로 올리지 않게 한다.
 *
 * 사용법:
 *   node sns_log.mjs --add <slug> [platform ...]   # 생성 완료 기록 (플랫폼 생략 시 세 종 전부)
 *   node sns_log.mjs --list                          # 전체 이력 출력
 *   node sns_log.mjs --remove <slug>                 # 특정 slug 이력 삭제 (다시 후보로 노출)
 *
 * 저장 위치: .claude/skills/sns-writer/data/sns-log.json
 * 날짜는 인자로 받는다. 인자가 없으면 기록하지 않고 사용자에게 날짜를 요청한다.
 *   node sns_log.mjs --add <slug> --date 2026-08-12 [platform ...]
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const DATA_DIR = join(dirname(fileURLToPath(import.meta.url)), "../data");
const LOG_PATH = join(DATA_DIR, "sns-log.json");
const ALL_PLATFORMS = ["threads", "instagram", "linkedin"];

function load() {
  if (!existsSync(LOG_PATH)) return { entries: {} };
  try {
    return JSON.parse(readFileSync(LOG_PATH, "utf8"));
  } catch {
    return { entries: {} };
  }
}

function save(log) {
  mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(LOG_PATH, JSON.stringify(log, null, 2));
}

const args = process.argv.slice(2);
const cmd = args[0];

if (cmd === "--list") {
  console.log(JSON.stringify(load(), null, 2));
} else if (cmd === "--remove") {
  const slug = args[1];
  const log = load();
  delete log.entries[slug];
  save(log);
  console.log(JSON.stringify({ removed: slug }));
} else if (cmd === "--add") {
  const slug = args[1];
  if (!slug) {
    console.error("사용법: sns_log.mjs --add <slug> [--date YYYY-MM-DD] [platform ...]");
    process.exit(2);
  }
  const rest = args.slice(2);
  const dateIdx = rest.indexOf("--date");
  let date = "";
  if (dateIdx !== -1) {
    date = rest[dateIdx + 1] || "";
    rest.splice(dateIdx, 2);
  }
  const platforms = rest.length ? rest : ALL_PLATFORMS;
  const log = load();
  const prev = log.entries[slug] || { platforms: [] };
  log.entries[slug] = {
    date: date || prev.date || "",
    platforms: [...new Set([...(prev.platforms || []), ...platforms])],
  };
  save(log);
  console.log(JSON.stringify({ added: slug, ...log.entries[slug] }));
} else {
  console.log("사용법: sns_log.mjs --add <slug> [--date YYYY-MM-DD] [platform ...] | --list | --remove <slug>");
  process.exit(1);
}
