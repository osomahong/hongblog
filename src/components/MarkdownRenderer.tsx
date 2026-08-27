"use client";

import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy, Check } from "lucide-react";
import { ImageLightbox, type LightboxImage } from "@/components/ImageLightbox";
import { SITE_URL } from "@/lib/constants";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-1.5 rounded bg-gray-700/60 hover:bg-gray-600 text-gray-300 hover:text-white transition-colors"
      aria-label="코드 복사"
    >
      {copied ? <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-400" /> : <Copy className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
    </button>
  );
}

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

/**
 * CommonMark strict 파싱에서 닫는 ** 앞에 괄호 등 구두점이 오고
 * 뒤에 한글·CJK 문자가 바로 이어지면 right-flanking delimiter로
 * 인식되지 않는 문제를 해결한다.
 *
 * 코드 블록(```)과 인라인 코드(`)를 보호한 뒤,
 * 모든 **text** 패턴을 <strong> HTML 태그로 변환한다.
 */
function preprocessMarkdown(content: string): string {
  const saved: string[] = [];
  // 1. 코드 블록·인라인 코드를 플레이스홀더로 대체
  let result = content.replace(/```[\s\S]*?```|`[^`]+`/g, (m) => {
    saved.push(m);
    return `\x00CODE${saved.length - 1}\x00`;
  });
  // 2. 모든 **text** → <strong>text</strong> (전각 별표 ＊＊ 포함)
  result = result.replace(/(?:\*\*|＊＊)(.+?)(?:\*\*|＊＊)/g, "<strong>$1</strong>");
  // 3. 플레이스홀더 복원
  result = result.replace(/\x00CODE(\d+)\x00/g, (_, i) => saved[Number(i)]);
  return result;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  const [lightbox, setLightbox] = useState<LightboxImage | null>(null);

  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[[remarkGfm, { singleTilde: false }]]}
        rehypePlugins={[rehypeRaw]}
        components={{
          // 헤딩
          h1: ({ children }) => (
            <h1 className="text-2xl sm:text-3xl font-black mt-6 sm:mt-8 mb-3 sm:mb-4 border-b-4 border-black pb-2 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-xl sm:text-2xl font-black mt-5 sm:mt-8 mb-2.5 sm:mb-4 border-b-2 border-black pb-2 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-lg sm:text-xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3 leading-snug">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-base sm:text-lg font-bold mt-3 sm:mt-4 mb-1.5 sm:mb-2 leading-snug">{children}</h4>
          ),

          // 문단
          p: ({ children }) => (
            <p className="mb-3 sm:mb-4 text-sm sm:text-base leading-[1.8] sm:leading-relaxed">{children}</p>
          ),

          // 리스트
          ul: ({ children }) => (
            <ul className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-sm sm:text-base leading-[1.7] sm:leading-relaxed">{children}</li>
          ),

          // 인용 (callout box)
          blockquote: ({ children }) => (
            <blockquote className="relative my-4 sm:my-6 bg-gray-50 border-2 border-black rounded-lg px-5 sm:px-6 pt-8 sm:pt-10 pb-3 sm:pb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-sm sm:text-base">
              <span className="absolute top-2 left-3 sm:left-4 text-3xl sm:text-4xl font-black text-[#FF0033] leading-none select-none" aria-hidden="true">&ldquo;</span>
              <div className="text-gray-700 [&>p]:mb-1.5 [&>p:last-child]:mb-0">
                {children}
              </div>
            </blockquote>
          ),

          // pre 태그: code 컴포넌트가 직접 블록 스타일링을 처리하므로 래퍼만 전달
          pre: ({ children }) => <>{children}</>,

          // 코드
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const codeString = String(children).replace(/\n$/, "");
            const isBlock = match || codeString.includes("\n");

            // 인라인 코드
            if (!isBlock) {
              return (
                <code
                  className="bg-gray-200 px-1 sm:px-1.5 py-0.5 rounded text-[13px] sm:text-sm font-mono text-[#FF0033]"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            // 언어 태그 있는 코드 블록 → macOS 윈도우 스타일 + 구문 강조
            if (match) {
              return (
                <div className="my-3 sm:my-4 rounded-lg border-2 border-black overflow-hidden">
                  <div className="flex items-center gap-1.5 px-3 py-2 bg-[#282c34] border-b border-gray-700">
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ff5f56]" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#ffbd2e]" />
                    <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#27c93f]" />
                  </div>
                  <div className="relative">
                  <CopyButton text={codeString} />
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    className="!my-0 !rounded-none !border-0 text-xs sm:text-sm overflow-x-auto"
                  >
                    {codeString}
                  </SyntaxHighlighter>
                  </div>
                </div>
              );
            }

            // 언어 태그 없는 코드 블록 → 단순 다크 배경
            return (
              <div className="relative my-3 sm:my-4 rounded-lg border-2 border-black overflow-hidden group">
                <CopyButton text={codeString} />
                <SyntaxHighlighter
                  style={oneDark}
                  language="text"
                  PreTag="div"
                  className="!my-0 !rounded-none !border-0 text-xs sm:text-sm overflow-x-auto"
                >
                  {codeString}
                </SyntaxHighlighter>
              </div>
            );
          },

          // 링크
          a: ({ href, id, children }) => {
            // id만 있고 href가 없으면 페이지 내 점프 타깃 (보이지 않는 anchor)
            if (!href) {
              return <a id={id} aria-hidden="true" />;
            }
            const isFragment = href.startsWith("#");
            const isInternal = href.startsWith("/") || href.startsWith(SITE_URL);
            const opensNewTab = !isFragment && !isInternal;
            return (
              <a
                href={href}
                id={id}
                target={opensNewTab ? "_blank" : undefined}
                rel={opensNewTab ? "noopener noreferrer" : undefined}
                className="text-[#FF0033] underline underline-offset-2 decoration-2 hover:bg-[#FF0033] hover:text-white hover:no-underline transition-colors font-medium text-sm sm:text-base px-0.5"
              >
                {children}
              </a>
            );
          },

          // 이미지
          img: ({ src, alt, title }) => {
            if (!src) return null;
            if (process.env.NODE_ENV !== "production" && !alt) {
              console.warn(`[MarkdownRenderer] 이미지 alt 속성 누락: ${src}`);
            }
            const effectiveAlt = alt || title || "";

            // 영상 파일은 GIF 대체용 무음 자동 반복 재생으로 렌더링한다.
            // 같은 길이 기준 GIF보다 용량이 10분의 1 수준이고 화질도 낫다.
            if (typeof src === "string" && /\.(mp4|webm)$/i.test(src)) {
              return (
                <video
                  src={src}
                  aria-label={effectiveAlt}
                  title={title}
                  className="block max-w-[min(80%,640px)] h-auto mx-auto my-3 sm:my-4 border-2 border-black rounded"
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              );
            }

            // 폭 80% + 절대 상한 640px: 포커스 모드에서 본문이 넓어져도 이미지는 커지지 않는다.
            // 상한 때문에 스크린샷 글씨가 작아지므로 클릭하면 라이트박스로 크게 연다.
            return (
              <button
                type="button"
                onClick={() => setLightbox({ src: String(src), alt: effectiveAlt })}
                aria-label={effectiveAlt ? `${effectiveAlt} 크게 보기` : "이미지 크게 보기"}
                className="block w-full max-w-[min(80%,640px)] mx-auto my-3 sm:my-4 cursor-zoom-in"
              >
                <img
                  src={src}
                  alt={effectiveAlt}
                  title={title}
                  className="block max-w-full h-auto mx-auto border-2 border-black rounded"
                  loading="lazy"
                  decoding="async"
                />
              </button>
            );
          },

          // 수평선
          hr: () => <hr className="my-4 sm:my-6 border-t-2 border-black" />,

          // 테이블 (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 sm:my-4 -mx-0 sm:mx-0 px-0 sm:px-0">
              <table className="w-full border-collapse border-2 border-black min-w-[400px] sm:min-w-0">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-black text-white">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-b-[3px] border-black px-2 sm:px-3 py-2 sm:py-3 text-left font-black uppercase text-xs sm:text-sm whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-b border-gray-300 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm">{children}</td>
          ),

          // 강조
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
          del: ({ children }) => <>{children}</>,
        }}
      >
        {preprocessMarkdown(content)}
      </ReactMarkdown>
      {lightbox && (
        <ImageLightbox image={lightbox} onClose={() => setLightbox(null)} />
      )}
    </div>
  );
}
