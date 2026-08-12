---
name: seo-title-creator
description: Recommends three search-competitive titles for a piece of content, each with its evidence and its weakness. Handles titles only and never proposes body edits or content additions. Requires Google Search Console — without a verified property it refuses to recommend and walks through the setup instead of guessing. For Korean target queries it also requires the Naver Search Ad keyword tool for monthly search volume; for English targets Naver is excluded entirely. Competition strength comes from live search results, optionally sharpened by SerpApi. Built for Korean-language content and Korean search behaviour; also works for English queries.
when_to_use: |
  (1) "recommend a title", "제목 추천해줘", "what should I call this post", "검색 잘 되는 제목",
  (2) after drafting a blog post or article and deciding what to name it,
  (3) re-titling published content that is not getting search impressions,
  (4) checking a keyword's search volume or competition strength,
  (5) comparing two or more title candidates to see which one is stronger.
argument-hint: "[file path | pasted body text | one-line topic]"
model: opus
effort: high
allowed-tools: >-
  Bash(node ${CLAUDE_SKILL_DIR}/scripts/check-setup.mjs *)
  Bash(node ${CLAUDE_SKILL_DIR}/scripts/language.mjs *)
  Bash(node ${CLAUDE_SKILL_DIR}/scripts/naver-keywords.mjs *)
  Bash(node ${CLAUDE_SKILL_DIR}/scripts/gsc-queries.mjs *)
  Read WebSearch WebFetch
compatibility: Requires Node.js 18+ and network access. Google Search Console credentials are mandatory and the skill refuses to run without them. Naver Search Ad credentials are mandatory for Korean target queries and unused for English ones. SerpApi is optional and has a free tier.
license: MIT
metadata:
  author: hongtani1
  version: "3.0"
---

# SEO Title Recommendation

Take a piece of content and return **three title candidates**, each with the query it targets, the evidence behind it, and what it gives up.

**Core rule: never recommend from intuition.** Search volume, competition strength, and the site's current position are measured, not guessed. A number that was estimated is not evidence.

This rule has teeth: **when a required source is missing, the skill produces no candidates at all.** It reports what is missing, walks through the setup, and stops. Recommending from partial data was the failure mode this skill exists to prevent, so a title recommendation is never the consolation prize for an unconfigured run. The exact requirements are in Step 0.

## Language

This skill speaks English and Korean. The choice is made once, on first run, and then stays fixed.

Most content this skill handles is Korean, and the method in `references/title-method.md` is built around Korean orthography — the same product is written 구글 애널리틱스, 구글애널리틱스, Google Analytics, and GA4, and those are four different queries. Keep Korean queries, titles, and examples in Korean regardless of the interface language. **Never translate a title candidate or a target query into the interface language.** A translated query is a different query and no longer matches what the data measured.

## Scope

**Titles only.** The body is read to decide the title and for nothing else.

| In scope | Out of scope |
|---|---|
| Title candidates and their evidence | Body edits, line editing |
| Meta title | Restructuring sections or headings |
| Target queries and competition strength | Expanding or trimming content |
| Comparison across candidates and a recommendation | Internal links, images, meta description |

Do not mention body problems even when they are obvious. If the user asks about something other than the title, answer then.

## Accepting input

Start from whatever was given. Minimize the number of questions asked back.

| What the user gave | What to do |
|---|---|
| A file path (`/seo-title-creator content/post.md`) | Read the file, go to Step 2 |
| Pasted body text | Go to Step 2 |
| A one-line topic (`/seo-title-creator 구글 애널리틱스 설정법`) | Go to Step 2, confirming once what the piece will cover |
| Nothing (`/seo-title-creator`) | Run Step 0 and Step 1, then ask what to title |
| An existing title | Evaluate that title against data first, then produce three alternatives |

Given several at once (multiple files, a list of topics), handle them one at a time and produce three candidates for each.

Whatever the input, **Step 0 runs first and can end the run before any of this happens.** Never read the body, derive variants, or start searching ahead of the gate — work done before the gate becomes pressure to hand it over afterwards.

## Workflow

### Step 0. Language gate and requirement gate (always first, and it can stop the run)

```bash
node ${CLAUDE_SKILL_DIR}/scripts/check-setup.mjs
```

The first line of the output is the language state.

**If it reports `NOT CHOSEN`**, ask the user before doing anything else:

> Which language should I use for this skill — English or Korean? I'll keep it fixed after this.

Then persist the answer and do not ask again:

```bash
node ${CLAUDE_SKILL_DIR}/scripts/language.mjs --set en   # or: --set ko
```

The value is stored in `~/.seo-title-advisor.env` and survives across projects and sessions. Re-run `--set` **only** when the user explicitly asks to switch languages. Once a language is set, every later run reads it and the question never appears again.

#### The requirement gate

The rest of the output ends in a `VERDICT` line. **Obey it. There is no path that produces titles anyway.**

| Source | Requirement | Guide | Effort |
|---|---|---|---|
| Google Search Console | **Mandatory, always** | `references/setup-gsc.md` | 15 min, service account |
| Naver Search Ad keyword tool | **Mandatory for Korean target queries.** Excluded for English targets | `references/setup-naver.md` | 5 min, issued instantly, no review |
| SERP check (SerpApi) | Recommended, never blocks. Free tier is 250 searches/month | `references/setup-serp.md` | 5 min, or skip |

Why GSC is the one that cannot be waived: every other number describes the market, and GSC is the only one that describes **this site**. Without it there is no way to know whether the site can rank for a query at all, or whether one of its own posts already holds it. A title chosen without that is a guess dressed up in evidence from somebody else's data.

Why Naver is skipped for English: the panel is domestic. Running an English query through it returns a number that measures almost nothing, and a meaningless number is worse than an acknowledged blank.

#### What to do at each verdict

**`BLOCKED` — GSC is not connected.** Produce nothing. Tell the user the skill cannot run, then walk `references/setup-gsc.md` step by step, in order, with the links inline. Two things must be said plainly:

- the blocking step is #5, adding the service account as a property user — this is the one people skip, and everything else can be perfect while every call still fails
- if they have no verified Search Console property for the site, **this skill is not usable for them**, and no partial version of it is worth running

Then stop. Do not offer titles as a fallback, do not offer an estimate, do not offer to "start from the SERP and refine later." Offer to resume once the credentials are in place.

**`READY for English target queries only` — GSC is in, Naver is not.** Decide from the content which language the target queries are in. English targets: proceed, Naver is not applicable and this is not a gap. Korean targets: stop and walk `references/setup-naver.md`, noting that it takes about five minutes and there is no approval queue.

**`READY`.** Proceed.

At any verdict, if SerpApi is missing, say so in one line, proceed with built-in web search, and record in the report that positions are approximate.

Once the user connects something, re-run the check with `--live` to prove the credentials actually work before continuing:

```bash
node ${CLAUDE_SKILL_DIR}/scripts/check-setup.mjs --live
```

### Step 1. Understand the content

Pull three things from the body or outline:

- **Subject**: the tool, concept, or problem the piece is about
- **The reader's situation**: what they were trying to do when they got stuck
- **The question the piece actually answers**: never put something in the title that the body does not deliver

If only a topic was given with no body, confirm once what it will cover. A title that outruns its content produces a click followed by a bounce, which costs ranking rather than gaining it.

### Step 2. Derive notation variants

Follow section 1 of `references/title-method.md` to expand the seed keyword across **five axes**. Pay particular attention to mixed Korean-English notation, which matches neither the Korean nor the English query cleanly and loses on both sides.

### Step 3. Search volume (Korean target queries; skipped for English targets)

```bash
node ${CLAUDE_SKILL_DIR}/scripts/naver-keywords.mjs 키워드1 키워드2 키워드3
```

Five hint keywords maximum per call, so split the variants across two or three calls. Read the related-keyword rows as well: an expression nobody predicted often carries the largest volume, and that is the single most useful thing this step produces.

For English target queries this step is **skipped, not failed.** Say so once in the report — "Naver excluded: English target queries" — and do not present the absence as a gap in the evidence.

### Step 4. The site's current position (always; the gate guarantees it is available)

```bash
# how much visibility does this site already have in this topic cluster
node ${CLAUDE_SKILL_DIR}/scripts/gsc-queries.mjs --contains "주제 키워드" --days 180

# is an existing post already taking the candidate query
node ${CLAUDE_SKILL_DIR}/scripts/gsc-queries.mjs --contains "후보 검색어" --by page
```

Under 100 total impressions means the site has no authority in that cluster yet, so drop head queries from the candidate list. If another post already holds a candidate query, that is cannibalization — change the angle rather than competing with yourself.

Run both calls for every candidate before writing anything. This step is the reason the gate exists, so skipping it because the first result looked uninteresting defeats the whole arrangement.

### Step 5. Competition strength

Look up each candidate query in live search and judge who occupies the top. Apply the verdict table in section 3 of `references/title-method.md`. If SerpApi is configured, use the call shown in `references/setup-serp.md`.

The SerpApi free tier is **250 searches per month**, so spend it on the two or three queries that will actually appear in a title and leave exploratory variants to built-in web search. Do not run the whole variant list through it.

Two checks matter most:

- **Prefer queries where Q&A community threads sit at the top.** Demand is proven and no organized answer exists yet.
- **Check whether the site's own posts appear.** This overlaps Step 4 deliberately: GSC misses a page that ranks but earns no impressions, and the SERP read misses how a page performs. Either flag disqualifies the candidate.

### Step 6. Produce three titles

Build one each from patterns A, B, and C in section 4 of `references/title-method.md`. Candidates that share a character stop functioning as a choice.

Follow the output format in section 6 exactly. Every candidate carries its target query, its evidence, and its weakness. Close with a single paragraph naming which one you recommend and why.

## Judgment rules

- **A missing requirement stops the run.** No GSC, no candidates — for anyone, on any content, however small the request looks. Korean targets with no Naver, likewise. "Just a rough one" and "I know it's an estimate" are not exemptions; the user cannot consent to evidence that does not exist, and a recommendation with this skill's format around it reads as measured whatever the disclaimer says.
- **Absent data is reported as absent.** Never write an estimated search volume as if it were measured.
- **Every candidate states its weakness.** Each of the three gives something up, and the user cannot choose without knowing what.
- **A title never promises more than the body delivers.** Traffic up and bounce up together sends ranking down.
- **An existing title is evaluated before alternatives are offered.** Name the problem with the current title using data, then propose.
- **Korean stays Korean.** Titles, queries, and notation variants are never translated into the interface language.

## After the title is chosen

Changing a title does not make search engines re-read the page. Mention this in one line, and only when the content was already published:

- update the sitemap's lastmod, or request re-indexing through Search Console's URL inspection

That is the end of this skill. Do not propose body checks or follow-up work.
