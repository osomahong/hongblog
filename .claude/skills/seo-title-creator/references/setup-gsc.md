# Google Search Console API setup

Shows **which queries your site already gets impressions for**, and **whether an existing post is already taking the query you want**.

**This source is mandatory.** The skill will not produce title candidates without it. Every other number describes the market; this is the only one that describes your site, and a title chosen without knowing your own position is a guess wearing somebody else's evidence.

The corollary is worth stating plainly: **if you do not own a verified Search Console property for the site the content will be published on, this skill is not for you.** Not a reduced version of it — none of it. Come back once the property is verified.

## Before you start

- You need a Search Console property with verified ownership.
- You need a Google Cloud account. For this purpose it stays **inside the free quota and needs no billing account**.

## Steps

1. **Create a Google Cloud project**
   [https://console.cloud.google.com/projectcreate](https://console.cloud.google.com/projectcreate)
   An existing project works fine.

2. **Enable the Search Console API**
   [https://console.cloud.google.com/apis/library/searchconsole.googleapis.com](https://console.cloud.google.com/apis/library/searchconsole.googleapis.com)
   Press Enable. Skip this and every later call returns 403.

3. **Create a service account**
   [https://console.cloud.google.com/iam-admin/serviceaccounts](https://console.cloud.google.com/iam-admin/serviceaccounts)
   Create service account, give it a name, save. **No role is needed.** Permission comes from Search Console, not from Cloud IAM.

4. **Download a JSON key**
   Click the service account → Keys tab → Add key → Create new key → **JSON**
   The downloaded file contains `client_email` and `private_key`.

5. **Add the service account as a user on the Search Console property**

   **This is the step people miss.** Google's own documentation buries it. Without it, the four steps above can be perfect and every call still fails on permissions.

   [https://search.google.com/search-console/users](https://search.google.com/search-console/users)
   Settings → Users and permissions → Add user
   Paste the `client_email` value from step 4 (it looks like `...@....iam.gserviceaccount.com`) and grant **Full** permission. Full is sufficient for reading performance data.

6. **Identify the property address**

   | Property type | Value for `GSC_SITE_URL` |
   |---|---|
   | Domain property | `sc-domain:example.com` |
   | URL-prefix property | `https://example.com/` (trailing slash included) |

   Check which type you have in the property picker at the top left of Search Console. The wrong format produces a "property not found" error.

## Registering the credentials

The JSON key is awkward to paste because of its line breaks. **Collapse it to one base64 line.**

```bash
# macOS or Linux
base64 -i ~/Downloads/service-account.json | tr -d '\n'
```

Put the resulting single line in `.env`.

```bash
GSC_SERVICE_ACCOUNT_KEY=ewogICJ0eXBlIjogInNlcnZpY2VfYWNjb3VudCIs...
GSC_SITE_URL=sc-domain:example.com
```

A path to the JSON file also works. The loader accepts base64, raw JSON, and a file path.

```bash
GSC_SERVICE_ACCOUNT_KEY=/Users/me/keys/service-account.json
```

If a service account is already in use for GA4 analysis, `GA4_SERVICE_ACCOUNT_KEY` is picked up automatically. In that case only step 5 remains — add that account to Search Console.

## Verifying

```bash
node ${CLAUDE_SKILL_DIR}/scripts/check-setup.mjs --live
node ${CLAUDE_SKILL_DIR}/scripts/gsc-queries.mjs --contains 키워드 --days 180
```

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| `User does not have sufficient permission` | Step 5 was skipped | Add the service account email as a property user |
| `Search Console API has not been used in project` | Step 2 was skipped | Enable it in the API library |
| Property not found | Address format mismatch | Domain properties need the `sc-domain:` prefix; URL properties need the trailing slash |
| Empty data | There genuinely are no impressions | Not an error. Getting no impressions in that query cluster is itself the evidence |
| No recent data | Search Console reporting lag | Typically 2–3 days. The script only queries up to 3 days ago |

## Limits worth knowing

- Data retention is **16 months**.
- Very low-impression queries are withheld for privacy, which is why the row totals do not add up to the reported sum.
- It reports on your site only. Competitor rankings and their search volume are not available here.
