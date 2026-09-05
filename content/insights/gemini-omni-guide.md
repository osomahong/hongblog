---
slug: gemini-omni-guide
title: '구글 옴니(Gemini Omni) 장점과 사용법, 다른 모델과의 차이'
excerpt: >-
  구글 옴니(Gemini Omni)는 글, 이미지, 소리, 영상을 한 번에 입력받아 소리까지 붙은 영상을 만들어 내는 통합 멀티모달
  모델입니다. 대화로 영상을 수정하는 방식과 Veo 3.1과의 차이, 사용처와 요금을 공식 데모 영상과 함께 정리했습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 마케팅 실무
publishedAt: '2026-08-01T00:00:00.000Z'
updatedAt: '2026-08-24T00:00:00.000Z'
highlights:
  - '옴니는 아이디어와 수정 단계에, Veo 3.1은 마무리 단계에 맞습니다.'
  - 720p가 상한이라 고해상도 최종본에는 적합하지 않습니다.
quiz:
  - question: 구글 옴니가 다른 영상 모델과 가장 크게 구별되는 지점은 무엇일까요?
    options:
      - 만든 영상을 대화로 고치면서 나머지 화면은 그대로 유지한다
      - 4K 해상도로 가장 긴 영상을 만든다
      - 한국어 프롬프트를 가장 정확하게 알아듣는다
      - 무료로 무제한 생성할 수 있다
    correctIndex: 0
    explanation: >-
      옴니는 Interactions API로 앞선 생성 결과를 이어받습니다. 바꾸고 싶은 부분만 말로 설명하면 나머지 화면은 유지한 채 그
      부분만 수정합니다. 매번 새로 생성하는 방식과 달라서, 시안을 여러 번 고쳐 나가는 작업에 유리합니다.
metaTitle: '구글 옴니(Gemini Omni) 장점과 사용법, 다른 모델과의 차이'
metaDescription: >-
  구글 옴니(Gemini Omni)는 글, 이미지, 소리, 영상을 한 번에 입력받아 소리까지 붙은 영상을 만드는 통합 멀티모달 모델입니다.
  대화형 편집 방식과 Veo 3.1과의 차이, 사용처와 요금을 정리했습니다.
ogDescription: 구글 옴니의 대화형 편집 방식과 Veo 3.1과의 역할 차이를 공식 데모 영상으로 살펴봅니다.
ogImage: /og/gemini-omni-guide.png
summary3:
  - '구글 옴니는 글과 이미지, 소리, 영상을 한 번에 입력받아 소리까지 붙은 영상을 만드는 통합 멀티모달 모델입니다.'
  - 마음에 들지 않는 부분은 프롬프트를 새로 쓰지 않고 바꿀 곳만 말로 설명해 고칠 수 있습니다.
  - 720p가 상한이라 아이디어를 잡고 고치는 단계에 맞고 고해상도 최종본은 Veo 3.1 쪽이 맞습니다.
---

구글 옴니(Gemini Omni)는 글, 이미지, 소리, 영상을 한 번에 입력받아 소리까지 붙은 영상을 만들어 내는 통합 멀티모달 모델입니다. 2026년 5월 19일 Google I/O에서 공개됐고, 실제 쓰이는 변형은 Gemini Omni Flash입니다. 국내에서는 구글 옴니나 옴니 플래시로 불립니다.

구글에는 이미 Veo라는 영상 모델이 있습니다. 그래서 옴니가 무엇이 다른지, 둘 중 무엇을 써야 하는지가 첫 질문이 됩니다. 이 글에서는 옴니의 구조와 대화형 편집 방식을 공식 데모 영상으로 보여주고, Veo 3.1과의 역할 차이, 사용처와 요금을 정리합니다.

## 구글 옴니는 어떤 모델일까요?

멀티모달이라는 말이 프롬프트나 모델 이름보다 상대적으로 낯설 수 있습니다. 여러 종류의 입력을 한 모델이 함께 다룬다는 뜻입니다. 옴니는 그 범위가 넓습니다. 글, 이미지, 소리, 영상, 스케치를 한 프롬프트에 섞어 넣으면 영상과 편집된 사진, 아바타를 돌려줍니다.

기존 방식은 영상 모델과 오디오 모델을 따로 돌린 뒤 붙였습니다. 옴니는 한 번에 처리합니다. 화면 내용과 카메라 움직임, 장면의 물리 상태를 함께 보고 어떤 소리가 맞는지 판단합니다. 그래서 소리가 겉돌지 않습니다.

물리 표현도 이 구조에서 나옵니다. 중력, 운동 에너지, 유체 흐름을 이해한다고 구글은 설명합니다.

![구글 옴니가 생성한 영상, 밤하늘 아래 거품으로 이뤄진 반투명 구조물이 빛을 머금고 천천히 흔들리는 장면](/images/insights/gemini-omni-guide/omni-physics-foam-orb.mp4)

> 위 영상은 구글이 공개한 옴니 데모입니다. 원본 출처: [Watch 9 Google videos of Gemini Omni and Gemini 3.5 Flash (구글 공식 블로그)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-3-5-videos/)

## 대화로 영상을 고친다는 것은 무슨 뜻일까요?

옴니에서 가장 눈에 띄는 지점입니다. 만든 영상이 마음에 들지 않을 때 프롬프트를 새로 써서 다시 뽑는 것이 아니라, 바꿀 부분만 말로 설명합니다. 구글 공식 데모를 순서대로 보면 이해가 빠릅니다.

먼저 원본입니다. 실내에서 바이올린을 연주하는 장면입니다.

![구글 옴니 대화형 편집 데모의 원본 영상, 실내 무대에서 한 연주자가 바이올린을 켜는 장면](/images/insights/gemini-omni-guide/omni-multiturn-01-original.mp4)

여기에 배경을 야외로 바꾸고 바이올린을 보이지 않게 해 달라고 요청한 결과입니다. 연주자와 동작, 활의 움직임은 그대로 두고 요청한 부분만 바뀌었습니다.

![구글 옴니가 수정한 영상, 같은 연주자가 잔디밭에서 바이올린 없이 활만 든 채 연주 동작을 이어가는 장면](/images/insights/gemini-omni-guide/omni-multiturn-02-edited.mp4)

이어서 각도를 바꿔 달라고 한 결과입니다. 앞선 두 번의 요청 내용을 유지한 채 시점만 뒤로 옮겨 갔습니다.

![구글 옴니가 각도를 바꾼 영상, 같은 장면을 연주자 뒤쪽에서 바라본 시점](/images/insights/gemini-omni-guide/omni-multiturn-03-angle.mp4)

> 위 세 영상은 구글이 공개한 옴니 멀티턴 편집 데모입니다. 원본 출처: [Watch 9 Google videos of Gemini Omni and Gemini 3.5 Flash (구글 공식 블로그)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-3-5-videos/)

기술적으로는 Interactions API가 이 동작을 맡습니다. 이전 생성 결과에 붙은 번호를 다음 요청에 함께 넘기면, 모델이 앞선 맥락을 그대로 이어받습니다. 소재를 다시 올릴 필요가 없습니다.

## Veo 3.1과는 어떻게 나눠 써야 할까요?

구글이 영상 모델을 두 개 두고 있어서 헷갈리기 쉽습니다. 경쟁 관계가 아니라 작업 단계가 다릅니다.

| 항목 | 구글 옴니 | Veo 3.1 |
|---|---|---|
| 성격 | 여러 입력을 함께 다루는 대화형 모델 | 영상에 특화된 고품질 생성기 |
| 입력 | 글, 이미지, 소리, 영상, 스케치 | 글 중심, 시작 이미지 |
| 수정 방식 | 대화로 여러 번 고침 | 프롬프트를 바꿔 새로 생성 |
| 해상도 상한 | 720p | 4K |
| API 상태 | 2026년 6월 30일 공개, 프리뷰 | 2025년 말부터 안정 운영 |
| 맞는 단계 | 아이디어와 반복 수정 | 마무리 결과물 |

정리하면 옴니는 시안을 빠르게 굴리는 도구이고, Veo 3.1은 완성본을 뽑는 도구입니다. 해상도가 720p에서 막히므로 옴니 결과를 그대로 최종 납품물로 쓰기는 어렵습니다. 옴니로 구도와 연출을 잡고 Veo로 다시 뽑는 흐름이 현실적입니다.

다른 회사 모델과의 비교는 [영상 AI 모델별 실제 영상 비교 글](/insights/ai-video-generator-recommendation-2026)에 정리해 두었습니다.

## 어디서 어떻게 쓸 수 있을까요?

2026년 8월 기준 사용 경로는 네 가지입니다.

- **제미나이 앱과 YouTube Shorts**: 가장 쉬운 경로입니다. 무료 등급에서도 열리고, 10초 클립을 만듭니다.
- **Flow**: 구글의 영상 제작 도구입니다. 무료 등급은 하루 50크레딧 안팎, Pro 등급은 월 1,000크레딧을 줍니다.
- **Google Vids**: 워크스페이스의 영상 문서 도구에 들어가 있습니다.
- **API와 AI Studio**: 모델 이름은 `gemini-omni-flash-preview`입니다. 영상 출력 100만 토큰당 $17.50이고, 720p 기준 초당 약 $0.10입니다. 무료 API 등급은 없습니다.

대학생이라면 요금을 내지 않고 여는 경로가 하나 더 있습니다. 구글은 2026년 8월 20일부터 대학생에게 유료 요금제를 1년간 무료로 제공합니다. 미국은 Google AI Pro, 한국을 포함한 140여 개 시장은 Google AI Plus가 대상이고 옴니는 AI Plus에 들어 있습니다. SheerID로 학생 인증을 거쳐야 하고 신청 기한은 2026년 12월 31일입니다. 12개월이 지나면 해지하지 않는 한 유료 구독으로 자동 전환되므로 결제일을 미리 적어 두는 편이 좋습니다.

> 한국 대학생은 2026년 12월 31일까지 신청하면 Google AI Plus를 1년간 무료로 받고, 여기에 제미나이 옴니가 포함됩니다.

구글 옴니를 쓸 때 알아둬야 할 제한적인 점도 있습니다.

- 유럽 경제 지역과 스위스, 영국에서는 영상 편집 기능이 열리지 않습니다.
- 영어만 완전히 지원됩니다. 한국어 프롬프트는 검증되지 않은 상태라 영어로 옮겨 넣는 편이 안정적입니다.
- 소리를 참조 자료로 넣는 기능은 아직 지원되지 않습니다. 소리 출력은 모든 생성에서 동작합니다.
- 온도 조정이나 시스템 지시문 같은 세부 제어는 쓸 수 없습니다.

## Sources

- [Generate and edit videos with Gemini Omni Flash (Gemini API 공식 문서)](https://ai.google.dev/gemini-api/docs/omni)
- [Gemini Omni Flash 모델 문서 (Google AI for Developers)](https://ai.google.dev/gemini-api/docs/models/gemini-omni-flash)
- [Watch 9 Google videos of Gemini Omni and Gemini 3.5 Flash (구글 공식 블로그)](https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-omni-3-5-videos/)
- [Gemini Omni Flash now available in Google Vids (구글 워크스페이스 블로그)](https://workspace.google.com/blog/product-announcements/introducing-gemini-omni-flash-in-google-vids)
- [Gemini Developer API 가격 책정](https://ai.google.dev/gemini-api/docs/pricing)
- [100 things we announced at Google I/O 2026 (구글 공식 블로그)](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/)
