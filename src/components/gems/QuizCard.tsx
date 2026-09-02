"use client";

import { useEffect, useState } from "react";
import { Asset } from "@/components/ui/Asset";
import type { QuizEntry } from "@/lib/content";

/**
 * The day's question. One guess per day, remembered in localStorage — the
 * result screen survives a reload but a new IST day brings a fresh question.
 */
export function QuizCard({ question, dayKey }: { question: QuizEntry; dayKey: string }) {
  const storageKey = `guess-the-para:${dayKey}`;
  const [picked, setPicked] = useState<string | null>(null);

  // Hydration-safe restore: the server renders the unanswered state, then the
  // stored guess (if any) is applied after mount.
  useEffect(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from localStorage, unavailable during SSR
      if (stored) setPicked(stored);
    } catch {
      /* private mode — the quiz just allows re-guessing after reload */
    }
  }, [storageKey]);

  const options = [
    { key: "1", label: question.option1 },
    { key: "2", label: question.option2 },
    { key: "3", label: question.option3 },
    { key: "4", label: question.option4 },
  ].filter((option) => option.label);

  const answered = picked !== null;
  const correct = picked === question.answer;
  const answerLabel = options.find((option) => option.key === question.answer)?.label;

  function guess(key: string) {
    if (answered) return;
    setPicked(key);
    try {
      localStorage.setItem(storageKey, key);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-6 rounded-[20px] bg-white p-6 shadow-[0_12px_16px_rgba(27,42,74,0.06)] sm:p-10">
      {question.image ? (
        <Asset
          src={question.image}
          alt="Today's para clue"
          className="h-[210px] w-full rounded-[12px] object-cover sm:h-[280px]"
        />
      ) : null}

      <p className="text-center font-display text-[20px] leading-snug font-extrabold text-navy sm:text-[24px]">
        {question.question}
      </p>

      <div className="grid w-full gap-3 sm:grid-cols-2">
        {options.map((option) => {
          const isAnswer = option.key === question.answer;
          const isPicked = option.key === picked;
          const state = !answered
            ? "border-line bg-white text-navy hover:border-pink"
            : isAnswer
              ? "border-grass bg-grass/8 text-navy"
              : isPicked
                ? "border-red bg-red/8 text-navy"
                : "border-line bg-white text-slate opacity-60";
          return (
            <button
              key={option.key}
              type="button"
              onClick={() => guess(option.key)}
              disabled={answered}
              className={`min-h-[52px] rounded-[8px] border-2 px-4 py-3 text-center font-display text-[16px] font-bold transition-colors duration-150 ${state}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className={`font-display text-[18px] font-extrabold ${correct ? "text-grass" : "text-red"}`}>
            {correct ? "Spot on! You know your paras." : `Not quite — it's ${answerLabel}.`}
          </p>
          <p className="font-body text-[14px] text-slate">
            Come back tomorrow for a new para to guess.
          </p>
        </div>
      ) : (
        <p className="font-body text-[13px] text-slate/70">One guess per day — choose carefully.</p>
      )}
    </div>
  );
}
