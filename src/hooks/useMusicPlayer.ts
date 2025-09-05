import { useState, useEffect, useRef } from 'react';
import { loadAllTracks, saveTrack, deleteTrack } from '@/lib/audioStore';

export interface Track {
  id: string;
  name: string;
  url: string;
  duration?: number;
}

export const useMusicPlayer = (enabled: boolean, volume: number) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLooping, setIsLooping] = useState<'off' | 'single' | 'all'>('off');
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffleOrder, setShuffleOrder] = useState<number[]>([]);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize tracks from background-score folder and persistent uploads (IndexedDB)
  useEffect(() => {
    const loadTracks = async () => {
      const extensions = ['mp3', 'wav', 'ogg', 'm4a'];
      const foundTracks: Track[] = [];

      // Built-in background track if present
      for (const ext of extensions) {
        try {
          const response = await fetch(`/src/background-score/background.${ext}`);
          if (response.ok) {
            foundTracks.push({
              id: `background-${ext}`,
              name: `Background Music`,
              url: `/src/background-score/background.${ext}`
            });
          }
        } catch (_) {
          // ignore
        }
      }

      // Load user uploads from IndexedDB
      try {
        const stored = await loadAllTracks();
        const uploaded: Track[] = stored.map((t) => ({
          id: `idb-${t.id}`,
          name: t.name,
          url: URL.createObjectURL(t.blob),
        }));
        setTracks([...foundTracks, ...uploaded]);
      } catch (e) {
        setTracks(foundTracks);
      }
    };

    loadTracks();
  }, []);

  // Initialize shuffle order when tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      setShuffleOrder(tracks.map((_, index) => index));
    }
  }, [tracks]);

  // Audio setup and controls
  useEffect(() => {
    if (tracks.length === 0) return;

    const currentTrack = tracks[currentTrackIndex];
    if (!currentTrack) return;

    if (audioRef.current && audioRef.current.src !== currentTrack.url) {
      audioRef.current.pause();
    }

    audioRef.current = new Audio(currentTrack.url);
    audioRef.current.volume = volume / 100;

    const audio = audioRef.current;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleDurationChange = () => {
      setDuration(audio.duration);
    };

    const handleEnded = () => {
      if (isLooping === 'single') {
        audio.currentTime = 0;
        audio.play();
      } else if (isLooping === 'all' || currentTrackIndex < tracks.length - 1) {
        nextTrack();
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleDurationChange);
    audio.addEventListener('ended', handleEnded);

    if (enabled && isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleDurationChange);
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
    };
  }, [currentTrackIndex, tracks, volume]);

  // Handle play/pause when enabled changes
  useEffect(() => {
    if (audioRef.current) {
      if (enabled && isPlaying) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [enabled]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current || tracks.length === 0) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  };

  const nextTrack = () => {
    if (tracks.length === 0) return;

    let nextIndex;
    if (isShuffled) {
      const currentShuffleIndex = shuffleOrder.indexOf(currentTrackIndex);
      const nextShuffleIndex = (currentShuffleIndex + 1) % shuffleOrder.length;
      nextIndex = shuffleOrder[nextShuffleIndex];
    } else {
      nextIndex = (currentTrackIndex + 1) % tracks.length;
    }
    
    setCurrentTrackIndex(nextIndex);
  };

  const previousTrack = () => {
    if (tracks.length === 0) return;

    let prevIndex;
    if (isShuffled) {
      const currentShuffleIndex = shuffleOrder.indexOf(currentTrackIndex);
      const prevShuffleIndex = currentShuffleIndex === 0 ? shuffleOrder.length - 1 : currentShuffleIndex - 1;
      prevIndex = shuffleOrder[prevShuffleIndex];
    } else {
      prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    }
    
    setCurrentTrackIndex(prevIndex);
  };

  const selectTrack = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleLoop = () => {
    setIsLooping(prev => {
      switch (prev) {
        case 'off': return 'single';
        case 'single': return 'all';
        case 'all': return 'off';
        default: return 'off';
      }
    });
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => {
      if (!prev) {
        // Enable shuffle - create new random order
        const newOrder = [...tracks.keys()];
        for (let i = newOrder.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [newOrder[i], newOrder[j]] = [newOrder[j], newOrder[i]];
        }
        setShuffleOrder(newOrder);
      }
      return !prev;
    });
  };

  const uploadMusic = (files: FileList) => {
    Array.from(files).forEach(async (file) => {
      if (!file.type.startsWith('audio/')) return;
      try {
        const stored = await saveTrack(file);
        const url = URL.createObjectURL(stored.blob);
        const newTrack: Track = {
          id: `idb-${stored.id}`,
          name: stored.name,
          url,
        };
        setTracks(prev => [...prev, newTrack]);
      } catch (e) {
        // Fallback: in-memory only
        const url = URL.createObjectURL(file);
        const newTrack: Track = {
          id: `uploaded-${Date.now()}-${Math.random()}`,
          name: file.name.replace(/\.[^/.]+$/, ''),
          url,
        };
        setTracks(prev => [...prev, newTrack]);
      }
    });
  };

  const removeTrack = (trackId: string) => {
    setTracks(prev => {
      const removed = prev.find(track => track.id === trackId);
      const filtered = prev.filter(track => track.id !== trackId);
      const removedIndex = prev.findIndex(track => track.id === trackId);

      // Cleanup object URL
      if (removed && removed.id.startsWith('idb-')) {
        const idNum = Number(removed.id.replace('idb-', ''));
        deleteTrack(idNum).catch(() => {});
      }
      if (removed) {
        try { URL.revokeObjectURL(removed.url); } catch {}
      }
      
      if (removedIndex === currentTrackIndex && filtered.length > 0) {
        setCurrentTrackIndex(0);
      } else if (removedIndex < currentTrackIndex) {
        setCurrentTrackIndex(prev => prev - 1);
      }
      
      return filtered;
    });
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    tracks,
    currentTrack: tracks[currentTrackIndex],
    isPlaying: enabled && isPlaying,
    currentTime,
    duration,
    isLooping,
    isShuffled,
    hasMusic: tracks.length > 0,
    togglePlayPause,
    nextTrack,
    previousTrack,
    selectTrack,
    seek,
    toggleLoop,
    toggleShuffle,
    uploadMusic,
    removeTrack,
    formatTime,
    fileInputRef
  };
};