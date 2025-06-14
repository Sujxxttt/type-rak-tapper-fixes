
import React from 'react';

interface HistoryPageProps {
  username: string;
  onClose: () => void;
  theme: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  username,
  onClose,
  theme
}) => {
  const getButtonColor = () => {
    switch (theme) {
      case 'midnight-black':
        return 'linear-gradient(135deg, #868686 0%, #3b3b3b 100%)';
      case 'cotton-candy-glow':
        return 'linear-gradient(135deg, #ffcce7 0%, #ff99c6 100%)';
      default:
        return 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
    }
  };

  const getHistory = () => {
    const existingHistory = localStorage.getItem(`${username}-history`);
    return existingHistory ? JSON.parse(existingHistory) : [];
  };

  const allTestHistory = getHistory();

  return (
    <div style={{
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '20px 0',
      flex: 1,
      minHeight: '80vh'
    }}>
      <div style={{
        width: '90%',
        maxWidth: '900px',
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '30px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>Test History - {username}</h2>
          <button 
            onClick={onClose}
            style={{
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Back to Dashboard
          </button>
        </div>
        
        {allTestHistory.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: '1.2rem', opacity: 0.8, color: 'white' }}>No test history available.</p>
          </div>
        ) : (
          <div style={{ maxHeight: '65vh', overflowY: 'auto' }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
              gap: '15px',
              marginBottom: '20px',
              padding: '15px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              fontWeight: 'bold',
              color: 'white'
            }}>
              <div>Date & Time</div>
              <div style={{ textAlign: 'center' }}>WPM</div>
              <div style={{ textAlign: 'center' }}>Errors</div>
              <div style={{ textAlign: 'center' }}>Accuracy</div>
              <div style={{ textAlign: 'center' }}>Duration</div>
            </div>
            
            {allTestHistory.slice().reverse().map((test: any, index: number) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '15px',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                transition: 'background 0.2s ease',
                color: 'white'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{test.date}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {test.time}
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#6366f1' }}>
                  {test.wpm}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#6366f1' }}>
                  {test.errors}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#6366f1' }}>
                  {test.accuracy}%
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: '#6366f1' }}>
                  {test.duration}s
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
