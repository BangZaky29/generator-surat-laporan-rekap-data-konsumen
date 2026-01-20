import React, { useState } from 'react';
import { Consumer, ReportMeta, CompanyConfig } from '../types';
import { TTDUpload } from './TTDUpload';
import { StampUpload } from './StampUpload';
import { CompanyInfo } from './CompanyInfo';
import { ConfirmationModal } from './ConfirmationModal';
import { 
  Plus, Trash2, User, FileBadge, MapPin, 
  Phone, Briefcase, FileText, Hash, ChevronLeft, ChevronRight, LayoutList, Calendar,
  ChevronDown, ChevronUp, Building2
} from 'lucide-react';

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

// Helper Input Component with Label on Top
const InputGroup = ({ icon: Icon, label, value, onChange, placeholder, type = 'text' }: any) => (
  <div className="relative w-full">
    <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">{label}</label>
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
        <Icon size={18} />
      </div>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="pl-10 block w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-3 transition-all shadow-sm"
      />
    </div>
  </div>
);

// Accordion Item Component
const AccordionItem = ({ title, icon: Icon, isOpen, onToggle, children }: any) => (
  <div className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden ${isOpen ? 'border-blue-500 shadow-md ring-1 ring-blue-500' : 'border-gray-200 shadow-sm'}`}>
    <button 
      onClick={onToggle}
      className={`w-full flex items-center justify-between p-4 transition-colors ${isOpen ? 'bg-blue-50 text-blue-700' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
    >
      <div className="flex items-center gap-3 font-bold text-sm md:text-base">
        <Icon size={20} className={isOpen ? 'text-blue-600' : 'text-gray-400'} />
        {title}
      </div>
      {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
    </button>
    
    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      <div className="p-5 border-t border-gray-100">
        {children}
      </div>
    </div>
  </div>
);

// Component for Single Consumer Card (Extracted to prevent re-renders)
interface ConsumerCardProps {
  consumer: Consumer;
  index: number;
  isMobile?: boolean;
  onUpdate: (id: string, field: keyof Consumer, value: string) => void;
  onDelete: (id: string) => void;
}

const ConsumerCard: React.FC<ConsumerCardProps> = ({ consumer, index, isMobile = false, onUpdate, onDelete }) => (
  <div className={`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden ${!isMobile ? 'hover:shadow-md transition-shadow' : ''}`}>
    <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500"></div>
    
    <div className="flex justify-between items-center mb-5 pl-3 border-b border-gray-100 pb-3">
      <h4 className="font-bold text-gray-800 flex items-center gap-2">
        <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-mono">#{index + 1}</span>
        Data Konsumen
      </h4>
      <button onClick={() => onDelete(consumer.id)} className="text-gray-300 hover:text-red-500 bg-gray-50 hover:bg-red-50 p-2 rounded-full transition-all">
        <Trash2 size={18} />
      </button>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pl-3">
        <div className="md:col-span-2">
          <InputGroup 
            icon={User} label="Nama Lengkap" placeholder="Contoh: Budi Santoso"
            value={consumer.name} onChange={(e: any) => onUpdate(consumer.id, 'name', e.target.value)}
          />
        </div>
        
        <InputGroup 
          icon={Phone} label="Nomor HP / WhatsApp" placeholder="0812..."
          value={consumer.phone} onChange={(e: any) => onUpdate(consumer.id, 'phone', e.target.value)}
        />
        
        <InputGroup 
          icon={MapPin} label="Domisili (Kota/Kab)" placeholder="Contoh: Jakarta Selatan"
          value={consumer.city} onChange={(e: any) => onUpdate(consumer.id, 'city', e.target.value)}
        />

        <InputGroup 
          icon={Briefcase} label="Keperluan" placeholder="Contoh: Pembelian Unit"
          value={consumer.purpose} onChange={(e: any) => onUpdate(consumer.id, 'purpose', e.target.value)}
        />

        <div className="relative w-full">
          <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">Status</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <FileBadge size={18} />
            </div>
            <select 
                value={consumer.status}
                onChange={(e) => onUpdate(consumer.id, 'status', e.target.value as any)}
                className="pl-10 block w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-3 transition-all shadow-sm appearance-none"
            >
              <option value="Prospek">Prospek</option>
              <option value="Aktif">Aktif</option>
              <option value="Non-Aktif">Non-Aktif</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <InputGroup 
              icon={FileText} label="Referensi Invoice / SPH" placeholder="INV/2024/..."
              value={consumer.invoiceRef} onChange={(e: any) => onUpdate(consumer.id, 'invoiceRef', e.target.value)}
          />
        </div>
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
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Accordion State
  const [openSection, setOpenSection] = useState<string | null>('company');

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };
  
  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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
    // Auto switch to new item
    setCurrentIndex(consumers.length);
  };

  const updateConsumer = (id: string, field: keyof Consumer, value: string) => {
    setConsumers(consumers.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const initiateDelete = (id: string) => {
    setDeleteId(id);
    setModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      setConsumers(prev => prev.filter(c => c.id !== deleteId));
      // Adjust index if we deleted the last item
      if (currentIndex >= consumers.length - 1 && currentIndex > 0) {
        setCurrentIndex(curr => curr - 1);
      }
      setDeleteId(null);
    }
  };

  // Navigation handlers
  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const handleNext = () => {
    if (currentIndex < consumers.length - 1) setCurrentIndex(prev => prev + 1);
  };

  return (
    <div className="space-y-6 pb-32 md:pb-0">
      
      {/* Confirmation Modal */}
      <ConfirmationModal 
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmDelete}
        title="Hapus Konsumen?"
        message="Data yang dihapus tidak dapat dikembalikan. Lanjutkan?"
      />

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
                <Hash size={16} />
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
                <Calendar size={16} />
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
        <div className="animate-fadeIn">
           
           {/* Mobile View: Carousel / Card Stack */}
           <div className="md:hidden space-y-4">
              {consumers.length > 0 ? (
                <>
                  {/* Navigation Control */}
                  <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-gray-200 shadow-sm">
                     <button 
                       onClick={handlePrev} 
                       disabled={currentIndex === 0}
                       className="p-3 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-blue-600"
                     >
                       <ChevronLeft size={24} />
                     </button>
                     <div className="text-center">
                        <span className="text-sm font-bold text-gray-800">
                          Data {currentIndex + 1} <span className="text-gray-400 font-normal">dari {consumers.length}</span>
                        </span>
                     </div>
                     <button 
                       onClick={handleNext} 
                       disabled={currentIndex === consumers.length - 1}
                       className="p-3 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-blue-600"
                     >
                       <ChevronRight size={24} />
                     </button>
                  </div>

                  {/* Single Card Display */}
                  <div className="transition-all duration-300">
                     <ConsumerCard 
                        consumer={consumers[currentIndex]} 
                        index={currentIndex} 
                        isMobile={true}
                        onUpdate={updateConsumer}
                        onDelete={initiateDelete} 
                     />
                  </div>
                </>
              ) : (
                <div className="text-center py-10 bg-white rounded-2xl border-2 border-dashed border-gray-300">
                   <div className="bg-gray-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-3">
                      <LayoutList className="text-gray-400" size={32} />
                   </div>
                   <p className="text-gray-500 font-medium">Belum ada data konsumen</p>
                </div>
              )}

              <button 
                onClick={addConsumer}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 font-bold transition-all active:scale-95"
              >
                <Plus size={20} /> Tambah Data Baru
              </button>
           </div>

           {/* Desktop View: List List */}
           <div className="hidden md:block space-y-4">
              {consumers.map((consumer, index) => (
                <ConsumerCard 
                    key={consumer.id} 
                    consumer={consumer} 
                    index={index} 
                    onUpdate={updateConsumer}
                    onDelete={initiateDelete}
                />
              ))}
              <button 
                onClick={addConsumer}
                className="w-full py-4 border-2 border-dashed border-blue-300 text-blue-600 bg-blue-50/50 rounded-2xl hover:bg-blue-50 flex items-center justify-center gap-2 font-bold transition-all hover:scale-[1.01] active:scale-[0.99]"
              >
                <Plus size={20} /> Tambah Data Konsumen
              </button>
           </div>

        </div>
      ) : (
        <div className="space-y-4 animate-fadeIn">
          
          {/* Accordion 1: Data Perusahaan */}
          <AccordionItem 
            title="Data Perusahaan" 
            icon={Building2}
            isOpen={openSection === 'company'}
            onToggle={() => toggleSection('company')}
          >
            <CompanyInfo data={company} onChange={setCompany} />
          </AccordionItem>

          {/* Accordion 2: Detail Surat */}
          <AccordionItem 
            title="Detail Surat" 
            icon={FileBadge}
            isOpen={openSection === 'detail'}
            onToggle={() => toggleSection('detail')}
          >
             <div className="grid grid-cols-1 gap-5">
                <InputGroup 
                   icon={Hash} label="Nomor Surat"
                   value={meta.letterNumber} onChange={(e: any) => setMeta({...meta, letterNumber: e.target.value})}
                />
                
                {/* Fixed Layout for Place & Date */}
                <div className="space-y-4">
                   <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1">
                        <InputGroup 
                          icon={MapPin} label="Tempat (Kota)"
                          value={meta.location} onChange={(e: any) => setMeta({...meta, location: e.target.value})}
                          placeholder="Contoh: Jakarta"
                        />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-600 mb-1.5 block uppercase tracking-wide">Tanggal Surat</label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Calendar size={18} />
                          </div>
                          <input 
                            type="date"
                            value={meta.date}
                            onChange={(e) => setMeta({...meta, date: e.target.value})}
                            className="pl-10 block w-full rounded-xl border-gray-300 bg-gray-50 border focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 sm:text-sm p-3 transition-all shadow-sm"
                          />
                        </div>
                      </div>
                   </div>
                </div>
             </div>
          </AccordionItem>

          {/* Accordion 3: Penanggung Jawab */}
          <AccordionItem 
            title="Penanggung Jawab" 
            icon={User}
            isOpen={openSection === 'signer'}
            onToggle={() => toggleSection('signer')}
          >
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
          </AccordionItem>
          
        </div>
      )}
    </div>
  );
};