
import React from 'react';

interface TestResult {
  wpm: number;
  errorRate: number;
}

interface TestHistoryProps {
  testHistory: TestResult[];
  theme: string;
  getButtonColor: () => string;
}

export const TestHistory: React.FC<TestHistoryProps> = ({
  testHistory,
  theme,
  getButtonColor
}) => {
  return (
    <div style={{
      width: '100%',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px',
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>Test History</h2>
      
      {testHistory.length === 0 ? (
        <p style={{ color: 'white', opacity: 0.7 }}>No tests completed yet.</p>
      ) : (
        <div>
          {testHistory.map((test, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '10px',
              margin: '5px 0',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              color: 'white'
            }}>
              <span>Test {testHistory.length - index}</span>
              <span>{test.wpm} WPM</span>
              <span>{test.errorRate.toFixed(1)}% errors</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
