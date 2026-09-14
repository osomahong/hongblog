# GEO 후속 수정 검증

상태: 로컬 소스 반영 및 검증 완료. 커밋/공개 배포 미실행.

- 1: GA4교육 두페이지 자정/캠페인 세션정의 수정, 2026-09-10 공식문서확인일 표시.
- 2: 41배 및 파생비율과 잘못된 계산절차 철회. 원자료 부족으로 대체배수 미제시.
- 3: 두글본문/요약/퀴즈/FAQ에서유입, 이름언급, 직접URL인용구분. 전체원문없는이미지를자연발견률로계산하지않음.
- 4: About 서비스3개에대상/산출물예시/완료확인/협의범위/준비사항/견적요소 추가. 기존education연결.
- 5: 기존9개익명사례재사용. 사례공통공개범위추가. 기술참고와수행증거구분. 고객측독립검증/비공개원본의공개승인은추가확인하지않음.
- 6: 기존공통Person유지, 인사이트/클래스/사례의작성자화면과OG공통값연결. 홈Person동일성검사.

자동 검증
- npm run build: 성공. prebuild 링크/제목, TypeScript, SSG, postbuild 유지보수검사 포함.
- 검색 검사342경로통과. HTML395개내부링크검사통과(유효경로424).
- tsc --noEmit, 변경TS/TSX ESLint, git diff --check 통과.
- 두Markdown문체/문어체/3줄요약HARD0. 통계맥락의분포/구간WARN유지.
- 기존접힌FAQ/단계가서버HTML에서빠지는오류를새검사로발견. 조건부미렌더를hidden표시로바꾼뒤통과.

수동 및 브라우저 검증
- About, 두글, 사례, GA4교육2개 데스크톱검사; About390px 모바일가로넘침없음.
- FAQ접힘/열림작동확인. 구독/비구독은API응답fixture로검사해공개정의유지확인. 실제회원/DB인증미검증.
- 원저장소기존변경보존, 분리worktree에서최신HEAD기준검수후patch check를거쳐원소스에반영.

유지보수
- AGENTS.md/CLAUDE.md에변경마다확인할기준추가.
- postbuild의check:maintenance는기존검색검사와HTML링크검사를함께실행.
- Person,학점,공개FAQ/단계/정의,구독selector,선별llms링크의빌드대상확인. 실제계정/최신기술사실/외부URL네트워크확인은자동검사범위밖.
- 개인geo-scan스킬references/remediation.md추가및SKILL연결,스킬구조검증통과. Claude설치는같은폴더symlink.

근거: Google Analytics 세션비교 https://support.google.com/analytics/answer/11986666?hl=en ; 트래픽획득지표 https://support.google.com/analytics/answer/12923437?hl=en .

최종 낭독 검수의 인용 단정/채널 분리 모순/열거 개수 3건을 수정하고 production build를 다시 통과했다. 최초 검수의 수치를 전체 시장에 일반화하는 표현도 관측 범위로 좁혔다.
