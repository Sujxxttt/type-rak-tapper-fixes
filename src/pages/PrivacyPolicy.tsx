import React from 'react';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyProps {
  onBack: () => void;
}

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => {
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
          <h1 className="text-3xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="space-y-6 text-white/90">
            <p>
              This is the privacy policy for TypeWave. We take your privacy seriously and are committed to protecting your personal information.
            </p>
            
            <h2 className="text-xl font-semibold text-white">Information We Collect</h2>
            <p>
              We collect information that you provide directly to us, such as when you create an account, use our typing test features, or contact us for support.
            </p>
            
            <h2 className="text-xl font-semibold text-white">How We Use Your Information</h2>
            <p>
              We use the information we collect to provide, maintain, and improve our services, and to communicate with you about your account and our services.
            </p>
            
            <h2 className="text-xl font-semibold text-white">Data Storage</h2>
            <p>
              Your typing test results and preferences are stored locally in your browser. We do not collect or store this information on our servers.
            </p>
            
            <h2 className="text-xl font-semibold text-white">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us through our support channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};