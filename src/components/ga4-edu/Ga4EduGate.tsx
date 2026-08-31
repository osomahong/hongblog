"use client";

/**
 * 잠긴 튜토리얼의 실습 자리.
 *
 * 세 화면을 한 컴포넌트가 상태에 따라 바꿔 그린다.
 * 1) 확인 중: 세션을 묻는 동안의 자리 표시
 * 2) 잠김: 무엇을 배우는지 알려 주고 구독과 이메일 입력을 받는다
 * 3) 열림: 실습을 그대로 붙인다
 *
 * 구독 상태의 원본은 Neon이고 이 컴포넌트는 판정을 하지 않는다. 서버가 돌려준 결과만 따른다.
 * 구독을 해지하면 다음 확인에서 잠김으로 돌아간다.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { Mail, ArrowRight, Lock, LogIn, Loader2 } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { dissolveElement } from "@/lib/canvas-fx";
import { NewsletterModal } from "@/components/NewsletterModal";
import { LabStage } from "./lab/LabStage";

type GateState = "checking" | "locked" | "open";

interface Ga4EduGateProps {
  slug: string;
  title: string;
  teaches: string[];
  /** 좁은 화면 안내에 적는 주소 */
  url: string;
}

interface SessionResponse {
  ok?: boolean;
  state?: string;
  email?: string;
  message?: string;
}

export function Ga4EduGate({ slug, title, teaches, url }: Ga4EduGateProps) {
  const [state, setState] = useState<GateState>("checking");
  const [email, setEmail] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const gateRef = useRef<HTMLDivElement | null>(null);

  /** 잠금 카드를 재로 날려 보내고 실습으로 바꾼다. 미지원 브라우저면 바로 바뀐다 */
  const openStage = useCallback(async () => {
    if (gateRef.current) await dissolveElement(gateRef.current);
    setState("open");
  }, []);

  /**
   * 서버에 지금 세션이 유효한지 묻는다. 구독 해지도 여기서 걸러진다.
   * animated는 잠금 카드가 화면에 있을 때만 true다. 처음 확인에는 흩어질 카드가 없다.
   */
  const refresh = useCallback(async (animated = false) => {
    try {
      const res = await fetch("/api/ga4-edu/session", { cache: "no-store" });
      const data = (await res.json()) as SessionResponse;
      if (data.ok) {
        if (animated) await openStage();
        else setState("open");
        return;
      }
      setState("locked");
      // 해지나 대기 상태로 막힌 경우에만 이유를 보여 준다. 처음 온 사람에게는 조용히 둔다
      if (data.state && data.state !== "anonymous" && data.message) {
        setNotice(data.message);
      }
    } catch {
      setState("locked");
    }
  }, [openStage]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    setNotice("");

    try {
      const res = await fetch("/api/ga4-edu/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = (await res.json()) as SessionResponse;

      if (data.ok) {
        sendGAEvent("ga4edu_unlock", { content_id: slug });
        await openStage();
        return;
      }

      setNotice(data.message ?? "다시 시도해 주세요.");
      // 명단에 없는 주소면 구독 폼을 바로 띄워 준다
      if (data.state === "none") setModalOpen(true);
    } catch {
      setNotice("일시적인 오류입니다. 잠시 후 다시 시도해 주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (state === "checking") {
    return (
      <div className="ga4-wrap">
        <div className="ga4-lab-loading">
          <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} aria-hidden />
          구독 상태를 확인하는 중입니다.
        </div>
      </div>
    );
  }

  if (state === "open") {
    return <LabStage slug={slug} url={url} />;
  }

  return (
    <div className="ga4-wrap">
      <div className="ga4-gate" ref={gateRef}>
        <span className="ga4-gate-icon" aria-hidden>
          <Lock className="w-5 h-5" strokeWidth={1.8} />
        </span>

        <h2 className="ga4-gate-title">이 실습은 뉴스레터 구독자에게 열립니다</h2>
        <p className="ga4-gate-desc">
          {title} 실습은 준이아빠블로그 뉴스레터를 구독하면 바로 열립니다. 구독은 무료이고, GA4와
          SEO 실무 내용을 월 1회에서 2회 보내 드립니다. 구독 없이 볼 수 있는 튜토리얼도 두 편 있으니
          먼저 해 보고 구독을 정해도 됩니다.
        </p>

        {teaches.length > 0 && (
          <ul className="ga4-gate-list">
            {teaches.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        )}

        <button
          type="button"
          onClick={() => {
            sendGAEvent("ga4edu_subscribe_click", { content_id: slug });
            setModalOpen(true);
          }}
          className="ga4-btn-primary"
        >
          <Mail className="w-4 h-4" strokeWidth={2} /> 무료로 구독하고 실습 열기
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </button>

        <div className="ga4-gate-login">
          <p className="ga4-gate-login-label">이미 구독 중이라면 구독한 이메일을 넣어 주세요.</p>
          <form onSubmit={handleSubmit} className="ga4-gate-form">
            <label className="sr-only" htmlFor={`ga4-gate-email-${slug}`}>
              구독한 이메일 주소
            </label>
            <input
              id={`ga4-gate-email-${slug}`}
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="ga4-gate-input"
            />
            <button type="submit" disabled={submitting} className="ga4-btn-ghost">
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin" strokeWidth={2} aria-hidden />
              ) : (
                <LogIn className="w-4 h-4" strokeWidth={2} aria-hidden />
              )}
              실습 열기
            </button>
          </form>
          {notice && (
            <p className="ga4-gate-notice" role="status">
              {notice}
            </p>
          )}
        </div>
      </div>

      <NewsletterModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          // 구독을 마치고 닫았을 수 있으니 상태를 다시 본다
          void refresh(true);
        }}
        signupSource="ga4_edu"
      />
    </div>
  );
}
