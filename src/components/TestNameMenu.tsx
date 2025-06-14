
import React, { useState } from 'react';

interface TestNameMenuProps {
  onCreate: (username: string) => boolean;
  onClose: () => void;
}

export const TestNameMenu: React.FC<TestNameMenuProps> = ({
  onCreate,
  onClose
}) => {
  const [newTestName, setNewTestName] = useState('');

  const handleConfirm = () => {
    if (newTestName.trim()) {
      const success = onCreate(newTestName.trim());
      if (success) {
        onClose();
      }
    }
  };

  const getButtonColor = () => {
    return 'linear-gradient(135deg, #6366f1 0%, #4338ca 100%)';
  };

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
        onClick={onClose}
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
        <h3 style={{ marginBottom: '20px', textAlign: 'center', color: 'white' }}>Create User Profile</h3>
        <input
          type="text"
          value={newTestName}
          onChange={(e) => setNewTestName(e.target.value)}
          placeholder="Enter username..."
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
          onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
          autoFocus
        />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={handleConfirm}
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
            Create Profile
          </button>
          <button
            onClick={onClose}
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
