# SERP checking

Find out **who occupies the top** of the results to judge competition strength. When official documentation or large publishers fill page one, that query is not worth targeting head-on in a title.

There are three ways, and **the first needs no setup at all.**

## Method 1 — built-in web search (no setup, the default)

Search each candidate query with Claude's web search tool and read what comes back. Nothing to obtain, nothing to pay.

Three things to judge:

- Is there **official documentation or a vendor site** at the top? If so, avoid the query.
- Is the top a **Q&A community thread**? That is the opportunity — the question exists and no organized answer does.
- Are there several **complete explainer posts** on the same topic? Change the angle.

A fourth check that matters in practice: **look for the site's own pages.** If they show up, the query is already taken and adding another post splits it.

The limit is that positions are approximate and neither localization nor personalization is reflected. For relative judgment that is enough.

## Method 2 — SerpApi (recommended, free tier)

Use when you want exact positions on record rather than an approximate read. **There is a free tier — you do not need a paid plan for this skill.**

**250 searches per month**, confirmed on a live account dashboard in August 2026. A title decision spends three to five searches, so the free tier covers roughly fifty runs a month. Treat it as a budget worth spending on candidate queries rather than exploratory ones: check the two or three queries that will actually appear in a title, and leave the rest to Method 1.

The allowance has changed before, so if the dashboard disagrees with this document, believe the dashboard. A card is not required. This source never blocks the skill — skip it and Method 1 takes over, losing only positional precision.

1. Sign up at [https://serpapi.com/users/sign_up](https://serpapi.com/users/sign_up)
2. Copy the key from [https://serpapi.com/manage-api-key](https://serpapi.com/manage-api-key)
3. Register it
4. Remaining quota is shown on the dashboard at [https://serpapi.com/dashboard](https://serpapi.com/dashboard)

```bash
SERPAPI_KEY=your_key_here
```

Call it like this. **`gl` and `hl` are mandatory for Korean results** — omit them and you get US results for a Korean query, which is worse than no data.

```bash
curl -s "https://serpapi.com/search.json?q=검색어&gl=kr&hl=ko&api_key=$SERPAPI_KEY" \
  | node -e "let s='';process.stdin.on('data',d=>s+=d).on('end',()=>{const j=JSON.parse(s);(j.organic_results||[]).slice(0,10).forEach(r=>console.log(r.position, r.link))})"
```

## Method 3 — check it yourself

Open a private browser window and read page one. With three or four candidate queries this is the fastest and most accurate option.

## Choosing a method

| Situation | Use |
|---|---|
| 3–5 candidate queries, relative comparison is enough | Method 1 |
| You need positions on record | Method 2 |
| Results look wrong and you want to see for yourself | Method 3 |

All three exist to read the **character of the occupant**. Whether the slot is held by official documentation or by a personal blog matters far more to the title decision than the position number does.
