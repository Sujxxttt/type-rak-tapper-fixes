
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
  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '12px',
      padding: '20px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              Date
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              WPM
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              Error Rate
            </th>
            <th style={{ padding: '12px', textAlign: 'left', borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}>
              Duration
            </th>
          </tr>
        </thead>
        <tbody>
          {history.map((entry) => (
            <tr key={entry.id}>
              <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {new Date(entry.date).toLocaleDateString()}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {entry.wpm}
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {entry.errorRate.toFixed(2)}%
              </td>
              <td style={{ padding: '12px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                {entry.duration}s
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
