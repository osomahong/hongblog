---
slug: ai-writing-tone-editing
title: 'AI 말투 교정법: GPT 초안에서 AI 티 나는 표현을 걷어내는 순서'
excerpt: >-
  AI 말투 교정은 AI가 만든 초안에서 기계가 쓴 티가 나는 표현을 찾아 사람이 쓰는 말로 바꾸는 작업입니다. 번역투와 과장, AI식
  지시문, 문어체 어휘의 교정 사례 36건을 정리하고 검사를 자동화하는 네 단계를 덧붙였습니다.
category: AI_TECH
tags:
  - AI
  - 자동화
  - 바이브코딩
relatedSlugs:
  - claude-load-bearing-vocabulary-github-pr
  - ai-content-seo-not-penalized
publishedAt: '2026-09-15T09:00:00.000Z'
highlights:
  - 기호만 지우고 끝내지 않습니다. em dash와 가운뎃점을 지워도 번역투 문장 구조와 문어체 낱말은 그대로 남습니다.
  - 검사는 글을 쓴 직후에 겁니다. 나중에 몰아서 고치면 이미 발행된 뒤인 경우가 많습니다.
metaTitle: 'AI 말투 교정법: GPT 초안에서 AI 티 나는 표현을 걷어내는 순서'
metaDescription: >-
  AI 말투 교정은 AI가 만든 초안에서 기계가 쓴 티가 나는 표현을 찾아 사람이 쓰는 말로 바꾸는 작업입니다. 번역투와 과장, AI식
  지시문, 문어체 어휘의 교정 사례 36건과 검사를 자동화하는 네 단계를 정리했습니다.
ogTitle: 'AI 말투 교정법: AI 티 나는 표현 36건과 고친 문장'
ogDescription: >-
  em dash만 지우면 번역투 문장 구조와 문어체 낱말이 그대로 남습니다. 360편 넘는 글에 적용해 온 규칙과 실제 교정 사례 36건을
  정리했습니다.
ogImage: /og/ai-writing-tone-editing.png
quiz:
  - question: 말투 교정에서 기계 검사를 마친 뒤에도 사람이 직접 읽어야만 걸러지는 것은 무엇일까요?
    options:
      - 명사와 서술어의 궁합이 어긋난 문장
      - 조사가 붙어 겉모습이 바뀐 문어체 낱말
      - 문단마다 반복해서 들어간 굵은 글씨
      - 맺음말에 붙은 결론 머리글
    correctIndex: 0
    explanation: >-
      낱말 하나하나는 멀쩡한데 붙여 놓으면 어색한 조합은 사전에 등록할 단위가 없습니다. 조사가 붙은 낱말, 굵은 글씨, 결론 머리글은
      규칙을 덧대면 기계가 잡아낼 수 있지만, 궁합은 문장을 입으로 읽어야 드러납니다.
summary3:
  - >-
    준이아빠블로그는 번역투, 과장, AI식 지시문, 문어체 어휘를 막는 규칙 79개를 등록해 두고 글을 쓸 때마다 돌려 360편 넘는
    글에 적용해 왔습니다.
  - 번역투는 조사로 바로 이어 고치고 과장은 수치로 바꾸고 AI식 지시문과 맺음말 상투구는 지우면 초안 문장 대부분이 정리됩니다.
  - 정규식과 사전은 낱말만 보므로 명사와 서술어의 궁합이 어긋난 문장은 마지막에 입으로 읽어야 걸립니다.
---

**AI 말투 교정은 AI가 만든 초안에서 기계가 쓴 티가 나는 표현을 찾아 사람이 쓰는 말로 바꾸는 작업입니다.** 낱말 몇 개를 갈아 끼우는 선에서 끝나지 않습니다. 영어에서 옮겨 온 문장 구조와 사실 없는 과장, 읽는 사람에게 행동을 시키는 문장까지 함께 걷어내야 합니다.

초안을 AI에게 맡기는 일은 이제 특별하지 않습니다. 읽는 쪽도 눈치가 빨라져서 문장 몇 개만 보고 기계가 쓴 글 같다고 말합니다. 그래서 글을 내보내기 전에 티를 지우려고 한 번은 들여다보게 됩니다.

문제는 무엇을 지워야 하는지가 잘 정리되어 있지 않다는 점입니다. em dash 같은 기호 몇 개를 지우고 나면 더 할 일이 떠오르지 않는데, 정작 문장 구조와 어휘는 그대로 남습니다. 준이아빠블로그는 이 문제 때문에 검사 규칙 79개를 만들어 360편 넘는 글에 적용해 왔습니다. 지금부터 그 규칙이 잡아낸 표현 32건과 규칙을 통과했다가 낭독에서 걸린 표현 4건을, 고친 문장과 나란히 정리하겠습니다. 규칙 수와 글 수는 2026년 9월 15일 기준입니다.

![영어 위키백과 Signs of AI writing 문서의 Collaborative communication 항목 화면. 노란 칸에 I hope this helps, Of course!, Certainly!, You're absolutely right! 같은 조심할 표현 아홉 개가 나열되어 있다](/images/insights/ai-writing-tone-editing/01-wikipedia-collaborative-communication.png)

영어 위키백과의 AI 정리 작업반은 AI가 남기는 흔적을 항목별로 모아 둡니다. 위 화면은 그중 사용자에게 말을 거는 문장을 다룬 항목이고, 노란 칸에 조심할 표현이 그대로 나열되어 있습니다. 이 문서는 위키백과 편집용이고, 스스로 규범보다 관찰에 가깝다고 밝혀 두었습니다. 목록도 영어 기준이라 한국어에 그대로 쓰기 어렵습니다.

밀가루를 굵은 체로 한 번, 고운 체로 한 번 치고도 마지막에는 손으로 남은 알갱이를 골라내듯, 말투 교정도 세 번에 나눠야 놓치는 표현이 줄어듭니다.

- **굵은 체**: 기호와 번역투, 과장, AI식 지시문처럼 규칙으로 잡아낼 수 있는 것
- **고운 체**: 문어체 어휘와 습관성 은유. 사전에 낱말을 등록해 잡습니다
- **손으로 고르기**: 낭독. 기계가 잡지 못하는, 낱말 조합이 어색한 문장

## AI 티가 나는 표현 다섯 종류

먼저 무엇을 찾을지부터 정해야 합니다. 준이아빠블로그가 규칙으로 등록해 둔 항목을 성격별로 묶으면 다섯 종류가 됩니다.

| 종류 | 무엇이 걸리는지 | 바꾸는 방향 |
|---|---|---|
| 기호와 서식 | em dash, 가운뎃점, 문단마다 들어간 굵은 글씨 | 콜론과 쉼표로 바꾸고 강조는 문단당 한 번 |
| 번역투 | 영어 전치사구와 수동태가 그대로 옮겨진 문장 | 조사로 바로 잇고 행동하는 쪽을 주어로 |
| 과장과 극적 은유 | 근거 없이 부풀린 수식 | 수치나 구체적 동작으로 |
| AI식 지시문과 상투구 | 행동을 시키는 문장, 맺음말 머리글, 인사말 | 서술문으로 바꾸거나 지움 |
| 문어체 어휘와 습관성 은유 | 글에서만 쓰는 낱말, 은유로 뭉뚱그린 말 | 일상어와 직접 서술로 |

## 먼저 지우는 기호와 서식

기호와 서식은 찾기 쉬운 쪽이라 먼저 처리합니다. 준이아빠블로그는 em dash와 가운뎃점을 본문과 제목, 이미지 설명, 표 안까지 전부 금지하고 글을 쓸 때마다 개수를 셉니다. 굵은 글씨는 산문 문단에서는 정의 문장 한 줄에만 쓰고, 목록과 요약의 머리말만 예외로 둡니다.

이 종류는 고친 문장을 표로 옮길 것이 없습니다. 찾아서 지우거나 콜론과 쉼표로 바꾸면 끝나기 때문입니다.

기호만 지우고 끝내면 나머지 네 종류가 그대로 남습니다. 게다가 사람이 쓴 글에도 em dash가 늘고 있어서 기호만으로는 가려내기 어렵습니다. [어휘 분석과 한국어 교정 기록을 다룬 글](/insights/claude-load-bearing-vocabulary-github-pr)에서도 em dash는 순위가 한참 낮았습니다.

## 번역투: 조사로 바로 이을 수 있는 표현

번역투는 영어 문장 구조가 한국어 문장에 그대로 남은 형태입니다. 한국어는 조사가 관계를 표시하므로, 영어의 전치사구와 수동태를 그대로 옮기면 군더더기가 생기고 행위 주어가 사라집니다. 이 종류는 AI 초안에서 특히 자주 걸립니다.

<div style="overflow-x:auto;margin:24px 0;">
<table style="width:100%;min-width:320px;border-collapse:collapse;border:3px solid #000;background:#fff;">
<thead>
<tr style="background:#FFD700;">
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">AI 초안에 나온 문장</th>
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">고친 문장</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">이 기능을 통해 데이터를 모을 수 있습니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">이 기능으로 데이터를 모읍니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">검색 의도에 대한 분석이 먼저입니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">검색 의도를 먼저 분석합니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">결과는 대시보드에서 보여집니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">결과는 대시보드에 나옵니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">순위는 알고리즘에 의해 결정됩니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">알고리즘이 순위를 정합니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">이것은 가장 흔한 실수 중 하나입니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">흔한 실수입니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">여러 번 고쳤음에도 불구하고 유입은 늘지 않았습니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">여러 번 고쳤는데도 유입은 늘지 않았습니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">색인이 지연된다는 사실을 확인했습니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">색인이 지연된다는 점을 확인했습니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">설정에 있어서 주의가 필요합니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">설정할 때 주의해야 합니다</td></tr>
<tr><td style="padding:8px 12px;">방문자가 이해하는 것을 돕습니다</td><td style="padding:8px 12px;">방문자가 이해하기 쉬워집니다</td></tr>
</tbody>
</table>
</div>

낱말만 바꾼 항목도 있고 어순까지 달라진 항목도 있습니다. 번역투 문장은 통째로 다시 써야 자연스러워집니다. 이중 피동을 쓴 항목은 자동사로 풀었고, `~에 의해`를 쓴 항목은 행위 주어를 문장 앞으로 옮겼습니다.

## 과장과 극적 은유: 수치로 바꾸는 표현

과장은 근거 없이 부풀린 수식입니다. 검증할 수 있는 숫자가 뒤따르는 강조와는 성격이 다릅니다. AI 초안에 과장이 자주 나오는 원인을 두고는 사람 피드백을 반영하는 후속 학습에서 칭찬과 감탄이 높은 점수를 받았기 때문이라는 설명이 많습니다.

![오픈AI 모델 규범 문서의 아첨 금지 항목 화면. 사용자의 비위를 맞추거나 늘 동의하지 말고 근거를 갖춘 의견을 내라는 설명이 보인다](/images/insights/ai-writing-tone-editing/03-model-spec-sycophancy.png)

오픈AI는 2025년 4월판 모델 규범 문서에 아첨하지 말라는 항목을 따로 두고, 돕는 것과 비위를 맞추는 것을 구분했습니다. 이 문서가 다루는 것은 대화에서의 태도인데, 같은 성향이 글에서는 수식으로 나타나기도 합니다. 고칠 때는 감탄을 지우고 숫자나 동작을 넣습니다.

<div style="overflow-x:auto;margin:24px 0;">
<table style="width:100%;min-width:320px;border-collapse:collapse;border:3px solid #000;background:#fff;">
<thead>
<tr style="background:#FFD700;">
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">AI 초안에 나온 문장</th>
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">고친 문장</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">이 기능은 업무 방식을 바꾸는 혁명적 변화입니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">이 기능은 주간 보고서를 만드는 시간을 줄여 줍니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">놀랍게도 3초 만에 완성됩니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">3초 만에 완성됩니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">AI가 마법처럼 코드를 짜 줍니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">AI가 코드를 대신 씁니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">노트북을 웹 서버로 변신시킵니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">노트북에서 작은 서버 프로그램이 실행됩니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">획기적인 성능 개선을 이뤄냈습니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">응답 시간이 1.2초에서 0.4초로 줄었습니다</td></tr>
<tr><td style="padding:8px 12px;">차원이 다른 결과물을 만들어 냅니다</td><td style="padding:8px 12px;">표 형식까지 맞춘 결과물이 나옵니다</td></tr>
</tbody>
</table>
</div>

성능 개선 항목에 넣은 1.2초와 0.4초는 고친 문장이 어떤 모습인지 보여주려고 만든 예시입니다. 실제로 고칠 때는 자기가 잰 값을 넣어야 하고, 잰 값이 없으면 그 문장은 아예 빼는 편이 낫습니다. 숫자를 넣지 못하는 칭찬은 대개 근거가 없습니다.

## AI식 지시문과 맺음말 상투구

세 번째 종류는 문장의 방향이 잘못된 표현입니다. 글쓴이가 자기 이야기를 하는 대신 읽는 사람에게 행동을 시키거나, 내용이 끝났는데 맺음말 머리글을 붙여 한 번 더 요약합니다. 앞의 위키백과 화면에 나열된 표현도 대부분 이 종류였고, `Of course!`와 `Certainly!` 같은 몇 개만 과장 절에서 다룬 아첨 계열입니다.

<div style="overflow-x:auto;margin:24px 0;">
<table style="width:100%;min-width:320px;border-collapse:collapse;border:3px solid #000;background:#fff;">
<thead>
<tr style="background:#FFD700;">
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">AI 초안에 나온 문장</th>
<th style="padding:10px 12px;text-align:left;border-bottom:3px solid #000;">고친 결과</th>
</tr>
</thead>
<tbody>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">상상해 보세요. 매일 아침 보고서가 쌓인다면 어떨까요</td><td style="padding:8px 12px;border-bottom:1px solid #000;">보고서를 자동으로 만들면 아침마다 같은 작업을 반복하지 않아도 됩니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">잠시 떠올려 보세요</td><td style="padding:8px 12px;border-bottom:1px solid #000;">문장을 통째로 지웁니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">소리 내어 읽어 주세요</td><td style="padding:8px 12px;border-bottom:1px solid #000;">입으로 읽으면 어색한 문장이 드러납니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">결론적으로, 이 방법이 가장 안전합니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">이 방법은 설정을 되돌릴 수 있어서 안전합니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">종합하면 다음과 같습니다</td><td style="padding:8px 12px;border-bottom:1px solid #000;">요약을 지우고 사실을 적은 마지막 문장에서 끝냅니다</td></tr>
<tr><td style="padding:8px 12px;border-bottom:1px solid #000;">지금 바로 시작해 보세요</td><td style="padding:8px 12px;border-bottom:1px solid #000;">행동을 시키는 문장은 넣지 않습니다</td></tr>
<tr><td style="padding:8px 12px;">도움이 되셨길 바랍니다</td><td style="padding:8px 12px;">인사말은 지웁니다</td></tr>
</tbody>
</table>
</div>

나누는 기준은 주어입니다. 주어가 글쓴이면 남깁니다. 읽는 사람이면 지웁니다. 그래서 "예로 들어 설명하겠습니다"는 그대로 두고, "예를 하나 생각해 보세요"처럼 읽는 사람을 주어로 세운 문장만 고칩니다. 맺음말 머리글은 지워도 내용이 줄지 않으니 통째로 뺍니다.

## 문어체 어휘와 습관성 은유

네 번째 종류는 낱말 단위라서 사전으로 잡기 좋습니다. 글에서만 쓰고 말로는 하지 않는 문어체 낱말이 한 묶음인데, 한 글에 서너 개만 섞여도 글 전체가 신문 사설처럼 들리는 편입니다. 고치다, 통하다, 묻다처럼 평범한 동작을 은유나 속어로 바꿔 쓴 말이 다른 한 묶음이고, 높임을 과하게 올린 말과 단위 명사를 뺀 압축도 함께 걸립니다. 준이아빠블로그가 실제로 지적받아 등록한 항목 가운데 열 개를 옮기면 이렇습니다.

| AI 초안에 나온 표현 | 바꾼 표현 |
|---|---|
| `두 갈래로 나뉩니다` | 두 가지로 나뉩니다 |
| `아래 도해를 보면` | 아래 그림을 보면 |
| `설정을 손보면` | 설정을 고치면 |
| `비로소 확인됩니다` | 그제야 확인됩니다 |
| `의견이 갈립니다` | 의견이 달라집니다 |
| `어떤 전략이 먹혔는지` | 어떤 전략이 통했는지 |
| `긍정적인 신호로 읽힙니다` | 긍정적인 신호로 보입니다 |
| `담당자께 여쭤보겠습니다` | 담당자에게 물어보겠습니다 |
| `세 지식이 필요합니다` | 세 가지 지식이 필요합니다 |
| `첫 자리에 놓습니다` | 첫 화면에 놓습니다 |

판정 기준은 세 가지입니다. 글로 쓸 때만 꺼내는 낱말이거나, 평범한 동작을 은유와 속어로 바꿔 쓴 말이거나, 높임과 압축이 과한 말이면 바꿉니다. 이 가운데 몇 개는 처음에 규칙을 빠져나갔다가 조건을 덧대고서야 잡혔습니다.

이런 목록은 시기마다 내용이 바뀝니다. 영어권에서는 위키백과 작업반이 조심할 어휘를 공개해 두고 계속 갱신합니다.

![영어 위키백과 Signs of AI writing 문서의 AI 어휘 밀도 항목 화면. delve, tapestry, meticulous, showcase 같은 낱말이 조심할 어휘로 나열되어 있다](/images/insights/ai-writing-tone-editing/02-ai-vocabulary-words.png)

위 화면의 노란 칸이 그 목록이고, 바로 아래 본문에서 같은 낱말을 시기 셋으로 다시 나눕니다. 노란 칸에는 delve와 tapestry처럼 2023년 무렵부터 지목되어 온 낱말이 그대로 보입니다. 목록은 한 번 만들고 그대로 두면 낡으므로, 어색한 표현이 눈에 띌 때마다 한 줄씩 늘리는 편이 낫습니다.

## 말투 검사를 자동화하는 네 단계

바꿀 대상은 여기까지 정리했고, 남은 문제는 이 규칙을 매번 빠짐없이 적용하는 일입니다. 사람 눈으로만 보면 글마다 적용 범위가 달라집니다. 준이아빠블로그는 네 단계로 나눠 처리합니다.

1. **표현을 파일 하나에 모읍니다.** 지침이 여기저기 흩어져 있으면 글을 쓸 때 절반만 적용하게 됩니다. 금지 표현과 대체 표현을 한 파일에 적고, 새 표현이 눈에 띄면 그 파일에만 추가합니다.
2. **등급을 둘로 나눕니다.** 발행을 막는 등급과 경고만 남기는 등급입니다. 이미 발행한 글에 쓰인 표현까지 전부 막으면 과거 글을 다 고쳐야 하므로, 새로 쓰는 글에만 강하게 거는 편이 현실적입니다.
3. **글을 쓴 직후에 겁니다.** 초안을 파일로 만들자마자 검사를 돌리고, 막는 등급이 한 건이라도 걸리면 그 글은 발행하지 않습니다. 나중에 몰아서 고치면 이미 발행된 뒤인 경우가 많습니다.
4. **지적받은 표현을 곧바로 등록합니다.** 등록하지 않으면 다음 글에서 같은 표현이 다시 나옵니다.

검사기는 정규식(regular expression) 목록 하나로 시작해도 됩니다. 준이아빠블로그가 처음 만든 검사기도 이 정도였습니다.

```js
const RULES = [
  { pattern: /[을를] 통해/g,          fix: "'~로'로 바꾼다",   severity: "HARD" },
  { pattern: /놀랍게도|획기적|마법처럼/g, fix: "사실 서술로",     severity: "HARD" },
  { pattern: /(?<![가-힣])갈래(?![가-힣])/g, fix: "가지, 종류",      severity: "HARD" },
  { pattern: /도해/g,                    fix: "이미지, 그림",    severity: "HARD" },
];
```

다만 한국어에서는 이 목록을 빠져나가는 표현이 금방 생깁니다. 체언에는 조사가 붙고 용언에는 어미가 붙는 데다 `갈래입니다`처럼 서술격 조사가 활용하기도 해서, 낱말의 겉모습이 계속 바뀌기 때문입니다. `갈래` 규칙처럼 앞뒤에 한글이 오지 않을 때만 잡도록 조건을 걸면 `갈래로만`과 `다섯 갈래입니다`가 그대로 통과합니다. 반대로 `도해` 규칙처럼 조건 없이 걸면 `시도해`와 `유도해` 같은 멀쩡한 활용형까지 걸립니다. 조사와 서술격 활용을 함께 받아 주는 정규식 조각을 하나 만들어 낱말 규칙마다 붙이는 편이 낫고, 정규식만으로 감당하기 어려워지면 형태소 분석기를 씁니다.

2026년 9월 15일 기준으로 준이아빠블로그의 규칙은 두 검사기에 나뉘어 79개입니다. 번역투와 기호를 보는 쪽이 28개, 낱말 사전을 보는 쪽이 51개이고, 발행을 막는 등급이 61개, 경고만 남기는 등급이 18개입니다. 앞서 낱말 사전 한쪽만 세었을 때는 47개였는데, 지적을 받을 때마다 하나씩 늘어 여기까지 왔습니다. 낱말 하나를 막는 데 규칙을 세 번 덧대야 했던 과정은 [어휘 분석과 한국어 교정 기록을 다룬 글](/insights/claude-load-bearing-vocabulary-github-pr)에 날짜별로 적어 두었습니다.

## 기계 검사를 통과하면 말투 교정이 끝나나요?

끝이 아닙니다. 체를 두 번 쳐도 마지막에는 손으로 골라야 할 알갱이가 남듯, 검사를 통과한 글에도 어색한 문장이 있습니다. 정규식과 사전은 등록된 낱말만 봅니다. 그런데 어색함은 대부분 낱말과 낱말의 조합에서 생깁니다.

| 검사를 통과한 표현 | 무엇이 어긋났는지 | 고친 결과 |
|---|---|---|
| `품을 없앱니다` | 명사와 서술어가 어울리지 않음 | 수고가 들지 않습니다 |
| `가르던 방법이 통하는지` | 무엇을 가르는지 빠짐 | 화면만 보고 가려내던 방식이 통할지 |
| `빠른 길`이 한 글에 여섯 번 | 표현 반복 | 상황마다 다른 말로 바꾸거나 원래 개념으로 되돌립니다 |
| `다행인 부분은 눈에 보인다는 점입니다` | 주어 누락 | 다행인 부분은 이 문제가 눈에 보인다는 점입니다 |

이런 문장은 낱말 하나하나가 멀쩡해서 사전에 올릴 단위가 없습니다. 그래서 마지막 단계는 사람이 맡습니다. 서술어를 하나씩 보면서 그 앞의 주어나 목적어와 맞는 짝인지 입으로 확인합니다. "품"은 "들다"와 붙고 "없애다"와는 붙지 않습니다. 이렇게 짝만 맞춰 봐도 기계가 놓친 문장은 대부분 걸립니다.

준이아빠블로그에서도 검사 두 개를 통과한 문장이 낭독에서 걸린 적이 여러 번 있습니다. 2026년 9월에는 낭독을 건너뛴 글이 그대로 나가는 바람에 발행한 뒤에 문장을 다시 고쳐야 했습니다. 이렇게 걸리는 문장은 표 안과 이미지 설명에 특히 자주 남으므로 그 두 곳을 먼저 봅니다.

## 자주 묻는 질문

### AI로 쓴 글은 검색에 불리한가요?

불리하지 않습니다. 구글은 AI로 만들었다는 이유만으로 불이익을 주지 않고, 도움이 되는 콘텐츠인지를 봅니다. 준이아빠블로그도 AI로 초안을 만든 글로 검색 노출을 늘려 왔고 그 과정을 [AI로 만든 글의 검색 노출을 확인한 기록](/insights/ai-content-seo-not-penalized)에 정리해 두었습니다. 말투를 교정하는 이유는 검색 순위보다 읽는 쪽의 신뢰에 있습니다.

### 금지어 목록만 있으면 되나요?

목록만으로는 부족합니다. 한계가 두 가지입니다. 목록은 시간이 지나면 낡고, 읽는 쪽이 거슬려 하는 부분은 낱말보다 문장을 짜는 방식에서 더 많이 나옵니다. "A가 아니라 B다" 식으로 짝을 맞춘 문장이나 항상 세 개로 맞추는 나열은 금지어 목록으로 잡히지 않습니다. 금지어 목록은 고운 체까지이고, 문장을 짜는 방식은 그다음에 따로 봐야 합니다.

### 챗GPT와 클로드는 말투가 다른가요?

두 모델을 직접 비교한 공개 자료는 찾기 어렵습니다. 깃허브 풀 리퀘스트 설명문의 어휘를 분석한 조사에서 2026년에 크게 늘어난 낱말 묶음이 하나 잡혔고, 그 낱말들이 코딩 에이전트를 써 본 사람에게 익숙하다는 정도까지 확인됐습니다. 그 조사도 어떤 글이 어느 낱말 묶음을 닮았는지만 말할 뿐 누가 썼는지는 말하지 못합니다. 조사 내용과 판별의 한계는 [어휘 분석과 한국어 교정 기록을 다룬 글](/insights/claude-load-bearing-vocabulary-github-pr)에 따로 정리해 두었습니다.

## 3줄 요약

1. **준이아빠블로그는 번역투, 과장, AI식 지시문, 문어체 어휘를 막는 규칙 79개를 등록해 두고 글을 쓸 때마다 돌려 360편 넘는 글에 적용해 왔습니다.** 막는 등급에 걸린 표현이 하나라도 있으면 그 글은 발행하지 않습니다.
2. **번역투는 조사로 바로 이어 고치고, 과장은 수치로 바꾸고, AI식 지시문과 맺음말 상투구는 지우면 초안 문장 대부분이 정리됩니다.** 기호만 지우고 끝내면 나머지가 그대로 남습니다.
3. **정규식과 사전은 낱말만 보므로, 명사와 서술어의 궁합이 어긋난 문장은 마지막에 입으로 읽어야 걸립니다.** 표 안과 이미지 설명을 먼저 봅니다.

**Sources:**
- [Wikipedia:Signs of AI writing (영어 위키백과)](https://en.wikipedia.org/wiki/Wikipedia:Signs_of_AI_writing)
- [OpenAI Model Spec 2025년 4월 11일판: Don't be sycophantic](https://model-spec.openai.com/2025-04-11.html) (이후 개정판이 나왔습니다)
- [Google 검색 센터: AI 생성 콘텐츠 관련 안내](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
