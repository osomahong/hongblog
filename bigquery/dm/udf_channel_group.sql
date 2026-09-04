-- 준이아빠블로그 채널 그룹 분류 UDF
-- 전 기간(2026-03~) source/medium 인벤토리를 근거로 작성
CREATE OR REPLACE FUNCTION `hong-project2511.analytics_dm.channel_group`(source STRING, medium STRING)
RETURNS STRING
AS ((
  WITH s AS (SELECT LOWER(IFNULL(source,'(direct)')) AS src, LOWER(IFNULL(medium,'(none)')) AS med)
  SELECT CASE
    -- AI 어시스턴트: 수동 태깅(medium=ai-assistant) 또는 알려진 AI 도메인
    WHEN med = 'ai-assistant' THEN 'AI 어시스턴트'
    WHEN REGEXP_CONTAINS(src, r'(^|\.)(chatgpt\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|notebooklm\.google\.com|notebook\.google\.com|copilot\.microsoft\.com|copilot\.com|grok\.com|x\.ai|you\.com|phind\.com|liner\.com|vertexaisearch\.cloud\.google\.com|felo\.ai|genspark\.ai|wrtn\.ai)$')
      OR src IN ('perplexity','chatgpt','claude','gemini','copilot','wrtn')
      THEN 'AI 어시스턴트'

    -- 유료
    WHEN REGEXP_CONTAINS(med, r'^(cpc|ppc|paidsearch|cpc_search|searchads|cpc_brandsearch|brandsearch)$') THEN '유료 검색'
    WHEN REGEXP_CONTAINS(med, r'^(cpc_paidsocial|paidsocial|paid|banner|display|cpm)$') THEN '유료 소셜'

    -- 오운드
    WHEN REGEXP_CONTAINS(med, r'^(email|e-?mail|newsletter|edm|owned_content)$') THEN '뉴스레터'

    -- 자연검색
    WHEN src = 'google' AND med = 'organic' THEN '구글 자연검색'
    WHEN REGEXP_CONTAINS(src, r'(^|\.)(naver\.com)$') OR src IN ('naver','m.search.naver.com','search.naver.com') THEN '네이버 자연검색'
    WHEN src IN ('bing','yahoo','daum','zum','nate','duckduckgo','ecosia','brave','mojeek','startpage','yandex')
      OR REGEXP_CONTAINS(src, r'(^|\.)(bing\.com|search\.yahoo\.[a-z.]+|search\.daum\.net|nate\.com|duckduckgo\.com|ecosia\.org|mojeek\.com)$')
      THEN '기타 자연검색'

    -- 소셜
    WHEN REGEXP_CONTAINS(med, r'^(social|organic_social|social-media)$') THEN '자연 소셜'
    WHEN src IN ('insta','instagram','ig','thread','threads','linkedin','facebook','fb','twitter','x','youtube','tiktok','band','link-copy')
      OR REGEXP_CONTAINS(src, r'(^|\.)(facebook\.com|instagram\.com|threads\.com|threads\.net|linkedin\.com|lnkd\.in|youtube\.com|youtu\.be|twitter\.com|t\.co|tiktok\.com|band\.us|pf\.kakao\.com|blog\.naver\.com|cafe\.naver\.com|brunch\.co\.kr|velog\.io|tistory\.com|medium\.com|reddit\.com|news\.ycombinator\.com|disqus\.com|padlet\.com)$')
      THEN '자연 소셜'

    -- 메신저·사내 협업 도구를 통한 공유
    WHEN REGEXP_CONTAINS(src, r'(^|\.)(teams\.microsoft\.com|onecdn\.static\.microsoft|teams\.cdn\.office\.net|worksmobile\.com|hiworks\.com|slack\.com|discord\.com|kakao\.com|kakaocorp\.com|menlosecurity\.com|keep\.naver\.com|link\.naver\.com|keep\.google\.com)$')
      OR src IN ('kakaotalk','slack','discord','teams')
      THEN '메신저'

    WHEN med IN ('referral','blog','pr','link','other') THEN '추천'
    WHEN src = '(direct)' AND med IN ('(none)','(not set)') THEN '직접'
    ELSE '미분류'
  END
  FROM s
));
