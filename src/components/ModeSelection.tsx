import React, { useState, useEffect } from 'react';
import { Play, Gamepad2 } from 'lucide-react';

interface ModeSelectionProps {
  onSelectClassic: () => void;
  onSelectArcade: () => void;
  theme: string;
}

export const ModeSelection: React.FC<ModeSelectionProps> = ({
  onSelectClassic,
  onSelectArcade,
  theme
}) => {
  const [showModes, setShowModes] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowModes(true);
    }, 500); // Show modes after intro animation
    return () => clearTimeout(timer);
  }, []);

  const getThemeColors = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return {
          primary: '#b109d6',
          secondary: '#0c6dc2',
          text: '#b109d6'
        };
      case 'midnight-black':
        return {
          primary: '#c559f7',
          secondary: '#7f59f7',
          text: '#c559f7'
        };
      case 'cotton-candy-glow':
        return {
          primary: '#fc03df',
          secondary: '#ff3be8',
          text: '#fc03df'
        };
      default:
        return {
          primary: '#b109d6',
          secondary: '#0c6dc2',
          text: '#b109d6'
        };
    }
  };

  const colors = getThemeColors();

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        opacity: showModes ? 1 : 0,
        transition: 'opacity 0.8s ease-in-out'
      }}
    >
      <div className="flex gap-12">
        {/* Classic Mode */}
        <div
          onClick={onSelectClassic}
          className="group cursor-pointer"
          style={{
            transform: showModes ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.2s'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              width: '280px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            className="group-hover:scale-105 group-hover:shadow-2xl"
          >
            <Play 
              size={64} 
              style={{
                color: colors.primary,
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 10px rgba(177, 9, 214, 0.3))'
              }}
            />
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '1rem',
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Classic
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', lineHeight: '1.5' }}>
              Traditional typing test with customizable settings and themes
            </p>
          </div>
        </div>

        {/* Arcade Mode */}
        <div
          onClick={onSelectArcade}
          className="group cursor-pointer"
          style={{
            transform: showModes ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            transitionDelay: '0.4s'
          }}
        >
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '20px',
              padding: '3rem 2.5rem',
              textAlign: 'center',
              width: '280px',
              height: '320px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
            }}
            className="group-hover:scale-105 group-hover:shadow-2xl"
          >
            <Gamepad2 
              size={64} 
              style={{
                color: colors.primary,
                marginBottom: '1.5rem',
                filter: 'drop-shadow(0 0 10px rgba(177, 9, 214, 0.3))'
              }}
            />
            <h2
              style={{
                fontSize: '2rem',
                fontWeight: 700,
                color: 'white',
                marginBottom: '1rem',
                background: `linear-gradient(45deg, ${colors.primary}, ${colors.secondary})`,
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Arcade
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '1rem', lineHeight: '1.5' }}>
              Challenge yourself with unique game modes and creative scenarios
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};