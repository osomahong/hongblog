"use client";

import { useCallback, useState } from "react";
import { Check, Link2 } from "lucide-react";
import { BrandIcon } from "@/components/icons/BrandIcons";
import { sendGAEvent } from "@/lib/gtm";
import {
  SHARE_CHANNELS,
  shareImageUrl,
  shareIntentUrl,
  shareTargetUrl,
  truncateForShare,
  type ShareChannel,
  type SharePayload,
} from "@/lib/share";
import { cn } from "@/lib/utils";

const KAKAO_SDK_SRC = "https://t1.kakao.com/kakao_js_sdk/2.7.5/kakao.min.js";

interface KakaoSdk {
  init: (jsKey: string) => void;
  isInitialized: () => boolean;
  Share: {
    sendDefault: (settings: Record<string, unknown>) => void;
  };
}

declare global {
  interface Window {
    Kakao?: KakaoSdk;
  }
}

/** SDK 스크립트를 한 번만 받도록 모듈 단위로 캐시한다. */
let kakaoSdkPromise: Promise<KakaoSdk> | null = null;

/**
 * 카카오 SDK를 첫 공유 클릭 시점에만 내려받는다.
 * 모든 글 페이지에서 미리 로드하면 읽기와 무관한 스크립트 비용이 붙는다.
 */
function loadKakaoSdk(jsKey: string): Promise<KakaoSdk> {
  if (window.Kakao?.isInitialized()) {
    return Promise.resolve(window.Kakao);
  }

  if (!kakaoSdkPromise) {
    kakaoSdkPromise = new Promise<KakaoSdk>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = KAKAO_SDK_SRC;
      script.async = true;
      script.onload = () => {
        const sdk = window.Kakao;
        if (!sdk) {
          reject(new Error("카카오톡 공유를 불러오지 못했습니다."));
          return;
        }
        if (!sdk.isInitialized()) {
          sdk.init(jsKey);
        }
        resolve(sdk);
      };
      script.onerror = () => reject(new Error("카카오톡 공유를 불러오지 못했습니다."));
      document.head.appendChild(script);
    }).catch((error: unknown) => {
      // 실패한 시도를 캐시에 남기면 재시도가 막힌다.
      kakaoSdkPromise = null;
      throw error;
    });
  }

  return kakaoSdkPromise;
}

interface ShareBarProps {
  payload: SharePayload;
  contentType: "post" | "class";
  /** GA4 share 이벤트의 item_id. 슬러그를 쓴다. */
  contentId: string;
  /**
   * compact: 글 상단용. 아이콘만 한 줄로 노출한다.
   * full: 글 하단용. 제목과 라벨을 함께 노출한다.
   * panel: PC 사이드바용. 아이콘만 노출하되 배경색 패널로 감싸 눈에 띄게 한다.
   */
  variant?: "compact" | "full" | "panel";
  className?: string;
}

export function ShareBar({
  payload,
  contentType,
  contentId,
  variant = "compact",
  className,
}: ShareBarProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** full만 라벨을 함께 노출한다. 나머지는 아이콘만 쓴다. */
  const isIconOnly = variant !== "full";
  const isPanel = variant === "panel";

  const copyLink = useCallback(
    async (channel: ShareChannel) => {
      if (!navigator.clipboard) {
        throw new Error("이 브라우저에서는 링크 복사를 지원하지 않습니다.");
      }
      await navigator.clipboard.writeText(shareTargetUrl(payload, channel.id));
      setCopiedId(channel.id);
      setNotice(channel.hint ?? "링크를 복사했습니다.");
      window.setTimeout(() => {
        setCopiedId(null);
        setNotice(null);
      }, 2000);
    },
    [payload],
  );

  const handleShare = useCallback(
    async (channel: ShareChannel) => {
      setError(null);
      const targetUrl = shareTargetUrl(payload, channel.id);

      // 실제로 어떤 경로로 나갔는지 GA4에 함께 남긴다.
      let transport: string = channel.action;

      try {
        if (channel.action === "intent") {
          const intentUrl = shareIntentUrl(payload, channel.id);
          if (!intentUrl) {
            throw new Error("공유 링크를 만들지 못했습니다.");
          }
          window.open(intentUrl, "_blank", "noopener,noreferrer,width=600,height=640");
        } else if (channel.action === "clipboard") {
          await copyLink(channel);
        } else if (channel.action === "native") {
          if (typeof navigator.share === "function") {
            try {
              await navigator.share({
                title: payload.title,
                text: truncateForShare(payload.description),
                url: targetUrl,
              });
            } catch (shareError: unknown) {
              // 공유 시트를 그냥 닫은 것은 실패가 아니다. 이벤트도 남기지 않는다.
              if (shareError instanceof Error && shareError.name === "AbortError") {
                return;
              }
              throw shareError;
            }
          } else {
            // 공유 시트를 못 쓰는 환경(대부분의 데스크톱 브라우저)에서는 복사로 대체한다.
            await copyLink(channel);
            transport = "clipboard";
          }
        } else {
          const jsKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY;
          if (!jsKey) {
            throw new Error("카카오톡 공유 설정이 아직 완료되지 않았습니다.");
          }
          const sdk = await loadKakaoSdk(jsKey);
          sdk.Share.sendDefault({
            objectType: "feed",
            content: {
              title: payload.title,
              description: truncateForShare(payload.description),
              imageUrl: shareImageUrl(payload),
              link: { mobileWebUrl: targetUrl, webUrl: targetUrl },
            },
            buttons: [
              {
                title: "글 보기",
                link: { mobileWebUrl: targetUrl, webUrl: targetUrl },
              },
            ],
          });
        }

        sendGAEvent("share", {
          method: channel.id,
          share_transport: transport,
          content_type: contentType,
          item_id: contentId,
          content_name: payload.title,
        });
      } catch (caught: unknown) {
        setError(
          caught instanceof Error ? caught.message : "공유하지 못했습니다. 잠시 후 다시 시도해 주세요.",
        );
      }
    },
    [payload, contentType, contentId, copyLink],
  );

  const buttons = SHARE_CHANNELS.map((channel) => {
    const { id } = channel;
    const isCopied = copiedId === id;

    const iconSize = isIconOnly ? "h-4 w-4 sm:h-[18px] sm:w-[18px]" : "h-4 w-4";
    const icon = isCopied ? (
      <Check className={iconSize} strokeWidth={3} />
    ) : id === "copy" ? (
      <Link2 className={iconSize} strokeWidth={2.5} />
    ) : (
      <BrandIcon name={id} className={iconSize} />
    );

    return (
      <button
        key={id}
        type="button"
        onClick={() => handleShare(channel)}
        aria-label={channel.ariaLabel}
        title={channel.ariaLabel}
        style={{ backgroundColor: channel.bg, color: channel.fg }}
        className={cn(
          "inline-flex shrink-0 items-center justify-center border-2 border-black font-bold neo-shadow-sm neo-hover",
          isIconOnly
            ? "h-9 w-9 sm:h-10 sm:w-10"
            : "h-10 gap-2 px-3 text-xs sm:text-sm",
        )}
      >
        {icon}
        {!isIconOnly && <span>{isCopied ? "복사 완료" : channel.label}</span>}
      </button>
    );
  });

  const feedback = (error || notice) && (
    <p
      role="status"
      aria-live="polite"
      className={cn(
        "text-xs font-bold",
        isIconOnly ? "mt-2 w-full" : "mt-3",
        // 패널은 배경이 빨강이라 본문용 색상을 그대로 쓰면 읽히지 않는다.
        isPanel
          ? "text-white"
          : error
            ? "text-primary"
            : "text-muted-foreground",
      )}
    >
      {error ?? notice}
    </p>
  );

  if (isPanel) {
    return (
      <section
        className={cn("border-4 border-black bg-primary p-4 neo-shadow", className)}
        aria-label="이 글 공유하기"
      >
        <p className="mb-3 text-xs font-black uppercase tracking-widest text-white">
          이 글 공유하기
        </p>
        <div className="flex flex-wrap items-center gap-2">{buttons}</div>
        {feedback}
      </section>
    );
  }

  if (isIconOnly) {
    return (
      <div className={cn("flex flex-wrap items-center gap-x-3 gap-y-2", className)}>
        <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          Share
        </span>
        <div className="flex items-center gap-1.5 sm:gap-2">{buttons}</div>
        {feedback}
      </div>
    );
  }

  return (
    <section
      className={cn(
        "border-4 border-black bg-white p-4 neo-shadow sm:p-6",
        className,
      )}
      aria-label="이 글 공유하기"
    >
      <p className="text-sm font-black sm:text-base">
        이 글이 도움이 되셨다면 공유해 주세요
      </p>
      <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
        메신저로 바로 보내거나 링크를 복사할 수 있습니다.
      </p>
      <div className="mt-3 flex flex-wrap gap-2 sm:mt-4">{buttons}</div>
      {feedback}
    </section>
  );
}
