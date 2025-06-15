import { useRef } from 'react';

export const useSoundEffects = (soundEnabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return audioContextRef.current;
  };

  const playKeyboardSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    if (audioContext.state === 'suspended') {
      audioContext.resume();
    }
    
    const oscillator1 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator1.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator1.type = 'triangle';
    const randomFreq = 1800 + Math.random() * 400;
    oscillator1.frequency.setValueAtTime(randomFreq, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    const stopTime = audioContext.currentTime + 0.05;
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(stopTime);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
  };

  return {
    playKeyboardSound,
    playErrorSound
  };
};
