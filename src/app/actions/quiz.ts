"use server";

import { getGemPhone } from "@/lib/auth";
import { getContent } from "@/lib/content";
import { istDayIndex } from "@/lib/quiz";
import { getUser, saveGuess, type Guess } from "@/lib/users";

export type GuessResult =
  | { ok: true; guess: Guess; answerLabel: string }
  | { ok: false; error: string };

/** Records today's guess against the verified number. One per day: a repeat
 *  call just returns what was already guessed, so clearing the browser can't
 *  earn a second try. */
export async function submitGuess(choice: "1" | "2" | "3" | "4"): Promise<GuessResult> {
  const phone = await getGemPhone();
  if (!phone) return { ok: false, error: "Verify your number first." };
  if (!["1", "2", "3", "4"].includes(choice)) return { ok: false, error: "Pick an option." };

  const { quiz } = await getContent();
  if (quiz.length === 0) return { ok: false, error: "There is no question today." };

  const day = istDayIndex();
  const question = quiz[day % quiz.length];
  const answerLabel =
    question[`option${question.answer}` as "option1" | "option2" | "option3" | "option4"];

  const existing = (await getUser(phone))?.guesses[String(day)];
  if (existing) return { ok: true, guess: existing, answerLabel };

  const guess: Guess = {
    day,
    at: new Date().toISOString(),
    question: question.question,
    choice,
    choiceLabel: question[`option${choice}` as "option1" | "option2" | "option3" | "option4"],
    correct: choice === question.answer,
  };
  await saveGuess(phone, guess);
  return { ok: true, guess, answerLabel };
}
