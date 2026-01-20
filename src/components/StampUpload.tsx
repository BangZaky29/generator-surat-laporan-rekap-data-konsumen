import React from 'react';
import { Upload, X } from 'lucide-react';
import { fileToBase64 } from '../utils/localStorageHandler';

interface StampUploadProps {
  value: string | null;
  onChange: (base64: string | null) => void;
}

export const StampUpload: React.FC<StampUploadProps> = ({ value, onChange }) => {
  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        onChange(base64);
      } catch (err) {
        console.error("Error reading file", err);
      }
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">Stempel / Cap (Opsional)</label>
      
      {value ? (
        <div className="relative inline-block border rounded-lg p-2 bg-white">
          <img src={value} alt="Stamp" className="h-24 w-24 object-contain" />
          <button 
            onClick={() => onChange(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 shadow-sm"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 mb-2 text-gray-400" />
              <p className="text-xs text-gray-500">Klik upload gambar stempel</p>
              <p className="text-[10px] text-gray-400">(PNG transparan recommended)</p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={handleFile} />
          </label>
        </div>
      )}
    </div>
  );
};