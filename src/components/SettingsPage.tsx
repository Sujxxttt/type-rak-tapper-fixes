
import React from 'react';

interface SettingsPageProps {
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  theme: string;
  getThemeColor: () => string;
  getButtonColor: () => string;
}

const SettingsPage: React.FC<SettingsPageProps> = ({
  soundEnabled,
  setSoundEnabled,
  theme,
  getThemeColor,
  getButtonColor
}) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-lg">Sound Effects</label>
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`px-4 py-2 rounded ${soundEnabled ? 'bg-green-500' : 'bg-gray-500'} text-white`}
          >
            {soundEnabled ? 'On' : 'Off'}
          </button>
        </div>
        
        <div className="mt-4">
          <label className="text-lg block mb-2">Theme</label>
          <p className="text-sm opacity-70">Current theme: {theme}</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
