
import React, { useState } from 'react';
import { Upload, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

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
  const [dragOver, setDragOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      handleFiles(files);
    }
  };

  const handleFiles = (files: File[]) => {
    const audioFiles = files.filter(file => 
      file.type.startsWith('audio/') || 
      ['mp3', 'wav', 'ogg', 'm4a', 'flac'].some(ext => file.name.toLowerCase().endsWith(ext))
    );

    if (audioFiles.length === 0) {
      alert('Please select valid audio files');
      return;
    }

    // Here you would typically upload files to a server or store them locally
    console.log('Audio files to upload:', audioFiles);
    alert(`${audioFiles.length} audio file(s) ready to upload!`);
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
        alignItems: 'center',
        marginBottom: '30px',
        gap: '15px'
      }}>
        <Button
          onClick={onBack}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '8px',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <ArrowLeft size={16} />
        </Button>
        <h1 style={{
          fontSize: '2rem',
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
          Upload Music
        </h1>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        style={{
          background: dragOver ? 
            'rgba(255, 255, 255, 0.15)' : 
            'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: dragOver ? 
            '2px dashed rgba(255, 255, 255, 0.5)' : 
            '2px dashed rgba(255, 255, 255, 0.3)',
          borderRadius: '16px',
          padding: '60px 20px',
          textAlign: 'center',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
      >
        <Upload size={48} style={{ marginBottom: '20px', opacity: 0.7 }} />
        <h3 style={{ margin: '0 0 10px 0' }}>
          Drag & Drop Audio Files Here
        </h3>
        <p style={{ margin: '0 0 20px 0', opacity: 0.7 }}>
          Or click to select files
        </p>
        <input
          type="file"
          multiple
          accept="audio/*,.mp3,.wav,.ogg,.m4a,.flac"
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="music-upload"
        />
        <Button
          onClick={() => document.getElementById('music-upload')?.click()}
          style={{
            background: getButtonColor(),
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            cursor: 'pointer',
            backdropFilter: 'blur(10px)'
          }}
        >
          Select Files
        </Button>
      </div>

      {/* Supported Formats */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.05)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        borderRadius: '12px',
        padding: '20px',
        marginTop: '20px'
      }}>
        <h4 style={{ margin: '0 0 10px 0' }}>Supported Formats</h4>
        <p style={{ margin: 0, opacity: 0.7 }}>
          MP3, WAV, OGG, M4A, FLAC
        </p>
      </div>
    </div>
  );
};
