"use client";

import { useState, useCallback } from "react";
import { CircleHelp, CircleCheck, CircleX, RotateCcw } from "lucide-react";
import { sendGAEvent } from "@/lib/gtm";
import type { QuizQuestion } from "@/lib/schema";

interface ContentQuizProps {
  quiz: QuizQuestion[];
  contentType: "post" | "class";
  contentSlug: string;
  contentName: string;
}

const LABELS = ["A", "B", "C", "D", "E", "F"];

export function ContentQuiz({ quiz, contentType, contentSlug, contentName }: ContentQuizProps) {
  const [selected, setSelected] = useState<number | null>(null);

  const q = quiz[0];
  if (!q) return null;

  const answered = selected !== null;
  const isCorrect = answered && q.correctIndex === selected;

  const handleSelect = useCallback((optionIndex: number) => {
    if (selected !== null) return;
    setSelected(optionIndex);

    sendGAEvent("quiz_answer", {
      content_type: contentType,
      content_id: contentSlug,
      content_name: contentName,
      question_index: 0,
      selected_option: optionIndex,
      is_correct: q.correctIndex === optionIndex,
    });
  }, [selected, contentType, contentSlug, contentName, q.correctIndex]);

  const handleRetry = useCallback(() => {
    setSelected(null);

    sendGAEvent("quiz_retry", {
      content_type: contentType,
      content_id: contentSlug,
      content_name: contentName,
    });
  }, [contentType, contentSlug, contentName]);

  return (
    <div className="mt-6 sm:mt-8 bg-white border-0 sm:border-4 border-black sm:neo-shadow p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <CircleHelp className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
        <span className="font-bold text-sm sm:text-base tracking-tight">퀴즈</span>
      </div>

      {/* Question */}
      <p className="font-black text-base sm:text-lg mb-4 sm:mb-5 leading-snug">
        {q.question}
      </p>

      {/* Options */}
      <div className="space-y-2.5 sm:space-y-3">
        {q.options.map((option, idx) => {
          const isThisCorrect = idx === q.correctIndex;
          const isThisSelected = idx === selected;

          let containerClass =
            "w-full flex items-center gap-3 px-3 sm:px-4 py-3 sm:py-3.5 border-2 transition-all";
          let labelClass =
            "flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-xs sm:text-sm font-bold rounded-full border-2";
          let icon = null;

          if (!answered) {
            containerClass += " border-gray-200 hover:border-black hover:bg-accent cursor-pointer";
            labelClass += " border-gray-300 text-gray-500 bg-white";
          } else if (isThisCorrect) {
            containerClass += " border-green-500 bg-green-50";
            icon = <CircleCheck className="w-5 h-5 text-green-500 flex-shrink-0" />;
          } else if (isThisSelected) {
            containerClass += " border-red-400 bg-red-50";
            icon = <CircleX className="w-5 h-5 text-red-400 flex-shrink-0" />;
          } else {
            containerClass += " border-gray-100 bg-white opacity-50";
            labelClass += " border-gray-200 text-gray-300 bg-white";
          }

          return (
            <button
              key={idx}
              type="button"
              className={containerClass}
              onClick={() => handleSelect(idx)}
              disabled={answered}
            >
              {icon ?? (
                <span className={labelClass}>
                  {LABELS[idx]}
                </span>
              )}
              <span className={`text-sm sm:text-base text-left ${
                answered && !isThisCorrect && !isThisSelected ? "text-gray-400" : "text-foreground"
              }`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>

      {/* Result / Explanation */}
      {answered && (
        <div className={`mt-4 sm:mt-5 p-4 sm:p-5 border-2 ${
          isCorrect
            ? "bg-green-50 border-green-400"
            : "bg-red-50 border-red-400"
        }`}>
          <p className={`font-black text-sm sm:text-base mb-2 ${
            isCorrect ? "text-green-700" : "text-red-600"
          }`}>
            {isCorrect ? "정답입니다!" : "틀렸습니다."}
          </p>
          <p className="text-sm sm:text-[15px] text-muted-foreground leading-relaxed">
            {q.explanation}
          </p>
        </div>
      )}

      {/* Retry */}
      {answered && (
        <div className="mt-3 sm:mt-4">
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground underline underline-offset-4 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            다시 풀기
          </button>
        </div>
      )}
    </div>
  );
}
