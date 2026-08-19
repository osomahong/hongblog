"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Download, Copy, Check } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import {
  assembleElement,
  dissolveElement,
  glitchElement,
  renderNodeToPngDataUrl,
  scanInElement,
  supportsHtmlInCanvas,
} from "@/lib/canvas-fx";

// About 페이지 전용 캔버스 인터랙션 묶음.
// 1) 디지털 명함 저장/복사: 실물 명함 디자인(미니멀, 하늘색 포인트)을 그대로 옮기되
//    전화번호와 주소는 빼고 블로그, 링크드인 QR을 넣는다
// 2) 경력 수치 카운트업 + 도달 시 글리치
// 3) 프로필 사진 이스터에그 (호버 글리치, 클릭 시 흩어졌다 재조립)
// 4) 히어로 강조문 글리치 (첫 진입 1회)
// 5) 소개 섹션 카드 스캔 등장 (스크롤 진입 1회)
// 명함 기능은 사용자가 직접 누르는 기능이라 회선 게이트를 타지 않고,
// 연출들은 기존 게이트를 그대로 따른다.

interface AboutCanvasFxProps {
  blogUrl: string;
  linkedinUrl: string;
}

const CARD = {
  name: "홍승협",
  role: "컨설팅 랩  |  차장",
  email: "hong@oso.ma",
  companyEn: "OPENSOURCE MARKETING",
  companyKo: "오픈소스마케팅 osoma.kr",
  accent: "#5aa9dc",
  accentLight: "#8fc4e6",
};

/** 실물 명함 레이아웃을 그대로 옮긴 카드 DOM (720x400, 표준 명함 9:5 비율) */
function buildBusinessCard(blogQr: string, linkedinQr: string): HTMLElement {
  const card = document.createElement("div");
  card.style.cssText =
    "position:relative;height:400px;background:#ffffff;border:1px solid #e2e2e2;padding:44px 48px;font-family:inherit;color:#111;box-sizing:border-box;";
  card.innerHTML = `
    <div style="font-size:34px;font-weight:800;letter-spacing:-0.01em;">${CARD.name}</div>
    <div style="font-size:19px;font-weight:500;margin-top:14px;color:#222;">${CARD.role}</div>
    <div style="font-size:19px;font-weight:500;margin-top:8px;color:#222;">${CARD.email}</div>
    <div style="position:absolute;right:48px;top:44px;display:flex;gap:18px;">
      <div style="text-align:center;">
        <img src="${blogQr}" width="86" height="86" style="display:block;" alt="" />
        <div style="font-size:10px;letter-spacing:0.12em;color:#999;margin-top:6px;">BLOG</div>
      </div>
      <div style="text-align:center;">
        <img src="${linkedinQr}" width="86" height="86" style="display:block;" alt="" />
        <div style="font-size:10px;letter-spacing:0.12em;color:#999;margin-top:6px;">LINKEDIN</div>
      </div>
    </div>
    <div style="position:absolute;left:48px;bottom:44px;width:64px;height:64px;border:15px solid ${CARD.accent};border-radius:42% 46% 44% 48%;"></div>
    <div style="position:absolute;right:48px;bottom:44px;text-align:right;">
      <div style="font-size:25px;font-weight:600;letter-spacing:0.04em;color:${CARD.accentLight};">${CARD.companyEn}</div>
      <div style="font-size:19px;font-weight:700;margin-top:6px;color:#111;">${CARD.companyKo}</div>
    </div>`;
  return card;
}

/** "16년차", "3,000+", "120곳+" 같은 표기에서 숫자부만 뽑아 카운트업한다 */
function animateCount(el: HTMLElement, onDone: () => void): void {
  const original = el.textContent ?? "";
  const match = original.match(/^([\d,]+)(.*)$/);
  if (!match) {
    onDone();
    return;
  }
  const target = parseInt(match[1].replace(/,/g, ""), 10);
  const suffix = match[2];
  if (!Number.isFinite(target) || target <= 0) {
    onDone();
    return;
  }
  const dur = 850;
  const t0 = performance.now();
  const tick = (t: number) => {
    const p = Math.min(1, (t - t0) / dur);
    const ease = 1 - (1 - p) * (1 - p) * (1 - p);
    const value = Math.round(target * ease);
    el.textContent = value.toLocaleString("ko-KR") + suffix;
    if (p < 1) requestAnimationFrame(tick);
    else {
      el.textContent = original;
      onDone();
    }
  };
  requestAnimationFrame(tick);
}

export function AboutCanvasFx({ blogUrl, linkedinUrl }: AboutCanvasFxProps) {
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState(false);
  const canUse = useRef(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    canUse.current = supportsHtmlInCanvas();
    setReady(canUse.current);
  }, []);

  const makeCardPng = useCallback(async (): Promise<string | null> => {
    const QRCode = (await import("qrcode")).default;
    const qrOpts = { width: 172, margin: 1, color: { dark: "#111111", light: "#ffffff" } };
    const [blogQr, linkedinQr] = await Promise.all([
      QRCode.toDataURL(blogUrl, qrOpts),
      QRCode.toDataURL(linkedinUrl, qrOpts),
    ]);
    return renderNodeToPngDataUrl(buildBusinessCard(blogQr, linkedinQr), 720);
  }, [blogUrl, linkedinUrl]);

  const handleCard = useCallback(
    async (action: "download" | "copy") => {
      if (busy) return;
      setBusy(true);
      try {
        const dataUrl = await makeCardPng();
        if (!dataUrl) return;
        if (action === "download") {
          const a = document.createElement("a");
          a.href = dataUrl;
          a.download = "hongseunghyub-card.png";
          a.click();
        } else {
          const blob = await (await fetch(dataUrl)).blob();
          await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1200);
        }
        sendGAEvent("business_card_save", { action });
      } catch {
        // 클립보드 권한 거부 등은 조용히 넘긴다
      } finally {
        setBusy(false);
      }
    },
    [busy, makeCardPng]
  );

  // 연출들: 서버 렌더된 About 마크업을 셀렉터로 찾아 건다
  useEffect(() => {
    if (!canUse.current) return;
    const cleanups: (() => void)[] = [];

    // 2) 경력 수치 카운트업 + 글리치 (스크롤 진입 1회)
    const statsSection = Array.from(document.querySelectorAll("section")).find((s) =>
      s.querySelector("h2")?.textContent?.trim() === "경력"
    );
    if (statsSection) {
      const numbers = Array.from(
        statsSection.querySelectorAll<HTMLElement>("div.text-2xl.font-black, div.sm\\:text-3xl.font-black")
      );
      const seen = new WeakSet<HTMLElement>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (!entry.isIntersecting || seen.has(el)) continue;
            seen.add(el);
            animateCount(el, () => void glitchElement(el));
            io.unobserve(el);
          }
        },
        { threshold: 0.6 }
      );
      numbers.forEach((n) => io.observe(n));
      cleanups.push(() => io.disconnect());
    }

    // 5) 이후 소개 섹션 카드들 스캔 등장 (스크롤 진입 1회)
    const laterCards = Array.from(document.querySelectorAll<HTMLElement>("section"))
      .filter((s) => {
        const h2 = s.querySelector("h2")?.textContent?.trim();
        return h2 && h2 !== "경력";
      })
      // 카드 본문은 섹션의 마지막 div (틸트 래퍼 또는 카드 자체)
      .map((s) => {
        const divs = s.querySelectorAll<HTMLElement>(":scope > div");
        return divs.length ? divs[divs.length - 1] : null;
      })
      .filter((el): el is HTMLElement => Boolean(el));
    if (laterCards.length) {
      const seen = new WeakSet<HTMLElement>();
      const io = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const el = entry.target as HTMLElement;
            if (!entry.isIntersecting || seen.has(el)) continue;
            seen.add(el);
            void scanInElement(el);
            io.unobserve(el);
          }
        },
        { threshold: 0.25 }
      );
      laterCards.forEach((c) => io.observe(c));
      cleanups.push(() => io.disconnect());
    }

    // 3) 프로필 사진 이스터에그
    const photo = document.querySelector<HTMLElement>(
      "section img[alt*='프로필']"
    )?.parentElement;
    if (photo) {
      const onEnter = () => void glitchElement(photo);
      const onClick = async () => {
        if (photo.dataset.fxRunning === "1") return;
        await dissolveElement(photo);
        await assembleElement(photo);
      };
      photo.addEventListener("mouseenter", onEnter);
      photo.addEventListener("click", onClick);
      photo.style.cursor = "pointer";
      cleanups.push(() => {
        photo.removeEventListener("mouseenter", onEnter);
        photo.removeEventListener("click", onClick);
      });
    }

    // 4) 히어로 강조문 글리치 (첫 진입 1회)
    const emphasis = document.querySelector<HTMLElement>("h1 span");
    if (emphasis) {
      const timer = window.setTimeout(() => void glitchElement(emphasis), 900);
      cleanups.push(() => window.clearTimeout(timer));
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  // HTML in Canvas 미지원 브라우저에서는 명함 버튼 자체를 숨긴다
  if (!ready) return null;

  const btnClass =
    "inline-flex items-center gap-2 px-4 py-2.5 bg-white text-black text-sm font-black border-3 border-black neo-shadow-sm hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-60";
  return (
    <span className="inline-flex flex-wrap gap-2">
      <button type="button" onClick={() => handleCard("download")} disabled={busy} className={btnClass}>
        <Download className="w-4 h-4 shrink-0" />
        {busy ? "만드는 중..." : "디지털 명함 저장"}
      </button>
      <button type="button" onClick={() => handleCard("copy")} disabled={busy} className={btnClass}>
        {copied ? <Check className="w-4 h-4 shrink-0 text-green-600" /> : <Copy className="w-4 h-4 shrink-0" />}
        {copied ? "복사됨!" : "명함 복사"}
      </button>
    </span>
  );
}
