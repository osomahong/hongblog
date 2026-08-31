# seo-title-creator

A Claude Code skill that recommends **three title candidates** for a piece of content — each with the query it targets, the evidence behind it, and what it gives up.

It is built on one rule: **never recommend from intuition.** Search volume, competition strength, and the site's current position are measured, not guessed. When a required source is missing, the skill produces no candidates at all — it reports what is missing, walks through the setup, and stops.

That refusal is the feature. A title recommendation dressed in this skill's evidence format reads as measured whatever the disclaimer says, so partial runs are not offered.

---

## What it does

| In scope | Out of scope |
|---|---|
| Three title candidates, each with evidence and weakness | Body edits, line editing |
| Meta title | Restructuring sections or headings |
| Target queries and competition strength | Expanding or trimming content |
| A recommendation naming one of the three | Internal links, images, meta description |

It reads the body only to decide the title, and never comments on the body — even when a problem is obvious.

---

## Requirements

| Source | Requirement | Cost | Setup |
|---|---|---|---|
| **Google Search Console** | **Mandatory, always.** No credentials → no candidates | Free | `references/setup-gsc.md` — 15 min, service account |
| **Naver Search Ad keyword tool** | **Mandatory for Korean target queries.** Excluded entirely for English targets | Free | `references/setup-naver.md` — 5 min, issued instantly, no review |
| SerpApi | Recommended, never blocks | Free tier, 250 searches/month | `references/setup-serp.md` — or skip, built-in web search substitutes |

**Google Search Console is the one that cannot be waived.** Every other number describes the market; GSC is the only one that describes *your* site. Without it there is no way to know whether the site can rank for a query at all, or whether one of its own posts already holds it.

The corollary matters before you install: **if you do not own a verified Search Console property for the site you publish on, this skill is not usable for you.** Not a reduced version of it — none of it.

**Naver is skipped for English on purpose.** The panel is domestic, so an English query returns a number that measures almost nothing. The skill leaves the field blank and says why, rather than reporting a meaningless figure as evidence.

Runtime: **Node.js 18+** and network access. No dependencies to install — the scripts use only Node built-ins.

---

## Install

Copy the `seo-title-creator` directory into either location:

```bash
# personal, available in every project
~/.claude/skills/seo-title-creator/

# project-scoped, shared with the repo
<project>/.claude/skills/seo-title-creator/
```

Then verify:

```bash
node ~/.claude/skills/seo-title-creator/scripts/check-setup.mjs
```

The last line is a `VERDICT`. `BLOCKED` means the skill will refuse to recommend until Search Console is connected.

---

## Credentials

Credentials are read in this order, first hit wins:

1. real environment variables
2. `./.env.local`
3. `./.env`
4. `~/.seo-title-advisor.env` — the shared file, works from any project

```bash
# Google Search Console (mandatory)
GSC_SERVICE_ACCOUNT_KEY=<base64 blob, raw JSON, or a path to the JSON file>
GSC_SITE_URL=sc-domain:example.com          # or https://example.com/

# Naver Search Ad (mandatory for Korean target queries)
NAVER_AD_CUSTOMER_ID=1234567
NAVER_AD_API_KEY=0100000000...
NAVER_AD_SECRET_KEY=AQAAAAA...

# SerpApi (optional)
SERPAPI_KEY=...
```

If a service account is already in use for GA4 analysis, `GA4_SERVICE_ACCOUNT_KEY` is picked up automatically — only the Search Console step remains, adding that account as a property user.

Prove the credentials actually work, rather than merely being present:

```bash
node scripts/check-setup.mjs --live
```

**No credentials ship with this package.** Add `.env` and `.env.local` to `.gitignore` before putting any value in them.

---

## Language

The skill asks once, on first run, whether to speak English or Korean, then keeps that choice permanently in `~/.seo-title-advisor.env`.

```bash
node scripts/language.mjs --get
node scripts/language.mjs --set ko    # or: --set en
```

The interface language never changes the content language. **Korean titles, queries, and notation variants stay Korean regardless of the setting** — a translated query is a different query and no longer matches what the data measured.

---

## Usage

```
/seo-title-creator content/post.md              # a file
/seo-title-creator <pasted body text>           # pasted content
/seo-title-creator 구글 애널리틱스 설정법          # a one-line topic
/seo-title-creator                              # asks what to title
```

Give it an existing title and it evaluates that title against data first, then offers alternatives.

---

## How it decides

1. **Gate** — check credentials, and stop here if a required one is missing
2. **Read** — subject, the reader's situation, the question the body actually answers
3. **Notation variants** — expand the seed keyword across five axes, because 구글 애널리틱스, 구글애널리틱스, Google Analytics, and GA4 are four different queries
4. **Volume** — Naver monthly search volume, including related keywords nobody predicted
5. **Position** — what this site already ranks for, and whether an existing post holds the candidate query
6. **Competition** — who occupies the top of the results, judged by occupant type rather than position number
7. **Three titles** — one situation-first, one subject-first, one scope-limited, so the candidates function as an actual choice

The method is documented in `references/title-method.md`. Its examples are kept in Korean deliberately: the problem it solves — one product splitting across several spellings — stops being visible in translation.

---

## Files

```
seo-title-creator/
├── SKILL.md                      workflow and judgment rules
├── README.md                     this file
├── references/
│   ├── title-method.md           how data becomes candidates
│   ├── setup-gsc.md              Search Console setup
│   ├── setup-naver.md            Naver Search Ad setup
│   └── setup-serp.md             SERP checking, three methods
└── scripts/
    ├── check-setup.mjs           credential status and the requirement gate
    ├── language.mjs              read and set the output language
    ├── naver-keywords.mjs        monthly search volume
    ├── gsc-queries.mjs           impressions, position, cannibalization
    └── lib/
        ├── env.mjs               credential loader, never prints values
        └── i18n.mjs              English and Korean message catalog
```

---

## Limits worth knowing

- Naver volume is **Naver's**, not Google's. For developer and practitioner topics, Google demand is often the larger share and this number understates it.
- GSC retains **16 months** of data and withholds very low-impression queries, so row totals do not add up to the reported sum.
- Built-in web search gives approximate positions with no localization or personalization. For judging *who* occupies the top — which matters more here than the number — that is enough.
- The skill decides titles. Reworking an existing post that already holds a query is out of scope.

## License

MIT
