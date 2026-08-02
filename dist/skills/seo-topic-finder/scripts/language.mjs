#!/usr/bin/env node
/**
 * Read or set the skill's output language. Asked once on first run, then fixed.
 *
 * Usage:
 *   node language.mjs --get           print the current choice, or "unset"
 *   node language.mjs --set en        fix the language to English
 *   node language.mjs --set ko        fix the language to Korean
 *
 * The choice is stored as SEO_TITLE_LANG in ~/.seo-title-advisor.env and is
 * never re-asked. Run --set again only when the user asks to change it.
 */
import { LANGS, currentLang, isLanguageSet, resolveLang, setLanguage, t } from "./lib/i18n.mjs";

function main() {
  const argv = process.argv;

  const setIdx = argv.indexOf("--set");
  if (setIdx !== -1) {
    const lang = (argv[setIdx + 1] ?? "").toLowerCase();
    if (!LANGS.includes(lang)) {
      console.error(`Unsupported language "${argv[setIdx + 1] ?? ""}". Expected one of: ${LANGS.join(", ")}`);
      process.exit(1);
    }
    const { file } = setLanguage(lang);
    // Render the confirmation in the language that was just chosen.
    process.env.SEO_TITLE_LANG = lang;
    console.log(t("lang.saved", lang, file));
    return;
  }

  if (argv.includes("--get")) {
    console.log(isLanguageSet() ? t("lang.current", resolveLang()) : t("lang.unset"));
    return;
  }

  console.error(t("lang.usage"));
  console.error(`Current: ${isLanguageSet() ? resolveLang() : "unset"} (falling back to ${currentLang()})`);
  process.exit(1);
}

main();
