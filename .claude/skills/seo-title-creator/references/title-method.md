# Title Method

How collected data becomes title candidates, and how to judge between them.

Examples are kept in Korean throughout. This method exists because Korean search behaviour splits one product across several spellings, and a translated example would stop demonstrating the problem.

## Contents

1. Deriving notation variants
2. Classifying candidate queries
3. Competition verdict table
4. Title construction patterns
5. Avoiding cannibalization
6. Output format

---

## 1. Deriving notation variants

People search for the same thing under several names. Expand every seed keyword across **five axes** before looking at any data.

| Axis | Example (seed: 구글 애널리틱스) |
|---|---|
| Korean, spaced | 구글 애널리틱스 |
| Korean, unspaced | 구글애널리틱스 |
| English | Google Analytics |
| Abbreviation and version | GA4 |
| Colloquial and clipped | 구글 애널 |

Search engines connect synonyms, but the connection is strong for famous brands and weak for unusual combinations. Do not rely on it.

### Mixed Korean-English notation

Treat this as its own risk. A string like `구글 Ads API` matches neither the English query nor the Korean one exactly and loses on both sides. Same for `GA4 ecommerce 이벤트`.

The exception is an abbreviation that has fully settled into Korean usage. `GA4`, `GTM`, `SEO`, and `API` sit inside Korean sentences without penalty because that is how people actually type them. The test is whether the mixed form is what a searcher would type, not whether it is technically correct.

### Industry-internal terms

A term the industry uses among itself is not necessarily a term buyers search. `임대몰` is a real word inside Korean e-commerce, but searching it returns results about `쇼핑몰` and `자사몰` instead — the demand sits under the other words, or under brand names like `카페24` and `고도몰`.

When a term looks industry-internal:

1. confirm the volume with Naver data
2. if there is no Naver data, keep it out of the title and put it in the meta title only
3. never make it the primary target query on an unverified guess

Feed the derived variants into the Naver keyword tool five at a time.

## 2. Classifying candidate queries

Sort by volume and intent into three tiers.

| Tier | Character | Example | Use in a title |
|---|---|---|---|
| Head | Bare subject name, highest volume | 구글 애널리틱스 | Never targeted alone |
| Body | Subject plus an action or state | 구글 애널리틱스 설정 | The main axis of the title |
| Tail | Subject plus a specific situation or failure | 구글 애널리틱스 세션 소스 안 잡힘 | Highest chance of ranking |

**On a new site, or one with almost no GSC impressions in this cluster, choose only from body and tail.** Head queries require displacing documents that are already established, and the odds are poor.

If total impressions for the cluster come back under 100 in GSC, treat the site as having no authority there yet.

## 3. Competition verdict table

Judge by who occupies the top of the results.

| Top occupant | Verdict | Response |
|---|---|---|
| Vendor documentation, official help centre | Effectively closed | Remove the query from the title |
| Large publisher, wiki | Hard | Drop to a narrower tail query |
| Q&A community thread | **Opportunity** | The question exists and no organized answer does. Target it directly |
| Personal blog, small site | Winnable | Win on completeness |
| Agency and marketing blogs clustered | Crowded but open | Win on specificity and evidence, not on breadth |
| Results are thin | Demand unconfirmed | Re-check against Naver volume before committing |

A community thread at the top is the best signal available: demand is proven by the question, and the absence of a good answer is proven by a forum post outranking everything else.

### Also check for your own domain

While reading the results, look for the site's own pages. When they appear for a candidate query, that query is already taken.

This duplicates the GSC check in section 5 on purpose. The two catch different things: GSC sees pages that earn impressions but shows nothing for a page that ranks where nobody clicks, and the SERP read sees the page but not how it performs. A candidate flagged by either one is out.

## 4. Title construction patterns

Build one of each so the three candidates do not collapse into the same choice.

**Pattern A — Situation-first**
Put the problem the reader would type into the search box directly into the title. Best fit for queries where community threads rank.

> 색인은 됐는데 검색 노출이 안 될 때 점검하는 순서

**Pattern B — Subject-first**
Lead with subject and action, then list the sub-topics after a colon. Targets body queries.

> 블로그 검색 노출이 안 되는 이유: 색인, 순위, 검색어 폭 점검

**Pattern C — Scope-limited**
Narrow the subject to a specific tool or condition. Targets tail queries and faces the weakest competition.

> 티스토리 글이 구글에 색인되지 않을 때 확인할 5가지

### Construction rules

- **Put the core query inside the first 15 characters.** Pushed further back, the match weakens.
- **Split two notation variants across the title and the meta title.** Never stack both into one.
- Target 30–45 characters for the title, 30–60 for the meta title. Korean characters count as one each.
- Never chain queries together mechanically. It has to read as a sentence a person wrote.
- A pattern C title that is more specific than the body is a trap: the click arrives expecting the narrow thing and leaves when it is not there.

## 5. Avoiding cannibalization

Before settling on a title, check each candidate query with `--by page`.

```bash
node ${CLAUDE_SKILL_DIR}/scripts/gsc-queries.mjs --contains "후보 검색어" --by page
```

If an existing post already holds the query, **drop the candidate.** Two pages pushing against each other lower the combined impressions rather than raising them. Move to a different notation variant or one step further down the tail.

This check always runs — GSC is a hard requirement of the skill, so there is no fallback branch here. Pair it with the domain read in section 3 rather than choosing between them.

Reworking the existing post is out of scope here. This check exists only to decide the new title.

## 6. Output format

Always three candidates, each with evidence and weakness. A recommendation without evidence is indistinguishable from a guess.

```
## Candidate 1: [title]

Meta title: [30–60 characters]
Target queries: [primary], [secondary]
Evidence:
  - Naver monthly volume: [number] (when queried)
  - SERP top occupant: [character]
  - This site's position: [GSC result, or "not checked"]
Weakness: [what it gives up]
```

Close with **one paragraph** naming which of the three you recommend and why. Do not hand the user three options and leave them to deliberate again.

Mark any data you could not obtain as "not checked". Never present an estimate in the shape of a measurement — a number carries authority it has not earned, and the user will act on it.

Keep every title, query, and notation variant in its original language. Rendering a Korean title in English breaks the thing being measured.
