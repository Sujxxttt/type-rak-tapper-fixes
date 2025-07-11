
import React from 'react';

interface HistoryEntry {
  id: number;
  wpm: number;
  errorRate: number;
  duration: number;
  date: string;
}

interface HistoryTableProps {
  history: HistoryEntry[];
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Date</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>WPM</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Error Rate</th>
            <th style={{ padding: '15px', textAlign: 'left', fontWeight: '600' }}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry, index) => (
            <tr
              key={entry.id}
              style={{
                borderBottom: index < history.length - 1 ? '1px solid rgba(255, 255, 255, 0.05)' : 'none'
              }}
            >
              <td style={{ padding: '12px 15px' }}>{formatDate(entry.date)}</td>
              <td style={{ padding: '12px 15px', fontWeight: '500' }}>{entry.wmp}</td>
              <td style={{ padding: '12px 15px' }}>{entry.errorRate.toFixed(2)}%</td>
              <td style={{ padding: '12px 15px' }}>{formatDuration(entry.duration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
