
export const fetchWPM = async (username: string) => {
  // Mock API call - replace with actual implementation
  return {
    wpm: 45,
    testsCompleted: 10,
    errorRate: 2.5,
    perfectTests: 3,
    cleanSessions: 5
  };
};

export const fetchHistory = async (username: string) => {
  // Mock API call - replace with actual implementation
  return [
    {
      id: 1,
      wpm: 45,
      errorRate: 2.5,
      duration: 60,
      date: new Date().toISOString()
    }
  ];
};
