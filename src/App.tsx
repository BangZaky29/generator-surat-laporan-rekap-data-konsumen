import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { FormInput } from './components/FormInput';
import { ReportPreview } from './components/ReportPreview';
import { MobileActionButton } from './components/MobileActionButton';
import { DownloadPDFButton } from './components/DownloadPDFButton';
import { loadState, saveState } from './utils/localStorageHandler';
import { AppState, ToastState } from './types';
import { CheckCircle2, AlertCircle } from 'lucide-react';
import SubscriptionGuard from './components/SubscriptionGuard';

function App() {
  // Load initial state from LocalStorage or use defaults
  const initialState = loadState();

  const [consumers, setConsumers] = useState(initialState.consumers);
  const [company, setCompany] = useState(initialState.company);
  const [meta, setMeta] = useState(initialState.meta);

  // Mobile View Mode State
  const [mobileMode, setMobileMode] = useState<'form' | 'preview'>('form');

  // Toast State
  const [toast, setToast] = useState<ToastState>({ show: false, message: '', type: 'success' });

  // Ref for PDF Generation
  const reportRef = useRef<HTMLDivElement>(null);

  // Persistence Effect: Save changes to LocalStorage
  useEffect(() => {
    const currentState: AppState = { consumers, company, meta };
    saveState(currentState);
  }, [consumers, company, meta]);

  // Determine PDF Filename
  const pdfFileName = `Laporan_Rekap_${meta.year}_${meta.month + 1}.pdf`;

  const showToastNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3000);
  };

  return (
    <SubscriptionGuard featureSlug="laporan-rekap-konsumen">
      <div className="min-h-screen bg-gray-100 flex flex-col font-sans">
        {/* 
         On mobile, we hide the header download button.
         It is replaced by the floating button in Preview mode.
      */}
        <Header
          action={
            <div className="hidden md:block">
              <DownloadPDFButton
                targetRef={reportRef}
                fileName={pdfFileName}
                onSuccess={() => showToastNotification('PDF Berhasil Diunduh!')}
              />
            </div>
          }
        />

        <main className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden relative">

          {/* Left Side: Form Input */}
          <div className={`
          flex-1 overflow-y-auto p-4 md:p-6
          ${mobileMode === 'preview' ? 'hidden md:block' : 'block'}
        `}>
            <div className="max-w-2xl mx-auto">
              <FormInput
                consumers={consumers}
                setConsumers={setConsumers}
                meta={meta}
                setMeta={setMeta}
                company={company}
                setCompany={setCompany}
                onShowToast={(msg) => showToastNotification(msg)}
              />
            </div>
          </div>

          {/* Right Side: Preview */}
          {/* On Mobile: Hidden if mode is form. On Desktop: Always visible as side panel */}
          <div className={`
          flex-1 bg-gray-200/80 overflow-auto border-l border-gray-300 relative
          ${mobileMode === 'form' ? 'hidden md:flex' : 'flex'}
        `}>
            <div className="w-full">
              <ReportPreview
                ref={reportRef}
                consumers={consumers}
                meta={meta}
                company={company}
              />
            </div>

            {/* Mobile Floating Download Button (Only visible in Preview Mode on Mobile) */}
            <div className="md:hidden">
              <DownloadPDFButton
                variant="floating"
                targetRef={reportRef}
                fileName={pdfFileName}
                onSuccess={() => showToastNotification('PDF Berhasil Disimpan!')}
              />
            </div>
          </div>

        </main>

        {/* Floating Action Button for Mobile Toggle */}
        <MobileActionButton mode={mobileMode} setMode={setMobileMode} />

        {/* Toast Notification Overlay */}
        {toast.show && (
          <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[60] toast-enter">
            <div className={`flex items-center gap-3 px-6 py-4 rounded-full shadow-2xl border ${toast.type === 'success' ? 'bg-gray-900 text-white border-gray-700' : 'bg-red-600 text-white border-red-700'
              }`}>
              {toast.type === 'success' ? <CheckCircle2 size={20} className="text-green-400" /> : <AlertCircle size={20} />}
              <span className="font-semibold text-sm">{toast.message}</span>
            </div>
          </div>
        )}
      </div>
    </SubscriptionGuard>
  );
}

export default App;