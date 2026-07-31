"use client";

/**
 * AIPBL 공용 시뮬레이션 채팅 프리미티브.
 * AI 응답은 각 AIPBL의 사전 구성 대본(lab-data.ts)을 타이핑 스트리밍으로 재생한다. 실제 AI 호출은 없다.
 * 안내(note)와 진행 버튼도 채팅 스트림 안에 넣어, 채팅 밖에서 카드가 생기고 사라지며
 * 레이아웃이 흔들리는 일을 없앤다. 채팅 영역은 항상 고정 높이다.
 */

import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";
import { BTN_PRIMARY_SM } from "./ui";

export type Block =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "pre"; text: string };

export interface ChatMsg {
  id: string;
  role: "user" | "ai" | "note";
  text?: string;
  blocks?: Block[];
  actionLabel?: string;
  actionId?: string;
  actionUsed?: boolean;
}

/* ===== 타이핑 스트리밍 텍스트 ===== */

interface StreamedTextProps {
  text: string;
  onDone?: () => void;
  tickMs?: number;
  chunk?: number;
}

export function StreamedText({ text, onDone, tickMs = 24, chunk = 2 }: StreamedTextProps) {
  const [count, setCount] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCount((c) => {
        const next = Math.min(c + chunk, text.length);
        if (next >= text.length) clearInterval(timer);
        return next;
      });
    }, tickMs);
    return () => clearInterval(timer);
  }, [text, tickMs, chunk]);

  useEffect(() => {
    if (count >= text.length && !firedRef.current) {
      firedRef.current = true;
      onDone?.();
    }
  }, [count, text.length, onDone]);

  const done = count >= text.length;
  return (
    <span>
      {text.slice(0, count)}
      {!done && <span className="ap-caret" aria-hidden />}
    </span>
  );
}

/* ===== 항목이 하나씩 나타나는 목록 ===== */

function StreamedList({ items, onDone }: { items: string[]; onDone?: () => void }) {
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (shown >= items.length) {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => setShown((n) => n + 1), 320);
    return () => clearTimeout(t);
  }, [shown, items.length, onDone]);

  return <ListView items={items.slice(0, shown)} animated />;
}

function ListView({ items, animated = false }: { items: string[]; animated?: boolean }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li
          key={item}
          className={`flex items-start gap-2 text-sm leading-relaxed ${animated ? "ap-fade-up" : ""}`}
        >
          <span className="mt-[9px] w-1 h-1 rounded-full bg-[#a78bfa] flex-shrink-0" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/* ===== 행이 하나씩 나타나는 표 ===== */

interface TableProps {
  headers: string[];
  rows: string[][];
}

function StreamedTable({ headers, rows, onDone }: TableProps & { onDone?: () => void }) {
  const [shown, setShown] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (shown >= rows.length) {
      if (!firedRef.current) {
        firedRef.current = true;
        onDone?.();
      }
      return;
    }
    const t = setTimeout(() => setShown((n) => n + 1), 360);
    return () => clearTimeout(t);
  }, [shown, rows.length, onDone]);

  return <TableView headers={headers} rows={rows.slice(0, shown)} animated />;
}

function TableView({ headers, rows, animated = false }: TableProps & { animated?: boolean }) {
  return (
    <div className="overflow-x-auto rounded-[12px] border border-white/10">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-white/10 bg-white/5">
            {headers.map((h) => (
              <th
                key={h}
                className="px-3.5 py-2.5 text-left font-medium text-[var(--ap-muted)] whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.join("|")}
              className={`border-b border-white/[0.06] last:border-b-0 ${animated ? "ap-fade-up" : ""}`}
            >
              {row.map((cell, ci) => (
                <td key={ci} className="px-3.5 py-2.5 align-top leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ===== 블록 시퀀스 스트리밍 ===== */

function BlockView({
  block,
  streaming,
  onDone,
}: {
  block: Block;
  streaming: boolean;
  onDone: () => void;
}) {
  if (block.type === "p") {
    return (
      <p className="text-sm leading-relaxed">
        {streaming ? <StreamedText text={block.text} onDone={onDone} /> : block.text}
      </p>
    );
  }
  if (block.type === "pre") {
    return (
      <pre className="ap-prompt p-4 overflow-x-auto whitespace-pre-wrap">
        {streaming ? <StreamedText text={block.text} onDone={onDone} tickMs={16} chunk={3} /> : block.text}
      </pre>
    );
  }
  if (block.type === "list") {
    return streaming ? (
      <StreamedList items={block.items} onDone={onDone} />
    ) : (
      <ListView items={block.items} />
    );
  }
  return streaming ? (
    <StreamedTable headers={block.headers} rows={block.rows} onDone={onDone} />
  ) : (
    <TableView headers={block.headers} rows={block.rows} />
  );
}

function AiBlocks({ blocks, onDone }: { blocks: Block[]; onDone?: () => void }) {
  const [current, setCurrent] = useState(0);
  const firedRef = useRef(false);

  useEffect(() => {
    if (current >= blocks.length && !firedRef.current) {
      firedRef.current = true;
      onDone?.();
    }
  }, [current, blocks.length, onDone]);

  return (
    <div className="space-y-3">
      {blocks.slice(0, Math.min(current + 1, blocks.length)).map((block, i) => (
        <BlockView
          key={i}
          block={block}
          streaming={i === current}
          onDone={() => setCurrent((c) => c + 1)}
        />
      ))}
    </div>
  );
}

/* ===== 말풍선 ===== */

function ThinkingDots() {
  return (
    <span className="inline-flex items-center gap-1.5 py-1" role="status" aria-label="응답 생성 중">
      <span className="ap-think-dot" />
      <span className="ap-think-dot" />
      <span className="ap-think-dot" />
    </span>
  );
}

function UserBubble({ text }: { text: string }) {
  return (
    <div className="flex justify-end ap-fade-up">
      <div className="max-w-[85%] ap-bubble-user px-4 py-3">
        <p className="text-sm leading-relaxed whitespace-pre-wrap text-white">{text}</p>
      </div>
    </div>
  );
}

/** 3D 스파클 아바타 (헤더, AI 말풍선 공용) */
function AiAvatar({ size = "w-8 h-8" }: { size?: string }) {
  return (
    <img
      src="/images/ai-practice/icons/sparkle-ai.png"
      alt=""
      aria-hidden
      className={`ap-icon-3d ${size}`}
    />
  );
}

/** 스크린리더 안내용: 블록 시퀀스를 평문 한 덩어리로 만든다 */
function blocksToText(blocks: Block[]): string {
  return blocks
    .map((b) => {
      if (b.type === "p" || b.type === "pre") return b.text;
      if (b.type === "list") return b.items.join(". ");
      return b.rows.map((row) => row.join(", ")).join(". ");
    })
    .join(" ");
}

function AiBubble({ blocks, onDone }: { blocks: Block[]; onDone?: () => void }) {
  const [thinking, setThinking] = useState(true);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setThinking(false), 850);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-start gap-3 ap-fade-up">
      <span className="mt-0.5">
        <AiAvatar />
      </span>
      <div className="max-w-[85%] min-w-0 ap-bubble-ai px-4 py-3 text-gray-200">
        {thinking ? (
          <ThinkingDots />
        ) : (
          <AiBlocks
            blocks={blocks}
            onDone={() => {
              setDone(true);
              onDone?.();
            }}
          />
        )}
        {/* 타이핑 스트리밍은 announce하지 않고, 완성된 응답만 한 번 알린다 */}
        {done && (
          <p className="sr-only" role="status">
            {blocksToText(blocks)}
          </p>
        )}
      </div>
    </div>
  );
}

/** 안내, 인사이트, 진행 버튼을 채팅 스트림 안에서 표시하는 메시지 */
function NoteBubble({ msg, onAction }: { msg: ChatMsg; onAction?: (id: string) => void }) {
  // 리렌더로 actionUsed가 반영되기 전의 연속 탭이 진행을 두 번 호출하지 않게 막는다
  const firedRef = useRef(false);

  const fireAction = () => {
    if (firedRef.current || !msg.actionId) return;
    firedRef.current = true;
    onAction?.(msg.actionId);
  };

  return (
    <div className="ap-fade-up ap-bubble-note px-4 py-3.5" role="status">
      <div className="flex items-start gap-2.5">
        <img
          src="/images/ai-practice/icons/bulb-note.png"
          alt=""
          aria-hidden
          className="ap-icon-3d ap-note-icon"
        />
        <div className="min-w-0">
          <p className="text-[13px] leading-relaxed text-gray-300 whitespace-pre-line">
            {msg.text}
          </p>
          {msg.actionLabel && msg.actionId && !msg.actionUsed && (
            <button type="button" onClick={fireAction} className={`${BTN_PRIMARY_SM} mt-3`}>
              {msg.actionLabel} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ===== 채팅 창 (항상 고정 높이) ===== */

interface ChatWindowProps {
  messages: ChatMsg[];
  /** 헤더에 표시할 실습 이름. 예: "프롬프트 기초 실습" */
  subtitle: string;
  onAiDone?: () => void;
  onAction?: (id: string) => void;
}

export function ChatWindow({ messages, subtitle, onAiDone, onAction }: ChatWindowProps) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  // 사용자가 위로 스크롤해 과거 내용을 읽는 동안에는 하단 고정을 멈춘다
  const stickRef = useRef(true);

  const handleScroll = () => {
    const el = bodyRef.current;
    if (!el) return;
    stickRef.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };

  // 스트리밍으로 내용 높이가 늘어나는 동안 하단에 붙어 있게 한다
  useEffect(() => {
    const el = bodyRef.current;
    const content = contentRef.current;
    if (!el || !content) return;
    const observer = new ResizeObserver(() => {
      if (stickRef.current) el.scrollTop = el.scrollHeight;
    });
    observer.observe(content);
    return () => observer.disconnect();
  }, []);

  // 새 메시지가 추가되면 (내가 보낸 프롬프트 포함) 항상 하단으로 이동한다
  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    stickRef.current = true;
    el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <div className="ap-chat">
      <div className="flex items-center gap-3 px-5 py-3.5 border-b border-white/[0.08]">
        <AiAvatar size="w-8 h-8" />
        <div>
          <p className="text-sm font-semibold text-white leading-tight">AIPBL 어시스턴트</p>
          <p className="text-[11px] text-[var(--ap-muted)]">{subtitle}</p>
        </div>
      </div>
      <div ref={bodyRef} onScroll={handleScroll} className="ap-chat-body px-5 py-5">
        <div ref={contentRef} className="space-y-4">
          {messages.map((m) => {
            if (m.role === "user") return <UserBubble key={m.id} text={m.text ?? ""} />;
            if (m.role === "ai") {
              return <AiBubble key={m.id} blocks={m.blocks ?? []} onDone={onAiDone} />;
            }
            return <NoteBubble key={m.id} msg={m} onAction={onAction} />;
          })}
        </div>
      </div>
    </div>
  );
}
