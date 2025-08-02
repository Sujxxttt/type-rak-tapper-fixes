
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Upload } from 'lucide-react';

interface MusicPlayerProps {
  theme: string;
  getButtonColor: () => string;
}

interface Song {
  name: string;
  url: string;
  duration?: number;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({ theme, getButtonColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState<Song | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load songs from localStorage
  useEffect(() => {
    const savedSongs = localStorage.getItem('musicPlayerSongs');
    if (savedSongs) {
      const parsed = JSON.parse(savedSongs);
      setSongs(parsed);
      if (parsed.length > 0) {
        setCurrentSong(parsed[0]);
      }
    }
  }, []);

  // Update audio element when current song changes
  useEffect(() => {
    if (audioRef.current && currentSong) {
      audioRef.current.src = currentSong.url;
      audioRef.current.volume = volume / 100;
    }
  }, [currentSong, volume]);

  // Handle audio events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => nextSong();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!audioRef.current || !currentSong) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const nextSong = () => {
    if (songs.length === 0) return;
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentIndex(nextIndex);
    setCurrentSong(songs[nextIndex]);
    setIsPlaying(false);
  };

  const prevSong = () => {
    if (songs.length === 0) return;
    const prevIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentIndex(prevIndex);
    setCurrentSong(songs[prevIndex]);
    setIsPlaying(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newSongs: Song[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        newSongs.push({
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          url: url
        });
      }
    });

    const updatedSongs = [...songs, ...newSongs];
    setSongs(updatedSongs);
    localStorage.setItem('musicPlayerSongs', JSON.stringify(updatedSongs));

    if (updatedSongs.length > 0 && !currentSong) {
      setCurrentSong(updatedSongs[0]);
      setCurrentIndex(0);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (songs.length === 0) {
    return (
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '12px',
        padding: '20px',
        textAlign: 'center',
        color: 'white',
        maxWidth: '400px',
        margin: '0 auto'
      }}>
        <h3 style={{ margin: '0 0 15px 0' }}>Music Player</h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.7, fontSize: '0.9rem' }}>
          Upload some music files to get started
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: getButtonColor(),
            border: 'none',
            borderRadius: '8px',
            padding: '10px 20px',
            color: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            margin: '0 auto'
          }}
        >
          <Upload size={16} />
          Upload Music
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(20px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '12px',
      padding: '20px',
      color: 'white',
      maxWidth: '400px',
      margin: '0 auto'
    }}>
      <audio ref={audioRef} />
      
      {/* Song Info */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>
          {currentSong?.name || 'No song selected'}
        </h3>
        <p style={{ margin: 0, opacity: 0.7, fontSize: '0.8rem' }}>
          {songs.length > 0 && `${currentIndex + 1} of ${songs.length}`}
        </p>
      </div>

      {/* Progress Bar */}
      {currentSong && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
              height: '100%',
              background: 'rgba(255, 255, 255, 0.6)',
              transition: 'width 0.3s ease'
            }} />
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginTop: '5px',
            fontSize: '0.7rem',
            opacity: 0.7
          }}>
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '15px',
        marginBottom: '20px'
      }}>
        <button
          onClick={prevSong}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <SkipBack size={20} />
        </button>
        
        <button
          onClick={togglePlay}
          disabled={!currentSong}
          style={{
            background: getButtonColor(),
            border: 'none',
            borderRadius: '50%',
            width: '50px',
            height: '50px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: currentSong ? 'pointer' : 'not-allowed',
            color: 'white'
          }}
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        
        <button
          onClick={nextSong}
          style={{
            background: 'rgba(255, 255, 255, 0.2)',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: 'white'
          }}
        >
          <SkipForward size={20} />
        </button>
      </div>

      {/* Volume Control */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '15px'
      }}>
        <Volume2 size={16} />
        <input
          type="range"
          min="0"
          max="100"
          value={volume}
          onChange={(e) => setVolume(parseInt(e.target.value))}
          style={{
            flex: 1,
            height: '4px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '2px',
            outline: 'none',
            cursor: 'pointer'
          }}
        />
        <span style={{ fontSize: '0.8rem', opacity: 0.7, minWidth: '25px' }}>
          {volume}%
        </span>
      </div>

      {/* Upload More */}
      <div style={{ textAlign: 'center' }}>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '6px',
            padding: '8px 16px',
            color: 'white',
            cursor: 'pointer',
            fontSize: '0.8rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            margin: '0 auto'
          }}
        >
          <Upload size={14} />
          Add More Songs
        </button>
      </div>
    </div>
  );
};
