import React from 'react';
import logo from '../assets/NS_white_01.png';

interface HeaderProps {
  action?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ action }) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-20 h-16 flex items-center px-4 md:px-6 justify-between shadow-sm">
      <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center rounded-l shadow-[5px_5px_12px_rgba(0,0,0,0.11)] overflow-hidden">
            <img src={logo} alt="Logo" className="w-full h-full object-contain"/>
          </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight text-gray-800">Generator<span className="text-blue-600"> Surat Rekap Data Konsumen</span></h1>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {action}
      </div>
    </header>
  );
};