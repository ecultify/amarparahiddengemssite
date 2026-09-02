"use client";

import { useRouter } from "next/navigation";
import { PhoneVerify } from "@/components/gems/PhoneVerify";

/** Shown when there is no visitor session yet. PhoneVerify sets the shared
 *  session cookie server-side; a refresh then re-renders the page with the
 *  quiz in place of this gate. */
export function QuizGate() {
  const router = useRouter();

  return (
    <div className="flex w-full max-w-[640px] flex-col items-center gap-6 rounded-[20px] bg-white p-6 shadow-[0_12px_16px_rgba(27,42,74,0.06)] sm:p-10">
      <div className="flex flex-col items-center gap-2 text-center">
        <p className="font-display text-[20px] leading-snug font-extrabold text-navy sm:text-[24px]">
          Verify your number to play
        </p>
        <p className="max-w-[440px] font-body text-[14px] leading-[1.6] text-slate">
          Guess the Para uses the same verification as the hidden gem form — if you just submitted
          a gem, you&apos;re already in.
        </p>
      </div>
      <PhoneVerify verified={false} onVerified={() => router.refresh()} />
    </div>
  );
}
