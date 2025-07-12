
import { useState, useEffect, useRef } from 'react';

export interface Track {
  name: string;
  url: string;
}

export const useMusicPlayer = (enabled: boolean, volume: number) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Load tracks from Music folder
  useEffect(() => {
    const loadTracks = async () => {
      const musicTracks: Track[] = [];
      const extensions = ['mp3', 'wav', 'ogg', 'm4a'];
      
      for (const ext of extensions) {
        try {
          const response = await fetch(`/src/Music/track1.${ext}`);
          if (response.ok) {
            musicTracks.push({ name: `Track 1`, url: `/src/Music/track1.${ext}` });
          }
        } catch (error) {
          // File doesn't exist, continue
        }
      }
      
      setTracks(musicTracks);
      if (musicTracks.length > 0) {
        setCurrentTrack(musicTracks[0]);
      }
    };

    loadTracks();
  }, []);

  // Handle audio setup
  useEffect(() => {
    if (currentTrack && enabled) {
      if (audioRef.current) {
        audioRef.current.pause();
      }
      
      audioRef.current = new Audio(currentTrack.url);
      audioRef.current.volume = volume / 100;
      
      audioRef.current.addEventListener('loadedmetadata', () => {
        setDuration(audioRef.current?.duration || 0);
      });
      
      audioRef.current.addEventListener('timeupdate', () => {
        setCurrentTime(audioRef.current?.currentTime || 0);
      });
      
      audioRef.current.addEventListener('ended', () => {
        nextTrack();
      });
    }

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [currentTrack, enabled]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const play = () => {
    if (audioRef.current && enabled) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(error => {
        console.log('Could not play music:', error);
      });
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextTrack = () => {
    if (tracks.length > 0) {
      const nextIndex = (currentTrackIndex + 1) % tracks.length;
      setCurrentTrackIndex(nextIndex);
      setCurrentTrack(tracks[nextIndex]);
    }
  };

  const previousTrack = () => {
    if (tracks.length > 0) {
      const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
      setCurrentTrackIndex(prevIndex);
      setCurrentTrack(tracks[prevIndex]);
    }
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const uploadTrack = (file: File) => {
    const url = URL.createObjectURL(file);
    const newTrack: Track = {
      name: file.name.replace(/\.[^/.]+$/, ""),
      url: url
    };
    
    setTracks(prev => [...prev, newTrack]);
    if (!currentTrack) {
      setCurrentTrack(newTrack);
      setCurrentTrackIndex(0);
    }
  };

  return {
    isPlaying,
    currentTrack,
    tracks,
    currentTime,
    duration,
    play,
    pause,
    nextTrack,
    previousTrack,
    seek,
    uploadTrack,
    hasMusic: tracks.length > 0
  };
};
