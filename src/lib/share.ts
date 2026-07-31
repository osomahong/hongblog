import { absoluteUrl } from "./utils";
import type { BrandName } from "@/components/icons/BrandIcons";

/**
 * SNS 공유 채널 정의와 공유 URL 조립.
 *
 * 서버 컴포넌트에서도 쓸 수 있도록 순수 함수만 둔다.
 * 실제 공유 동작(창 띄우기, 클립보드, 카카오 SDK)은 ShareBar가 담당한다.
 */

export type ShareChannelId = BrandName | "copy";

/** 채널별 공유 실행 방식 */
export type ShareAction =
  /** 공유 창을 새 창으로 띄운다 */
  | "intent"
  /** URL을 클립보드에 복사한다 */
  | "clipboard"
  /** 카카오 JavaScript SDK의 메시지 템플릿을 쓴다 */
  | "kakao"
  /**
   * OS 공유 시트(Web Share API)를 띄우고, 미지원 환경에서는 클립보드로 대체한다.
   * 브라우저는 특정 앱의 설치 여부를 알 수 없지만, 공유 시트는 OS가 설치된 앱만
   * 보여주므로 "앱 있으면 앱으로, 없으면 복사"를 사용자 선택으로 해결한다.
   */
  | "native";

export interface ShareChannel {
  id: ShareChannelId;
  label: string;
  /** 아이콘만 노출하는 compact 변형에서 스크린 리더와 툴팁이 쓰는 문구 */
  ariaLabel: string;
  action: ShareAction;
  /** 브랜드 대표색 */
  bg: string;
  /** bg 위에서 WCAG AA(4.5:1) 이상 대비를 확보하는 전경색 */
  fg: string;
  /** clipboard 채널에서 복사 직후 노출할 안내 */
  hint?: string;
}

/**
 * 노출 순서. X와 스레드는 브랜드 대표색이 둘 다 검정이라
 * 나란히 두면 한 덩어리로 보인다. 사이에 Slack(자주)을 끼워 구분한다.
 */
export const SHARE_CHANNELS: readonly ShareChannel[] = [
  {
    id: "kakao",
    label: "카카오톡",
    ariaLabel: "카카오톡으로 공유",
    action: "kakao",
    bg: "#FEE500",
    fg: "#000000",
  },
  {
    id: "linkedin",
    label: "링크드인",
    ariaLabel: "링크드인에 공유",
    action: "intent",
    bg: "#0A66C2",
    fg: "#FFFFFF",
  },
  {
    id: "threads",
    label: "스레드",
    ariaLabel: "스레드에 공유",
    action: "intent",
    bg: "#000000",
    fg: "#FFFFFF",
  },
  {
    id: "slack",
    label: "슬랙",
    // Slack은 제3자 페이지에서 채널로 바로 보내는 공개 intent URL이 없다.
    // OS 공유 시트에 슬랙 앱이 뜨면 그쪽으로 보내고, 시트를 못 열면 링크를 복사한다.
    // 붙여 넣기만 해도 Slack이 OG 카드를 자동으로 펼쳐준다.
    ariaLabel: "슬랙으로 공유",
    action: "native",
    // 슬랙만 공식 4색 마크를 쓴다. 아우버진(#4A154B) 배경에서는 크림슨과 그린이
    // 배경에 묻어 로고가 뭉개지므로, 슬랙 공식 배색대로 흰 배경에 얹는다.
    // 전경색은 아우버진으로 둬서 같은 흰 배경인 링크 복사 버튼과 구분한다.
    bg: "#FFFFFF",
    fg: "#4A154B",
    hint: "링크를 복사했습니다. 슬랙에 붙여 넣으세요.",
  },
  {
    id: "x",
    label: "X",
    ariaLabel: "X에 공유",
    action: "intent",
    bg: "#000000",
    fg: "#FFFFFF",
  },
  {
    id: "copy",
    label: "링크 복사",
    ariaLabel: "링크 복사",
    action: "clipboard",
    bg: "#FFFFFF",
    fg: "#000000",
    hint: "링크를 복사했습니다.",
  },
];

export interface SharePayload {
  /** 공유 카드 제목 */
  title: string;
  /** 공유 카드 설명 */
  description: string;
  /** og:image. 상대 경로면 절대 URL로 변환한다 */
  image: string;
  /** 사이트 내 경로. 예: /insights/my-post */
  path: string;
}

const UTM_MEDIUM = "social";
const UTM_CAMPAIGN = "organic-share";

/**
 * utm_source 값. 채널 id와 다를 수 있어 분리한다.
 * link-copy는 붙여 넣을 곳을 알 수 없지만, 실제로는 대부분 메신저로 가므로
 * medium은 social로 묶어 GA4 기본 채널 그룹의 Organic Social에 떨어지게 한다.
 */
const UTM_SOURCE: Record<ShareChannelId, string> = {
  kakao: "kakaotalk",
  linkedin: "linkedin",
  threads: "threads",
  slack: "slack",
  x: "x",
  copy: "link-copy",
};

/**
 * 공유 대상 URL. 단축 도메인이 준비되면 이 함수만 바꾸면 전 채널에 반영된다.
 */
export function shareTargetUrl(payload: SharePayload, channelId: ShareChannelId): string {
  const url = new URL(absoluteUrl(payload.path));
  url.searchParams.set("utm_source", UTM_SOURCE[channelId]);
  url.searchParams.set("utm_medium", UTM_MEDIUM);
  url.searchParams.set("utm_campaign", UTM_CAMPAIGN);
  return url.toString();
}

/** 카카오 메시지 템플릿에 넣을 이미지. 절대 URL이어야 한다. */
export function shareImageUrl(payload: SharePayload): string {
  return payload.image.startsWith("/") ? absoluteUrl(payload.image) : payload.image;
}

/** 공유 창을 띄우는 채널의 intent URL. 그 외 채널은 null. */
export function shareIntentUrl(
  payload: SharePayload,
  channelId: ShareChannelId,
): string | null {
  const target = shareTargetUrl(payload, channelId);

  switch (channelId) {
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(target)}`;
    case "x":
      return `https://x.com/intent/post?url=${encodeURIComponent(target)}&text=${encodeURIComponent(payload.title)}`;
    case "threads":
      // 스레드 intent는 text 하나만 받는다. 제목과 URL을 한 덩어리로 넘긴다.
      return `https://www.threads.net/intent/post?text=${encodeURIComponent(`${payload.title}\n${target}`)}`;
    default:
      return null;
  }
}

/** 공유 카드에서 잘리지 않을 길이로 설명을 줄인다. */
export function truncateForShare(text: string, max = 100): string {
  const normalized = text.replace(/\s+/g, " ").trim();
  return normalized.length <= max ? normalized : `${normalized.slice(0, max - 1)}…`;
}
