export const dynamic = "force-static";

const HTML = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex, nofollow" />
<title>Privacy Policy - GTM 태깅에이전트</title>
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0;
    padding: 0;
    background: #ffffff;
    color: #1a1a1a;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Apple SD Gothic Neo", "Malgun Gothic", "맑은 고딕", Roboto, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.7;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  .wrap {
    max-width: 760px;
    margin: 0 auto;
    padding: 48px 24px 96px;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 8px;
    line-height: 1.35;
  }
  h2 {
    font-size: 22px;
    font-weight: 700;
    margin: 48px 0 12px;
    line-height: 1.4;
    border-bottom: 1px solid #e5e5e5;
    padding-bottom: 8px;
  }
  h3 {
    font-size: 17px;
    font-weight: 600;
    margin: 28px 0 8px;
    line-height: 1.45;
  }
  p, li {
    font-size: 15px;
    color: #2a2a2a;
  }
  p { margin: 12px 0; }
  ul, ol { padding-left: 22px; margin: 12px 0; }
  li { margin: 6px 0; }
  strong { color: #0d0d0d; font-weight: 600; }
  code {
    background: #f4f4f4;
    border-radius: 3px;
    padding: 1px 6px;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
    font-size: 13.5px;
    color: #b30038;
  }
  a {
    color: #0a66c2;
    text-decoration: underline;
    word-break: break-all;
  }
  a:hover { color: #054a8f; }
  .meta {
    color: #666;
    font-size: 14px;
    margin: 0 0 4px;
  }
  .lang-divider {
    border: 0;
    border-top: 2px solid #1a1a1a;
    margin: 64px 0 32px;
  }
  .section-divider {
    border: 0;
    border-top: 1px solid #e5e5e5;
    margin: 32px 0;
  }
  .lang-tag {
    display: inline-block;
    background: #f4f4f4;
    color: #333;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 4px 10px;
    border-radius: 999px;
    margin-bottom: 16px;
  }
  @media (max-width: 600px) {
    .wrap { padding: 32px 18px 64px; }
    h1 { font-size: 24px; }
    h2 { font-size: 19px; }
    h3 { font-size: 16px; }
    p, li { font-size: 14.5px; }
  }
</style>
</head>
<body>
<main class="wrap">

  <h1>Privacy Policy &mdash; GTM 태깅에이전트</h1>
  <p class="meta"><strong>Effective date / 시행일</strong>: 2026-05-15</p>
  <p class="meta"><strong>Extension name</strong>: GTM 태깅에이전트 (GTM Tagging Agent)</p>

  <hr class="lang-divider" />

  <span class="lang-tag">한국어</span>

  <h2>1. 개요</h2>
  <p>GTM 태깅에이전트는 사용자가 현재 보고 있는 웹페이지에서 클릭 영역과 페이지 정보를 분석해 Google Tag Manager(GTM)에서 사용할 변수·트리거·태그 가이드를 사이드 패널에 표시하는 단일 목적(Single Purpose) Chrome 확장입니다. 본 정책은 이 확장이 사용자 데이터를 어떻게 다루는지 설명합니다.</p>

  <h2>2. 수집·처리하는 정보</h2>
  <p>확장은 <strong>사용자가 확장을 직접 활성화한 탭</strong>에서 다음 정보를 <strong>로컬에서 일시적으로</strong> 읽습니다.</p>
  <ul>
    <li>현재 페이지 URL과 제목</li>
    <li>사용자가 선택한 DOM 요소의 selector, 텍스트, 속성 일부(태그명, class, role, aria-label 등)</li>
    <li>페이지의 <code>window.dataLayer</code> 존재 여부와 크기, 설치된 GTM/GA4 컨테이너 ID(최대 5개)</li>
    <li>페이지에 적용된 프레임워크/마크업 힌트(React, Vue, Next, Swiper 등의 존재 표시)</li>
  </ul>

  <h2>3. 정보의 전송·저장</h2>
  <ul>
    <li>위 정보는 <strong>외부 서버로 전송되지 않습니다</strong>. 본 확장에는 백엔드 서버가 존재하지 않으며, 코드 전체에서 외부 API 호출이 없습니다.</li>
    <li>정보는 사이드 패널이 열려 있는 동안에만 메모리에 보관되며, 사이드 패널이 닫히거나 브라우저가 종료되면 자동 폐기됩니다.</li>
    <li>진단 로그 외 사용자 설정은 현재 <code>chrome.storage.local</code>에 저장되지 않습니다.</li>
  </ul>

  <h3>3-1. 사용자 제보 기능과 진단 로그</h3>
  <p>사용자가 사이드 패널 푸터의 <strong>"🐛 제보"</strong> 버튼을 통해 의견을 보내실 수 있도록, 다음 정보를 <strong>사용자 기기 안의 <code>chrome.storage.local</code>에 경량 링버퍼(최대 80건, FIFO)</strong>로 보관합니다.</p>
  <ul>
    <li>사이드 패널 시작 이벤트(브라우저 UA의 첫 80자, 언어, 뷰포트 크기)</li>
    <li>페이지 감지 이벤트: <strong>호스트(host)</strong>, 제목 문자 길이, 감지된 플랫폼/마크업/프레임워크 힌트, GTM·GA4 컨테이너 ID <strong>개수</strong>(ID 자체는 저장하지 않음), <code>dataLayer</code> 크기</li>
    <li>클릭 픽커 이벤트: 시작/취소, 클릭한 요소의 <strong>태그명·컨테이너 id 패턴(해시는 마스킹)</strong>, selector 신뢰도, 형제 일치 개수</li>
    <li>무시된 클릭 사유(<code>no-target</code> / <code>dup</code> / <code>max</code> / <code>session-lost</code> / <code>analyze-fail</code>)</li>
    <li>에러 메시지와 스택 첫 3줄(파일·라인 정보만 남도록 잘림)</li>
  </ul>

  <p><strong>수집하지 않는 정보</strong>: 페이지의 텍스트 본문, URL의 경로/쿼리/해시, 사용자가 입력한 임의 텍스트, 쿠키, 로그인 상태.</p>

  <p>이 정보는 <strong>사용자가 제보 모달의 "메일로 보내기" 버튼을 누른 시점에만</strong> 외부로 전달되며, 다음 두 경로로 전송됩니다.</p>
  <ol>
    <li>시스템 메일 클라이언트의 <code>mailto:</code> 링크: 요약 정보가 <code>hongtani625@gmail.com</code> 수신자로 채워진 새 메일이 열립니다(사용자가 직접 보내야만 발송됨).</li>
    <li>클립보드 자동 복사: 전체 진단 JSON이 클립보드에 복사되어, 필요 시 사용자가 메일 본문에 붙여넣을 수 있습니다.</li>
  </ol>

  <p>사용자는 제보 모달 안의 <strong>"🗑️ 로컬 로그 비우기"</strong> 버튼으로 언제든 저장된 진단 로그를 모두 삭제할 수 있습니다.</p>

  <h2>4. 제3자 서비스</h2>
  <p>디자인 일관성을 위해 한국어 폰트 <strong>Noto Sans KR</strong>을 Google Fonts(<code>fonts.googleapis.com</code>, <code>fonts.gstatic.com</code>)에서 로드합니다. 폰트 파일 외 사용자 정보나 페이지 데이터는 Google로 전송되지 않습니다. 이 동작은 사용자 IP가 Google 폰트 서버에 노출되는 일반적인 웹폰트 요청과 동일합니다.</p>

  <h2>5. Google API Services User Data Policy &mdash; Limited Use 준수</h2>
  <p>본 확장은 Chrome Web Store의 <strong>Limited Use</strong> 원칙을 준수합니다. 향후 Google API(예: GTM API) 연동이 추가될 경우, Google로부터 수신한 사용자 데이터는 (a) 사용자에게 명시한 기능 제공 목적으로만 사용하고, (b) 광고·인적 검토·머신러닝 학습에 사용하지 않으며, (c) 제3자에게 판매·이전하지 않습니다. 자세한 정책: <a href="https://developer.chrome.com/docs/webstore/program-policies/limited-use" target="_blank" rel="noopener noreferrer">https://developer.chrome.com/docs/webstore/program-policies/limited-use</a></p>

  <h2>6. 정책 변경</h2>
  <p>이 정책은 변경될 수 있으며, 변경 시 본 페이지의 시행일을 갱신합니다. 중대한 변경 시 확장 업데이트 노트에서도 안내합니다.</p>

  <h2>7. 문의</h2>
  <ul>
    <li>사용자 문의: <a href="https://digitalmarketer.co.kr/contact" target="_blank" rel="noopener noreferrer">https://digitalmarketer.co.kr/contact</a></li>
    <li>소스 코드: <a href="https://github.com/osomahong/gtm-tagging-agent" target="_blank" rel="noopener noreferrer">https://github.com/osomahong/gtm-tagging-agent</a> (등록 시점 기준)</li>
  </ul>

  <hr class="lang-divider" />

  <span class="lang-tag">English</span>

  <h2>1. Overview</h2>
  <p>GTM Tagging Agent is a Single Purpose Chrome extension that analyzes the active tab's clicked elements and page context, then displays Google Tag Manager (GTM) variable / trigger / tag guidance in the side panel. This policy describes how the extension handles user data.</p>

  <h2>2. Information accessed</h2>
  <p>On the tab where the user explicitly activates the extension, the extension reads &mdash; <strong>locally and ephemerally</strong> &mdash; the following:</p>
  <ul>
    <li>Current page URL and title</li>
    <li>Selector, text content, and selected attributes (tag, class, role, aria-label, etc.) of the DOM element the user picks</li>
    <li>Presence and size of <code>window.dataLayer</code>, and the IDs of installed GTM/GA4 containers (capped at 5)</li>
    <li>Hints about frameworks/markup (React, Vue, Next, Swiper, etc.)</li>
  </ul>

  <h2>3. Transmission and storage</h2>
  <ul>
    <li>The above is <strong>never transmitted to any external server</strong>. The extension has no backend and makes no outbound API calls in its code.</li>
    <li>Data lives in memory only while the side panel is open, and is discarded when the panel closes or the browser exits.</li>
    <li>Apart from the diagnostic log described below, no user preferences are currently persisted in <code>chrome.storage.local</code>.</li>
  </ul>

  <h3>3-1. User feedback feature and diagnostic log</h3>
  <p>To enable users to send feedback via the <strong>"🐛 Report"</strong> button in the side panel footer, the extension keeps a lightweight ring buffer (FIFO, capped at 80 entries) in <strong><code>chrome.storage.local</code> on the user's own device</strong> containing:</p>
  <ul>
    <li>Session-start events (first 80 chars of UA, language, viewport size)</li>
    <li>Page-detect events: <strong>host only</strong>, title length, detected platforms / markup class / framework hints, <strong>counts</strong> of GTM and GA4 container IDs (the IDs themselves are not stored), <code>dataLayer</code> size</li>
    <li>Click-picker events: start/cancel, the clicked element's tag name and container id pattern (hashy ids masked), selector reliability, sibling match count</li>
    <li>Reasons for ignored clicks (<code>no-target</code> / <code>dup</code> / <code>max</code> / <code>session-lost</code> / <code>analyze-fail</code>)</li>
    <li>Error messages and the first 3 stack lines (file:line only)</li>
  </ul>

  <p><strong>Not collected</strong>: page text content, URL path/query/hash, arbitrary user-typed text, cookies, login state.</p>

  <p>This information is sent outside the extension <strong>only when the user clicks "Send via email" in the feedback modal</strong>, via:</p>
  <ol>
    <li>A <code>mailto:</code> link opened in the system mail client, addressed to <code>hongtani625@gmail.com</code> with a pre-filled summary (the user must press send).</li>
    <li>A clipboard copy of the full diagnostic JSON, so the user can paste it into the email if desired.</li>
  </ol>

  <p>Users can clear the local diagnostic log at any time with the <strong>"🗑️ Clear local log"</strong> button inside the feedback modal.</p>

  <h2>4. Third-party services</h2>
  <p>The extension loads the Korean typeface <strong>Noto Sans KR</strong> from Google Fonts (<code>fonts.googleapis.com</code>, <code>fonts.gstatic.com</code>) to maintain visual consistency for Korean text. No user information or page data is sent to Google beyond the standard font request (which exposes the user's IP to the font server, as is typical for web fonts).</p>

  <h2>5. Compliance with Google API Services User Data Policy &mdash; Limited Use</h2>
  <p>This extension complies with the Chrome Web Store <strong>Limited Use</strong> requirements. If/when Google APIs (e.g., GTM API) are integrated, user data received from Google APIs will (a) be used only to provide user-facing features, (b) not be used for advertising, human review, or ML training, and (c) not be sold or transferred to third parties. See: <a href="https://developer.chrome.com/docs/webstore/program-policies/limited-use" target="_blank" rel="noopener noreferrer">https://developer.chrome.com/docs/webstore/program-policies/limited-use</a></p>

  <h2>6. Changes</h2>
  <p>This policy may change. When it does, the effective date above will be updated; significant changes will also be noted in the extension's update notes.</p>

  <h2>7. Contact</h2>
  <ul>
    <li>User inquiries: <a href="https://digitalmarketer.co.kr/contact" target="_blank" rel="noopener noreferrer">https://digitalmarketer.co.kr/contact</a></li>
    <li>Source code: <a href="https://github.com/osomahong/gtm-tagging-agent" target="_blank" rel="noopener noreferrer">https://github.com/osomahong/gtm-tagging-agent</a> (at time of submission)</li>
  </ul>

</main>
</body>
</html>`;

export async function GET(): Promise<Response> {
  return new Response(HTML, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
