import React from 'react';
import { Eye, PenLine } from 'lucide-react';

interface MobileActionButtonProps {
  mode: 'form' | 'preview';
  setMode: (mode: 'form' | 'preview') => void;
}

export const MobileActionButton: React.FC<MobileActionButtonProps> = ({ mode, setMode }) => {
  const toggle = () => {
    const newMode = mode === 'form' ? 'preview' : 'form';
    setMode(newMode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      onClick={toggle}
      className="md:hidden fixed bottom-6 right-6 h-14 w-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 transition-all z-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 active:scale-90"
      aria-label={mode === 'form' ? "Switch to Preview" : "Switch to Edit"}
    >
      {mode === 'form' ? <Eye size={24} /> : <PenLine size={24} />}
    </button>
  );
};