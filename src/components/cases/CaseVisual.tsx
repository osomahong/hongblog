import type { CaseVisual as Visual } from "@/lib/case-visuals";

const tones = {
  sheet: { accent: "#18734C", pale: "#EDF6F0", symbol: "▦" },
  document: { accent: "#315EA8", pale: "#EFF4FC", symbol: "▤" },
  workspace: { accent: "#7044A0", pale: "#F4EFF9", symbol: "◫" },
  report: { accent: "#245B70", pale: "#EDF5F7", symbol: "▥" },
};

export function CaseVisual({ visual, number }: { visual: Visual; number: number }) {
  const tone = tones[visual.kind];
  const sheet = visual.kind === "sheet";
  return (
    <figure id={`figure-${visual.id}`} className="my-9 scroll-mt-24 [word-break:normal] leading-normal">
      <div className="flex items-center justify-between gap-3 mb-2 text-xs text-gray-500">
        <a href={`#figure-${visual.id}`} className="font-bold text-gray-700 underline underline-offset-4">그림 {number}. {visual.title}</a>
        <span className="shrink-0">설명용 목업</span>
      </div>
      <div role="region" aria-label={`${visual.title} 목업, 좌우로 스크롤하여 보기`} tabIndex={0} className="overflow-x-auto rounded-lg border border-[#CAD1DB] shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
        <div data-case-visual={visual.id} className="min-w-[640px] bg-[#F4F6F9] text-[#263346] font-sans text-[12px] leading-[1.6]">
          <div className="flex items-center justify-between border-b border-[#DBE1E8] bg-[#EAEFF4] px-4 py-2.5">
            <div className="flex items-center gap-1.5" aria-hidden="true"><i className="size-2 rounded-full bg-[#C5CCD5]" /><i className="size-2 rounded-full bg-[#C5CCD5]" /><i className="size-2 rounded-full bg-[#C5CCD5]" /></div>
            <span className="text-[10px] tracking-wide text-[#526174]">{visual.app}</span>
            <span className="text-[10px] text-[#526174]">VIEW / {String(number).padStart(2, "0")}</span>
          </div>
          <div className="flex items-center gap-3 border-b border-[#DBE1E8] bg-white px-5 py-3">
            <span aria-hidden="true" className="flex size-8 items-center justify-center rounded text-lg text-white" style={{ background: tone.accent }}>{tone.symbol}</span>
            <div><p className="font-bold text-[13px]">{visual.title}</p><p className="text-[10px] text-[#677487]">프로젝트 작업 화면</p></div>
            <span className="ml-auto rounded border px-2 py-1 text-[10px]" style={{ color: tone.accent, borderColor: tone.accent }}>예시 화면</span>
          </div>
          <div className="flex gap-5 border-b border-[#DBE1E8] bg-white px-5 text-[11px]">
            {visual.tabs.map((tab, i) => <span key={tab} className={`py-2 ${i === 0 ? "border-b-2 font-bold" : "text-[#697688]"}`} style={i === 0 ? { borderColor: tone.accent, color: tone.accent } : undefined}>{tab}</span>)}
          </div>
          {sheet && <div className="flex border-b border-[#DBE1E8] bg-white text-[10px] text-[#677487]"><span className="border-r px-5 py-1">A1</span><span className="px-3 py-1 italic">fx</span><span className="py-1">{visual.heading}</span></div>}
          <div className={visual.kind === "document" ? "px-8 py-5" : "p-5"}>
            <div className={visual.kind === "document" ? "border border-[#DEE4ED] bg-white px-6 py-6 shadow-sm" : ""}>
              <p className="mb-2 text-[9px] font-bold tracking-[0.12em]" style={{ color: tone.accent }}>{visual.eyebrow}</p>
              <h3 className="text-[18px] font-bold tracking-tight leading-snug text-[#182536]">{visual.heading}</h3>
              <p className="mt-2 mb-5 text-[11px] leading-relaxed text-[#627084]">{visual.intro}</p>
              {visual.columns && visual.rows && (
                <div className="overflow-hidden rounded border border-[#D9E0E8] bg-white">
                  <table className="w-full border-collapse text-left text-[11px]">
                    <caption className="sr-only">{visual.title}</caption>
                    <thead>
                      {sheet && <tr className="bg-[#F1F4F7] text-center text-[9px] text-[#788494]"><th className="w-7 border-r border-b border-[#D9E0E8]" aria-label="행 번호" />{visual.columns.map((col, i) => <th key={col} className="border-r border-b border-[#D9E0E8] py-1 font-normal">{String.fromCharCode(65 + i)}</th>)}</tr>}
                      <tr style={{ background: tone.pale }}>
                        {sheet && <th className="border-r border-[#D9E0E8] text-center font-normal text-[#788494]">1</th>}
                        {visual.columns.map(col => <th scope="col" key={col} className="border-b border-[#D9E0E8] px-3 py-2.5 font-bold whitespace-nowrap" style={{ color: tone.accent }}>{col}</th>)}
                      </tr>
                    </thead>
                    <tbody>{visual.rows.map((row, i) => <tr key={row[0]} className={i % 2 ? "bg-[#FAFBFD]" : "bg-white"}>
                      {sheet && <td className="border-r border-b border-[#E4E9EF] bg-[#F1F4F7] text-center text-[9px] text-[#788494]">{i + 2}</td>}
                      {row.map((cell, j) => j === 0 ? <th scope="row" key={j} className="border-b border-[#E4E9EF] px-3 py-3 font-medium">{cell}</th> : <td key={j} className="border-b border-[#E4E9EF] px-3 py-3 align-top">{cell}</td>)}
                    </tr>)}</tbody>
                  </table>
                </div>
              )}
              {visual.blocks && <div className={`grid gap-3 ${visual.rows ? "mt-4" : ""} ${visual.blocks.length > 1 ? "grid-cols-3" : "grid-cols-1"}`}>
                {visual.blocks.map((block, i) => <div key={block.label} className="relative overflow-hidden rounded border border-[#D9E0E8] bg-white">
                  <p className="px-4 pt-4 font-bold text-[10px]" style={{ color: tone.accent }}>{block.label}</p>
                  <div className="p-4"><p className="mb-3 font-bold text-[13px] leading-snug">{block.title}</p><p className="whitespace-pre-line text-[11px] leading-[1.9] text-[#526174]">{block.text}</p></div>
                  {visual.blocks!.length > 1 && <div className="px-4 pb-3 text-right text-[10px] text-[#8994A3]" aria-hidden="true">{String(i + 1).padStart(2, "0")} / {String(visual.blocks!.length).padStart(2, "0")}</div>}
                </div>)}
              </div>}
              <p className="mt-4 text-[11px] leading-relaxed text-[#627084]">{visual.note}</p>
            </div>
          </div>
          <div className="flex justify-between border-t border-[#DBE1E8] bg-white px-5 py-2 text-[9px] text-[#7B8796]"><span>준이아빠블로그 / 실무 사례</span><span>설명용으로 재구성한 화면</span></div>
        </div>
      </div>
      <p className="mt-2 text-[11px] text-gray-500 sm:hidden">화면을 좌우로 밀어 자세히 볼 수 있습니다.</p>
      <figcaption className="mt-3 text-[13px] leading-[1.7] text-gray-600">{visual.caption}</figcaption>
    </figure>
  );
}
