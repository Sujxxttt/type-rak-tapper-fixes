
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from 'lucide-react';

interface Song {
  name: string;
  file: File | string;
  url: string;
}

interface MusicPlayerProps {
  enabled: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onUploadClick: () => void;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  enabled,
  volume,
  onVolumeChange,
  onUploadClick
}) => {
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    // Load songs from localStorage
    const savedSongs = localStorage.getItem('typeRakMusic');
    if (savedSongs) {
      const parsed: Song[] = JSON.parse(savedSongs);
      setSongs(parsed);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (!enabled && isPlaying) {
      pause();
    }
  }, [enabled]);

  const play = () => {
    if (audioRef.current && songs.length > 0 && enabled) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const pause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const nextSong = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % songs.length);
    }
  };

  const prevSong = () => {
    if (songs.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + songs.length) % songs.length);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!enabled) return null;

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.08)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.15)',
      borderRadius: '15px',
      padding: '16px',
      marginBottom: '1.5rem'
    }}>
      <h4 style={{ 
        marginBottom: '12px', 
        fontSize: '0.8rem', 
        fontWeight: '600', 
        opacity: 0.8 
      }}>
        Music Player
      </h4>

      {songs.length > 0 && (
        <audio
          ref={audioRef}
          src={songs[currentSongIndex]?.url}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={nextSong}
        />
      )}

      <div style={{ marginBottom: '12px' }}>
        <div style={{
          fontSize: '0.9rem',
          fontWeight: '500',
          marginBottom: '4px',
          opacity: songs.length > 0 ? 1 : 0.5
        }}>
          {songs.length > 0 ? songs[currentSongIndex]?.name || 'Unknown Song' : 'No songs loaded'}
        </div>
        
        {songs.length > 0 && (
          <div style={{
            fontSize: '0.7rem',
            opacity: 0.6
          }}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        )}
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <button 
          onClick={prevSong}
          disabled={songs.length === 0}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: songs.length > 0 ? 'pointer' : 'not-allowed',
            opacity: songs.length > 0 ? 1 : 0.5
          }}
        >
          <SkipBack size={16} color="white" />
        </button>

        <button 
          onClick={isPlaying ? pause : play}
          disabled={songs.length === 0}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: songs.length > 0 ? 'pointer' : 'not-allowed',
            opacity: songs.length > 0 ? 1 : 0.5
          }}
        >
          {isPlaying ? <Pause size={20} color="white" /> : <Play size={20} color="white" />}
        </button>

        <button 
          onClick={nextSong}
          disabled={songs.length === 0}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: 'none',
            borderRadius: '50%',
            width: '32px',
            height: '32px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: songs.length > 0 ? 'pointer' : 'not-allowed',
            opacity: songs.length > 0 ? 1 : 0.5
          }}
        >
          <SkipForward size={16} color="white" />
        </button>
      </div>

      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '12px'
      }}>
        <Volume2 size={16} color="white" />
        <input 
          type="range" 
          min="0" 
          max="100" 
          value={volume} 
          onChange={(e) => onVolumeChange(Number(e.target.value))}
          style={{
            flex: 1,
            height: '4px',
            borderRadius: '2px',
            background: 'rgba(255, 255, 255, 0.2)',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '0.7rem', opacity: 0.7 }}>{volume}%</span>
      </div>

      <button 
        onClick={onUploadClick}
        style={{
          width: '100%',
          background: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: '8px',
          color: 'white',
          padding: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '0.8rem'
        }}
      >
        <Upload size={16} />
        Upload Music
      </button>
    </div>
  );
};
