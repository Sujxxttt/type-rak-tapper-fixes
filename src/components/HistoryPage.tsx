
import React from 'react';

interface HistoryPageProps {
  onClose?: () => void;
  onBack?: () => void;
  allTestHistory?: any[];
  theme?: string;
  getButtonColor?: () => string;
}

export const HistoryPage: React.FC<HistoryPageProps> = ({
  onClose,
  onBack,
  allTestHistory = [],
  theme = 'cosmic-nebula',
  getButtonColor = () => '#a3b18a'
}) => {
  const handleBack = () => {
    if (onBack) onBack();
    if (onClose) onClose();
  };

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
          <h2 style={{ margin: 0, fontSize: '2rem' }}>Test History</h2>
          <button 
            onClick={handleBack}
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
            <p style={{ fontSize: '1.2rem', opacity: 0.8 }}>No test history available.</p>
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
              fontWeight: 'bold'
            }}>
              <div>Test Name & Date</div>
              <div style={{ textAlign: 'center' }}>WPM</div>
              <div style={{ textAlign: 'center' }}>Error Rate</div>
              <div style={{ textAlign: 'center' }}>Score</div>
              <div style={{ textAlign: 'center' }}>Time</div>
            </div>
            
            {allTestHistory.slice().reverse().map((test, index) => (
              <div key={index} style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr',
                gap: '15px',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.08)',
                padding: '15px',
                borderRadius: '8px',
                marginBottom: '10px',
                transition: 'background 0.2s ease'
              }}>
                <div>
                  <div style={{ fontWeight: 'bold', marginBottom: '5px' }}>{test.name}</div>
                  <div style={{ fontSize: '0.85rem', opacity: 0.7 }}>
                    {new Date(test.date).toLocaleString()}
                  </div>
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.wpm}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.errorRate}%
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {test.score}
                </div>
                <div style={{ textAlign: 'center', fontWeight: 'bold', color: getButtonColor() }}>
                  {Math.floor(test.time / 60)}:{(test.time % 60).toString().padStart(2, '0')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
