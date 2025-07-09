
import React, { useEffect, useState } from 'react';
import { Trophy } from 'lucide-react';

interface AchievementNotificationProps {
  achievement: {
    name: string;
    subtitle: string;
    wpm: number;
  } | null;
  onClose: () => void;
}

export const AchievementNotification: React.FC<AchievementNotificationProps> = ({
  achievement,
  onClose
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      // Play achievement sound
      const audio = new Audio('/achievement.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Fallback if audio fails to play
        console.log('Achievement unlocked:', achievement.name);
      });
      
      // Auto close after 5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [achievement, onClose]);

  if (!achievement) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        zIndex: 10000,
        transform: isVisible ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '15px',
        padding: '20px',
        color: 'white',
        minWidth: '300px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <div style={{
          background: 'rgba(255, 215, 0, 0.2)',
          borderRadius: '50%',
          padding: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Trophy size={24} style={{ color: '#ffd700' }} />
        </div>
        <div>
          <h3 style={{ 
            margin: '0 0 4px 0', 
            fontSize: '1.1rem', 
            fontWeight: '600',
            background: 'linear-gradient(45deg, #ffd700, #ffed4e)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            {achievement.name}
          </h3>
          <p style={{ 
            margin: 0, 
            fontSize: '0.9rem', 
            opacity: 0.8 
          }}>
            {achievement.subtitle}
          </p>
          <p style={{ 
            margin: '4px 0 0 0', 
            fontSize: '0.8rem', 
            opacity: 0.6 
          }}>
            {achievement.wpm} WPM achieved!
          </p>
        </div>
      </div>
    </div>
  );
};
