
import React from 'react';

interface HistoryPageProps {
  currentUser: string;
  onBack: () => void;
  theme: string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  currentUser,
  theme,
  onBack
}) => {
  const getButtonColor = () => {
    switch (theme) {
      case 'cosmic-nebula': return '#667eea';
      case 'midnight-black': return '#34495e';
      case 'cotton-candy-glow': return '#fd79a8';
      default: return '#667eea';
    }
  };

  // Get user's test history
  const history = JSON.parse(localStorage.getItem(`history_${currentUser}`) || '[]');

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
          <h2 style={{ margin: 0, fontSize: '2rem', color: 'white' }}>Test History for {currentUser}</h2>
          <button 
            onClick={onBack}
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
        
        {history.length === 0 ? (
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
              <div>Date</div>
              <div style={{ textAlign: 'center' }}>WPM</div>
              <div style={{ textAlign: 'center' }}>Accuracy</div>
              <div style={{ textAlign: 'center' }}>Errors</div>
              <div style={{ textAlign: 'center' }}>Duration</div>
            </div>
            
            {history.map((test: any, index: number) => (
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
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {new Date(test.date).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.wpm}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.accuracy}%
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.errors}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
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
