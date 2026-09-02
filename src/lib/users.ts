import { readJson, readJsonCollection, writeJson } from "@/lib/blob-store";

/** One guess in Guess the Para, snapshotted so the admin table can show it
 *  even after the question is edited. */
export type Guess = {
  day: number;
  at: string;
  question: string;
  choice: "1" | "2" | "3" | "4";
  choiceLabel: string;
  correct: boolean;
};

/** A visitor who verified their number — shared by the gem form and the quiz. */
export type QuizUser = {
  phone: string;
  firstSeen: string;
  lastSeen: string;
  /** Keyed by IST day number: one guess per day. */
  guesses: Record<string, Guess>;
};

const PREFIX = "users/";
const pathFor = (phone: string) => `${PREFIX}${phone.replace(/\D/g, "")}.json`;

export const getUser = (phone: string) => readJson<QuizUser>(pathFor(phone));

export const listUsers = () => readJsonCollection<QuizUser>(PREFIX);

/** Creates the user on first sight, refreshes lastSeen after. */
export async function touchUser(phone: string): Promise<QuizUser> {
  const now = new Date().toISOString();
  const existing = await getUser(phone);
  const user: QuizUser = existing
    ? { ...existing, lastSeen: now }
    : { phone: phone.replace(/\D/g, ""), firstSeen: now, lastSeen: now, guesses: {} };
  await writeJson(pathFor(phone), user);
  return user;
}

export async function saveGuess(phone: string, guess: Guess) {
  const user = (await getUser(phone)) ?? (await touchUser(phone));
  user.guesses[String(guess.day)] = guess;
  user.lastSeen = guess.at;
  await writeJson(pathFor(phone), user);
}
