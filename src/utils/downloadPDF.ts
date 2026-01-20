// @ts-ignore
import html2pdf from 'html2pdf.js';

export const downloadPDF = async (element: HTMLElement, filename: string) => {
  const opt = {
    margin: 0, // We handle margins in CSS inside the element
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      logging: false 
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    await html2pdf().set(opt).from(element).save();
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    return false;
  }
};