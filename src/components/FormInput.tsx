import React, { useState, useMemo } from 'react';
import { Consumer, ReportMeta, CompanyConfig } from '../types';
import { TTDUpload } from './TTDUpload';
import { StampUpload } from './StampUpload';
import { CompanyInfo } from './CompanyInfo';
import { ConfirmationModal } from './ConfirmationModal';
import { 
  Plus, Trash2, User, MapPin, 
  Phone, Briefcase, FileText, Hash, Calendar,
  Settings, Users, Search, Edit2, X
} from 'lucide-react';

interface FormInputProps {
  consumers: Consumer[];
  setConsumers: React.Dispatch<React.SetStateAction<Consumer[]>>;
  meta: ReportMeta;
  setMeta: React.Dispatch<React.SetStateAction<ReportMeta>>;
  company: CompanyConfig;
  setCompany: React.Dispatch<React.SetStateAction<CompanyConfig>>;
  onShowToast: (message: string) => void;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

// Helper Input Component
const InputGroup = ({ icon: Icon, label, value, onChange, placeholder, type = 'text', required = false }: any) => (
  <div className="relative w-full">
    <label className="text-xs font-bold text-gray-600 mb-1.5 flex items-center gap-1 uppercase tracking-wide">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="pl-10 block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border transition-all hover:border-blue-300"
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
  setCompany,
  onShowToast
}) => {
  const [activeTab, setActiveTab] = useState<'data' | 'settings'>('data');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Initial form state
  const initialForm = {
    name: '',
    phone: '',
    email: '',
    city: '',
    purpose: '',
    status: 'Aktif' as Consumer['status'],
    invoiceRef: ''
  };

  const [formData, setFormData] = useState(initialForm);

  // Filter consumers based on selected Year/Month in Meta
  const filteredConsumers = useMemo(() => {
    return consumers.filter(c => {
      const d = new Date(c.dateAdded);
      return d.getMonth() === meta.month && d.getFullYear() === meta.year;
    });
  }, [consumers, meta.month, meta.year]);

  const handleInputChange = (field: keyof typeof initialForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value as any }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingId) {
      setConsumers(prev => prev.map(c => 
        c.id === editingId ? { ...c, ...formData } : c
      ));
      onShowToast('Data konsumen berhasil diperbarui');
      setEditingId(null);
    } else {
      // Create date matching the current report period
      const newDate = new Date();
      newDate.setFullYear(meta.year);
      newDate.setMonth(meta.month);
      
      const newConsumer: Consumer = {
        id: crypto.randomUUID(),
        ...formData,
        dateAdded: newDate.toISOString()
      };
      setConsumers(prev => [...prev, newConsumer]);
      onShowToast('Konsumen baru berhasil ditambahkan');
    }
    setFormData(initialForm);
  };

  const handleEdit = (consumer: Consumer) => {
    setFormData({
      name: consumer.name,
      phone: consumer.phone,
      email: consumer.email,
      city: consumer.city,
      purpose: consumer.purpose,
      status: consumer.status,
      invoiceRef: consumer.invoiceRef
    });
    setEditingId(consumer.id);
    setActiveTab('data');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const confirmDelete = () => {
    if (deleteId) {
      setConsumers(prev => prev.filter(c => c.id !== deleteId));
      onShowToast('Data konsumen dihapus');
      setIsDeleteModalOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6 pb-20 md:pb-0">
      
      {/* --- PERIOD & GLOBAL SETTINGS --- */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
            <Calendar className="text-blue-600" /> Periode Laporan
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Bulan</label>
            <select 
              value={meta.month} 
              onChange={(e) => setMeta({ ...meta, month: parseInt(e.target.value) })}
              className="w-full rounded-xl border-gray-300 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Tahun</label>
            <select 
              value={meta.year} 
              onChange={(e) => setMeta({ ...meta, year: parseInt(e.target.value) })}
              className="w-full rounded-xl border-gray-300 py-2 text-sm focus:ring-blue-500 focus:border-blue-500"
            >
              {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i).map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* --- TABS --- */}
      <div className="flex p-1 bg-gray-200 rounded-xl font-medium text-sm">
        <button
          onClick={() => setActiveTab('data')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'data' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Users size={16} /> Data Konsumen
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 py-2.5 rounded-lg flex items-center justify-center gap-2 transition-all ${
            activeTab === 'settings' ? 'bg-white text-blue-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Settings size={16} /> Pengaturan Surat
        </button>
      </div>

      {/* --- CONTENT: DATA TAB --- */}
      {activeTab === 'data' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Form Input */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 text-lg flex items-center gap-2">
                {editingId ? <Edit2 size={20} className="text-orange-500" /> : <Plus size={20} className="text-green-500" />}
                {editingId ? 'Edit Konsumen' : 'Tambah Konsumen'}
              </h3>
              {editingId && (
                <button 
                  onClick={() => { setEditingId(null); setFormData(initialForm); }}
                  className="text-xs bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                >
                  <X size={12} /> Batal Edit
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  icon={User} label="Nama Lengkap" required 
                  value={formData.name} onChange={(e: any) => handleInputChange('name', e.target.value)} 
                  placeholder="Contoh: Budi Santoso"
                />
                <InputGroup 
                  icon={Phone} label="No. Handphone" 
                  value={formData.phone} onChange={(e: any) => handleInputChange('phone', e.target.value)} 
                  placeholder="0812..."
                  type="tel"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InputGroup 
                  icon={MapPin} label="Domisili (Kota/Kab)" 
                  value={formData.city} onChange={(e: any) => handleInputChange('city', e.target.value)} 
                  placeholder="Jakarta Selatan"
                />
                <InputGroup 
                  icon={Briefcase} label="Keperluan" 
                  value={formData.purpose} onChange={(e: any) => handleInputChange('purpose', e.target.value)} 
                  placeholder="Pembelian Unit / Servis"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">Status</label>
                   <select 
                      value={formData.status}
                      onChange={(e) => handleInputChange('status', e.target.value)}
                      className="block w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm py-2.5 border px-3"
                   >
                     <option value="Aktif">Aktif</option>
                     <option value="Non-Aktif">Non-Aktif</option>
                     <option value="Prospek">Prospek</option>
                   </select>
                </div>
                <InputGroup 
                  icon={Hash} label="Ref. Invoice / SPH" 
                  value={formData.invoiceRef} onChange={(e: any) => handleInputChange('invoiceRef', e.target.value)} 
                  placeholder="INV/2024/001"
                />
              </div>

              <button 
                type="submit" 
                className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 ${
                  editingId ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
                }`}
              >
                {editingId ? <Edit2 size={18} /> : <Plus size={18} />}
                {editingId ? 'Update Data' : 'Tambah Data ke Daftar'}
              </button>
            </form>
          </div>

          {/* List Display */}
          <div className="space-y-3">
             <div className="flex justify-between items-center px-2">
               <h3 className="font-bold text-gray-700 flex items-center gap-2">
                 <Users size={18} /> Daftar Konsumen
                 <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">{filteredConsumers.length}</span>
               </h3>
               <div className="text-xs text-gray-500">
                 {months[meta.month]} {meta.year}
               </div>
             </div>
             
             {filteredConsumers.length === 0 ? (
               <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-gray-400">
                 <Search size={40} className="mx-auto mb-2 opacity-50" />
                 <p>Belum ada data di bulan ini</p>
               </div>
             ) : (
               <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1 custom-scrollbar">
                 {filteredConsumers.map((item) => (
                   <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow group relative">
                     <div className="flex justify-between items-start">
                       <div>
                         <h4 className="font-bold text-gray-900">{item.name}</h4>
                         <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                           <MapPin size={10} /> {item.city} &bull; {item.phone}
                         </p>
                         <div className="mt-2 flex gap-2">
                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${
                              item.status === 'Aktif' ? 'bg-green-100 text-green-700' :
                              item.status === 'Non-Aktif' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                            }`}>
                              {item.status}
                            </span>
                            {item.invoiceRef && (
                              <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded font-mono border">
                                {item.invoiceRef}
                              </span>
                            )}
                         </div>
                       </div>
                       <div className="flex gap-1">
                         <button 
                           onClick={() => handleEdit(item)}
                           className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                         >
                           <Edit2 size={16} />
                         </button>
                         <button 
                           onClick={() => { setDeleteId(item.id); setIsDeleteModalOpen(true); }}
                           className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                         >
                           <Trash2 size={16} />
                         </button>
                       </div>
                     </div>
                   </div>
                 ))}
               </div>
             )}
          </div>
        </div>
      )}

      {/* --- CONTENT: SETTINGS TAB --- */}
      {activeTab === 'settings' && (
        <div className="space-y-6 animate-fadeIn">
           {/* Company Config */}
           <CompanyInfo data={company} onChange={setCompany} />

           {/* Letter Meta */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <FileText size={18} className="text-blue-600" /> Detail Surat
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup 
                    icon={Hash} label="Nomor Surat" 
                    value={meta.letterNumber} onChange={(e: any) => setMeta({...meta, letterNumber: e.target.value})}
                 />
                 <InputGroup 
                    icon={Calendar} label="Tanggal Surat" type="date"
                    value={meta.date} onChange={(e: any) => setMeta({...meta, date: e.target.value})}
                 />
                 <InputGroup 
                    icon={MapPin} label="Tempat / Kota" 
                    value={meta.location} onChange={(e: any) => setMeta({...meta, location: e.target.value})}
                 />
              </div>
           </div>

           {/* Author & Signature */}
           <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 space-y-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b pb-2">
                <User size={18} className="text-blue-600" /> Penandatangan
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <InputGroup 
                    icon={User} label="Nama Lengkap" 
                    value={meta.authorName} onChange={(e: any) => setMeta({...meta, authorName: e.target.value})}
                 />
                 <InputGroup 
                    icon={Briefcase} label="Jabatan" 
                    value={meta.authorRole} onChange={(e: any) => setMeta({...meta, authorRole: e.target.value})}
                 />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <TTDUpload 
                  value={meta.signature} 
                  onChange={(sig) => setMeta({...meta, signature: sig})} 
                  authorName={meta.authorName || 'Staff'} 
                />
                <StampUpload 
                  value={meta.stamp} 
                  onChange={(stmp) => setMeta({...meta, stamp: stmp})} 
                />
              </div>
           </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal 
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Data?"
        message="Data konsumen yang dihapus tidak dapat dikembalikan lagi. Pastikan Anda memilih data yang benar."
      />

    </div>
  );
};