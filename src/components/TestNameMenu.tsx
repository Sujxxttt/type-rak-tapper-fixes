
import React from 'react';

interface TestNameMenuProps {
  showTestNameMenu: boolean;
  newTestName: string;
  setNewTestName: (name: string) => void;
  onConfirm: () => void;
  onCancel: () => void;
  getButtonColor: () => string;
}

export const TestNameMenu: React.FC<TestNameMenuProps> = ({
  showTestNameMenu,
  newTestName,
  setNewTestName,
  onConfirm,
  onCancel,
  getButtonColor
}) => {
  if (!showTestNameMenu) {
    // Show test selection buttons instead
    const tests = ['short', 'medium', 'long'];
    
    return (
      <div style={{
        padding: '16px',
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '15px',
        color: 'white'
      }}>
        <div style={{ marginBottom: '12px', fontSize: '0.9rem', opacity: 0.8 }}>
          Test Type:
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {tests.map((test) => (
            <button
              key={test}
              onClick={() => setNewTestName(test)}
              style={{
                padding: '8px 16px',
                background: newTestName === test ? getButtonColor() : 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontSize: '0.9rem'
              }}
            >
              {test}
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          zIndex: 999
        }}
        onClick={onCancel}
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'rgba(255, 255, 255, 0.15)',
        borderRadius: '16px',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.3)',
        padding: '30px',
        zIndex: 1000,
        minWidth: '400px'
      }}>
        <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Create New Test</h3>
        <input
          type="text"
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          placeholder="Enter test name..."
          style={{
            width: '100%',
            padding: '12px',
            marginBottom: '20px',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '8px',
            background: 'rgba(255, 255, 255, 0.1)',
            color: 'white',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)'
          }}
          onKeyPress={(e) => e.key === 'Enter' && onConfirm()}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              background: getButtonColor(),
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Start Test
          </button>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              background: 'rgba(108, 117, 125, 0.8)',
              color: 'white',
              border: 'none',
              padding: '12px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    </>
  );
};
