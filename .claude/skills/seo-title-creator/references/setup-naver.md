# Naver Search Ad API setup

The only free official source that gives **monthly search volume** for Korean queries as a number. There is no review or approval queue — it takes about five minutes.

**Mandatory for Korean target queries.** With Korean content and no Naver credentials, the skill stops and sends you here rather than recommending from an unmeasured guess.

**Not used at all for English target queries.** The panel is domestic, so an English keyword comes back with a number that measures almost nothing. Running it anyway would be worse than leaving the field blank, so the skill leaves it blank and says why.

The console is Korean-only, so Korean UI labels are given alongside the English description.

## Before you start

- You need a Naver Search Ad account. **You do not have to run any ads** — registering is enough.
- A business registration number is not required; you can register as an individual advertiser (개인 광고주).
- No payment method and no prepaid balance are needed.

## Steps

1. **Register or sign in at Naver Search Ad**
   [https://searchad.naver.com](https://searchad.naver.com)
   Without an account, pick an advertiser type (개인 for individual, 사업자 for business) during signup.

2. **Open API access management**
   After signing in: top menu → **도구 > API 사용 관리** (Tools > API access management)
   Direct link: [https://manage.searchad.naver.com/customers/tool/api](https://manage.searchad.naver.com/customers/tool/api)

3. **Apply for the Search Ad API service**
   Press the apply button (신청), accept the terms, and save. Credentials are issued immediately — there is no review step.

4. **Copy three values**

   | Value | Label on screen | Notes |
   |---|---|---|
   | Customer ID | 고객 ID / CUSTOMER_ID | Account number, also shown in the top-right corner |
   | Access license | 액세스 라이선스 / API Key | Sent in the request header |
   | Secret key | 비밀키 / Secret Key | Used only to sign requests, never transmitted |

   Reissuing the secret key invalidates the previous one, so store it somewhere safe.

## Registering the credentials

Pick whichever fits.

**Option 1 — a `.env` file in the working folder** (simplest)

```bash
NAVER_AD_CUSTOMER_ID=1234567
NAVER_AD_API_KEY=0100000000...
NAVER_AD_SECRET_KEY=AQAAAAA...
```

Add `.env` to `.gitignore` without exception.

**Option 2 — a shared file in your home directory** (use across projects)

```bash
~/.seo-title-advisor.env
```

Same format. Read from any working directory. This is also where the skill stores your language choice.

**Option 3 — shell environment variables**

```bash
export NAVER_AD_CUSTOMER_ID=1234567
export NAVER_AD_API_KEY=...
export NAVER_AD_SECRET_KEY=...
```

## Verifying

```bash
node ${CLAUDE_SKILL_DIR}/scripts/check-setup.mjs --live
node ${CLAUDE_SKILL_DIR}/scripts/naver-keywords.mjs 구글애널리틱스
```

A table of related keywords with monthly volume means it works.

## Common problems

| Symptom | Cause | Fix |
|---|---|---|
| HTTP 401 or 403 | Signature mismatch or a typo in a key | Strip whitespace around the secret key. Copying often introduces a line break |
| HTTP 403 persists | The API service application was never saved | Re-check the application status on the API 사용 관리 screen |
| Empty result | Hint keyword contains spaces or punctuation | The script strips spaces automatically, but do not pass particles or full sentences |
| Volume comes back as `< 10` | Naver withholds exact numbers for low-volume queries | The script reports it as 5. Treat it as effectively no demand |

## Limits worth knowing

- Volume is **Naver's**, not Google's. For developer and practitioner topics, Google demand is often the larger share and this number understates it.
- **Five hint keywords per call**, maximum.
- Monthly volume is an estimate over the trailing 30 days and carries seasonality.
- English keywords return data, but the sample is small because the panel is domestic.
