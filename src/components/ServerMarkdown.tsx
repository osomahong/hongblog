import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";

type ServerMarkdownProps = {
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
  let result = content.replace(/```[\s\S]*?```|`[^`]+`/g, (m) => {
    saved.push(m);
    return `\x00CODE${saved.length - 1}\x00`;
  });
  result = result.replace(/(?:\*\*|＊＊)(.+?)(?:\*\*|＊＊)/g, "<strong>$1</strong>");
  result = result.replace(/\x00CODE(\d+)\x00/g, (_, i) => saved[Number(i)]);
  return result;
}

export default function ServerMarkdown({ content, className = "" }: ServerMarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw]}
        components={{
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
          p: ({ children }) => (
            <p className="mb-3 sm:mb-4 text-[13px] sm:text-base leading-[1.8] sm:leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-4 sm:pl-6 mb-3 sm:mb-4 space-y-1.5 sm:space-y-1">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-[13px] sm:text-base leading-[1.7] sm:leading-relaxed">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="relative my-4 sm:my-6 bg-amber-50 border-2 border-black rounded-lg px-5 sm:px-6 pt-8 sm:pt-10 pb-3 sm:pb-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] text-[13px] sm:text-base">
              <span className="absolute top-2 left-3 sm:left-4 text-3xl sm:text-4xl font-black text-amber-400 leading-none select-none" aria-hidden="true">&ldquo;</span>
              <div className="text-gray-700 [&>p]:mb-1.5 [&>p:last-child]:mb-0">
                {children}
              </div>
            </blockquote>
          ),
          code: ({ className: codeClassName, children, ...props }) => {
            return (
              <code
                className="bg-gray-200 px-1 sm:px-1.5 py-0.5 rounded text-[12px] sm:text-sm font-mono text-red-600"
                {...props}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="my-3 sm:my-4 p-3 sm:p-4 bg-gray-900 text-gray-100 rounded-lg border-2 border-black overflow-x-auto text-[11px] sm:text-sm">
              {children}
            </pre>
          ),
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
          hr: () => <hr className="my-4 sm:my-6 border-t-2 border-black" />,
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
          strong: ({ children }) => (
            <strong className="font-bold">{children}</strong>
          ),
          em: ({ children }) => <em className="italic">{children}</em>,
        }}
      >
        {preprocessMarkdown(content)}
      </ReactMarkdown>
    </div>
  );
}
