
export interface LeaderboardEntry {
  username: string;
  wpm: number;
}

export interface HistoryEntry {
  wpm: number;
  errorRate: number;
  date: string;
  name: string;
  score: number;
  time: number;
}

export const fetchLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  // Mock data for now
  return [
    { username: "TypeMaster", wpm: 95 },
    { username: "SpeedTyper", wpm: 87 },
    { username: "QuickFingers", wpm: 82 }
  ];
};

export const fetchHistory = async (username: string): Promise<HistoryEntry[]> => {
  // Mock data for now
  const savedData = localStorage.getItem(`typing-history-${username}`);
  return savedData ? JSON.parse(savedData) : [];
};
