import React from 'react';
import { Info } from 'lucide-react';
import type { Language } from '../types';

interface PrototypeBoundaryBannerProps {
  currentLang: Language;
  onOpen: () => void;
}

export const PrototypeBoundaryBanner: React.FC<PrototypeBoundaryBannerProps> = ({
  currentLang,
  onOpen,
}) => {
  const hi = currentLang === 'hi';

  return (
    <button
      type="button"
      className="prototype-boundary-trigger"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={hi ? 'प्रोटोटाइप के बारे में जानें' : 'About this prototype'}
      title={hi ? 'प्रोटोटाइप के बारे में' : 'About this prototype'}
    >
      <Info size={14} strokeWidth={2.25} aria-hidden="true" />
      <span className="prototype-boundary-trigger-label">{hi ? 'प्रोटोटाइप के बारे में' : 'About prototype'}</span>
    </button>
  );
};
