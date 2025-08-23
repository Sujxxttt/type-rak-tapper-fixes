
export const calculateWPM = (wordCount: number, timeElapsed: number): number => {
  if (timeElapsed === 0) return 0;
  const minutes = timeElapsed / 60;
  return Math.round(wordCount / minutes);
};

export const calculateErrorPercentage = (errors: number, totalTyped: string): number => {
  if (totalTyped.length === 0) return 0;
  return (errors / totalTyped.length) * 100;
};
