"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { sendGAEvent } from "@/lib/gtm";
import {
  burstElement,
  renderNodeToPngDataUrl,
  suckElement,
  supportsHtmlInCanvas,
} from "@/lib/canvas-fx";

// 글 페이지의 HTML in Canvas 인터랙션 묶음.
// 1) 본문 문장을 드래그하면 인용 카드 이미지를 저장하는 플로팅 버튼
// 2) 본문 이미지 호버 시 확대 렌즈
// 3) 코드 복사 버튼 클릭 시 코드가 버튼으로 빨려 들어가는 잔상
// 4) "도움이 됐어요" 클릭 시 버튼 파편 터짐
// 3, 4번은 이벤트 위임이라 해당 컴포넌트(MarkdownRenderer, ContentFeedback)를
// 수정하지 않는다. 미지원 브라우저에서는 1번 버튼이 아예 뜨지 않고
// 나머지는 조용히 생략된다.

interface ArticleCanvasFxProps {
  /** 인용 카드에 박을 글 제목 */
  title: string;
  /** 인용 카드 출처 표기용 사이트 내 경로 */
  path: string;
}

interface QuoteButtonState {
  x: number;
  y: number;
  text: string;
}

// 한 페이지에 ShareBar가 여러 번 마운트돼도 효과는 한 인스턴스만 담당한다
let activeInstances = 0;

const QUOTE_MIN = 12;
const QUOTE_MAX = 300;
const LENS_SIZE = 180;
const LENS_ZOOM = 2;

/** 인용 카드 DOM을 만든다. 렌더 결과가 그대로 공유 이미지가 된다 */
function buildQuoteCard(quote: string, title: string): HTMLElement {
  const card = document.createElement("div");
  card.style.cssText =
    "background:#fff;border:4px solid #000;box-shadow:10px 10px 0 #000;padding:36px;font-family:inherit;color:#111;";
  card.innerHTML = `
    <div style="display:inline-block;background:#FFD700;border:2px solid #000;font-weight:900;font-size:13px;letter-spacing:.08em;padding:4px 12px;margin-bottom:20px;">QUOTE</div>
    <p style="font-size:24px;line-height:1.65;font-weight:800;margin:0 0 26px;word-break:keep-all;">&ldquo;${quote
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")}&rdquo;</p>
    <div style="border-top:2px solid #000;padding-top:14px;display:flex;justify-content:space-between;gap:16px;font-size:13px;">
      <span style="font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${title
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")}</span>
      <span style="font-weight:900;white-space:nowrap;">준이아빠블로그 · digitalmarketer.co.kr</span>
    </div>`;
  return card;
}

export function ArticleCanvasFx({ title, path }: ArticleCanvasFxProps) {
  const [quoteBtn, setQuoteBtn] = useState<QuoteButtonState | null>(null);
  const [saving, setSaving] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const lensRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    activeInstances += 1;
    if (activeInstances === 1) setIsActive(true);
    return () => {
      activeInstances -= 1;
    };
  }, []);

  // 1) 본문 드래그 → 인용 카드 버튼
  useEffect(() => {
    if (!isActive || !supportsHtmlInCanvas()) return;
    const onMouseUp = () => {
      // 버튼 자체를 클릭하는 경우와 선택 확정 사이의 경합을 피한다
      window.setTimeout(() => {
        const sel = window.getSelection();
        if (!sel || sel.isCollapsed) {
          setQuoteBtn(null);
          return;
        }
        const text = sel.toString().replace(/\s+/g, " ").trim();
        const anchor = sel.anchorNode?.parentElement;
        if (
          text.length < QUOTE_MIN ||
          text.length > QUOTE_MAX ||
          !anchor?.closest("article")
        ) {
          setQuoteBtn(null);
          return;
        }
        const rect = sel.getRangeAt(0).getBoundingClientRect();
        setQuoteBtn({
          x: Math.min(window.innerWidth - 150, rect.left + rect.width / 2),
          y: rect.top - 44,
          text,
        });
      }, 0);
    };
    document.addEventListener("mouseup", onMouseUp);
    return () => document.removeEventListener("mouseup", onMouseUp);
  }, [isActive]);

  const saveQuoteCard = useCallback(async () => {
    if (!quoteBtn || saving) return;
    setSaving(true);
    try {
      const card = buildQuoteCard(quoteBtn.text, title);
      const dataUrl = await renderNodeToPngDataUrl(card, 720);
      if (!dataUrl) return;
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `quote-${path.split("/").pop() || "card"}.png`;
      a.click();
      sendGAEvent("quote_card_save", {
        content_id: path,
        content_name: title,
        quote_length: quoteBtn.text.length,
      });
    } finally {
      setSaving(false);
      setQuoteBtn(null);
      window.getSelection()?.removeAllRanges();
    }
  }, [quoteBtn, saving, title, path]);

  // 2) 본문 이미지 확대 렌즈 + 3) 코드 복사 잔상 + 4) 피드백 터짐 (전부 위임)
  useEffect(() => {
    if (!isActive) return;
    const removeLens = () => {
      lensRef.current?.remove();
      lensRef.current = null;
    };

    const onMouseMove = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const img =
        target instanceof HTMLImageElement && target.closest("article")
          ? target
          : null;
      if (!img || !img.complete || img.naturalWidth < 400) {
        removeLens();
        return;
      }
      const rect = img.getBoundingClientRect();
      let lens = lensRef.current;
      if (!lens) {
        lens = document.createElement("canvas");
        lens.width = LENS_SIZE * 2;
        lens.height = LENS_SIZE * 2;
        lens.style.cssText = `position:fixed;width:${LENS_SIZE}px;height:${LENS_SIZE}px;border-radius:50%;border:3px solid #000;box-shadow:6px 6px 0 rgba(0,0,0,.35);pointer-events:none;z-index:9999;background:#fff;`;
        document.body.appendChild(lens);
        lensRef.current = lens;
      }
      lens.style.left = `${e.clientX - LENS_SIZE / 2}px`;
      lens.style.top = `${e.clientY - LENS_SIZE / 2}px`;
      const ctx = lens.getContext("2d");
      if (!ctx) return;
      // 커서 위치를 원본 이미지 좌표로 환산해 확대해 그린다
      const rx = (e.clientX - rect.left) / rect.width;
      const ry = (e.clientY - rect.top) / rect.height;
      const sw = img.naturalWidth * (LENS_SIZE / rect.width) / LENS_ZOOM;
      const sh = img.naturalHeight * (LENS_SIZE / rect.height) / LENS_ZOOM;
      const sx = Math.max(0, Math.min(img.naturalWidth - sw, img.naturalWidth * rx - sw / 2));
      const sy = Math.max(0, Math.min(img.naturalHeight - sh, img.naturalHeight * ry - sh / 2));
      ctx.clearRect(0, 0, lens.width, lens.height);
      ctx.save();
      ctx.beginPath();
      ctx.arc(lens.width / 2, lens.height / 2, lens.width / 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, lens.width, lens.height);
      ctx.restore();
    };

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 3) 코드 복사: MarkdownRenderer의 복사 버튼 (aria-label 기준 위임)
      const copyBtn = target.closest<HTMLElement>('button[aria-label="코드 복사"]');
      if (copyBtn) {
        const codeArea = copyBtn.parentElement?.querySelector<HTMLElement>("div, pre");
        if (codeArea) void suckElement(codeArea, copyBtn);
        return;
      }
      // 4) 긍정 피드백: ContentFeedback의 도움됐어요 버튼 (텍스트 기준 위임)
      const fbBtn = target.closest("button");
      if (fbBtn && fbBtn.textContent?.includes("도움이 됐어요")) {
        void burstElement(fbBtn);
      }
    };

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("click", onClick, true);
      removeLens();
    };
  }, [isActive]);

  if (!quoteBtn) return null;
  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()} // 선택이 풀리기 전에 클릭을 받는다
      onClick={saveQuoteCard}
      style={{ left: quoteBtn.x, top: Math.max(8, quoteBtn.y) }}
      className="fixed z-[10000] -translate-x-1/2 px-3 py-1.5 text-xs font-black bg-[#FFD700] border-2 border-black neo-shadow-sm hover:bg-black hover:text-[#FFD700] transition-colors"
    >
      {saving ? "만드는 중..." : "인용 카드 저장"}
    </button>
  );
}
