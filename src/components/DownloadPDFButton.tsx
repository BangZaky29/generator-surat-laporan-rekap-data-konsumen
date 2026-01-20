import React, { useState } from 'react';
import { Download, Loader2, CheckCircle2 } from 'lucide-react';
import { downloadPDF } from '../utils/downloadPDF';

interface Props {
  targetRef: React.RefObject<HTMLDivElement>;
  fileName: string;
  onSuccess?: () => void;
  variant?: 'header' | 'floating';
}

export const DownloadPDFButton: React.FC<Props> = ({ targetRef, fileName, onSuccess, variant = 'header' }) => {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (!targetRef.current) return;
    
    setLoading(true);
    // Slight delay to ensure any pending UI updates are flushed
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = await downloadPDF(targetRef.current, fileName);
    setLoading(false);
    
    if (success && onSuccess) {
      onSuccess();
    }
  };

  if (variant === 'floating') {
     return (
        <button
          onClick={handleDownload}
          disabled={loading}
          className="md:hidden fixed bottom-24 right-6 h-14 w-14 bg-gray-900 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-black transition-all z-40 focus:outline-none active:scale-90 border-2 border-white/20"
        >
          {loading ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
        </button>
     );
  }

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`
        flex items-center gap-2 bg-gray-900 text-white px-4 py-2.5 rounded-xl hover:bg-black transition-all disabled:opacity-70 disabled:cursor-not-allowed text-sm font-bold shadow-lg hover:shadow-gray-900/20 active:scale-95
        ${loading ? 'pr-5' : ''}
      `}
    >
      {loading ? (
        <Loader2 size={18} className="animate-spin" /> 
      ) : (
        <Download size={18} />
      )}
      <span className="hidden sm:inline">{loading ? 'Memproses...' : 'Download PDF'}</span>
      <span className="sm:hidden">{loading ? '...' : 'PDF'}</span>
    </button>
  );
};