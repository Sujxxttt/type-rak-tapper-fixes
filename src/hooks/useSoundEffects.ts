
import { useRef } from 'react';

export const useSoundEffects = (soundEnabled: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);

  const initAudioContext = () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if it's suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    return audioContextRef.current;
  };

  const playKeyboardSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    
    // More realistic mechanical keyboard sound
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator1.connect(filterNode);
    filterNode.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    // Sharp click sound
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(1800 + Math.random() * 200, audioContext.currentTime);
    
    // Very sharp attack, quick decay for realistic click
    gainNode1.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.02);
    
    // High-pass filter for crisp sound
    filterNode.type = 'highpass';
    filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.02);

    // Subtle bottom-out thock
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    const filterNode2 = audioContext.createBiquadFilter();
    
    oscillator2.connect(filterNode2);
    filterNode2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(120 + Math.random() * 30, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.04);
    
    // Low-pass filter for subtle thump
    filterNode2.type = 'lowpass';
    filterNode2.frequency.setValueAtTime(300, audioContext.currentTime);

    oscillator2.start(audioContext.currentTime + 0.005);
    oscillator2.stop(audioContext.currentTime + 0.04);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    
    // Error buzz sound
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Harsh buzz
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    oscillator.frequency.linearRampToValueAtTime(100, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    
    // Band-pass filter for harsh buzz
    filterNode.type = 'bandpass';
    filterNode.frequency.setValueAtTime(300, audioContext.currentTime);
    filterNode.Q.setValueAtTime(5, audioContext.currentTime);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  };

  return {
    playKeyboardSound,
    playErrorSound
  };
};
