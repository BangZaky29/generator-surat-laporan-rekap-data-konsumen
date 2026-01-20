// @ts-ignore
import html2pdf from 'html2pdf.js';

export const downloadPDF = async (element: HTMLElement, filename: string) => {
  // 1. CLONE the element to manipulate it without affecting the UI
  const clone = element.cloneNode(true) as HTMLElement;
  
  // 2. FORCE DESKTOP STYLES ON CLONE
  // Remove any mobile-specific scaling transforms
  clone.style.transform = 'none';
  clone.style.width = 'fit-content'; // Allow natural A4 width
  clone.style.maxWidth = 'none'; // CRITICAL: override any max-width constraints
  clone.style.margin = '0 auto';
  
  // Ensure the clone's inner content (the A4 page) is visible and standard size
  // We assume the .a4-page class handles the 210mm width.
  // We need to place this clone in a container that allows it to expand.
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.top = '-9999px';
  container.style.left = '-9999px';
  container.style.width = '1200px'; // Desktop mock width
  container.style.zIndex = '-100';
  container.appendChild(clone);
  document.body.appendChild(container);

  const opt = {
    margin: 0, 
    filename: filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { 
      scale: 2, 
      useCORS: true,
      logging: false,
      windowWidth: 1200 // Simulate desktop window
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait' as const 
    },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  try {
    // Generate from the CLONE, not the original scaled mobile element
    await html2pdf().set(opt).from(clone).save();
    
    // Cleanup
    if(document.body.contains(container)) {
      document.body.removeChild(container);
    }
    return true;
  } catch (error) {
    console.error('PDF Generation failed:', error);
    if(document.body.contains(container)) {
        document.body.removeChild(container);
    }
    return false;
  }
};