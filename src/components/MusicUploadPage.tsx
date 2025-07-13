
import React, { useState, useRef } from 'react';
import { Upload, Music, X, Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MusicUploadPageProps {
  onBack: () => void;
  theme: string;
  getButtonColor: () => string;
}

export const MusicUploadPage: React.FC<MusicUploadPageProps> = ({
  onBack,
  theme,
  getButtonColor
}) => {
  const [songs, setSongs] = useState<File[]>([]);
  const [currentSong, setCurrentSong] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newSongs = Array.from(files).filter(file => 
        file.type.startsWith('audio/')
      );
      setSongs(prev => [...prev, ...newSongs]);
    }
  };

  const removeSong = (index: number) => {
    setSongs(prev => prev.filter((_, i) => i !== index));
    if (index === currentSong && songs.length > 1) {
      setCurrentSong(0);
    }
  };

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextSong = () => {
    setCurrentSong(prev => (prev + 1) % songs.length);
  };

  const prevSong = () => {
    setCurrentSong(prev => (prev - 1 + songs.length) % songs.length);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <div>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            margin: 0,
            background: theme === 'midnight-black' ? 
              'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
              theme === 'cotton-candy-glow' ?
              'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)' :
              'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Music Library
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8,
            margin: '10px 0 0 0'
          }}>
            Upload and manage your music
          </p>
        </div>
        <button
          onClick={onBack}
          className="glass-button"
          style={{
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back
        </button>
      </div>

      {/* Upload Section */}
      <div 
        className="glass-button"
        style={{
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '30px',
          textAlign: 'center',
          cursor: 'pointer'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload size={48} style={{ margin: '0 auto 15px' }} />
        <h3 style={{ margin: '0 0 10px 0' }}>Upload Music Files</h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Click here or drag and drop audio files
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />
      </div>

      {/* Music Player */}
      {songs.length > 0 && (
        <div 
          className="glass-button"
          style={{
            padding: '25px',
            borderRadius: '16px',
            marginBottom: '30px'
          }}
        >
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            marginBottom: '20px'
          }}>
            <Music size={24} />
            <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>
              {songs[currentSong]?.name || 'No song selected'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            <button
              onClick={prevSong}
              className="glass-button"
              style={{
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <SkipBack size={20} />
            </button>

            <button
              onClick={togglePlayPause}
              className="glass-button"
              style={{
                padding: '15px',
                borderRadius: '50%',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>

            <button
              onClick={nextSong}
              className="glass-button"
              style={{
                padding: '10px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              <SkipForward size={20} />
            </button>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <Volume2 size={20} />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              style={{
                flex: 1,
                cursor: 'pointer'
              }}
            />
            <span style={{ minWidth: '40px', textAlign: 'right' }}>
              {volume}%
            </span>
          </div>

          {songs[currentSong] && (
            <audio
              ref={audioRef}
              src={URL.createObjectURL(songs[currentSong])}
              onEnded={nextSong}
              onLoadedData={() => {
                if (audioRef.current) {
                  audioRef.current.volume = volume / 100;
                }
              }}
            />
          )}
        </div>
      )}

      {/* Song List */}
      {songs.length > 0 && (
        <div 
          className="glass-button"
          style={{
            padding: '25px',
            borderRadius: '16px'
          }}
        >
          <h3 style={{ margin: '0 0 20px 0' }}>Uploaded Songs</h3>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px'
          }}>
            {songs.map((song, index) => (
              <div
                key={index}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px',
                  background: index === currentSong ? 
                    'rgba(255, 255, 255, 0.1)' : 
                    'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
                onClick={() => setCurrentSong(index)}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <Music size={16} />
                  <span>{song.name}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSong(index);
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    opacity: 0.7
                  }}
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
