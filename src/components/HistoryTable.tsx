
import React from 'react';

interface HistoryEntry {
  wpm: number;
  errorRate: number;
  date: string;
  name?: string;
  score?: number;
  time?: number;
}

interface HistoryTableProps {
  history: HistoryEntry[];
  theme: string;
}

export const HistoryTable: React.FC<HistoryTableProps> = ({ history, theme }) => {
  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black': return '#c559f7';
      case 'cotton-candy-glow': return '#ff59e8';
      case 'cosmic-nebula':
      default: return '#b109d6';
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      overflowX: 'auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '15px',
        marginBottom: '15px',
        padding: '10px',
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: '8px',
        fontWeight: 'bold',
        color: 'white'
      }}>
        <div>Date</div>
        <div>WPM</div>
        <div>Error Rate</div>
        <div>Score</div>
      </div>
      
      {history.map((entry, index) => (
        <div key={index} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '15px',
          padding: '10px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          marginBottom: '8px',
          color: 'white'
        }}>
          <div>{new Date(entry.date).toLocaleDateString()}</div>
          <div style={{ color: getButtonColor(), fontWeight: 'bold' }}>{entry.wpm}</div>
          <div style={{ color: getButtonColor(), fontWeight: 'bold' }}>{entry.errorRate.toFixed(1)}%</div>
          <div style={{ color: getButtonColor(), fontWeight: 'bold' }}>{entry.score || 0}</div>
        </div>
      ))}
    </div>
  );
};
