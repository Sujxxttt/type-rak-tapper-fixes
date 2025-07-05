
import { useState, useEffect, useRef } from 'react';

export const useBackgroundMusic = (enabled: boolean, volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [availableMusic, setAvailableMusic] = useState<string[]>([]);

  useEffect(() => {
    // Check for available music files in BGM folder
    const checkForMusic = async () => {
      try {
        // Common audio file extensions
        const extensions = ['mp3', 'wav', 'ogg', 'm4a'];
        const musicFiles: string[] = [];
        
        for (const ext of extensions) {
          try {
            const response = await fetch(`/src/BGM/background.${ext}`);
            if (response.ok) {
              musicFiles.push(`/src/BGM/background.${ext}`);
            }
          } catch (error) {
            // File doesn't exist, continue
          }
        }
        
        setAvailableMusic(musicFiles);
      } catch (error) {
        console.log('No background music found');
      }
    };

    checkForMusic();
  }, []);

  const playMusic = () => {
    if (availableMusic.length > 0 && enabled) {
      if (!audioRef.current) {
        audioRef.current = new Audio(availableMusic[0]);
        audioRef.current.loop = true;
        audioRef.current.volume = volume / 100;
      }
      
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Could not play background music:', error);
      });
    }
  };

  const stopMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    if (enabled && availableMusic.length > 0) {
      playMusic();
    } else {
      stopMusic();
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [enabled, availableMusic]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  return { isPlaying, hasMusic: availableMusic.length > 0, playMusic, stopMusic };
};
