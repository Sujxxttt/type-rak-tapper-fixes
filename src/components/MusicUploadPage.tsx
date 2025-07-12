
import React, { useState, useRef } from 'react';
import { Upload, X, Music, Trash2 } from 'lucide-react';

interface Song {
  name: string;
  file: File | string;
  url: string;
}

interface MusicUploadPageProps {
  onBack: () => void;
}

export const MusicUploadPage: React.FC<MusicUploadPageProps> = ({ onBack }) => {
  const [songs, setSongs] = useState<Song[]>(() => {
    const saved = localStorage.getItem('typeRakMusic');
    return saved ? JSON.parse(saved) : [];
  });
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (files: FileList) => {
    const newSongs: Song[] = [];
    
    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        newSongs.push({
          name: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
          file: file,
          url: url
        });
      }
    });

    const updatedSongs = [...songs, ...newSongs];
    setSongs(updatedSongs);
    localStorage.setItem('typeRakMusic', JSON.stringify(updatedSongs));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const removeSong = (index: number) => {
    const updatedSongs = songs.filter((_, i) => i !== index);
    setSongs(updatedSongs);
    localStorage.setItem('typeRakMusic', JSON.stringify(updatedSongs));
  };

  return (
    <div style={{
      minHeight: '100vh',
      padding: '20px',
      color: 'white'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          margin: 0,
          background: 'linear-gradient(135deg, #f7ba2c, #f8a902)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          Music Library
        </h1>
        <button
          onClick={onBack}
          className="main-button"
          style={{
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '1rem'
          }}
        >
          Back to Settings
        </button>
      </div>

      {/* Upload Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragOver ? '#f7ba2c' : 'rgba(255, 255, 255, 0.3)'}`,
          borderRadius: '16px',
          padding: '40px',
          textAlign: 'center',
          marginBottom: '30px',
          cursor: 'pointer',
          background: dragOver ? 'rgba(247, 186, 44, 0.1)' : 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          transition: 'all 0.3s ease'
        }}
      >
        <Upload size={48} color={dragOver ? '#f7ba2c' : 'white'} style={{ marginBottom: '16px' }} />
        <h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>
          Drop your music files here
        </h3>
        <p style={{ margin: 0, opacity: 0.7 }}>
          Or click to browse files. Supports MP3, WAV, OGG, M4A
        </p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="audio/*"
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* Songs List */}
      {songs.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
            Your Music ({songs.length} songs)
          </h2>
          <div style={{
            display: 'grid',
            gap: '12px'
          }}>
            {songs.map((song, index) => (
              <div
                key={index}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Music size={20} color="#f7ba2c" />
                  <span style={{ fontSize: '1rem' }}>{song.name}</span>
                </div>
                <button
                  onClick={() => removeSong(index)}
                  style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    color: '#ef4444',
                    padding: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
