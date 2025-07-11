
export const calculateWPM = (text: string, durationInSeconds: number): number => {
  if (durationInSeconds === 0) return 0;
  const wordCount = text.trim().split(/\s+/).length;
  return Math.round((wordCount / durationInSeconds) * 60);
};

export const calculateErrorRate = (originalText: string, typedText: string): number => {
  if (originalText.length === 0) return 0;
  
  let errors = 0;
  const maxLength = Math.max(originalText.length, typedText.length);
  
  for (let i = 0; i < maxLength; i++) {
    if (originalText[i] !== typedText[i]) {
      errors++;
    }
  }
  
  return (errors / originalText.length) * 100;
};
