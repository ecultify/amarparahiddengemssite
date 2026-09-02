"use client";

import { useState, useTransition } from "react";
import { Asset } from "@/components/ui/Asset";
import { submitGuess } from "@/app/actions/quiz";
import type { QuizEntry } from "@/lib/content";
import type { Guess } from "@/lib/users";

/**
 * The day's question. The guess is recorded server-side against the verified
 * number — one per day, and it survives any amount of browser clearing.
 */
export function QuizCard({
  question,
  initialGuess,
}: {
  question: QuizEntry;
  initialGuess: Guess | null;
}) {
  const [picked, setPicked] = useState<string | null>(initialGuess?.choice ?? null);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

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
    if (answered || pending) return;
    setError(null);
    startTransition(async () => {
      const result = await submitGuess(key as "1" | "2" | "3" | "4");
      if (!result.ok) {
        setError(result.error);
        return;
      }
      // The server's answer wins — a repeat play shows the original guess.
      setPicked(result.guess.choice);
    });
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
              disabled={answered || pending}
              className={`min-h-[52px] rounded-[8px] border-2 px-4 py-3 text-center font-display text-[16px] font-bold transition-colors duration-150 disabled:cursor-default ${state} ${pending && !answered ? "opacity-60" : ""}`}
            >
              {option.label}
            </button>
          );
        })}
      </div>

      {error ? <p className="font-body text-[13px] text-red">{error}</p> : null}

      {answered ? (
        <div className="flex flex-col items-center gap-1 text-center">
          <p className={`font-display text-[18px] font-extrabold ${correct ? "text-grass" : "text-red"}`}>
            {correct ? "Spot on! You know your paras." : `Not quite. It's ${answerLabel}.`}
          </p>
          <p className="font-body text-[14px] text-slate">
            Come back tomorrow for a new para to guess.
          </p>
        </div>
      ) : (
        <p className="font-body text-[13px] text-slate/70">
          {pending ? "Locking in your guess…" : "One guess per day — choose carefully."}
        </p>
      )}
    </div>
  );
}
