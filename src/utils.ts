
export const calculateWPM = (text: string, timeInSeconds: number): number => {
  if (timeInSeconds === 0) return 0;
  const words = text.trim().split(/\s+/).length;
  return Math.round((words / timeInSeconds) * 60);
};

export const calculateErrorRate = (originalText: string, typedText: string): number => {
  if (originalText.length === 0) return 0;
  
  let errors = 0;
  const minLength = Math.min(originalText.length, typedText.length);
  
  for (let i = 0; i < minLength; i++) {
    if (originalText[i] !== typedText[i]) {
      errors++;
    }
  }
  
  // Add remaining characters as errors
  errors += Math.abs(originalText.length - typedText.length);
  
  return (errors / originalText.length) * 100;
};
