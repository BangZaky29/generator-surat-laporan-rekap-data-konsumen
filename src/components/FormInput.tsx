import React, { useState } from 'react';
import { Consumer, ReportMeta, CompanyConfig } from '../types';
import { TTDUpload } from './TTDUpload';
import { StampUpload } from './StampUpload';
import { CompanyInfo } from './CompanyInfo';
import { Plus, Trash2, Calendar, User, FileBadge, MapPin, Phone, Briefcase, FileText, Hash } from 'lucide-react';

interface FormInputProps {
  consumers: Consumer[];
  setConsumers: React.Dispatch<React.SetStateAction<Consumer[]>>;
  meta: ReportMeta;
  setMeta: React.Dispatch<React.SetStateAction<ReportMeta>>;
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Moved outside to prevent re-renders losing focus
const InputGroup = ({ icon: Icon, label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="relative">
    <label className="text-xs font-semibold text-gray-500 mb-1 block">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon size={16} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all shadow-sm"
      />
    </div>
  </div>
);

export const FormInput: React.FC<FormInputProps> = ({
  consumers,
  setConsumers,
  meta,
  setMeta,
  company,
  setCompany
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'meta'>('data');

  const addConsumer = () => {
    const newConsumer: Consumer = {
      id: crypto.randomUUID(),
      name: '',
      phone: '',
      email: '',
      city: '',
      purpose: '',
      status: 'Prospek',
      invoiceRef: '',
      dateAdded: new Date().toISOString()
    };
    setConsumers([...consumers, newConsumer]);
  };

  const updateConsumer = (id: string, field: keyof Consumer, value: string) => {
    setConsumers(consumers.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeConsumer = (id: string) => {
    if(confirm('Hapus data konsumen ini?')) {
      setConsumers(consumers.filter(c => c.id !== id));
    }
  };

  return (
    <div className="space-y-6 pb-32 md:pb-0">
      
      {/* Top Filter Bar */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 grid grid-cols-2 gap-4">
         <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Tahun Laporan</label>
            <div className="relative">
              <select 
                value={meta.year}
                onChange={(e) => setMeta({...meta, year: parseInt(e.target.value)})}
                className="appearance-none block w-full rounded-xl border-gray-200 bg-gray-50 text-gray-800 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 font-bold"
              >
                {[2023, 2024, 2025, 2026, 2027].map(y => <option key={y} value={y}>{y}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
         </div>
         <div>
            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 block">Bulan Laporan</label>
            <div className="relative">
              <select 
                value={meta.month}
                onChange={(e) => setMeta({...meta, month: parseInt(e.target.value)})}
                className="appearance-none block w-full rounded-xl border-gray-200 bg-gray-50 text-gray-800 py-3 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-blue-500 font-bold"
              >
                {months.map((m, idx) => <option key={idx} value={idx}>{m}</option>)}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
         </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-gray-200 rounded-xl">
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'data' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Data Konsumen
        </button>
        <button
          onClick={() => setActiveTab('meta')}
          className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all ${activeTab === 'meta' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Info Surat
        </button>
      </div>

      {/* Content */}
      {activeTab === 'data' ? (
        <div className="space-y-4 animate-fadeIn">
           {consumers.map((consumer, index) => (
             <div key={consumer.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
                
                <div className="flex justify-between items-center mb-4 pl-3">
                  <h4 className="font-bold text-gray-800 flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-mono">#{index + 1}</span>
                    Data Konsumen
                  </h4>
                  <button onClick={() => removeConsumer(consumer.id)} className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all">
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3">
                   <div className="md:col-span-2">
                     <InputGroup 
                        icon={User} label="Nama Lengkap" placeholder="Contoh: Budi Santoso"
                        value={consumer.name} onChange={(e: any) => updateConsumer(consumer.id, 'name', e.target.value)}
                     />
                   </div>
                   
                   <InputGroup 
                      icon={Phone} label="Nomor HP / WhatsApp" placeholder="0812..."
                      value={consumer.phone} onChange={(e: any) => updateConsumer(consumer.id, 'phone', e.target.value)}
                   />
                   
                   <InputGroup 
                      icon={MapPin} label="Domisili (Kota/Kab)" placeholder="Contoh: Jakarta Selatan"
                      value={consumer.city} onChange={(e: any) => updateConsumer(consumer.id, 'city', e.target.value)}
                   />

                   <InputGroup 
                      icon={Briefcase} label="Keperluan" placeholder="Contoh: Pembelian Unit"
                      value={consumer.purpose} onChange={(e: any) => updateConsumer(consumer.id, 'purpose', e.target.value)}
                   />

                   <div className="relative">
                      <label className="text-xs font-semibold text-gray-500 mb-1 block">Status</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <FileBadge size={16} />
                        </div>
                        <select 
                            value={consumer.status}
                            onChange={(e) => updateConsumer(consumer.id, 'status', e.target.value as any)}
                            className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-blue-500 sm:text-sm p-2.5 transition-all shadow-sm"
                        >
                          <option value="Prospek">Prospek</option>
                          <option value="Aktif">Aktif</option>
                          <option value="Non-Aktif">Non-Aktif</option>
                        </select>
                      </div>
                   </div>

                   <div className="md:col-span-2">
                      <InputGroup 
                          icon={FileText} label="Referensi Invoice / SPH" placeholder="INV/2024/..."
                          value={consumer.invoiceRef} onChange={(e: any) => updateConsumer(consumer.id, 'invoiceRef', e.target.value)}
                      />
                   </div>
                </div>
             </div>
           ))}
           
           <button 
             onClick={addConsumer}
             className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50/50 rounded-2xl hover:bg-blue-50 flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
           >
             <Plus size={20} /> Tambah Data Konsumen
           </button>
        </div>
      ) : (
        <div className="space-y-6 animate-fadeIn">
          <CompanyInfo data={company} onChange={setCompany} />
          
          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
             <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 pb-2 border-b border-gray-100">
               <FileBadge size={20} className="text-blue-600" /> Detail Surat
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup 
                   icon={Hash} label="Nomor Surat"
                   value={meta.letterNumber} onChange={(e: any) => setMeta({...meta, letterNumber: e.target.value})}
                />
                
                <div>
                   <label className="text-xs font-semibold text-gray-500 mb-1 block">Tempat & Tanggal</label>
                   <div className="flex gap-2">
                      <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                          <MapPin size={16} />
                        </div>
                        <input 
                          value={meta.location}
                          onChange={(e) => setMeta({...meta, location: e.target.value})}
                          className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 sm:text-sm p-2.5"
                          placeholder="Kota"
                        />
                      </div>
                      <input 
                        type="date"
                        value={meta.date}
                        onChange={(e) => setMeta({...meta, date: e.target.value})}
                        className="block w-full rounded-lg border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 sm:text-sm p-2.5"
                      />
                   </div>
                </div>
             </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-5">
             <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800 pb-2 border-b border-gray-100">
               <User size={20} className="text-blue-600" /> Penanggung Jawab
             </h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InputGroup 
                   icon={User} label="Nama Lengkap"
                   value={meta.authorName} onChange={(e: any) => setMeta({...meta, authorName: e.target.value})}
                />
                <InputGroup 
                   icon={Briefcase} label="Jabatan"
                   value={meta.authorRole} onChange={(e: any) => setMeta({...meta, authorRole: e.target.value})}
                />
                
                <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    <TTDUpload 
                      value={meta.signature} 
                      onChange={(v) => setMeta({...meta, signature: v})} 
                      authorName={meta.authorName}
                    />
                    <StampUpload 
                      value={meta.stamp}
                      onChange={(v) => setMeta({...meta, stamp: v})}
                    />
                </div>
             </div>
          </div>
        </div>
      )}
    </div>
  );
};