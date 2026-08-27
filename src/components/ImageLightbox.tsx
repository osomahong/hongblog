"use client";

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface ImageLightboxProps {
  image: LightboxImage;
  onClose: () => void;
}

interface ZoomState {
  /** 확대 배율에서 이미지에 줄 실제 픽셀 폭 */
  width: number;
  /** 누른 지점의 이미지 내 상대 위치 (0~1). 확대 후 그 지점으로 스크롤한다 */
  offsetX: number;
  offsetY: number;
}

/** 화면 폭의 몇 배까지 키울지. 원본이 더 크면 여기서 자른다 */
const MAX_ZOOM_VIEWPORTS = 3;

/**
 * 본문 이미지 클릭 확대 오버레이.
 *
 * 본문 이미지는 폭 상한(640px)이 걸려 있어 스크린샷 안의 글씨가 작게 들어간다.
 * 클릭하면 화면 크기에 맞춰 펼치고, 한 번 더 누르면 그 지점을 가운데 두고 키운다.
 * 커서를 따라다니던 호버 렌즈와 달리 터치 기기에서도 동작한다.
 *
 * 본문에 transform이 걸린 조상이 있으면 fixed 위치가 그 기준으로 잡히므로
 * 포털로 body에 직접 붙인다.
 */
export function ImageLightbox({ image, onClose }: ImageLightboxProps) {
  const [zoom, setZoom] = useState<ZoomState | null>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    // 오버레이가 열려 있는 동안 뒤쪽 본문이 따라 스크롤되지 않게 막는다
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // 확대 직후, 누른 지점이 화면 가운데 오도록 스크롤을 옮긴다.
  // 이게 없으면 큰 원본에서 좌상단 여백만 보인다.
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !zoom) return;
    el.scrollLeft = zoom.offsetX * el.scrollWidth - el.clientWidth / 2;
    el.scrollTop = zoom.offsetY * el.scrollHeight - el.clientHeight / 2;
  }, [zoom]);

  const handleImageClick = (e: ReactMouseEvent<HTMLImageElement>) => {
    e.stopPropagation(); // 이미지를 눌렀을 때는 오버레이가 닫히지 않는다
    if (zoom) {
      setZoom(null);
      return;
    }
    const img = e.currentTarget;
    const rect = img.getBoundingClientRect();
    setZoom({
      width: Math.min(img.naturalWidth, window.innerWidth * MAX_ZOOM_VIEWPORTS),
      offsetX: (e.clientX - rect.left) / rect.width,
      offsetY: (e.clientY - rect.top) / rect.height,
    });
  };

  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt || "이미지 크게 보기"}
      className="fixed inset-0 z-[10001] flex flex-col bg-black"
      onClick={onClose}
    >
      <div className="flex shrink-0 items-center justify-between gap-3 border-b-2 border-white/20 px-3 py-2 sm:px-4">
        <p className="text-[11px] font-black tracking-wide text-white/70">
          {zoom ? "눌러서 화면에 맞추기" : "눌러서 원본 크기로 보기"}
        </p>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="닫기"
          className="flex items-center gap-1 border-2 border-black bg-[#FFD700] px-2 py-1 text-xs font-black neo-shadow-sm transition-colors hover:bg-white sm:px-3 sm:py-1.5"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          닫기
        </button>
      </div>

      <div
        ref={scrollRef}
        className={
          zoom
            ? "flex-1 overflow-auto p-3 sm:p-6"
            : "flex flex-1 items-center justify-center overflow-hidden p-3 sm:p-6"
        }
      >
        <img
          src={image.src}
          alt={image.alt}
          onClick={handleImageClick}
          style={zoom ? { width: zoom.width, maxWidth: "none" } : undefined}
          className={
            zoom
              ? "mx-auto block h-auto cursor-zoom-out border-2 border-black bg-white"
              : "mx-auto block max-h-full max-w-full cursor-zoom-in border-2 border-black bg-white object-contain"
          }
        />
      </div>

      {image.alt && (
        <div className="shrink-0 border-t-2 border-white/20 px-3 py-2 sm:px-4">
          {/* 한국어 캡션은 단어 중간에서 끊지 않고, 폭을 묶어 한 줄이 길어지지 않게 한다 */}
          <p className="mx-auto max-h-24 max-w-3xl overflow-y-auto break-keep text-center text-[11px] leading-relaxed text-white/70 sm:text-xs">
            {image.alt}
          </p>
        </div>
      )}
    </div>,
    document.body,
  );
}
