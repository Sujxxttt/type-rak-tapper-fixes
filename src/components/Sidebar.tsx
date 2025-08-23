
import React from 'react';
import { Home, History, Settings, Trophy, Gamepad2 } from 'lucide-react';

interface SidebarProps {
  currentView: 'typing-test' | 'test-history' | 'settings' | 'achievements' | 'easter-egg';
  setCurrentView: React.Dispatch<React.SetStateAction<'typing-test' | 'test-history' | 'settings' | 'achievements' | 'easter-egg'>>;
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, isOpen, onClose }) => {
  const menuItems = [
    { id: 'typing-test' as const, label: 'Typing Test', icon: Home },
    { id: 'test-history' as const, label: 'History', icon: History },
    { id: 'achievements' as const, label: 'Achievements', icon: Trophy },
    { id: 'settings' as const, label: 'Settings', icon: Settings },
    { id: 'easter-egg' as const, label: 'Easter Egg', icon: Gamepad2 },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-64 bg-white shadow-xl">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Menu</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentView(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  {item.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
