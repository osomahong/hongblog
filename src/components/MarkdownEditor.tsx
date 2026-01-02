"use client";

import { useRef, useCallback, useState } from "react";
import { Bold, Italic, Heading2, Heading3, List, ListOrdered, Code, Link, Image, Quote, X, Upload, Loader2 } from "lucide-react";
import MarkdownRenderer from "./MarkdownRenderer";

type MarkdownEditorProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type ModalType = "image" | "link" | null;

export default function MarkdownEditor({ value, onChange, placeholder }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [modalType, setModalType] = useState<ModalType>(null);
  const [imageAlt, setImageAlt] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const insertText = useCallback((before: string, after: string = "", defaultText: string = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || defaultText;
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + before.length + selectedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  }, [value, onChange]);

  const insertAtLineStart = useCallback((prefix: string) => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const newText = value.substring(0, lineStart) + prefix + value.substring(lineStart);
    onChange(newText);
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length);
    }, 0);
  }, [value, onChange]);

  const uploadImage = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    setUploadError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) { setUploadError(data.error || "업로드 실패"); return null; }
      return data.url;
    } catch { setUploadError("업로드 중 오류가 발생했습니다."); return null; }
    finally { setIsUploading(false); }
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    insertText(`[${linkText || "링크"}](${linkUrl})`, "", "");
    setModalType(null); setLinkUrl(""); setLinkText("");
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const file = files[0];
    if (!file.type.startsWith("image/")) { setUploadError("이미지 파일만 업로드 가능합니다."); return; }
    const url = await uploadImage(file);
    if (url) {
      insertText(`![${imageAlt || "image"}](${url})\n`, "", "");
      setModalType(null);
      setImageAlt("");
    }
  };

  const dragCounterRef = useRef(0);
  
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current++;
    if (e.dataTransfer.types.includes("Files")) {
      setIsDragging(true);
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };
  
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current--;
    if (dragCounterRef.current === 0) {
      setIsDragging(false);
    }
  };
  
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith("image/")) {
      const url = await uploadImage(files[0]);
      if (url) insertText(`![image](${url})\n`, "", "");
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          const url = await uploadImage(file);
          if (url) insertText(`![image](${url})\n`, "", "");
        }
        return;
      }
    }
  };

  const openImageModal = () => {
    const textarea = textareaRef.current;
    if (textarea) setImageAlt(value.substring(textarea.selectionStart, textarea.selectionEnd) || "");
    setUploadError(null); setModalType("image");
  };

  const openLinkModal = () => {
    const textarea = textareaRef.current;
    if (textarea) setLinkText(value.substring(textarea.selectionStart, textarea.selectionEnd) || "");
    setModalType("link");
  };

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.ctrlKey || e.metaKey) {
      switch (e.key.toLowerCase()) {
        case "b": e.preventDefault(); insertText("**", "**", "텍스트"); break;
        case "i": e.preventDefault(); insertText("*", "*", "텍스트"); break;
        case "k": e.preventDefault(); openLinkModal(); break;
      }
    }
    if (e.key === "Tab") { e.preventDefault(); insertText("  ", "", ""); }
  }, [insertText]);

  const handleScroll = useCallback(() => {
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    if (!textarea || !preview) return;
    const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    preview.scrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
  }, []);

  return (
    <div className="border-4 border-black relative" onDragEnter={handleDragEnter} onDragOver={handleDragOver} onDragLeave={handleDragLeave} onDrop={handleDrop}>
      <div className="flex flex-wrap gap-1 p-2 bg-gray-100 border-b-4 border-black">
        <button type="button" onClick={() => insertText("**", "**", "텍스트")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="굵게 (Ctrl+B)"><Bold className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertText("*", "*", "텍스트")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="기울임 (Ctrl+I)"><Italic className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertAtLineStart("## ")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="제목2"><Heading2 className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertAtLineStart("### ")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="제목3"><Heading3 className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertAtLineStart("- ")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="목록"><List className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertAtLineStart("1. ")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="번호목록"><ListOrdered className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertText("`", "`", "code")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="코드"><Code className="w-4 h-4" /></button>
        <button type="button" onClick={() => insertAtLineStart("> ")} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="인용"><Quote className="w-4 h-4" /></button>
        <button type="button" onClick={openLinkModal} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black" title="링크 (Ctrl+K)"><Link className="w-4 h-4" /></button>
        <button type="button" onClick={openImageModal} className="p-2 hover:bg-gray-200 border-2 border-transparent hover:border-black bg-blue-50" title="이미지 삽입"><Image className="w-4 h-4" /></button>
        {isUploading && <div className="flex items-center gap-2 px-2 text-sm text-gray-500"><Loader2 className="w-4 h-4 animate-spin" />업로드 중...</div>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className={`border-r-0 lg:border-r-4 border-black relative ${isDragging ? "bg-blue-50" : ""}`}>
          {isDragging && (
            <div className="absolute inset-0 bg-blue-100/80 flex items-center justify-center z-10 pointer-events-none">
              <div className="text-center"><Upload className="w-12 h-12 mx-auto mb-2 text-blue-600" /><p className="font-bold text-blue-600">이미지를 여기에 놓으세요</p></div>
            </div>
          )}
          <textarea ref={textareaRef} value={value} onChange={(e) => onChange(e.target.value)} onKeyDown={handleKeyDown} onScroll={handleScroll} onPaste={handlePaste}
            className="w-full px-4 py-3 min-h-[500px] font-mono text-sm focus:outline-none resize-none"
            placeholder={placeholder || "마크다운을 입력하세요...\n\n💡 팁: 이미지를 드래그하거나 Ctrl+V로 붙여넣기 가능"} />
        </div>
        <div ref={previewRef} className="min-h-[500px] max-h-[500px] overflow-y-auto p-4 bg-gray-50">
          <div className="text-xs font-bold uppercase text-gray-400 mb-2">미리보기</div>
          {value ? <MarkdownRenderer content={value} /> : <p className="text-gray-400">내용을 입력하세요...</p>}
        </div>
      </div>

      {modalType === "image" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 w-full max-w-md mx-4" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase text-lg">이미지 삽입</h3>
              <button onClick={() => setModalType(null)} className="p-1 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold uppercase mb-1">대체 텍스트 (Alt)</label><input type="text" value={imageAlt} onChange={(e) => setImageAlt(e.target.value)} placeholder="이미지 설명" className="w-full px-3 py-2 border-4 border-black focus:outline-none" autoFocus /></div>
              <div className={`border-4 border-dashed p-6 text-center cursor-pointer ${isUploading ? "border-gray-300 bg-gray-50" : "border-gray-400 hover:border-black hover:bg-gray-50"}`}
                onClick={() => !isUploading && fileInputRef.current?.click()}>
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => handleFileSelect(e.target.files)} />
                {isUploading ? (
                  <div className="flex flex-col items-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400 mb-2" /><p className="text-sm text-gray-500">업로드 중...</p></div>
                ) : (
                  <><Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" /><p className="text-sm text-gray-600 font-medium">클릭하여 이미지 선택</p><p className="text-xs text-gray-400 mt-1">또는 드래그앤드롭 / 붙여넣기</p></>
                )}
              </div>
              {uploadError && <p className="text-red-600 text-sm font-bold">{uploadError}</p>}
              <button onClick={() => setModalType(null)} className="w-full px-4 py-2 border-4 border-black font-bold hover:bg-gray-100">취소</button>
            </div>
          </div>
        </div>
      )}

      {modalType === "link" && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white border-4 border-black p-6 w-full max-w-md mx-4" style={{ boxShadow: "8px 8px 0 black" }}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-black uppercase text-lg">링크 삽입</h3>
              <button onClick={() => setModalType(null)} className="p-1 hover:bg-gray-100"><X className="w-5 h-5" /></button>
            </div>
            <div className="space-y-4">
              <div><label className="block text-sm font-bold uppercase mb-1">링크 URL *</label><input type="url" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} placeholder="https://example.com" className="w-full px-3 py-2 border-4 border-black focus:outline-none" autoFocus /></div>
              <div><label className="block text-sm font-bold uppercase mb-1">링크 텍스트</label><input type="text" value={linkText} onChange={(e) => setLinkText(e.target.value)} placeholder="표시할 텍스트" className="w-full px-3 py-2 border-4 border-black focus:outline-none" /></div>
              <div className="flex gap-2"><button onClick={() => setModalType(null)} className="flex-1 px-4 py-2 border-4 border-black font-bold hover:bg-gray-100">취소</button><button onClick={handleInsertLink} disabled={!linkUrl} className="flex-1 px-4 py-2 bg-black text-white font-bold hover:bg-gray-800 disabled:bg-gray-400">삽입</button></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
