import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface AboutMeProps {
  onBack: () => void;
}

export const AboutMe: React.FC<AboutMeProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-white mb-8">About Me</h1>
          
          <div className="space-y-6 text-white/90">
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Hello there!</h2>
              <p>
                Welcome to TypeWave! I'm passionate about creating engaging and beautiful typing experiences that help people improve their typing skills while having fun.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">My Mission</h2>
              <p>
                My goal is to make typing practice enjoyable and accessible to everyone. Whether you're a beginner or an experienced typist, TypeWave offers something for everyone.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Why TypeWave?</h2>
              <p>
                I believe that learning should be fun and engaging. That's why TypeWave features beautiful themes, smooth animations, and innovative game modes that make typing practice feel less like work and more like play.
              </p>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold text-white mb-3">Get in Touch</h2>
              <p>
                I love hearing from users! Whether you have feedback, suggestions, or just want to say hello, feel free to reach out through the contact options in the side menu.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};