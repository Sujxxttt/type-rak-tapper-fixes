
import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { AchievementNotification as AchievementNotificationType } from '../types/achievements';

interface AchievementNotificationProps {
  notification: AchievementNotificationType | null;
  onDismiss: () => void;
  theme: string;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  notification,
  onDismiss,
  theme
}) => {
  useEffect(() => {
    if (notification?.show) {
      // Play achievement sound
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+Dxv2EeUaNu');
      audio.volume = 0.3;
      audio.play().catch(() => {
        // Fallback if audio fails to play
        console.log('Achievement sound could not be played');
      });

      const timer = setTimeout(() => {
        onDismiss();
      }, 8000);

      return () => clearTimeout(timer);
    }
  }, [notification, onDismiss]);

  if (!notification?.show) return null;

  const { achievement } = notification;

  return (
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      zIndex: 3000,
      maxWidth: '450px',
      width: '90%',
      animation: 'achievementSlideIn 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '20px',
        padding: '24px',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        textAlign: 'center'
      }}>
        <button
          onClick={onDismiss}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            background: 'rgba(255, 255, 255, 0.15)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.25)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)';
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <X size={16} />
        </button>

        <div style={{
          fontSize: '3rem',
          marginBottom: '16px',
          animation: 'bounce 1s ease-in-out infinite alternate'
        }}>
          {achievement.icon}
        </div>

        <div style={{
          color: '#FFD700',
          fontSize: '1.1rem',
          fontWeight: '600',
          marginBottom: '8px',
          textTransform: 'uppercase',
          letterSpacing: '1px'
        }}>
          Achievement Unlocked!
        </div>

        <h3 style={{
          color: 'white',
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '8px',
          margin: '0 0 8px 0'
        }}>
          {achievement.name}
        </h3>

        <p style={{
          color: 'rgba(255, 255, 255, 0.9)',
          fontSize: '1rem',
          margin: '0',
          lineHeight: '1.4'
        }}>
          {achievement.subtitle}
        </p>

        <div style={{
          marginTop: '16px',
          padding: '8px 16px',
          background: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '12px',
          fontSize: '0.9rem',
          color: 'rgba(255, 255, 255, 0.8)'
        }}>
          {achievement.wpmRequired} WPM for {achievement.timeRequired}+ seconds
        </div>
      </div>

      <style>{`
        @keyframes achievementSlideIn {
          0% {
            opacity: 0;
            transform: translate(-50%, -60%) scale(0.8);
          }
          100% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1);
          }
        }

        @keyframes bounce {
          0% { transform: translateY(0); }
          100% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
