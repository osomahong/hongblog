// 공개용 문구만 둔다. 원문, 고객 매핑, 계약 정보는 저장소 밖에서 관리한다.
export const EDUCATION_TITLE = "비개발자, 마케터를 위한 AI 실무 교육";
export const EDUCATION_DESCRIPTION =
  "홍승협(준이아빠)의 AI 실무 교육은 비개발자와 마케터가 콘텐츠 작성, 데이터 해석, 반복 업무에 AI를 적용하는 실습 교육입니다.";
export const PROFILE_DESCRIPTION =
  "홍승협(준이아빠)은 마케팅, 데이터 분석 경험을 바탕으로 AI 활용 교육과 업무 자동화 컨설팅을 진행하는 실무 강사이자 컨설턴트입니다.";
export const EDUCATION_CONTACT = "hong@oso.ma";
export const EDUCATION_COURSE_SLUGS = [
  "claude-fundamentals",
  "claude-in-practice",
  "claude-code-for-everyone",
] as const;

export const experienceCases = [
  {
    id: "education-practice",
    caseSlug: "public-sector-practical-training",
    sector: "공공 교육기관, 기업 실무자",
    status: "교육 완료",
    title: "디지털 마케팅 교육과 개별 실습 지원",
    context: "기업 실무자가 디지털 마케팅을 배우고 직접 실습하는 교육입니다.",
    role: "강의를 진행하고, 수강생이 실습 중 막히는 부분을 개별적으로 도왔습니다.",
    output: "이론 설명과 실습 지원을 제공하고, 교육 후 주최기관의 피드백을 받았습니다.",
    lesson: "설명을 짧게 나누고 바로 실습하는 방식, 수강생별 진행 속도를 고려한 교육 구성에 활용합니다.",
  },
  {
    id: "analytics-training",
    caseSlug: "marketing-analytics-training",
    sector: "소비재 기업, 실무 담당자",
    status: "공동 교육 완료",
    title: "공동 교육에서 데이터 질의응답과 참고 자료 제공",
    context: "디지털 마케팅 업무에 필요한 데이터 활용 방법을 다룬 교육입니다.",
    role: "사전 요구사항을 바탕으로 교육 구성과 진행을 조율하고, 공동 교육에서 데이터 기반 실무사례와 질의응답, 보고서 해석을 다뤘습니다.",
    output: "교육 종료 후 이벤트 정의서와 보고서 예시를 참고 자료로 전달했습니다.",
    lesson: "AI에 분석을 맡기기 전에 지표의 의미와 데이터 수집 기준을 설명하는 교육의 바탕이 됩니다.",
  },
  {
    id: "ai-analysis-planning",
    caseSlug: "ai-analysis-adoption-plan",
    sector: "온라인 서비스 기업, 비개발 직무",
    status: "현황 진단, 계획 수립",
    title: "비개발자를 위한 AI 데이터 분석 도입 계획",
    context: "앱 행동 데이터가 있어도 비개발 담당자가 직접 조회하고 해석하기 어려운 상황이었습니다.",
    role: "담당 컨설턴트로서 데이터와 AI 활용 현황을 진단하고, 이벤트 정의 정비와 자연어 조회, 보고 자동화의 수행 계획을 작성했습니다.",
    output: "데이터 정비, AI 연동, 조회 실습의 순서를 담은 컨설팅 수행 계획서를 작성했습니다.",
    lesson: "자동화 도구를 연결하기 전 데이터 상태와 담당자의 업무를 함께 점검하는 방법을 교육에 반영합니다.",
  },
] as const;

export const educationPrograms = [
  {
    id: "ai-basics",
    title: "생성형 AI 업무 활용",
    audience: "AI를 처음 쓰거나 문서, 콘텐츠 작성에 활용하려는 실무자",
    prerequisite: "문서 작성과 웹 브라우저 사용 경험. 코딩 경험은 필요하지 않습니다.",
    topics: ["업무 목적, 맥락, 조건을 담은 요청 작성", "문서 요약과 마케팅 콘텐츠 초안 작성", "원문 대조와 사실 확인, 수정 기준 적용"],
    output: "반복해서 쓸 업무 요청문과 검토 기준을 적용한 콘텐츠 초안",
    courseSlug: "claude-fundamentals",
    courseLabel: "클로드 기초 개념 학습",
  },
  {
    id: "ai-marketing-data",
    title: "마케팅 데이터와 AI 분석",
    audience: "보고서와 캠페인 성과를 다루는 마케터, 기획자",
    prerequisite: "표와 기본 마케팅 지표를 읽는 수준. SQL 경험은 필요하지 않습니다.",
    topics: ["분석 질문과 지표 정의, 데이터 상태 점검", "예제 데이터를 이용한 AI 요약과 해석", "원본 수치 대조와 후속 확인 과제 정리"],
    output: "지표 정의와 검증 항목을 포함한 분석 보고서 초안",
    courseSlug: "claude-in-practice",
    courseLabel: "클로드 실무 활용 개념 학습",
  },
  {
    id: "ai-workflow",
    title: "Claude Code와 반복 업무 설계",
    audience: "자료 정리, 보고 등 반복 업무를 자동화하고 싶은 비개발자",
    prerequisite: "기본적인 AI 사용 경험. 실습 환경 설치와 계정 준비가 필요합니다.",
    topics: ["업무를 입력, 처리, 검토 단계로 나누기", "Claude Code의 작업 지침과 권한 설정", "예제 파일로 실행하고 결과를 검토, 수정하기"],
    output: "반복 업무 한 가지의 작업 지침과 예제 파일 실행 결과",
    courseSlug: "claude-code-for-everyone",
    courseLabel: "비개발자를 위한 Claude Code 개념 학습",
  },
] as const;
