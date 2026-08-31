import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/utils";
import { KAKAO_INQUIRY_URL } from "@/lib/constants";

// 뉴스레터 구독(이메일 수집)을 시작하면서 필요해진 개인정보처리방침.
// 수집 항목이나 위탁 업체가 바뀌면 본문과 시행일을 함께 갱신한다.

export const metadata: Metadata = {
  title: "개인정보처리방침",
  description:
    "개인정보처리방침은 준이아빠블로그가 뉴스레터 구독 과정에서 처리하는 개인정보의 항목, 목적, 보유 기간을 설명하는 문서입니다.",
  alternates: { canonical: absoluteUrl("/privacy") },
  robots: { index: false, follow: true },
};

const SECTION_TITLE = "text-lg font-black mt-10 mb-3 border-b-2 border-black pb-2";
const P = "text-sm leading-relaxed text-black/80 mb-3";
const LI = "text-sm leading-relaxed text-black/80";

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h1 className="text-2xl sm:text-3xl font-black mb-4">개인정보처리방침</h1>
      <p className={P}>
        이 문서는 준이아빠블로그(digitalmarketer.co.kr, 이하 &quot;블로그&quot;)가
        뉴스레터 구독 과정에서 처리하는 개인정보의 항목, 목적, 보유 기간을 설명하는
        개인정보처리방침입니다.
      </p>

      <h2 className={SECTION_TITLE}>1. 수집하는 항목과 방법</h2>
      <p className={P}>
        뉴스레터 구독 폼과 스티비 구독 페이지에서 아래 항목을 수집합니다.
      </p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li className={LI}>
          <strong>필수:</strong> 이메일 주소, 광고성 정보 수신 동의 여부와 동의 시각
        </li>
        <li className={LI}>
          <strong>선택:</strong> 산업군, 직무, 연차 (입력하지 않아도 구독할 수 있습니다)
        </li>
        <li className={LI}>
          <strong>자동:</strong> 구독을 신청한 페이지 위치, 뉴스레터 안의 링크 선택 기록
        </li>
      </ul>

      <h2 className={SECTION_TITLE}>2. 이용 목적</h2>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li className={LI}>뉴스레터(광고성 정보 포함) 발송</li>
        <li className={LI}>관심사와 직무에 맞는 콘텐츠 구성</li>
        <li className={LI}>익명 통계 작성 (개인을 식별하지 않는 형태로만 공개)</li>
      </ul>

      <h2 className={SECTION_TITLE}>3. 보유 기간</h2>
      <p className={P}>
        수신거부하거나 삭제를 요청하면 지체 없이 파기합니다. 그 외에는 구독이 유지되는
        동안 보관합니다.
      </p>

      <h2 className={SECTION_TITLE}>4. 처리 위탁과 국외 보관</h2>
      <p className={P}>수집한 정보는 아래 서비스에 위탁해 처리됩니다.</p>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li className={LI}>
          <strong>스티비 주식회사</strong>: 이메일 발송과 구독자 관리
        </li>
        <li className={LI}>
          <strong>Neon Inc.</strong>: 구독자 데이터 보관 (국외 클라우드 서버에 보관될
          수 있습니다)
        </li>
      </ul>

      <h2 className={SECTION_TITLE}>5. 수신거부와 정보주체의 권리</h2>
      <ul className="list-disc pl-5 space-y-1 mb-3">
        <li className={LI}>
          모든 뉴스레터 하단의 수신거부 링크로 언제든 수신을 중단할 수 있습니다
        </li>
        <li className={LI}>
          본인의 정보에 관한 열람, 정정, 삭제는 아래 문의 경로로 요청할 수 있고,
          확인 후 지체 없이 처리합니다
        </li>
      </ul>

      <h2 className={SECTION_TITLE}>6. 문의</h2>
      <p className={P}>
        받으신 뉴스레터에 답장을 보내시거나,{" "}
        <a
          href={KAKAO_INQUIRY_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="underline font-bold"
        >
          카카오톡 문의 채널
        </a>
        로 연락해 주세요.
      </p>

      <h2 className={SECTION_TITLE}>7. 고지</h2>
      <p className={P}>
        이 방침은 2026년 8월 17일부터 적용됩니다. 내용이 바뀌면 이 페이지에서
        시행일과 함께 알립니다.
      </p>
    </main>
  );
}
