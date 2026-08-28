import React from 'react';
import type { AppStep, Language } from '../types';

interface StepTrackerProps {
  currentStep: AppStep;
  currentLang: Language;
}

export const StepTracker: React.FC<StepTrackerProps> = ({
  currentStep,
  currentLang,
}) => {
  const steps: { id: AppStep; labelEn: string; labelHi: string }[] = [
    { id: 'intake', labelEn: '1. Report', labelHi: '1. शिकायत' },
    { id: 'review', labelEn: '2. Check', labelHi: '2. जाँच' },
    { id: 'freeze', labelEn: '3. Act', labelHi: '3. कार्रवाई' },
    { id: 'radar', labelEn: '4. Track', labelHi: '4. स्थिति' },
  ];

  const currentIndex =
    currentStep === 'petition'
      ? steps.length - 1
      : steps.findIndex((s) => s.id === currentStep);

  return (
    <nav className="steps" aria-label="Progress">
      <div className="page-wrap">
        <div className="steps-row">
          {steps.map((step, idx) => (
            <span
              key={step.id}
              className={
                idx === currentIndex ? 'is-current' : idx < currentIndex ? 'is-done' : ''
              }
            >
              {currentLang === 'hi' ? step.labelHi : step.labelEn}
            </span>
          ))}
        </div>
      </div>
    </nav>
  );
};
