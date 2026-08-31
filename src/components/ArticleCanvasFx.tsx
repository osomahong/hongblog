"use client";

import { useCallback, useEffect, useState } from "react";
import { sendGAEvent } from "@/lib/gtm";
import {
  burstElement,
  renderNodeToPngDataUrl,
  suckElement,
  supportsHtmlInCanvas,
} from "@/lib/canvas-fx";

// 글 페이지의 HTML in Canvas 인터랙션 묶음.
// 1) 본문 문장을 드래그하면 인용 카드 이미지를 저장하는 플로팅 버튼
// 2) 코드 복사 버튼 클릭 시 코드가 버튼으로 빨려 들어가는 잔상
// 3) "도움이 됐어요" 클릭 시 버튼 파편 터짐
// 2, 3번은 이벤트 위임이라 해당 컴포넌트(MarkdownRenderer, ContentFeedback)를
// 수정하지 않는다. 미지원 브라우저에서는 1번 버튼이 아예 뜨지 않고
// 나머지는 조용히 생략된다.
//
// 본문 이미지 확대는 호버 렌즈에서 클릭 라이트박스(ImageLightbox)로 옮겼다.
// 렌즈는 커서 주변만 보여 주고 터치 기기에서는 아예 뜨지 않았다.

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

const QUOTE_MIN = 8;
/** 카드에 담을 최대 글자수. 넘으면 자르고 말줄임표를 붙인다 (버튼은 항상 띄운다) */
const QUOTE_MAX = 240;

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
  const [copied, setCopied] = useState(false);
  const [isActive, setIsActive] = useState(false);

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
        let text = sel.toString().replace(/\s+/g, " ").trim();
        // 드래그 시작점이 아니라 선택 영역 전체가 본문에 걸쳐 있는지로 판정한다.
        // 시작점 기준이면 문단 바깥 여백에서 드래그를 시작했을 때 버튼이 안 떠서
        // "될 때도 있고 안 될 때도 있는" 현상이 생긴다.
        const range = sel.getRangeAt(0);
        const container = range.commonAncestorContainer;
        const containerEl =
          container.nodeType === Node.TEXT_NODE
            ? container.parentElement
            : (container as HTMLElement);
        if (text.length < QUOTE_MIN || !containerEl?.closest("article")) {
          setQuoteBtn(null);
          return;
        }
        if (text.length > QUOTE_MAX) {
          text = `${text.slice(0, QUOTE_MAX).trimEnd()}…`;
        }
        const rect = range.getBoundingClientRect();
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

  const runQuoteCard = useCallback(
    async (action: "download" | "copy") => {
      if (!quoteBtn || saving) return;
      setSaving(true);
      let ok = false;
      try {
        const card = buildQuoteCard(quoteBtn.text, title);
        const dataUrl = await renderNodeToPngDataUrl(card, 720);
        if (!dataUrl) return;
        if (action === "download") {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = `quote-${path.split("/").pop() || "card"}.png`;
          a.click();
          ok = true;
        } else {
          const blob = await (await fetch(dataUrl)).blob();
          await navigator.clipboard.write([
            new ClipboardItem({ "image/png": blob }),
          ]);
          ok = true;
        }
        sendGAEvent("quote_card_save", {
          content_id: path,
          content_name: title,
          quote_length: quoteBtn.text.length,
          action,
        });
      } catch {
        // 클립보드 권한 거부 등. 조용히 닫는다
      } finally {
        setSaving(false);
        if (ok && action === "copy") {
          setCopied(true);
          window.setTimeout(() => {
            setCopied(false);
            setQuoteBtn(null);
            window.getSelection()?.removeAllRanges();
          }, 900);
        } else {
          setQuoteBtn(null);
          window.getSelection()?.removeAllRanges();
        }
      }
    },
    [quoteBtn, saving, title, path]
  );

  // 2) 코드 복사 잔상 + 3) 피드백 터짐 (전부 위임)
  useEffect(() => {
    if (!isActive) return;

    const onClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // 2) 코드 복사: MarkdownRenderer의 복사 버튼 (aria-label 기준 위임)
      const copyBtn = target.closest<HTMLElement>('button[aria-label="코드 복사"]');
      if (copyBtn) {
        const codeArea = copyBtn.parentElement?.querySelector<HTMLElement>("div, pre");
        if (codeArea) void suckElement(codeArea, copyBtn);
        return;
      }
      // 3) 긍정 피드백: ContentFeedback의 도움됐어요 버튼 (텍스트 기준 위임)
      const fbBtn = target.closest("button");
      if (fbBtn && fbBtn.textContent?.includes("도움이 됐어요")) {
        void burstElement(fbBtn);
      }
    };

    document.addEventListener("click", onClick, true);
    return () => {
      document.removeEventListener("click", onClick, true);
    };
  }, [isActive]);

  if (!quoteBtn) return null;
  const btnClass =
    "px-3 py-1.5 text-xs font-black bg-[#FFD700] border-2 border-black neo-shadow-sm hover:bg-black hover:text-[#FFD700] transition-colors disabled:opacity-60";
  return (
    <div
      style={{ left: quoteBtn.x, top: Math.max(8, quoteBtn.y) }}
      className="fixed z-[10000] -translate-x-1/2 flex gap-1.5"
      onMouseDown={(e) => e.preventDefault()} // 선택이 풀리기 전에 클릭을 받는다
    >
      <button type="button" onClick={() => runQuoteCard("download")} disabled={saving} className={btnClass}>
        {saving ? "만드는 중..." : "이미지 저장"}
      </button>
      <button type="button" onClick={() => runQuoteCard("copy")} disabled={saving} className={btnClass}>
        {copied ? "복사됨!" : "클립보드 복사"}
      </button>
    </div>
  );
}
