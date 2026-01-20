import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { Eraser, PenLine } from 'lucide-react';

interface TTDUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
  authorName: string;
}

export const TTDUpload: React.FC<TTDUploadProps> = ({ value, onChange, authorName }) => {
  const sigCanvas = useRef<SignatureCanvas>(null);

  const clear = () => {
    sigCanvas.current?.clear();
    onChange(null);
  };

  const handleEnd = () => {
    if (sigCanvas.current) {
      try {
        // Attempt to get trimmed canvas (removes whitespace)
        // This might fail in some ESM environments due to dependency issues
        onChange(sigCanvas.current.getTrimmedCanvas().toDataURL('image/png'));
      } catch (error) {
        console.warn("Signature trim failed, falling back to full canvas", error);
        // Fallback: use full canvas if trim fails to prevent crash
        onChange(sigCanvas.current.toDataURL('image/png'));
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Tanda Tangan ({authorName})</label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white hover:border-blue-400 transition-colors">
        {value ? (
           <div className="relative group">
             <img src={value} alt="Signature" className="h-24 object-contain mx-auto" />
             <div className="absolute inset-0 bg-black/50 hidden group-hover:flex items-center justify-center rounded transition-all">
                <button 
                  onClick={() => onChange(null)}
                  className="text-white text-xs bg-red-600 px-3 py-1 rounded"
                >
                  Hapus
                </button>
             </div>
           </div>
        ) : (
          <SignatureCanvas 
            ref={sigCanvas}
            canvasProps={{
              className: "w-full h-32 bg-gray-50 rounded cursor-crosshair"
            }}
            // @ts-ignore
            onEnd={handleEnd}
          />
        )}
      </div>

      {!value && (
        <div className="flex justify-between items-center text-xs text-gray-500">
          <span className="flex items-center gap-1"><PenLine size={12}/> Tulis tanda tangan diatas</span>
          <button 
            onClick={clear}
            type="button"
            className="flex items-center gap-1 text-red-600 hover:text-red-700 font-medium"
          >
            <Eraser size={12} /> Reset Canvas
          </button>
        </div>
      )}
    </div>
  );
};