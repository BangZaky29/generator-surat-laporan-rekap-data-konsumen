import React from 'react';
import { FileText } from 'lucide-react';

interface HeaderProps {
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ action }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16 flex items-center px-4 md:px-6 justify-between shadow-sm">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white">
          <FileText size={24} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900 leading-tight">RekapKonsumen</h1>
          <p className="text-xs text-gray-500 font-medium">Generator Laporan Bulanan</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {action}
      </div>
    </header>
  );
};