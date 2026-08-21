---
slug: claude-document-workflow
term: 문서, 자료 정리 워크플로 (PDF, 이미지, 표) 익히기
definition: >-
  PDF, 이미지, Excel, Word 같은 문서 자료를 Claude에 통째로 던져 분석, 요약, 변환, 정리하는 표준 흐름입니다. 매주 반복되는
  자료 정리 업무를 일관된 품질로 만드는 데 쓰입니다.
category: CLAUDE_EDUCATION
tags:
  - AI
  - 자동화
publishedAt: '2026-04-27T09:27:00.000Z'
updatedAt: '2026-07-26T00:00:00.000Z'
courseSlug: claude-in-practice
orderInCourse: 8
aliases:
  - 문서 워크플로
  - PDF 분석
  - 자료 정리
relatedTerms:
  - what-are-artifacts
  - what-are-claude-projects
  - context-window-explained
updateNotice:
  date: '2026-07'
  items:
    - 보고서 분석 시나리오의 권장 모델을 Sonnet 5, Opus 5로 교체했습니다.
difficulty: BEGINNER
quiz:
  - question: 두꺼운 PDF 보고서 100쪽을 정리할 때 결과 품질을 가장 안정적으로 만드는 흐름은 무엇일까요?
    options:
      - 자료 첨부 → 명확한 지시 → 단계 분리(요약 → 분석 → 결론) → Artifacts로 결과 다듬기
      - PDF를 본문에 그대로 복사해 붙여 넣기
      - 파일 이름만 보내고 자료는 첨부하지 않기
      - 100쪽을 한 문장으로 요약 시키기
    correctIndex: 0
    explanation: >-
      긴 자료 분석은 한 번에 다 시키지 말고, 자료 첨부 → 명확한 지시 → 단계 분리(요약 → 분석 → 결론) → Artifacts로
      다듬기 흐름을 따라야 결과가 안정됩니다. PDF 본문을 직접 붙여 넣으면 토큰을 낭비하고, 파일 이름만으로는 분석이 불가합니다. 한
      문장 요약은 분석이 아니라 압축에 가깝습니다.
metaTitle: '클로드로 PDF, 엑셀, 이미지 정리하는 방법: 문서 워크플로'
metaDescription: '클로드 문서 워크플로는 PDF, 이미지, 엑셀, 워드 자료를 Claude에 통째로 맡겨 분석, 요약, 변환하는 작업 방식입니다. 자료 유형별 처리 방법을 정리했습니다.'
ogImage: /og/claude-document-workflow.png
---

이 글은 앤트로픽이 운영하는 claude.com/resources와 platform.claude.com/docs의 문서, 이미지 처리 자료를 한국 입문자가 보기 편하게 정리한 글입니다.

## 🤔 PDF, 이미지, 표를 매주 정리하느라 시간이 너무 든다면

매주 회의록 정리, 광고 리포트 분석, 학습 자료 변환 같은 작업이 반복됩니다. 자료 형식은 PDF, 이미지, Excel, Word, 캡처 화면 등 제각각인데 결과물은 표, 요약, 보고서로 일정한 형식이어야 합니다.

이 흐름을 매번 손으로 하면 시간이 큽니다. Claude는 이런 자료를 통째로 받아 분석, 변환, 정리하는 데 강한 도구입니다. 다만 그냥 던지기보다 워크플로를 갖고 던지는 쪽이 결과 품질이 분명히 더 좋습니다.

## 📂 Claude가 다룰 수 있는 자료 형식

claude.ai와 Claude API 모두 다음 형식을 직접 받습니다.

- **PDF**: 보고서, 논문, 매뉴얼
- **이미지**: PNG, JPG, 스크린샷, 사진
- **Word, Excel, PowerPoint**: 문서, 표, 슬라이드
- **CSV, TXT, Markdown**: 텍스트 기반 자료
- **HTML**: 웹 페이지 저장본

OCR 변환이나 별도 전처리 없이 바로 업로드해 분석을 시킬 수 있습니다.

## 🔁 표준 4단계 워크플로

긴 자료 분석은 다음 네 단계로 흐름화할 때 가장 안정적입니다.

**1단계. 자료 첨부 + 명확한 지시**
- 파일을 통째로 업로드.
- "이 자료에서만 답해 달라"고 범위를 좁힘.
- [프롬프트 엔지니어링 5요소](/class/claude-fundamentals/prompt-engineering-basics)로 역할, 맥락, 작업, 제약, 예시를 갖춤.

**2단계. 요약 (Summary)**
- 전체 자료를 5~10줄로 압축.
- 분석 단계의 기반이 됩니다.

**3단계. 분석 (Analysis)**
- 요약을 바탕으로 패턴, 반복 키워드, 인사이트 도출.
- [Extended Thinking](/class/claude-in-practice/what-is-extended-thinking)을 사용 설정하면 깊이가 늘어납니다.

**4단계. 결론, 결과물 (Output)**
- [Artifacts](/class/claude-in-practice/what-are-artifacts)로 마크다운 보고서, 표, 슬라이드 초안 생성.
- 사람 검증 후 외부에 발행.

이 흐름을 한 번 정착시키면 같은 형식의 자료가 매주 같은 품질로 정리됩니다.

## 📑 시나리오 1. 회의록 정리

회의록을 음성 녹음 → 자동 받아쓰기 → 정리하는 흐름이 일반적입니다.

- **자료 첨부**: 받아쓴 텍스트 또는 자료 파일 업로드
- **지시**: "결정 사항, 할 일, 미해결 이슈 세 갈래로 정리. 분량 각 5개 이내, 잡담 제외"
- **결과**: Artifacts 마크다운 표 → 노션/구글 닥스로 옮김

[Skills](/class/claude-in-practice/what-are-claude-skills)로 등록하면 매번 같은 형식이 나옵니다.

## 📊 시나리오 2. 두꺼운 보고서 분석

100쪽 분량의 보고서를 분석하는 흐름입니다.

- **모델 선택**: [1M 컨텍스트](/class/claude-fundamentals/context-window-explained) 모델(Sonnet 5 또는 Opus 5)
- **단계 분리**:
  - "전체 5줄 요약"
  - "주제별 3~5개 키 인사이트"
  - "결정자에게 추천하는 다음 행동 3가지"
- **검증**: 출처가 보고서 안에 실제로 있는지 무작위 3곳 확인

[환각](/class/claude-fundamentals/what-is-hallucination) 위험이 큰 자리이므로 검증 단계가 필수입니다.

## 🖼️ 시나리오 3. 영수증, 스크린샷을 표로 변환

영수증 사진 50장을 스프레드시트로 옮기는 작업입니다.

- **자료 첨부**: 사진들을 한 번에 업로드
- **지시**: "각 영수증에서 날짜, 금액, 항목을 표로 정리. 표 형식: 날짜 | 금액 | 항목"
- **결과**: Artifacts 마크다운 표 → 엑셀로 옮김

자동화 빈도가 높다면 [Cowork Dispatch](/class/claude-in-practice/claude-cowork-overview)로 매월 자동 실행으로 묶을 수 있습니다.

## 🌐 시나리오 4. 외국어 자료 한국어 변환

영문 논문, 기사, 매뉴얼을 한국어로 변환하는 흐름입니다.

- **자료 첨부**: PDF 통째로
- **지시**: "한국어 존댓말로 핵심 7개. 영어 용어는 한국어 풀이를 괄호로 함께. 분량 2쪽 이내"
- **변환 후 검증**: 핵심 사실이 맞는지 원문과 비교

학습 자료라면 [교육자 가이드](/class/claude-in-practice/claude-for-educators) 시나리오 3을 참고하세요.

## 🔗 다른 도구와의 묶음

문서 워크플로는 단독보다 다른 도구와 묶일 때 효과가 커집니다.

- **[Projects](/class/claude-in-practice/what-are-claude-projects)**: 회사 양식, 과거 자료, 검토 체크리스트를 묶어둠
- **[Artifacts](/class/claude-in-practice/what-are-artifacts)**: 결과물을 시각으로 다듬음
- **[Skills](/class/claude-in-practice/what-are-claude-skills)**: 잘 됐던 워크플로를 재사용 단위로 등록
- **[Cowork](/class/claude-in-practice/claude-cowork-overview)**: 매주, 매월 반복되는 워크플로를 자동 실행

## ⚠️ 자주 하는 실수 3가지

**1. 너무 긴 자료를 한 번에 분석하기**
- 1M 컨텍스트라도 한 번에 다 던지면 앞부분 정확도가 떨어집니다. 단계로 쪼개세요.

**2. 검증 없이 결과 사용**
- 자료에서 나오지 않은 내용을 AI가 만들어 넣을 수 있습니다([환각](/class/claude-fundamentals/what-is-hallucination)). 무작위 검증을 흐름에 넣으세요.

**3. 민감 정보 그대로 입력**
- 회사 내부 자료, 고객 개인정보, 미공개 IR 자료는 [책임감 있는 AI 사용](/class/claude-fundamentals/responsible-ai-use)의 보안 기준에 따라 가명화, 마스킹 후 입력합니다.

## 📋 30초 요약

1. **Claude는 PDF, 이미지, Word, Excel, CSV 같은 자료를 직접 받아 분석할 수 있습니다.** OCR이나 별도 전처리가 필요 없습니다.

2. **표준 4단계 워크플로(자료 첨부 + 지시 → 요약 → 분석 → 결과물)를 흐름화하세요.** 회의록 정리, 보고서 분석, 영수증 변환, 외국어 변환 네 시나리오에 즉시 적용 가능합니다.

3. **[Projects](/class/claude-in-practice/what-are-claude-projects), [Artifacts](/class/claude-in-practice/what-are-artifacts), [Skills](/class/claude-in-practice/what-are-claude-skills), [Cowork](/class/claude-in-practice/claude-cowork-overview)와 묶으면 매주 같은 품질의 결과물이 자동으로 만들어집니다.** 너무 긴 자료 한 번에 분석, 검증 없이 사용, 민감 정보 그대로 입력 세 가지를 피하세요.

## 📚 참고 자료

- Claude 활용 사례 모음: [https://claude.com/resources/use-cases](https://claude.com/resources/use-cases)
- Vision (이미지 입력) 문서: [https://platform.claude.com/docs/en/build-with-claude/vision](https://platform.claude.com/docs/en/build-with-claude/vision)
- PDF 처리 가이드: [https://platform.claude.com/docs/en/build-with-claude/pdf-support](https://platform.claude.com/docs/en/build-with-claude/pdf-support)
- Anthropic Academy: [https://www.anthropic.com/learn](https://www.anthropic.com/learn)
