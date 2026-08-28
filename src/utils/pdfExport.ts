import { isAppleTouchDevice } from './browser';

const loadHtml2Pdf = async () => {
  const mod = await import('html2pdf.js');
  const fn = mod.default;
  if (typeof fn !== 'function') {
    throw new Error('html2pdf failed to load');
  }
  return fn;
};

const openBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob);
  const opened = window.open(url, '_blank');
  if (opened) opened.opener = null;
  if (!opened) {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }
  window.setTimeout(() => URL.revokeObjectURL(url), 60_000);
};

export const downloadElementPdf = async (element: HTMLElement, filename: string): Promise<void> => {
  const appleTouch = isAppleTouchDevice();
  const html2pdf = await loadHtml2Pdf();
  const opt = {
    margin: [10, 12, 10, 12] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.92 },
    html2canvas: {
      scale: appleTouch ? 1.25 : 2,
      useCORS: true,
      logging: false,
      windowWidth: 794,
      foreignObjectRendering: false,
      backgroundColor: '#ffffff',
      imageTimeout: 8000,
    },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  };

  try {
    if (appleTouch) {
      const blob = (await html2pdf().set(opt).from(element).outputPdf('blob')) as Blob;
      const file = new File([blob], filename, { type: 'application/pdf' });
      const shareData = { files: [file], title: filename };
      if (typeof navigator.canShare === 'function' && navigator.canShare(shareData) && navigator.share) {
        try {
          await navigator.share(shareData);
          return;
        } catch (err) {
          if ((err as { name?: string })?.name === 'AbortError') return;
        }
      }
      openBlob(blob, filename);
      return;
    }

    await html2pdf().set(opt).from(element).save();
  } catch {
    try {
      window.print();
    } catch {
      /* last resort failed */
    }
  }
};
