"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

type MarkdownRendererProps = {
  content: string;
  className?: string;
};

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 헤딩
          h1: ({ children }) => (
            <h1 className="text-xl sm:text-3xl font-black uppercase mt-6 sm:mt-8 mb-3 sm:mb-4 border-b-4 border-black pb-2 leading-tight">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg sm:text-2xl font-black uppercase mt-5 sm:mt-8 mb-2.5 sm:mb-4 border-b-2 border-black pb-2 leading-tight">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base sm:text-xl font-bold mt-4 sm:mt-6 mb-2 sm:mb-3 leading-snug">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm sm:text-lg font-bold mt-3 sm:mt-4 mb-1.5 sm:mb-2 leading-snug">{children}</h4>
          ),

          // 문단
          p: ({ children }) => (
            <p className="mb-3 sm:mb-4 text-[13px] sm:text-base leading-[1.8] sm:leading-relaxed">{children}</p>
          ),

          // 리스트
          ul: ({ children }) => (
            <ul className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[13px] sm:text-base leading-[1.7] sm:leading-relaxed">{children}</li>
          ),

          // 인용
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-black pl-3 sm:pl-4 my-3 sm:my-4 text-gray-600 italic bg-gray-50 py-2 pr-3 sm:pr-4 text-[13px] sm:text-base">
              {children}
            </blockquote>
          ),

          // 코드
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || "");
            const isInline = !match;

            if (isInline) {
              return (
                <code
                  className="bg-gray-200 px-1 sm:px-1.5 py-0.5 rounded text-[12px] sm:text-sm font-mono text-red-600"
                  {...props}
                >
                  {children}
                </code>
              );
            }

            return (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                className="!my-3 sm:!my-4 !rounded-lg border-2 border-black text-[11px] sm:text-sm overflow-x-auto"
              >
                {String(children).replace(/\n$/, "")}
              </SyntaxHighlighter>
            );
          },

          // 링크
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline hover:text-blue-800 font-medium text-[13px] sm:text-base"
            >
              {children}
            </a>
          ),

          // 이미지
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <img
                src={src}
                alt={alt || ""}
                className="max-w-full h-auto my-3 sm:my-4 border-2 border-black rounded"
                loading="lazy"
              />
            );
          },

          // 수평선
          hr: () => <hr className="my-4 sm:my-6 border-t-2 border-black" />,

          // 테이블 (GFM)
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 sm:my-4 -mx-3 sm:mx-0 px-3 sm:px-0">
              <table className="w-full border-collapse border-2 border-black min-w-[400px] sm:min-w-0">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="border-2 border-black px-2 sm:px-3 py-1.5 sm:py-2 text-left font-bold text-[11px] sm:text-sm whitespace-nowrap">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border-2 border-black px-2 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-sm">{children}</td>
          ),

          // 강조
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
