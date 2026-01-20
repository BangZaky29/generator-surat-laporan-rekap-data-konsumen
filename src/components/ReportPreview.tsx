import React, { forwardRef, useEffect, useState } from 'react';
import { Consumer, ReportMeta, CompanyConfig } from '../types';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface ReportPreviewProps {
  consumers: Consumer[];
  meta: ReportMeta;
  company: CompanyConfig;
}

const months = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
];

export const ReportPreview = forwardRef<HTMLDivElement, ReportPreviewProps>(({
  consumers,
  meta,
  company
}, ref) => {
  const [fitScale, setFitScale] = useState(1);
  const [zoomMode, setZoomMode] = useState(false); // false = Fit Width, true = Readable Zoom
  
  // Dynamic scaling logic for mobile devices
  useEffect(() => {
    const calculateScale = () => {
      // Only scale on screens smaller than md breakpoint (768px)
      if (window.innerWidth < 768) {
        // A4 width in pixels approx 794px (210mm * 3.78)
        const A4_WIDTH_PX = 794; 
        // Zero padding calculation to give max space
        const availableWidth = window.innerWidth;
        
        // Calculate scale to fit width perfectly (minus slight padding)
        const newScale = Math.min((availableWidth - 20) / A4_WIDTH_PX, 1);
        setFitScale(newScale);
      } else {
        setFitScale(1);
      }
    };

    calculateScale();
    window.addEventListener('resize', calculateScale);
    return () => window.removeEventListener('resize', calculateScale);
  }, []);

  // Decide current scale based on Zoom Mode
  // 1.0 allows full clarity and scrolling
  const currentScale = zoomMode ? 1.0 : fitScale;
  
  // A4 Width is ~794px
  const scaledWidth = 794 * currentScale;

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
  };

  // --- PAGINATION LOGIC ---
  const ITEMS_PER_FIRST_PAGE = 10;
  const ITEMS_PER_PAGE = 20;

  const pages = [];
  
  if (consumers.length === 0) {
    pages.push([]); // Empty page
  } else {
    // First page chunk
    pages.push(consumers.slice(0, ITEMS_PER_FIRST_PAGE));
    
    // Remaining chunks
    let remaining = consumers.slice(ITEMS_PER_FIRST_PAGE);
    while (remaining.length > 0) {
      pages.push(remaining.slice(0, ITEMS_PER_PAGE));
      remaining = remaining.slice(ITEMS_PER_PAGE);
    }
  }

  // Determine signature placement
  const lastPageIdx = pages.length - 1;
  const lastPageItems = pages[lastPageIdx].length;
  let signatureOnNewPage = false;
  
  if (lastPageIdx === 0 && lastPageItems > 7) {
     if(lastPageItems > 8) signatureOnNewPage = true;
  } else if (lastPageIdx > 0 && lastPageItems > 15) {
     signatureOnNewPage = true;
  }

  if (signatureOnNewPage) {
    pages.push([]); // Add empty page for signature
  }

  return (
    <div className={`bg-gray-100 p-1 md:p-8 overflow-auto flex min-h-screen items-start justify-center`}>
      
      {/* Mobile Zoom Toggle */}
      <button 
        onClick={() => setZoomMode(!zoomMode)}
        className="md:hidden fixed top-20 right-4 z-30 bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-200 active:scale-95 transition-all"
        aria-label={zoomMode ? "Kecilkan Tampilan" : "Perbesar Tampilan"}
      >
         {zoomMode ? <ZoomOut size={20}/> : <ZoomIn size={20}/>}
      </button>

      {/* 
         MOBILE SCALING CONTAINER 
         When ZoomMode is TRUE (scale 1.0), we force the width to be A4 size (794px).
         This physically expands the container, triggering the PARENT's overflow-auto.
      */}
      <div 
        className="mobile-preview-wrapper transition-all duration-200 ease-out origin-top-left relative"
        style={{ 
          // If zoomed on mobile, set width to full A4 pixel width. Otherwise auto/scaled.
          width: (window.innerWidth < 768 && zoomMode) ? '794px' : (window.innerWidth < 768 ? scaledWidth : 'auto'),
          // Prevent horizontal scroll on parent when FITTING to screen
          overflow: (window.innerWidth < 768 && !zoomMode) ? 'hidden' : 'visible'
        }}
      >
        
        <div 
          ref={ref} 
          id="report-content"
          style={{ 
            width: window.innerWidth < 768 ? '794px' : 'auto',
            transform: window.innerWidth < 768 ? `scale(${currentScale})` : 'none',
            transformOrigin: 'top left',
            // Negative margin only needed when SCALING DOWN to remove white space
            marginBottom: (window.innerWidth < 768 && !zoomMode) ? `-${(1 - currentScale) * 100}%` : '0',
          }}
        >
          {pages.map((pageData, pageIndex) => (
            <div 
              key={pageIndex}
              className="a4-page relative text-[11pt] leading-relaxed text-black bg-white mx-auto shadow-lg mb-8"
              style={{ pageBreakAfter: pageIndex < pages.length - 1 ? 'always' : 'auto' }}
            >
              {/* HEADER (Only on first page) */}
              {pageIndex === 0 && (
                <>
                  {company.useLetterhead && (
                    <div className="flex border-b-[3px] border-double border-black pb-4 mb-6 gap-4 items-center">
                      {company.logo && (
                        <img src={company.logo} alt="Logo" className="w-24 h-24 object-contain" />
                      )}
                      <div className={`flex-1 ${company.logo ? 'text-left' : 'text-center'}`}>
                        <h1 className="text-2xl font-extrabold uppercase tracking-wide font-serif">{company.name}</h1>
                        <p className="text-sm whitespace-pre-wrap leading-tight mt-1">{company.address}</p>
                        <p className="text-sm font-semibold mt-1">Telp: {company.phone}</p>
                      </div>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h2 className="text-lg font-bold underline uppercase tracking-wider">Laporan Rekapitulasi Data Konsumen</h2>
                    <table className="mx-auto mt-2 text-sm font-medium">
                      <tbody>
                        <tr>
                          <td className="text-right pr-2">Nomor :</td>
                          <td className="text-left">{meta.letterNumber}</td>
                        </tr>
                        <tr>
                          <td className="text-right pr-2">Periode :</td>
                          <td className="text-left">{months[meta.month]} {meta.year}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* HEADER SPACER FOR NEXT PAGES */}
              {pageIndex > 0 && (
                <div className="mb-8 text-right text-xs text-gray-400 italic border-b pb-2">
                  Lanjutan Laporan - Hal {pageIndex + 1}
                </div>
              )}

              {/* CONTENT TABLE */}
              <div className="w-full">
                {(pageData.length > 0 || (pageIndex === 0 && consumers.length === 0)) && (
                  <table className="w-full border-collapse border border-black text-[10pt]">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="border border-black p-2 w-10 text-center">No</th>
                        <th className="border border-black p-2 text-left">Nama Konsumen</th>
                        <th className="border border-black p-2 text-left w-32">Kontak</th>
                        <th className="border border-black p-2 text-left">Domisili</th>
                        <th className="border border-black p-2 text-left">Keperluan</th>
                        <th className="border border-black p-2 text-center w-20">Status</th>
                        <th className="border border-black p-2 text-left w-28">Ref. Inv</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageData.length > 0 ? (
                        pageData.map((c, i) => {
                          const globalIndex = (pageIndex === 0 ? 0 : ITEMS_PER_FIRST_PAGE + (pageIndex - 1) * ITEMS_PER_PAGE) + i + 1;
                          return (
                            <tr key={c.id}>
                              <td className="border border-black p-1.5 text-center">{globalIndex}</td>
                              <td className="border border-black p-1.5 font-semibold">{c.name}</td>
                              <td className="border border-black p-1.5">{c.phone}</td>
                              <td className="border border-black p-1.5">{c.city}</td>
                              <td className="border border-black p-1.5">{c.purpose}</td>
                              <td className="border border-black p-1.5 text-center">
                                <span className={`text-[10px] uppercase font-bold px-1 py-0.5 rounded ${
                                  c.status === 'Aktif' ? 'text-green-800 bg-green-100' :
                                  c.status === 'Non-Aktif' ? 'text-red-800 bg-red-100' :
                                  'text-yellow-800 bg-yellow-100'
                                }`}>
                                  {c.status}
                                </span>
                              </td>
                              <td className="border border-black p-1.5 text-xs font-mono">{c.invoiceRef}</td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan={7} className="border border-black p-8 text-center italic text-gray-500">
                            Belum ada data konsumen untuk periode ini.
                          </td>
                        </tr>
                      )}
                    </tbody>
                    {pageIndex === pages.length - (signatureOnNewPage ? 2 : 1) && (
                       <tfoot>
                         <tr className="bg-gray-50 font-bold">
                           <td colSpan={6} className="border border-black p-2 text-right">Total Data Keseluruhan:</td>
                           <td className="border border-black p-2 text-center">{consumers.length}</td>
                         </tr>
                       </tfoot>
                    )}
                  </table>
                )}
              </div>

              {/* SIGNATURE SECTION */}
              {pageIndex === pages.length - 1 && (
                <div className="flex justify-end mt-10 pr-10">
                  <div className="text-center w-64 relative">
                    <p className="mb-1">{meta.location}, {formatDate(meta.date)}</p>
                    <p className="font-bold mb-4">{meta.authorRole}</p>
                    
                    <div className="relative h-32 w-full flex items-center justify-center">
                      {meta.signature ? (
                        <img 
                          src={meta.signature} 
                          alt="TTD" 
                          className="relative z-10 h-28 object-contain" 
                        />
                      ) : (
                        <div className="h-28 w-full"></div>
                      )}

                      {meta.stamp && (
                        <img 
                          src={meta.stamp} 
                          alt="Stempel" 
                          className="absolute z-0 w-28 h-28 object-contain opacity-90 rotate-[-10deg]"
                          style={{ 
                            right: '20px', // Shifted left (from -20px to 20px)
                            bottom: '10px'
                          }} 
                        />
                      )}
                    </div>

                    <p className="font-bold border-b border-black inline-block min-w-[180px] mt-2 text-lg">
                      {meta.authorName}
                    </p>
                  </div>
                </div>
              )}

              {/* Page Number */}
              <div className="absolute bottom-4 right-8 text-xs text-gray-400">
                Halaman {pageIndex + 1} dari {pages.length}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

ReportPreview.displayName = 'ReportPreview';