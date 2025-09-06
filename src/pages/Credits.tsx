import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface CreditsProps {
  onBack: () => void;
}

export const Credits: React.FC<CreditsProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={onBack}
          className="flex items-center gap-2 mb-8 text-white/80 hover:text-white transition-colors"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '0.5rem 1rem'
          }}
        >
          <ArrowLeft size={20} />
          Back
        </button>
        
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '3rem'
          }}
        >
          <h1 className="text-3xl font-bold text-white mb-8">Credits</h1>
          
          <div className="space-y-6 text-white/90">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Development Team</h2>
              <p>TypeWave was created with passion and dedication by our development team.</p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Technologies Used</h2>
              <ul className="list-disc list-inside space-y-2">
                <li>React & TypeScript for the user interface</li>
                <li>Tailwind CSS for styling</li>
                <li>Lucide React for icons</li>
                <li>Web Audio API for sound effects</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Special Thanks</h2>
              <p>
                Special thanks to all our beta testers and the typing community for their valuable feedback and support.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Open Source Libraries</h2>
              <p>
                We are grateful to the open source community and all the libraries that made TypeWave possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};