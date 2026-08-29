---
slug: what-is-domain-and-selfhosting
term: 도메인과 셀프호스팅 (Domain & Self-hosting)
definition: 도메인은 인터넷에서 내 서비스를 찾을 수 있는 고유 주소이고, 셀프호스팅은 남의 플랫폼 대신 내가 직접 서버를 운영하는 방식입니다.
category: AI_TECH
tags:
- 바이브코딩
publishedAt: '2026-04-11T01:18:07.000Z'
courseSlug: digital-basic
orderInCourse: 12
aliases:
- 도메인
- Domain
- DNS
- 셀프호스팅
- Self-hosting
- VPS
- 호스팅
relatedTerms:
- what-is-deployment
- what-is-env-variables
difficulty: BEGINNER
quiz:
- options:
  - 'MX 레코드: 이메일 서버를 지정하는 레코드'
  - 'A 레코드 또는 CNAME: 도메인을 서버 IP나 다른 도메인으로 연결하는 레코드'
  - 'TXT 레코드: 텍스트 정보를 저장하는 레코드'
  - 'PTR 레코드: IP 주소를 도메인으로 역변환하는 레코드'
  question: 도메인을 구매하고 Vercel에 연결하려면 설정해야 하는 DNS 레코드는 무엇일까요?
  explanation: 웹 서비스에 도메인을 연결할 때는 A 레코드(도메인 → IP 주소) 또는 CNAME(도메인 → 다른 도메인)을 사용합니다. Vercel 같은 플랫폼은 보통 CNAME 설정을 안내하며, 루트 도메인에는 A 레코드를 사용합니다. 설정 후 HTTPS 인증서는 자동으로 발급됩니다.
  correctIndex: 1
metaTitle: '도메인 뜻과 셀프호스팅: 내 주소로 서비스 여는 방법'
metaDescription: '도메인은 인터넷에서 내 서비스를 찾는 고유 주소이고, 셀프호스팅은 내 서버로 직접 서비스를 운영하는 방식입니다. 도메인 연결과 호스팅 선택 기준을 정리했습니다.'
ogImage: /og/what-is-domain-and-selfhosting.png
summary3:
  - '도메인은 숫자로 된 IP 주소 대신 사람이 읽을 수 있게 붙인 서비스 주소이고 DNS가 그 이름을 IP로 바꿔 줍니다.'
  - '도메인은 등록 업체에서 사며 클라우드플레어는 원가에 가까운 연 10달러 안팎이고 가비아는 한국어 지원과 .kr 도메인이 강점입니다.'
  - '셀프호스팅은 남의 플랫폼 대신 직접 서버를 운영하는 방식이라 플랫폼 제한은 없어지지만 보안과 백업, 장애 대응까지 직접 맡아야 합니다.'
---

## 🤔 혹시 이런 경험 있나요?

Vercel에 배포까지 성공했습니다. `my-app.vercel.app`으로 접속도 잘 됩니다. 그런데 이 주소를 명함이나 포트폴리오에 적기엔 좀 부끄럽습니다. "내 도메인을 연결하고 싶은데, DNS? A 레코드? 네임서버? 이게 다 뭐지?" 또는 "Vercel 무료 플랜 제한이 걱정되는데, 내 서버에서 직접 돌릴 수는 없을까?" 이런 생각이 드는 시점이라면, 이 글이 딱 필요한 타이밍입니다.

## 🌐 도메인이란?

**도메인(Domain)**은 인터넷에서 내 서비스를 찾아가는 주소입니다.

컴퓨터들은 서로를 **IP 주소**(예: `76.76.21.21`)로 구분합니다. 하지만 사람이 숫자를 외우기는 어렵죠. 그래서 숫자 대신 사람이 읽을 수 있는 이름을 붙인 것이 도메인입니다.

```
IP 주소:  76.76.21.21        ← 컴퓨터가 이해하는 주소
도메인:   myapp.com           ← 사람이 이해하는 주소
```

전화번호부에서 이름으로 전화번호를 찾듯이, **DNS(Domain Name System)**가 도메인을 IP 주소로 변환해줍니다.

## 📱 도메인은 집 주소, 서버는 집

도메인과 서버의 관계를 집에 비유하면 이해가 쉽습니다.

- **서버**: 실제 집 건물입니다. 내 앱이 돌아가는 컴퓨터입니다.
- **IP 주소**: GPS 좌표입니다. 정확하지만 외우기 어렵습니다.
- **도메인**: 집 주소(서울시 강남구...)입니다. 사람이 쉽게 찾을 수 있습니다.
- **DNS**: 주소를 GPS 좌표로 변환해주는 내비게이션입니다.

집을 이사하면(서버를 바꾸면) GPS 좌표가 바뀌지만, 주소 체계를 업데이트하면(DNS를 수정하면) 같은 주소로 새 집을 찾아갈 수 있습니다.

## 🛒 도메인 구매부터 연결까지

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; display:flex; flex-wrap:wrap; gap:8px; align-items:stretch;">
    <div style="flex:1; min-width:180px; border:3px solid #000; background:#fff; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#FFD700; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">1. 브라우저 입력</div>
      <div style="font-family:monospace; font-size:0.9em; background:#F3F3F3; border:2px solid #000; padding:8px;">myapp.com</div>
      <p style="margin:8px 0 0; color:#555;">사람이 읽는 주소</p>
    </div>
    <div style="align-self:center; font-weight:bold; font-size:1.2em;">→</div>
    <div style="flex:1; min-width:190px; border:3px solid #000; background:#fff; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#F3F3F3; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">2. DNS 조회</div>
      <div style="font-family:monospace; font-size:0.85em; background:#F3F3F3; border:2px solid #000; padding:8px;">A 레코드<br>myapp.com<br>= 76.76.21.21</div>
      <p style="margin:8px 0 0; color:#555;">주소를 IP로 변환</p>
    </div>
    <div style="align-self:center; font-weight:bold; font-size:1.2em;">→</div>
    <div style="flex:1; min-width:180px; border:3px solid #000; background:#fff; padding:10px;">
      <div style="display:inline-block; font-weight:bold; background:#FFD700; border:2px solid #000; padding:2px 8px; margin-bottom:8px;">3. 서버 접속</div>
      <div style="font-family:monospace; font-size:0.9em; background:#F3F3F3; border:2px solid #000; padding:8px;">76.76.21.21</div>
      <p style="margin:8px 0 0; color:#555;">이 IP의 서버가 웹페이지를 응답</p>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">도메인 연결의 핵심은 "도메인 → DNS → 서버 IP" 세 단계가 전부입니다.</p>
</div>

### 1단계: 도메인 구매

도메인은 **도메인 등록 업체(Registrar)**에서 구매합니다.

| 업체 | 특징 | 가격대 (.com 기준) |
|------|------|-------------------|
| **Cloudflare Registrar** | 원가 판매, 가장 저렴 | 연 $10 내외 |
| **Namecheap** | 첫해 할인 많음, 영문 UI | 연 $9~13 |
| **가비아** | 한국어 지원, .kr 도메인 | 연 15,000~20,000원 |
| **Porkbun** | 저렴하고 UI가 깔끔 | 연 $9 내외 |

> **팁**: 도메인은 "소유"가 아니라 **"임대"**입니다. 매년 갱신해야 하며, 갱신을 놓치면 다른 사람이 가져갈 수 있으므로 자동 갱신을 켜두세요.

### 2단계: DNS 레코드 설정

도메인을 구매했으면, "이 도메인으로 접속하면 어디로 보내줘"라는 설정을 해야 합니다. 이것이 **DNS 레코드**입니다.

| 레코드 타입 | 역할 | 예시 |
|------------|------|------|
| **A** | 도메인 → IP 주소 | `myapp.com → 76.76.21.21` |
| **CNAME** | 도메인 → 다른 도메인 | `www.myapp.com → myapp.vercel.app` |
| **TXT** | 텍스트 정보 저장 | 도메인 소유 인증, 이메일 인증 등 |
| **MX** | 이메일 서버 지정 | `myapp.com → mail.google.com` |

바이브코딩에서 가장 많이 쓰는 것은 **A 레코드**와 **CNAME**입니다.

### 3단계: 배포 플랫폼에서 도메인 연결

**Vercel 예시:**
```
1. Vercel 대시보드 → Settings → Domains
2. 구매한 도메인 입력 (예: myapp.com)
3. Vercel이 알려주는 DNS 레코드를 도메인 업체에 설정
4. 인증 완료 후 HTTPS 인증서 자동 발급
```

대부분의 배포 플랫폼은 도메인을 연결하면 **HTTPS(SSL 인증서)**를 자동으로 발급해줍니다. 직접 인증서를 설치할 필요가 없습니다.

## 🏠 셀프호스팅이란?

Vercel, Netlify 같은 플랫폼 대신 **내가 직접 서버를 운영**하는 것을 셀프호스팅(Self-hosting)이라고 합니다.

| 구분 | 플랫폼 호스팅 (Vercel 등) | 셀프호스팅 |
|------|--------------------------|----------|
| 서버 관리 | 플랫폼이 알아서 처리 | 내가 직접 관리 |
| 비용 | 무료~사용량 기반 과금 | 서버 임대 비용 (월 $5~) |
| 자유도 | 플랫폼 제한 내에서 사용 | 완전한 자유 |
| 확장성 | 자동 스케일링 | 직접 설정 필요 |
| 난이도 | 쉬움 | 중간~어려움 |

## 🤔 언제 셀프호스팅을 고려할까요?

**플랫폼 호스팅이 적합한 경우:**
- 개인 프로젝트, 포트폴리오, 블로그
- 트래픽이 예측 가능한 소규모 서비스
- 서버 관리에 시간 쓰고 싶지 않을 때

**셀프호스팅이 적합한 경우:**
- 플랫폼 무료 제한을 초과했을 때
- 데이터를 내 서버에만 저장해야 할 때 (보안, 규정)
- 플랫폼이 지원하지 않는 기능이 필요할 때 (장시간 작업, 특수 런타임)
- Docker, 데이터베이스 등 인프라를 직접 제어하고 싶을 때

## 🛠️ 셀프호스팅 시작하기

<div style="overflow-x:auto; margin:16px 0;">
  <div style="max-width:100%; border:3px solid #000; background:#fff; padding:16px;">
    <div style="display:inline-block; font-weight:bold; background:#FFD700; border:3px solid #000; padding:4px 12px; margin-bottom:10px;">셀프호스팅에서 요청이 도착하는 길</div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center; margin-bottom:8px;">
      <div style="flex:1; min-width:140px; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">사용자 접속<br><span style="font-family:monospace; font-size:0.85em;">myapp.com</span></div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:160px; border:2px solid #000; padding:6px 10px;">DNS A 레코드<br><span style="font-family:monospace; font-size:0.85em;">→ 내 VPS IP</span></div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:150px; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">VPS 서버<br><span style="font-size:0.85em;">방화벽: 80, 443만 개방</span></div>
    </div>
    <div style="display:flex; flex-wrap:wrap; gap:8px; align-items:center;">
      <div style="flex:1; min-width:150px; border:2px solid #000; padding:6px 10px;">Nginx<br><span style="font-size:0.85em;">HTTPS 처리, 요청 전달</span></div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:150px; border:2px solid #000; background:#FFD700; padding:6px 10px;">내 앱 (Node.js)<br><span style="font-size:0.85em;">PM2로 상시 실행</span></div>
      <div style="font-weight:bold;">→</div>
      <div style="flex:1; min-width:130px; border:2px solid #000; background:#F3F3F3; padding:6px 10px;">웹페이지 응답</div>
    </div>
  </div>
  <p style="margin:8px 0 0; font-size:0.9em; color:#555;">플랫폼이 대신 해주던 이 전체 경로를 셀프호스팅에서는 내가 직접 구성합니다.</p>
</div>

### VPS(가상 서버) 선택

셀프호스팅의 첫 단계는 **VPS(Virtual Private Server)**를 임대하는 것입니다.

| 서비스 | 최저 가격 | 특징 |
|--------|----------|------|
| **Oracle Cloud** | 무료 (Always Free) | ARM 서버 24GB RAM 무료 |
| **Hetzner** | 월 €3.79 | 유럽 기반, 가성비 최고 |
| **Vultr** | 월 $5 | 서울 리전 있음, 한국 속도 빠름 |
| **DigitalOcean** | 월 $4 | 튜토리얼 풍부, 초보 친화 |

### 기본 배포 흐름

```
1. VPS 서버 임대 (Ubuntu 추천)
2. 서버에 Node.js, npm 설치
3. 내 프로젝트 코드를 서버에 올림 (git clone)
4. npm install && npm run build
5. PM2 등으로 프로세스를 상시 실행
6. Nginx로 도메인과 HTTPS 설정
7. 도메인 DNS에 서버 IP를 A 레코드로 연결
```

### Docker로 간편하게

서버 환경 설정이 복잡하다면, **Docker**를 사용하면 편합니다.

```bash
# Dockerfile 예시
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
CMD ["npm", "start"]
```

Docker를 사용하면 "내 컴퓨터에서는 되는데 서버에서 안 돼요" 문제를 거의 없앨 수 있습니다. AI에게 "내 Next.js 프로젝트를 Docker로 배포하는 방법 알려줘"라고 물어보면 프로젝트에 맞는 Dockerfile을 만들어줍니다.

## 🔒 셀프호스팅 시 꼭 알아야 할 보안 기본

셀프호스팅은 자유도가 높은 만큼, 보안도 본인 책임입니다.

1. **SSH 키 인증 사용**: 비밀번호 대신 SSH 키로 서버에 접속하세요. 비밀번호 로그인은 비활성화하는 것이 안전합니다.
2. **방화벽 설정**: 80(HTTP), 443(HTTPS), 22(SSH) 포트만 열어두세요.
3. **자동 업데이트**: 서버 OS 보안 패치를 자동으로 적용하도록 설정하세요.
4. **HTTPS 필수**: Let's Encrypt로 무료 SSL 인증서를 발급받으세요. Nginx + Certbot 조합이 가장 일반적입니다.

## ⚠️ 바이브코딩할 때 주의할 점

1. **DNS 변경은 시간이 걸립니다.** DNS 레코드를 수정해도 전 세계에 퍼지는 데 최대 24~48시간이 걸릴 수 있습니다(보통 5~30분). 안 된다고 설정을 반복 변경하면 오히려 더 오래 걸립니다.

2. **네임서버는 한 곳에서만 관리하세요.** 도메인 업체의 네임서버를 쓸지, Cloudflare 같은 외부 DNS를 쓸지 하나만 선택하세요. 양쪽에서 동시에 관리하면 충돌이 생깁니다.

3. **셀프호스팅은 유지보수도 내 몫입니다.** 서버가 다운되면 직접 복구해야 하고, 보안 패치도 직접 적용해야 합니다. 처음에는 플랫폼 호스팅으로 시작하고, 필요할 때 셀프호스팅으로 넘어가는 것을 추천합니다.

## 📋 30초 요약

1. **도메인은 인터넷에서 내 서비스를 찾는 주소**입니다. DNS가 도메인을 서버 IP로 변환해주며, A 레코드와 CNAME만 알면 대부분의 연결이 가능합니다.

2. **셀프호스팅은 플랫폼 대신 내 서버를 직접 운영하는 것**입니다. 자유도와 비용 절감이 장점이지만, 서버 관리와 보안을 직접 책임져야 합니다. 초보자는 플랫폼 호스팅으로 시작하는 것을 추천합니다.

3. **처음에는 도메인 구매 + Vercel 연결로 시작하고, 서비스가 커지면 셀프호스팅을 고려**하세요. Docker를 활용하면 셀프호스팅도 훨씬 수월해집니다.

서비스를 실제로 여는 과정은 [배포](/class/vibe-coding-basics/what-is-deployment) 클래스에서, 설정값 관리는 [환경 변수](/class/vibe-coding-basics/what-is-env-variables) 클래스에서 이어집니다.
