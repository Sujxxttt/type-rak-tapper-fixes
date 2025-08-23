
import { useState, useCallback } from 'react';

const commonWords = [
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i',
  'it', 'for', 'not', 'on', 'with', 'he', 'as', 'you', 'do', 'at',
  'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she',
  'or', 'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what',
  'so', 'up', 'out', 'if', 'about', 'who', 'get', 'which', 'go', 'me',
  'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know', 'take',
  'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also',
  'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first', 'well', 'way',
  'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us'
];

export const useTestWords = (testLength: number) => {
  const [words, setWords] = useState<string[]>([]);

  const generateWords = useCallback(() => {
    const newWords: string[] = [];
    for (let i = 0; i < testLength; i++) {
      const randomIndex = Math.floor(Math.random() * commonWords.length);
      newWords.push(commonWords[randomIndex]);
    }
    return newWords;
  }, [testLength]);

  const newTest = useCallback(() => {
    setWords(generateWords());
  }, [generateWords]);

  // Initialize words on first load
  useState(() => {
    setWords(generateWords());
  });

  return {
    words,
    newTest
  };
};
