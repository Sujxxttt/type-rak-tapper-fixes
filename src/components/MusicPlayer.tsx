import React from 'react';
import { Play, Pause, SkipBack, SkipForward, Repeat, Shuffle, Upload, Trash2, List, Volume2 } from 'lucide-react';
import { useMusicPlayer } from '../hooks/useMusicPlayer';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface MusicPlayerProps {
  enabled: boolean;
  volume: number;
  setVolume: (volume: number) => void;
  getButtonColor: () => string;
}

export const MusicPlayer: React.FC<MusicPlayerProps> = ({
  enabled,
  volume,
  setVolume,
  getButtonColor
}) => {
  const {
    tracks,
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    isLooping,
    isShuffled,
    hasMusic,
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
  } = useMusicPlayer(enabled, volume);

  if (!hasMusic && tracks.length === 0) {
    return (
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Music Player:</h4>
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.08)', 
          padding: '12px 16px', 
          borderRadius: '15px',
          fontSize: '0.9rem',
          backdropFilter: 'blur(15px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          textAlign: 'center',
          opacity: 0.7
        }}>
          <p style={{ marginBottom: '10px', fontSize: '0.8rem' }}>No music found</p>
          <button 
            onClick={() => fileInputRef.current?.click()}
            style={{
              background: `rgba(${getButtonColor().match(/\d+/g)?.slice(0,3).join(',') || '255,255,255'}, 0.2)`,
              border: 'none',
              borderRadius: '10px',
              color: 'white',
              padding: '8px 12px',
              cursor: 'pointer',
              fontSize: '0.8rem',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              margin: '0 auto'
            }}
          >
            <Upload size={14} />
            Upload Music
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="audio/*"
            style={{ display: 'none' }}
            onChange={(e) => e.target.files && uploadMusic(e.target.files)}
          />
        </div>
      </div>
    );
  }

  const buttonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    color: 'white',
    width: '32px',
    height: '32px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
    transition: 'all 0.2s ease'
  };

  const activeButtonStyle = {
    ...buttonStyle,
    background: `rgba(${getButtonColor().match(/\d+/g)?.slice(0,3).join(',') || '255,255,255'}, 0.3)`,
    border: `1px solid rgba(${getButtonColor().match(/\d+/g)?.slice(0,3).join(',') || '255,255,255'}, 0.5)`
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <h4 style={{ marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: '600', opacity: 0.8 }}>Music Player:</h4>
      
      <div style={{ 
        background: 'rgba(255, 255, 255, 0.08)', 
        padding: '12px', 
        borderRadius: '15px',
        backdropFilter: 'blur(15px)',
        border: '1px solid rgba(255, 255, 255, 0.15)'
      }}>
        {/* Current track info */}
        {currentTrack && (
          <div style={{ 
            marginBottom: '12px',
            textAlign: 'center',
            fontSize: '0.8rem',
            opacity: 0.9
          }}>
            <div style={{ fontWeight: '500', marginBottom: '2px' }}>{currentTrack.name}</div>
            <div style={{ opacity: 0.6, fontSize: '0.7rem' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        )}

        {/* Progress bar */}
        {currentTrack && (
          <div 
            style={{ 
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '2px',
              marginBottom: '12px',
              cursor: 'pointer',
              position: 'relative'
            }}
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const clickX = e.clientX - rect.left;
              const percentage = clickX / rect.width;
              seek(percentage * duration);
            }}
          >
            <div 
              style={{
                height: '100%',
                background: getButtonColor(),
                borderRadius: '2px',
                width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                transition: 'width 0.1s ease'
              }}
            />
          </div>
        )}

        {/* Controls */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between',
          marginBottom: '10px'
        }}>
          {/* Left controls */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              style={isShuffled ? activeButtonStyle : buttonStyle}
              onClick={toggleShuffle}
              title="Shuffle"
            >
              <Shuffle size={14} />
            </button>
            
            <button 
              style={buttonStyle}
              onClick={previousTrack}
              disabled={tracks.length <= 1}
              title="Previous"
            >
              <SkipBack size={14} />
            </button>
          </div>

          {/* Play/Pause */}
          <button 
            style={{
              ...buttonStyle,
              width: '40px',
              height: '40px',
              background: `rgba(${getButtonColor().match(/\d+/g)?.slice(0,3).join(',') || '255,255,255'}, 0.2)`
            }}
            onClick={togglePlayPause}
            disabled={!currentTrack}
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>

          {/* Right controls */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            <button 
              style={buttonStyle}
              onClick={nextTrack}
              disabled={tracks.length <= 1}
              title="Next"
            >
              <SkipForward size={14} />
            </button>
            
            <button 
              style={isLooping !== 'off' ? activeButtonStyle : buttonStyle}
              onClick={toggleLoop}
              title={`Loop: ${isLooping}`}
            >
              <Repeat size={14} />
              {isLooping === 'single' && (
                <span style={{ fontSize: '0.6rem', position: 'absolute', marginTop: '14px' }}>1</span>
              )}
            </button>
          </div>
        </div>

        {/* Bottom controls */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          fontSize: '0.8rem'
        }}>
          {/* Volume */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1, gap: '8px' }}>
            <Volume2 size={14} style={{ opacity: 0.7 }} />
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={volume} 
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{
                flex: 1,
                height: '4px',
                borderRadius: '2px',
                background: 'rgba(255, 255, 255, 0.2)',
                outline: 'none',
                cursor: 'pointer'
              }}
            />
            <span style={{ fontSize: '0.7rem', opacity: 0.7, minWidth: '30px' }}>{volume}%</span>
          </div>

          {/* Track list and upload */}
          <div style={{ display: 'flex', gap: '4px' }}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button style={buttonStyle} title="Track List">
                  <List size={14} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(25px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white',
                  borderRadius: '15px',
                  maxHeight: '200px',
                  overflowY: 'auto',
                  minWidth: '250px'
                }}
              >
                <DropdownMenuLabel>Track List</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {tracks.map((track, index) => (
                  <DropdownMenuItem 
                    key={track.id}
                    onClick={() => selectTrack(index)}
                    style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      background: index === tracks.findIndex(t => t.id === currentTrack?.id) ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                    }}
                  >
                    <span style={{ fontSize: '0.8rem', flex: 1 }}>{track.name}</span>
                    {track.id.startsWith('uploaded-') && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTrack(track.id);
                        }}
                        style={{
                          background: 'rgba(239, 68, 68, 0.7)',
                          border: 'none',
                          borderRadius: '4px',
                          color: 'white',
                          width: '20px',
                          height: '20px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginLeft: '8px'
                        }}
                      >
                        <Trash2 size={10} />
                      </button>
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <button 
              style={buttonStyle}
              onClick={() => fileInputRef.current?.click()}
              title="Upload Music"
            >
              <Upload size={14} />
            </button>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && uploadMusic(e.target.files)}
        />
      </div>
    </div>
  );
};