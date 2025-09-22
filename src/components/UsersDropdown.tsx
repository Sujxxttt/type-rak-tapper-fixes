import React, { useState } from 'react';
import { Lock, Plus } from 'lucide-react';

interface User {
  username: string;
  hasPassword: boolean;
}

interface UsersDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentUser: string;
  onSelectUser: (username: string) => void;
  onCreateUser: () => void;
  style?: React.CSSProperties;
}

export const UsersDropdown: React.FC<UsersDropdownProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser,
  onCreateUser,
  style
}) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        marginTop: '4px',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(25px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '8px',
        color: 'white',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        zIndex: 10002,
        maxHeight: '200px',
        overflowY: 'auto',
        ...style
      }}
    >
      {users.map((user) => (
        <div
          key={user.username}
          onClick={() => {
            onSelectUser(user.username);
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            background: user.username === currentUser ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
            fontSize: '0.9rem'
          }}
          onMouseEnter={(e) => {
            if (user.username !== currentUser) {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            }
          }}
          onMouseLeave={(e) => {
            if (user.username !== currentUser) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span>{user.username}</span>
          {user.hasPassword && (
            <Lock 
              size={12} 
              style={{ 
                color: 'rgba(255, 255, 255, 0.6)',
                filter: 'drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))'
              }} 
            />
          )}
        </div>
      ))}
      
      <div
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          marginTop: '8px',
          paddingTop: '8px'
        }}
      >
        <div
          onClick={() => {
            onCreateUser();
            onClose();
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 12px',
            borderRadius: '8px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            fontSize: '0.9rem',
            color: 'rgba(255, 255, 255, 0.8)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <Plus size={14} />
          <span>Create New User</span>
        </div>
      </div>
    </div>
  );
};