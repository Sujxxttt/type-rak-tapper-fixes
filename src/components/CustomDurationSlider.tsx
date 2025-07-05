
import React from 'react';
import { Slider } from '@/components/ui/slider';

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
  const getSliderAccent = () => {
    switch (theme) {
      case 'cosmic-nebula':
        return '#f364f0';
      case 'midnight-black':
        return '#c559f7';
      case 'cotton-candy-glow':
        return '#ff59e8';
      default:
        return '#c454f0';
    }
  };

  const formatTime = (seconds: number) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) return `${minutes}m`;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <span className="text-sm text-white/80">Duration:</span>
        <span className="font-medium text-white">{formatTime(value)}</span>
      </div>
      <Slider
        value={[value]}
        onValueChange={(values) => onChange(values[0])}
        min={15}
        max={7200} // 120 minutes
        step={15}
        className="w-full"
        style={{
          '--slider-accent': getSliderAccent()
        } as React.CSSProperties}
      />
      <div className="flex justify-between text-xs text-white/60">
        <span>15s</span>
        <span>120m</span>
      </div>
    </div>
  );
};
