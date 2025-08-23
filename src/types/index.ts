
export type Font = 'Roboto Mono' | 'Fira Code' | 'Source Code Pro';

export interface TestResult {
  wpm: number;
  errorRate: number;
  duration: number;
  timestamp: Date;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}
