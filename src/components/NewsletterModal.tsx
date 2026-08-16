"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Mail, X, CheckCircle2 } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import { cn } from "@/lib/utils";
import {
  CONSENT_TEXT,
  ETC_VALUE,
  INDUSTRY_OPTIONS,
  JOB_ROLE_OPTIONS,
  YEARS_OPTIONS,
  type SelectOption,
  type SignupSource,
} from "@/lib/newsletter/options";

// 뉴스레터 가입 팝업.
// 스티비 외부 페이지로 보내던 흐름을 사이트 안에서 끝낸다.
// 제출하면 /api/newsletter/subscribe가 Neon과 스티비에 넣고, 확인 메일(더블 옵트인)이 나간다.

interface NewsletterModalProps {
  open: boolean;
  onClose: () => void;
  signupSource: SignupSource;
}

interface SelectWithEtcProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  etcText: string;
  onChange: (value: string) => void;
  onEtcChange: (text: string) => void;
}

const FIELD_CLASS =
  "w-full border-2 border-black bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black";

/** 드롭다운 하나. "기타 (직접 입력)"를 고르면 아래에 입력란이 열린다. */
function SelectWithEtc({
  id,
  label,
  options,
  value,
  etcText,
  onChange,
  onEtcChange,
}: SelectWithEtcProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-xs font-black mb-1">
        {label} <span className="font-normal text-black/50">(선택)</span>
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={FIELD_CLASS}
      >
        <option value="">선택하지 않음</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {value === ETC_VALUE && (
        <input
          type="text"
          value={etcText}
          onChange={(e) => onEtcChange(e.target.value)}
          maxLength={40}
          placeholder="직접 입력해 주세요"
          className={cn(FIELD_CLASS, "mt-2")}
        />
      )}
    </div>
  );
}

export function NewsletterModal({ open, onClose, signupSource }: NewsletterModalProps) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [industry, setIndustry] = useState("");
  const [industryEtc, setIndustryEtc] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [jobRoleEtc, setJobRoleEtc] = useState("");
  const [years, setYears] = useState("");
  const [website, setWebsite] = useState(""); // 봇 걸러내기용 숨은 필드
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  const withEtc = (value: string, etcText: string) =>
    value === ETC_VALUE ? `${ETC_VALUE}:${etcText.trim()}` : value;

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (submitting) return;
      setError(null);
      setSubmitting(true);
      try {
        const res = await fetch("/api/newsletter/subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email,
            consent,
            industry: withEtc(industry, industryEtc),
            jobRole: withEtc(jobRole, jobRoleEtc),
            years,
            signupSource,
            website,
          }),
        });
        const data = (await res.json()) as { ok: boolean; message: string };
        if (!data.ok) {
          setError(data.message);
          return;
        }
        setDone(true);
        sendGAEvent("newsletter_subscribe", { location: signupSource });
      } catch {
        setError("일시적인 오류입니다. 잠시 후 다시 시도해 주세요.");
      } finally {
        setSubmitting(false);
      }
    },
    [
      submitting,
      email,
      consent,
      industry,
      industryEtc,
      jobRole,
      jobRoleEtc,
      years,
      signupSource,
      website,
    ]
  );

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      role="dialog"
      aria-modal="true"
      aria-label="뉴스레터 구독"
    >
      <div
        ref={dialogRef}
        className="w-full max-w-md max-h-[90vh] overflow-y-auto bg-white neo-border-thick neo-shadow-lg"
      >
        <div className="flex items-center justify-between bg-accent border-b-4 border-black px-5 py-3">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <span className="font-black uppercase text-sm">디지털마케터 뉴스레터</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="p-1 border-2 border-black bg-white hover:bg-black hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {done ? (
          <div className="p-6 text-center">
            <CheckCircle2 className="w-10 h-10 mx-auto mb-3" />
            <h3 className="font-black text-lg mb-2">확인 메일을 보냈습니다</h3>
            <p className="text-sm text-black/70 leading-relaxed mb-5">
              {email}의 받은편지함을 확인해 주세요. 메일 안의 구독 확인 버튼을 누르면
              구독이 완료됩니다. 메일이 보이지 않으면 스팸함에 있을 수 있습니다.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-black text-white text-sm font-black border-2 border-black hover:bg-[#FF0033] transition-colors"
            >
              닫기
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <p className="text-sm font-bold text-black leading-relaxed">
              매일 쏟아지는 AI 소식 중에서 지금 하는 일에 필요한 변화만 골라
              보내드립니다.
            </p>
            <p className="text-sm text-black/70 leading-relaxed">
              매주 한 번, 바로 써볼 수 있는 도구와 방법을 짧고 쉽게 정리해
              드립니다. 산업군과 직무를 알려주시면 관련 사례부터 받아보실 수
              있습니다.
            </p>

            <div>
              <label htmlFor="nl-email" className="block text-xs font-black mb-1">
                이메일 <span className="text-[#FF0000]">*</span>
              </label>
              <input
                id="nl-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className={FIELD_CLASS}
              />
            </div>

            {/* 봇 걸러내기용. 사람 눈에는 보이지 않는다 */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="absolute -left-[9999px] h-0 w-0 opacity-0"
            />

            <SelectWithEtc
              id="nl-industry"
              label="산업군"
              options={INDUSTRY_OPTIONS}
              value={industry}
              etcText={industryEtc}
              onChange={setIndustry}
              onEtcChange={setIndustryEtc}
            />
            <SelectWithEtc
              id="nl-job"
              label="직무"
              options={JOB_ROLE_OPTIONS}
              value={jobRole}
              etcText={jobRoleEtc}
              onChange={setJobRole}
              onEtcChange={setJobRoleEtc}
            />
            <div>
              <label htmlFor="nl-years" className="block text-xs font-black mb-1">
                연차 <span className="font-normal text-black/50">(선택)</span>
              </label>
              <select
                id="nl-years"
                value={years}
                onChange={(e) => setYears(e.target.value)}
                className={FIELD_CLASS}
              >
                <option value="">선택하지 않음</option>
                {YEARS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            <label className="flex items-start gap-2 text-xs leading-relaxed cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-black"
              />
              <span>
                {CONSENT_TEXT} 입력하신 이메일 주소와 선택 항목은{" "}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="underline font-bold"
                >
                  개인정보처리방침
                </Link>
                에 따라 관리됩니다. 수신은 메일 하단에서 언제든 거부할 수 있습니다.
              </span>
            </label>

            {error && (
              <p className="text-xs font-bold text-[#FF0000] border-2 border-[#FF0000] px-3 py-2">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-black text-white font-black uppercase text-sm border-2 border-black hover:bg-[#FF0033] transition-colors disabled:opacity-60"
            >
              {submitting ? "처리 중..." : "무료 구독하기"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
