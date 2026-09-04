#!/usr/bin/env python3
"""준이아빠블로그 데이터 마트 대시보드 생성기.

analytics_dm에서 집계값을 읽어 template.html에 끼워 넣고 index.html을 만든다.
브라우저로 바로 열 수 있는 단일 파일이라 서버가 필요 없다.

사용법
  python3 bigquery/dm/dashboard/build.py
  python3 bigquery/dm/dashboard/build.py --end 2026-09-02
"""
import argparse
import json
import os
import subprocess
import sys
from collections import OrderedDict

PROJECT = "hong-project2511"
DATASET = "analytics_dm"
SITE = "digitalmarketer.co.kr"
GA4_PROPERTY = "520024278"
HERE = os.path.dirname(os.path.abspath(__file__))


def bq(sql):
    """bq CLI로 쿼리를 돌리고 행 목록을 돌려준다."""
    cmd = ["bq", f"--project_id={PROJECT}", "query", "--use_legacy_sql=false",
           "--format=prettyjson", "--max_rows=100000", sql]
    r = subprocess.run(cmd, capture_output=True, text=True)
    if r.returncode != 0:
        sys.exit(f"쿼리 실패\n{r.stdout[:800]}\n{r.stderr[:800]}")
    return json.loads(r.stdout or "[]")


def I(v):
    return int(float(v)) if v not in (None, "") else 0


def F(v, nd=4):
    return round(float(v), nd) if v not in (None, "") else None


def build_payload(start, end):
    dm = f"`{PROJECT}.{DATASET}`".strip("`")
    T = lambda name: f"`{PROJECT}.{DATASET}.{name}`"
    W = f"BETWEEN DATE '{start}' AND DATE '{end}'"

    daily = [[r["date"], I(r["sessions"]), I(r["users"]), I(r["engaged"]), I(r["new_users"]),
              I(r["page_views"]), I(r["impressions"]), I(r["clicks"]), F(r["avg_position"], 2)]
             for r in bq(f"""
        SELECT FORMAT_DATE('%Y-%m-%d', d.date) AS date,
          IFNULL(s.sessions,0) AS sessions, IFNULL(s.users,0) AS users,
          IFNULL(s.engaged,0) AS engaged, IFNULL(s.new_users,0) AS new_users,
          IFNULL(c.page_views,0) AS page_views,
          IFNULL(g.impressions,0) AS impressions, IFNULL(g.clicks,0) AS clicks,
          ROUND(g.avg_position,2) AS avg_position
        FROM (SELECT date FROM UNNEST(GENERATE_DATE_ARRAY(DATE '{start}', DATE '{end}')) AS date) d
        LEFT JOIN (SELECT date, COUNT(*) sessions, COUNT(DISTINCT user_pseudo_id) users,
                          COUNTIF(is_engaged_session) engaged, COUNTIF(is_first_visit) new_users
                   FROM {T('sessions')} WHERE NOT is_local_traffic GROUP BY 1) s USING (date)
        LEFT JOIN (SELECT date, SUM(page_views) page_views FROM {T('content_daily')} GROUP BY 1) c USING (date)
        LEFT JOIN (SELECT date, SUM(web_impressions) impressions, SUM(web_clicks) clicks,
                          SAFE_DIVIDE(SUM(web_avg_position*web_impressions), NULLIF(SUM(web_impressions),0)) avg_position
                   FROM {T('search_content_daily')} GROUP BY 1) g USING (date)
        ORDER BY date""")]

    ch_rows = bq(f"""
        SELECT FORMAT_DATE('%Y-%m-%d', DATE_TRUNC(date, WEEK(MONDAY))) AS week,
               traffic.channel_group AS channel, COUNT(*) AS sessions,
               COUNTIF(is_engaged_session) AS engaged
        FROM {T('sessions')} WHERE NOT is_local_traffic AND date {W}
        GROUP BY 1,2 ORDER BY 1,3 DESC""")
    tot = {}
    for r in ch_rows:
        tot[r["channel"]] = tot.get(r["channel"], 0) + I(r["sessions"])
    keep = [k for k, _ in sorted(tot.items(), key=lambda x: -x[1])[:6]]
    agg = OrderedDict()
    for r in ch_rows:
        k = r["channel"] if r["channel"] in keep else "기타"
        a = agg.setdefault((r["week"], k), [0, 0])
        a[0] += I(r["sessions"])
        a[1] += I(r["engaged"])
    channel = [[w, c, v[0], v[1]] for (w, c), v in sorted(agg.items())]

    content = [[r["content_type"], r["slug"], (r["name"] or "")[:90], I(r["impressions"]), I(r["clicks"]),
                F(r["ctr"]), F(r["avg_position"], 2), I(r["page_views"]), I(r["entrances"]), I(r["google_en"]),
                I(r["naver_en"]), I(r["ai_en"]), I(r["engaged_en"]), I(r["s25"]), I(r["s90"]), F(r["deep_rate"]),
                F(r["eng_sec"], 1), I(r["newsletter"]), I(r["shares"]), I(r["related"]), I(r["active_days"]),
                r["first_date"], I(r["discover_imp"]), I(r["discover_clicks"])]
               for r in bq(f"""
        SELECT content_type, content_slug AS slug, ANY_VALUE(content_name) AS name,
          SUM(web_impressions) AS impressions, SUM(web_clicks) AS clicks,
          ROUND(SAFE_DIVIDE(SUM(web_clicks), NULLIF(SUM(web_impressions),0)),4) AS ctr,
          ROUND(SAFE_DIVIDE(SUM(web_avg_position*web_impressions), NULLIF(SUM(web_impressions),0)),2) AS avg_position,
          SUM(discover_impressions) AS discover_imp, SUM(discover_clicks) AS discover_clicks,
          SUM(page_views) AS page_views, SUM(entrances) AS entrances,
          SUM(google_organic_entrances) AS google_en, SUM(naver_organic_entrances) AS naver_en,
          SUM(ai_assistant_entrances) AS ai_en, SUM(engaged_entrances) AS engaged_en,
          SUM(scroll_25) AS s25, SUM(scroll_90) AS s90,
          ROUND(SAFE_DIVIDE(SUM(scroll_90), NULLIF(SUM(scroll_25),0)),4) AS deep_rate,
          ROUND(SAFE_DIVIDE(SUM(engagement_time_sec), NULLIF(SUM(sessions),0)),1) AS eng_sec,
          SUM(newsletter_clicks) AS newsletter, SUM(shares) AS shares, SUM(related_clicks) AS related,
          COUNT(DISTINCT date) AS active_days, FORMAT_DATE('%Y-%m-%d', MIN(date)) AS first_date
        FROM {T('search_content_daily')}
        WHERE content_slug IS NOT NULL AND date {W}
        GROUP BY 1,2 HAVING impressions > 0 OR page_views > 0
        ORDER BY impressions DESC""")]

    queries = [[r["query"], I(r["impressions"]), I(r["clicks"]), F(r["ctr"]), F(r["avg_position"], 2), I(r["pages"])]
               for r in bq(f"""
        SELECT q.query, SUM(q.impressions) AS impressions, SUM(q.clicks) AS clicks,
          ROUND(SAFE_DIVIDE(SUM(q.clicks), NULLIF(SUM(q.impressions),0)),4) AS ctr,
          ROUND(SAFE_DIVIDE(SUM(q.avg_position*q.impressions), NULLIF(SUM(q.impressions),0)),2) AS avg_position,
          COUNT(DISTINCT content_slug) AS pages
        FROM {T('search_content_daily')}, UNNEST(top_queries) q
        WHERE date {W} GROUP BY 1 ORDER BY impressions DESC LIMIT 150""")]

    td = [[r["content_slug"], r["content_type"], (r["name"] or "")[:80], I(r["imp_now"]), I(r["imp_prev"]),
           I(r["clk_now"]), I(r["clk_prev"]), I(r["clk_delta"])]
          for r in bq(f"""
        WITH p AS (
          SELECT content_slug, content_type, ANY_VALUE(content_name) AS name,
            SUM(IF(date > DATE_SUB(DATE '{end}', INTERVAL 28 DAY), web_impressions, 0)) AS imp_now,
            SUM(IF(date <= DATE_SUB(DATE '{end}', INTERVAL 28 DAY)
                   AND date > DATE_SUB(DATE '{end}', INTERVAL 56 DAY), web_impressions, 0)) AS imp_prev,
            SUM(IF(date > DATE_SUB(DATE '{end}', INTERVAL 28 DAY), web_clicks, 0)) AS clk_now,
            SUM(IF(date <= DATE_SUB(DATE '{end}', INTERVAL 28 DAY)
                   AND date > DATE_SUB(DATE '{end}', INTERVAL 56 DAY), web_clicks, 0)) AS clk_prev
          FROM {T('search_content_daily')} WHERE content_slug IS NOT NULL GROUP BY 1,2)
        SELECT *, clk_now - clk_prev AS clk_delta FROM p WHERE imp_now + imp_prev >= 100""")]
    td.sort(key=lambda x: -x[7])

    payload = dict(
        meta=dict(start=start, end=end, days=len(daily), project=PROJECT, dataset=DATASET, site=SITE,
                  ga4=GA4_PROPERTY),
        daily=daily, channel=channel, channelOrder=keep + ["기타"], content=content, queries=queries,
        trend=dict(up=td[:18], down=td[-18:][::-1]),
        positionBucket=[[r["bucket"], I(r["impressions"]), I(r["clicks"]), F(r["ctr"]), I(r["page_days"])]
                        for r in bq(f"""
            SELECT CASE WHEN web_avg_position < 3 THEN '1-3' WHEN web_avg_position < 6 THEN '3-6'
                        WHEN web_avg_position < 11 THEN '6-10' WHEN web_avg_position < 21 THEN '11-20'
                        WHEN web_avg_position < 51 THEN '21-50' ELSE '50+' END AS bucket,
              SUM(web_impressions) AS impressions, SUM(web_clicks) AS clicks,
              ROUND(SAFE_DIVIDE(SUM(web_clicks), NULLIF(SUM(web_impressions),0)),4) AS ctr,
              COUNT(*) AS page_days
            FROM {T('search_content_daily')} WHERE web_impressions > 0 AND date {W}
            GROUP BY 1 ORDER BY MIN(web_avg_position)""")],
        scroll=[[r["content_type"], I(r["page_views"]), I(r["s25"]), I(r["s50"]), I(r["s75"]), I(r["s90"]),
                 I(r["sessions"]), F(r["eng_sec"], 1)] for r in bq(f"""
            SELECT content_type, SUM(page_views) AS page_views, SUM(scroll_25) AS s25, SUM(scroll_50) AS s50,
              SUM(scroll_75) AS s75, SUM(scroll_90) AS s90, SUM(sessions) AS sessions,
              ROUND(SAFE_DIVIDE(SUM(engagement_time_sec), NULLIF(SUM(sessions),0)),1) AS eng_sec
            FROM {T('content_daily')}
            WHERE date {W} AND content_type IN ('insight','class','course','ai_practice','ga4_edu','home','tag')
            GROUP BY 1 ORDER BY page_views DESC""")],
        typeSummary=[[r["content_type"], I(r["pages"]), I(r["impressions"]), I(r["clicks"]), F(r["ctr"]),
                      F(r["avg_position"], 2), I(r["entrances"]), I(r["page_views"]), F(r["deep_rate"])]
                     for r in bq(f"""
            SELECT content_type, COUNT(DISTINCT content_slug) AS pages,
              SUM(web_impressions) AS impressions, SUM(web_clicks) AS clicks,
              ROUND(SAFE_DIVIDE(SUM(web_clicks), NULLIF(SUM(web_impressions),0)),4) AS ctr,
              ROUND(SAFE_DIVIDE(SUM(web_avg_position*web_impressions), NULLIF(SUM(web_impressions),0)),2) AS avg_position,
              SUM(entrances) AS entrances, SUM(page_views) AS page_views,
              ROUND(SAFE_DIVIDE(SUM(scroll_90), NULLIF(SUM(scroll_25),0)),4) AS deep_rate
            FROM {T('search_content_daily')} WHERE content_slug IS NOT NULL AND date {W}
            GROUP BY 1 ORDER BY impressions DESC""")],
        monthly=[[r["month"], I(r["page_views"]), I(r["sessions"]), I(r["quiz_answers"]), I(r["quiz_correct"]),
                  I(r["newsletter"]), I(r["shares"]), I(r["related"]), I(r["aipbl_start"]),
                  I(r["aipbl_complete"]), I(r["expand"])] for r in bq(f"""
            SELECT FORMAT_DATE('%Y-%m', date) AS month, SUM(page_views) AS page_views, SUM(sessions) AS sessions,
              SUM(quiz_answers) AS quiz_answers, SUM(quiz_correct) AS quiz_correct,
              SUM(newsletter_clicks) AS newsletter, SUM(shares) AS shares,
              SUM(related_insight_clicks + related_class_clicks) AS related,
              SUM(aipbl_start) AS aipbl_start, SUM(aipbl_complete) AS aipbl_complete, SUM(expand_clicks) AS expand
            FROM {T('content_daily')} WHERE date {W} GROUP BY 1 ORDER BY 1""")],
        searchType=[[r["month"], I(r["web_imp"]), I(r["web_clk"]), I(r["img_imp"]), I(r["img_clk"]),
                     I(r["dis_imp"]), I(r["dis_clk"])] for r in bq(f"""
            SELECT FORMAT_DATE('%Y-%m', date) AS month,
              SUM(web_impressions) AS web_imp, SUM(web_clicks) AS web_clk,
              SUM(image_impressions) AS img_imp, SUM(image_clicks) AS img_clk,
              SUM(discover_impressions) AS dis_imp, SUM(discover_clicks) AS dis_clk
            FROM {T('search_content_daily')} WHERE date {W} GROUP BY 1 ORDER BY 1""")],
        hourly=[[I(r["hour"]), I(r["dow"]), r["weekday"], I(r["sessions"])] for r in bq(f"""
            SELECT EXTRACT(HOUR FROM DATETIME(TIMESTAMP_MICROS(session_start_time), 'Asia/Seoul')) AS hour,
              FORMAT_DATE('%a', date) AS weekday, EXTRACT(DAYOFWEEK FROM date) AS dow, COUNT(*) AS sessions
            FROM {T('sessions')} WHERE NOT is_local_traffic AND date {W}
            GROUP BY 1,2,3 ORDER BY 3,1""")],
        lifecycle=[[I(r["week_since"]), I(r["posts"]), I(r["impressions"]), I(r["clicks"]),
                    F(r["imp_per_post"], 1), F(r["clk_per_post"], 1)] for r in bq(f"""
            WITH first_seen AS (
              SELECT content_slug, MIN(date) AS d0 FROM {T('search_content_daily')}
              WHERE content_type='insight' AND content_slug IS NOT NULL AND (web_impressions>0 OR page_views>0)
              GROUP BY 1)
            SELECT DIV(DATE_DIFF(s.date, f.d0, DAY), 7) AS week_since,
              COUNT(DISTINCT s.content_slug) AS posts, SUM(s.web_impressions) AS impressions,
              SUM(s.web_clicks) AS clicks,
              ROUND(SAFE_DIVIDE(SUM(s.web_impressions), COUNT(DISTINCT s.content_slug)),1) AS imp_per_post,
              ROUND(SAFE_DIVIDE(SUM(s.web_clicks), COUNT(DISTINCT s.content_slug)),1) AS clk_per_post
            FROM {T('search_content_daily')} s JOIN first_seen f USING (content_slug)
            WHERE s.content_type='insight' AND DATE_DIFF(s.date, f.d0, DAY) BETWEEN 0 AND 167
            GROUP BY 1 ORDER BY 1""")],
        cannibal=[[r["query"], I(r["pages"]), I(r["impressions"]), I(r["clicks"]), r["slugs"]] for r in bq(f"""
            SELECT q.query, COUNT(DISTINCT content_slug) AS pages, SUM(q.impressions) AS impressions,
              SUM(q.clicks) AS clicks,
              ARRAY_TO_STRING(ARRAY_AGG(DISTINCT content_slug ORDER BY content_slug LIMIT 4), ' | ') AS slugs
            FROM {T('search_content_daily')}, UNNEST(top_queries) q
            WHERE date {W} GROUP BY 1 HAVING pages >= 2 ORDER BY impressions DESC LIMIT 30""")],
    )

    dev_geo = bq(f"""
        SELECT 'device' AS dim, device_info.category AS k, COUNT(*) AS sessions, COUNTIF(is_engaged_session) AS engaged
        FROM {T('sessions')} WHERE NOT is_local_traffic AND date {W} GROUP BY 1,2
        UNION ALL
        SELECT 'country', geo.country, COUNT(*), COUNTIF(is_engaged_session)
        FROM {T('sessions')} WHERE NOT is_local_traffic AND date {W} GROUP BY 1,2
        ORDER BY dim, sessions DESC""")
    payload["device"] = [[r["k"], I(r["sessions"]), I(r["engaged"])] for r in dev_geo if r["dim"] == "device"]
    payload["country"] = [[r["k"], I(r["sessions"]), I(r["engaged"])] for r in dev_geo if r["dim"] == "country"][:12]
    return payload


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--start", default=None, help="시작일 (기본: 마트 최초일)")
    ap.add_argument("--end", default=None, help="종료일 (기본: 마트 최종일)")
    ap.add_argument("--out", default=os.path.join(HERE, "index.html"))
    a = ap.parse_args()

    if not a.start or not a.end:
        r = bq(f"SELECT FORMAT_DATE('%Y-%m-%d', MIN(date)) AS s, FORMAT_DATE('%Y-%m-%d', MAX(date)) AS e "
               f"FROM `{PROJECT}.{DATASET}.content_daily`")[0]
        a.start = a.start or r["s"]
        a.end = a.end or r["e"]
    print(f"기간 {a.start} ~ {a.end}")

    payload = build_payload(a.start, a.end)
    body = open(os.path.join(HERE, "template.html"), encoding="utf-8").read()
    if "__PAYLOAD__" not in body:
        sys.exit("template.html에 __PAYLOAD__ 자리가 없습니다.")
    body = body.replace("__PAYLOAD__", json.dumps(payload, ensure_ascii=False, separators=(",", ":")))

    page = ('<!doctype html>\n<html lang="ko">\n<head>\n<meta charset="utf-8">\n'
            '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
            '<meta name="robots" content="noindex,nofollow">\n'
            '<style>body{margin:0}img{max-width:100%}[hidden]{display:none!important}</style>\n'
            '</head>\n<body>\n' + body + '\n</body>\n</html>\n')
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(page)
    print(f"생성 완료: {a.out} ({len(page)/1024:.1f} KB)")
    print(f"열기: open {a.out}")


if __name__ == "__main__":
    main()
