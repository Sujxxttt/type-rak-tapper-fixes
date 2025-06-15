
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
    
    // Mechanical keyboard "clack"
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    oscillator1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(1200 + Math.random() * 300, audioContext.currentTime);
    gainNode1.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.04);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.04);

    // Mechanical keyboard "thock"
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    oscillator2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(300 + Math.random() * 100, audioContext.currentTime);
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);

    oscillator2.start(audioContext.currentTime);
    oscillator2.stop(audioContext.currentTime + 0.08);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sawtooth'; // A more jarring sound for an error
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
