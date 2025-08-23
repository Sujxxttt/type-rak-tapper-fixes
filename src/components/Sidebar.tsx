
import React from 'react';

interface SidebarProps {
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  username: string;
  isLoggedIn: boolean;
  onLogout: () => void;
  getButtonColor: () => string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  showSidebar,
  setShowSidebar,
  currentView,
  setCurrentView,
  username,
  isLoggedIn,
  onLogout,
  getButtonColor
}) => {
  return (
    <div style={{
      position: 'fixed',
      left: showSidebar ? '0' : '-250px',
      top: '0',
      width: '250px',
      height: '100vh',
      background: 'rgba(0, 0, 0, 0.8)',
      backdropFilter: 'blur(10px)',
      transition: 'left 0.3s ease',
      zIndex: 1000,
      padding: '20px'
    }}>
      <button
        onClick={() => setShowSidebar(!showSidebar)}
        style={{
          position: 'absolute',
          right: '10px',
          top: '10px',
          background: 'none',
          border: 'none',
          color: 'white',
          fontSize: '20px',
          cursor: 'pointer'
        }}
      >
        ×
      </button>
      
      <div style={{ marginTop: '40px', color: 'white' }}>
        <h3>{username}</h3>
        
        <div style={{ marginTop: '30px' }}>
          <button
            onClick={() => setCurrentView('typing-test')}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              background: currentView === 'typing-test' ? getButtonColor() : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Typing Test
          </button>
          
          <button
            onClick={() => setCurrentView('test-history')}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              background: currentView === 'test-history' ? getButtonColor() : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Test History
          </button>
          
          <button
            onClick={() => setCurrentView('settings')}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              background: currentView === 'settings' ? getButtonColor() : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Settings
          </button>
          
          <button
            onClick={() => setCurrentView('achievements')}
            style={{
              display: 'block',
              width: '100%',
              padding: '10px',
              margin: '10px 0',
              background: currentView === 'achievements' ? getButtonColor() : 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Achievements
          </button>
        </div>
        
        {isLoggedIn && (
          <button
            onClick={onLogout}
            style={{
              position: 'absolute',
              bottom: '20px',
              left: '20px',
              right: '20px',
              padding: '10px',
              background: 'rgba(255, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '5px',
              color: 'white',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};
