
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
    
    // Cherry MX Blue style click
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator1.connect(filterNode);
    filterNode.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    // High frequency click
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(2200 + Math.random() * 400, audioContext.currentTime);
    
    // Sharp attack, quick decay
    gainNode1.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.03);
    
    // High-pass filter for crisp sound
    filterNode.type = 'highpass';
    filterNode.frequency.setValueAtTime(1000, audioContext.currentTime);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.03);

    // Mechanical thock (lower frequency component)
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    const filterNode2 = audioContext.createBiquadFilter();
    
    oscillator2.connect(filterNode2);
    filterNode2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.type = 'triangle';
    oscillator2.frequency.setValueAtTime(150 + Math.random() * 50, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.06);
    
    // Low-pass filter for thump
    filterNode2.type = 'lowpass';
    filterNode2.frequency.setValueAtTime(800, audioContext.currentTime);

    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.06);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth';
    oscillator.frequency.setValueAtTime(250, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(150, audioContext.currentTime + 0.15);
    
    gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.15);
  };

  return {
    playKeyboardSound,
    playErrorSound
  };
};
