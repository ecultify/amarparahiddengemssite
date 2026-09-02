/** The IST calendar-day number — Guess the Para rotates on it. */
export const istDayIndex = () => Math.floor((Date.now() + 5.5 * 3_600_000) / 86_400_000);

export const istDateLabel = (dayIndex: number) =>
  new Date(dayIndex * 86_400_000).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
