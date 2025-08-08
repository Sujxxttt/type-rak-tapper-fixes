
import React, { useState, useEffect, useRef } from 'react';
import { Upload, Play, Pause, SkipBack, SkipForward, Volume2, X, Music, Trash2 } from 'lucide-react';

interface MusicUploadPageProps {
  onBack: () => void;
  theme: string;
  getButtonColor: () => string;
}

interface MusicFile {
  id: string;
  name: string;
  url: string;
  file: File;
}

export const MusicUploadPage: React.FC<MusicUploadPageProps> = ({
  onBack,
  theme,
  getButtonColor
}) => {
  const [musicFiles, setMusicFiles] = useState<MusicFile[]>([]);
  const [currentTrack, setCurrentTrack] = useState<MusicFile | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isDragOver, setIsDragOver] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Load music files from localStorage
    const savedFiles = localStorage.getItem('typeRakMusicFiles');
    if (savedFiles) {
      const parsed = JSON.parse(savedFiles);
      // Create URLs for saved files - in a real app, you'd need a more robust storage solution
      const filesWithUrls = parsed.map((file: any) => ({
        ...file,
        url: file.url || URL.createObjectURL(new Blob()) // Placeholder - files won't persist on refresh
      }));
      setMusicFiles(filesWithUrls);
    }
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;

    const newFiles: MusicFile[] = [];
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const id = Date.now() + Math.random().toString();
        const url = URL.createObjectURL(file);
        newFiles.push({ id, name: file.name, url, file });
      }
    });

    const updatedFiles = [...musicFiles, ...newFiles];
    setMusicFiles(updatedFiles);
    
    // Save to localStorage (note: this won't persist files across sessions)
    localStorage.setItem('typeRakMusicFiles', JSON.stringify(
      updatedFiles.map(f => ({ id: f.id, name: f.name }))
    ));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFileUpload(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const playTrack = (track: MusicFile) => {
    if (audioRef.current) {
      if (currentTrack?.id === track.id) {
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        } else {
          audioRef.current.play();
          setIsPlaying(true);
        }
      } else {
        setCurrentTrack(track);
        audioRef.current.src = track.url;
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const nextTrack = () => {
    if (!currentTrack || musicFiles.length === 0) return;
    const currentIndex = musicFiles.findIndex(f => f.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % musicFiles.length;
    playTrack(musicFiles[nextIndex]);
  };

  const prevTrack = () => {
    if (!currentTrack || musicFiles.length === 0) return;
    const currentIndex = musicFiles.findIndex(f => f.id === currentTrack.id);
    const prevIndex = (currentIndex - 1 + musicFiles.length) % musicFiles.length;
    playTrack(musicFiles[prevIndex]);
  };

  const deleteTrack = (trackId: string) => {
    const updatedFiles = musicFiles.filter(f => f.id !== trackId);
    setMusicFiles(updatedFiles);
    
    if (currentTrack?.id === trackId) {
      setCurrentTrack(null);
      setIsPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
    }
    
    localStorage.setItem('typeRakMusicFiles', JSON.stringify(
      updatedFiles.map(f => ({ id: f.id, name: f.name }))
    ));
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      color: 'white'
    }}>
      <audio ref={audioRef} />
      
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
            backgroundImage: theme === 'midnight-black' ? 
              'linear-gradient(90deg, #c559f7 0%, #7f59f7 100%)' :
              theme === 'cotton-candy-glow' ?
              'linear-gradient(90deg, #fc03df 0%, #ff3be8 100%)' :
              'linear-gradient(45deg, #b109d6 0%, #0c6dc2 100%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Music Player
          </h1>
          <p style={{
            fontSize: '1.1rem',
            opacity: 0.8,
            margin: '10px 0 0 0'
          }}>
            Upload and play your favorite tracks
          </p>
        </div>
        <button
          onClick={onBack}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            backdropFilter: 'blur(10px)'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          background: isDragOver ? 
            'rgba(255, 255, 255, 0.2)' : 
            'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `2px dashed ${isDragOver ? 'rgba(255, 255, 255, 0.5)' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '30px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
      >
        <Upload size={48} style={{ marginBottom: '15px', opacity: 0.7 }} />
        <h3 style={{ margin: '0 0 10px 0', fontSize: '1.3rem' }}>
          Upload Music Files
        </h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Drag and drop audio files here, or click to browse
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          style={{ display: 'none' }}
          onChange={(e) => handleFileUpload(e.target.files)}
        />
      </div>

      {/* Current Player */}
      {currentTrack && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.15)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '25px',
          marginBottom: '30px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '15px',
            marginBottom: '20px'
          }}>
            <Music size={24} />
            <div style={{ flex: 1 }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                {currentTrack.name}
              </h3>
              <p style={{ margin: '5px 0 0 0', opacity: 0.7, fontSize: '0.9rem' }}>
                {formatTime(currentTime)} / {formatTime(duration)}
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            width: '100%',
            height: '6px',
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '3px',
            marginBottom: '20px',
            cursor: 'pointer'
          }}
          onClick={(e) => {
            if (audioRef.current && duration) {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const newTime = (clickX / rect.width) * duration;
              audioRef.current.currentTime = newTime;
            }
          }}>
            <div style={{
              width: duration ? `${(currentTime / duration) * 100}%` : '0%',
              height: '100%',
              background: 'linear-gradient(90deg, #f7ba2c, #f8a902)',
              borderRadius: '3px',
              transition: 'width 0.1s ease'
            }} />
          </div>

          {/* Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '15px'
          }}>
            <button
              onClick={prevTrack}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={() => playTrack(currentTrack)}
              style={{
                background: 'linear-gradient(90deg, #f7ba2c, #f8a902)',
                border: 'none',
                borderRadius: '50%',
                width: '55px',
                height: '55px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </button>
            
            <button
              onClick={nextTrack}
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                border: 'none',
                borderRadius: '50%',
                width: '45px',
                height: '45px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              <SkipForward size={20} />
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginLeft: '20px'
            }}>
              <Volume2 size={20} />
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={(e) => setVolume(parseInt(e.target.value))}
                style={{
                  width: '100px',
                  accentColor: '#f7ba2c'
                }}
              />
              <span style={{ fontSize: '0.9rem', opacity: 0.7 }}>
                {volume}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Music List */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        borderRadius: '16px',
        padding: '25px'
      }}>
        <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem' }}>
          Your Music Library ({musicFiles.length})
        </h2>

        {musicFiles.length === 0 ? (
          <p style={{ margin: 0, opacity: 0.7, textAlign: 'center', padding: '40px 0' }}>
            No music files uploaded yet. Upload some tracks to get started!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {musicFiles.map(file => (
              <div
                key={file.id}
                style={{
                  background: currentTrack?.id === file.id ? 
                    'rgba(247, 186, 44, 0.2)' : 
                    'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px'
                }}
              >
                <button
                  onClick={() => playTrack(file)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                >
                  {currentTrack?.id === file.id && isPlaying ? 
                    <Pause size={18} /> : 
                    <Play size={18} />
                  }
                </button>

                <div style={{ flex: 1 }}>
                  <h4 style={{ 
                    margin: 0, 
                    fontSize: '1rem',
                    color: currentTrack?.id === file.id ? '#f7ba2c' : 'white'
                  }}>
                    {file.name}
                  </h4>
                </div>

                <button
                  onClick={() => deleteTrack(file.id)}
                  style={{
                    background: 'rgba(255, 0, 0, 0.2)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px',
                    color: '#ff6b6b',
                    cursor: 'pointer'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
