
export const fetchWPM = async (username: string) => {
  // Mock implementation - replace with actual API call
  return {
    wmp: 45,
    errorRate: 2.5,
    testsCompleted: 12,
    perfectTests: 3,
    cleanSessions: 8
  };
};

export const fetchHistory = async (username: string) => {
  // Mock implementation - replace with actual API call
  return [
    {
      id: 1,
      wpm: 45,
      errorRate: 2.5,
      duration: 120,
      date: new Date().toISOString()
    },
    {
      id: 2,
      wpm: 42,
      errorRate: 3.1,
      duration: 135,
      date: new Date(Date.now() - 86400000).toISOString()
    }
  ];
};
