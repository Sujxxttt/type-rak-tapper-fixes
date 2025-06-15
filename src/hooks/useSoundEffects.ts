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
    
    // Create a more realistic mechanical keyboard sound
    const oscillator1 = audioContext.createOscillator();
    const oscillator2 = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    const filterNode = audioContext.createBiquadFilter();
    
    // Connect the nodes
    oscillator1.connect(filterNode);
    oscillator2.connect(filterNode);
    filterNode.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Configure the first oscillator (main click) - sharper and slightly randomized
    oscillator1.type = 'square';
    const mainFreq = 1200 + (Math.random() - 0.5) * 200;
    oscillator1.frequency.setValueAtTime(mainFreq, audioContext.currentTime);
    oscillator1.frequency.exponentialRampToValueAtTime(mainFreq * 0.5, audioContext.currentTime + 0.03);
    
    // Configure the second oscillator (adds body to the sound) - lower for more 'thock'
    oscillator2.type = 'triangle';
    const bodyFreq = 300 + (Math.random() - 0.5) * 50;
    oscillator2.frequency.setValueAtTime(bodyFreq, audioContext.currentTime);
    oscillator2.frequency.exponentialRampToValueAtTime(bodyFreq * 0.5, audioContext.currentTime + 0.05);
    
    // Configure the filter for a more realistic sound
    filterNode.type = 'lowpass';
    filterNode.frequency.setValueAtTime(2200, audioContext.currentTime);
    filterNode.frequency.exponentialRampToValueAtTime(1200, audioContext.currentTime + 0.06);
    
    // Configure the gain for a sharp attack and quick decay - slightly louder click
    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.2, audioContext.currentTime + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // Start and stop the oscillators
    const stopTime = audioContext.currentTime + 0.1;
    oscillator1.start(audioContext.currentTime);
    oscillator2.start(audioContext.currentTime);
    oscillator1.stop(stopTime);
    oscillator2.stop(stopTime);
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
