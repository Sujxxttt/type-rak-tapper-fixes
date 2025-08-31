
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
    
    // Purple tactile mechanical switch sound - Sharp click
    const oscillator1 = audioContext.createOscillator();
    const gainNode1 = audioContext.createGain();
    const filterNode1 = audioContext.createBiquadFilter();
    
    oscillator1.connect(filterNode1);
    filterNode1.connect(gainNode1);
    gainNode1.connect(audioContext.destination);
    
    // Sharp tactile click - higher frequency for crisp sound
    oscillator1.type = 'square';
    oscillator1.frequency.setValueAtTime(2800 + Math.random() * 300, audioContext.currentTime);
    
    // Very sharp attack, quick decay for tactile feel
    gainNode1.gain.setValueAtTime(0.4, audioContext.currentTime);
    gainNode1.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.025);
    
    // Band-pass filter for tactile sharpness
    filterNode1.type = 'bandpass';
    filterNode1.frequency.setValueAtTime(2500, audioContext.currentTime);
    filterNode1.Q.setValueAtTime(3, audioContext.currentTime);
    
    oscillator1.start(audioContext.currentTime);
    oscillator1.stop(audioContext.currentTime + 0.025);

    // Deep thock for purple switch body resonance
    const oscillator2 = audioContext.createOscillator();
    const gainNode2 = audioContext.createGain();
    const filterNode2 = audioContext.createBiquadFilter();
    
    oscillator2.connect(filterNode2);
    filterNode2.connect(gainNode2);
    gainNode2.connect(audioContext.destination);

    oscillator2.type = 'sine';
    oscillator2.frequency.setValueAtTime(180 + Math.random() * 40, audioContext.currentTime);
    
    gainNode2.gain.setValueAtTime(0.2, audioContext.currentTime);
    gainNode2.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.08);
    
    // Low-pass for deep thump
    filterNode2.type = 'lowpass';
    filterNode2.frequency.setValueAtTime(600, audioContext.currentTime);

    oscillator2.start(audioContext.currentTime + 0.005);
    oscillator2.stop(audioContext.currentTime + 0.08);

    // Subtle upper harmonic for tactile complexity
    const oscillator3 = audioContext.createOscillator();
    const gainNode3 = audioContext.createGain();
    
    oscillator3.connect(gainNode3);
    gainNode3.connect(audioContext.destination);

    oscillator3.type = 'triangle';
    oscillator3.frequency.setValueAtTime(1200 + Math.random() * 200, audioContext.currentTime);
    
    gainNode3.gain.setValueAtTime(0.08, audioContext.currentTime);
    gainNode3.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.04);

    oscillator3.start(audioContext.currentTime);
    oscillator3.stop(audioContext.currentTime + 0.04);
  };

  const playErrorSound = () => {
    if (!soundEnabled) return;
    
    const audioContext = initAudioContext();
    
    // Subtle error sound - gentle negative feedback
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    oscillator.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Gentle descending tone
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.12);
    
    // Softer volume for subtlety
    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.12);
    
    // Low-pass filter for warmth
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(800, audioContext.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.12);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.12);
  };

  return {
    playKeyboardSound,
    playErrorSound
  };
};
