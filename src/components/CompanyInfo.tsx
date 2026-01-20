import React from 'react';
import { CompanyConfig } from '../types';
import { fileToBase64 } from '../utils/localStorageHandler';
import { Building2, Upload, Trash2 } from 'lucide-react';

interface CompanyInfoProps {
  data: CompanyConfig;
  onChange: (data: CompanyConfig) => void;
}

export const CompanyInfo: React.FC<CompanyInfoProps> = ({ data, onChange }) => {
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      onChange({ ...data, logo: base64 });
    }
  };

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
          <Building2 size={20} /> Data Perusahaan
        </h3>
        <label className="flex items-center cursor-pointer gap-2 text-sm">
          <input 
            type="checkbox" 
            checked={data.useLetterhead} 
            onChange={(e) => onChange({...data, useLetterhead: e.target.checked})}
            className="rounded text-blue-600 focus:ring-blue-500"
          />
          <span className="font-medium text-gray-700">Pakai Kop Surat</span>
        </label>
      </div>

      {data.useLetterhead && (
        <div className="grid gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Perusahaan</label>
            <input 
              type="text" 
              value={data.name}
              onChange={(e) => onChange({...data, name: e.target.value})}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Alamat Lengkap</label>
            <textarea 
              value={data.address}
              onChange={(e) => onChange({...data, address: e.target.value})}
              rows={2}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
            />
          </div>
          
          <div className="flex gap-4 items-start">
             <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Kontak / Telp</label>
                <input 
                  type="text" 
                  value={data.phone}
                  onChange={(e) => onChange({...data, phone: e.target.value})}
                  className="w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2 border"
                />
             </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Logo</label>
                <div className="flex items-center gap-2">
                  {data.logo ? (
                    <div className="relative group">
                      <img src={data.logo} className="h-10 w-auto object-contain border rounded p-1" />
                      <button 
                        onClick={() => onChange({...data, logo: null})}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-sm"
                      >
                        <Trash2 size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-md px-3 py-2 text-xs flex items-center gap-1 transition-colors">
                      <Upload size={14} /> Upload
                      <input type="file" className="hidden" accept="image/*" onChange={handleLogoUpload} />
                    </label>
                  )}
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};