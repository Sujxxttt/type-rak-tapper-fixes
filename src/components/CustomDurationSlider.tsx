
import React from 'react';
import { Slider } from '../components/ui/slider';

interface CustomDurationSliderProps {
  value: number;
  onChange: (value: number) => void;
  theme: string;
}

export const CustomDurationSlider: React.FC<CustomDurationSliderProps> = ({
  value,
  onChange,
  theme
}) => {
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    } else if (seconds < 3600) {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`;
    } else {
      const hours = Math.floor(seconds / 3600);
      const remainingMinutes = Math.floor((seconds % 3600) / 60);
      return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    }
  };

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '10px'
    }}>
      <div style={{ 
        color: 'white', 
        marginBottom: '15px', 
        textAlign: 'center',
        fontSize: '1.1rem',
        fontWeight: '500'
      }}>
        Custom Duration: {formatDuration(value)}
      </div>
      <Slider
        value={[value]}
        onValueChange={(newValue) => onChange(newValue[0])}
        min={30}
        max={7200} // 120 minutes
        step={30}
        className="w-full"
      />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.8rem',
        marginTop: '10px'
      }}>
        <span>30s</span>
        <span>120m</span>
      </div>
    </div>
  );
};
