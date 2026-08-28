import React, { useMemo, useState } from 'react';
import { CheckCircle2, ShieldCheck, X, XCircle } from 'lucide-react';
import type { Language } from '../types';
import { CYBER_SAFETY_QUIZ } from '../data/cyberSafetyQuiz';

interface CyberSafetyQuizProps {
  currentLang: Language;
  onClose: () => void;
}

export const CyberSafetyQuiz: React.FC<CyberSafetyQuizProps> = ({ currentLang, onClose }) => {
  const hi = currentLang === 'hi';
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const question = CYBER_SAFETY_QUIZ[questionIndex];
  const selectedAnswer = answers[question.id];
  const isComplete = questionIndex === CYBER_SAFETY_QUIZ.length - 1 && selectedAnswer !== undefined;
  const score = useMemo(
    () => CYBER_SAFETY_QUIZ.reduce((total, item) => total + (answers[item.id] === item.correctIndex ? 1 : 0), 0),
    [answers]
  );

  const chooseAnswer = (index: number) => {
    if (selectedAnswer !== undefined) return;
    setAnswers((current) => ({ ...current, [question.id]: index }));
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswers({});
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <section
        className="bg-card border border-line rounded-2xl w-full max-w-2xl max-h-[94vh] flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cyber-safety-quiz-title"
      >
        <header className="flex items-center justify-between gap-4 p-4 sm:p-5 border-b border-line bg-soft rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#15803d] text-white flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h2 id="cyber-safety-quiz-title" className="text-lg font-bold">
                {hi ? 'साइबर सुरक्षा क्विज़' : 'Cyber-safety quiz'}
              </h2>
              <p className="text-xs text-muted">
                {hi ? '90 सेकंड में ठगी के संकेत पहचानें' : 'Spot scam signals in 90 seconds'}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon !w-9 !h-9" aria-label={hi ? 'क्विज़ बंद करें' : 'Close quiz'}>
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-5 sm:p-7">
          {isComplete ? (
            <div className="text-center py-6">
              <CheckCircle2 size={48} className="mx-auto text-success" />
              <p className="eyebrow mt-5">{hi ? 'अभ्यास पूरा' : 'Practice complete'}</p>
              <h3 className="text-3xl font-bold">
                {score}/{CYBER_SAFETY_QUIZ.length} {hi ? 'सही' : 'correct'}
              </h3>
              <p className="mt-3 text-muted max-w-md mx-auto">
                {hi
                  ? 'याद रखें: घबराएँ नहीं, सबूत सुरक्षित रखें और पैसे जाने पर तुरंत 1930 पर कॉल करें।'
                  : 'Remember: pause, preserve evidence, and call 1930 immediately if money was lost.'}
              </p>
              <div className="notice text-left mt-6">
                <p className="font-semibold text-ink">{hi ? 'अगला कदम' : 'Next step'}</p>
                <p className="mt-1 text-sm text-muted">
                  {hi
                    ? 'अगर यह वास्तविक घटना है, तो क्विज़ छोड़कर रिपोर्टिंग फ्लो शुरू करें।'
                    : 'If this is a real incident, leave the quiz and start the reporting flow.'}
                </p>
              </div>
              <div className="btn-group justify-center mt-7">
                <button type="button" className="btn-secondary" onClick={restart}>
                  {hi ? 'फिर से शुरू करें' : 'Try again'}
                </button>
                <button type="button" className="btn-primary" onClick={onClose}>
                  {hi ? 'बंद करें' : 'Close'}
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between gap-3 text-xs text-muted">
                <span>{hi ? question.categoryHi : question.category}</span>
                <span>{questionIndex + 1} / {CYBER_SAFETY_QUIZ.length}</span>
              </div>
              <div className="h-1.5 bg-soft rounded-full mt-3 overflow-hidden" aria-hidden="true">
                <div
                  className="h-full bg-[#15803d] transition-all"
                  style={{ width: `${((questionIndex + 1) / CYBER_SAFETY_QUIZ.length) * 100}%` }}
                />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold leading-tight mt-7">
                {hi ? question.scenarioHi : question.scenario}
              </h3>

              <div className="grid gap-3 mt-7" role="group" aria-label={hi ? 'उत्तर चुनें' : 'Choose an answer'}>
                {(hi ? question.optionsHi : question.options).map((option, index) => {
                  const isSelected = selectedAnswer === index;
                  const isCorrect = question.correctIndex === index;
                  const className =
                    selectedAnswer === undefined
                      ? 'border-line hover:border-ink hover:bg-soft'
                      : isCorrect
                        ? 'border-emerald-600 bg-emerald-500/10'
                        : isSelected
                          ? 'border-red-500 bg-red-500/10'
                          : 'border-line opacity-65';
                  return (
                    <button
                      key={option}
                      type="button"
                      onClick={() => chooseAnswer(index)}
                      disabled={selectedAnswer !== undefined}
                      className={`w-full text-left p-4 rounded-xl border transition-colors ${className}`}
                      aria-pressed={isSelected}
                    >
                      <span className="flex items-start gap-3">
                        <span className="font-mono text-muted">{String.fromCharCode(65 + index)}.</span>
                        <span className="flex-1">{option}</span>
                        {selectedAnswer !== undefined && isCorrect && <CheckCircle2 size={18} className="text-success shrink-0" />}
                        {selectedAnswer !== undefined && isSelected && !isCorrect && <XCircle size={18} className="text-danger shrink-0" />}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedAnswer !== undefined && (
                <div className={`notice mt-6 ${selectedAnswer === question.correctIndex ? 'border-emerald-600' : 'notice-urgent'}`} role="status">
                  <p className="font-semibold text-ink">
                    {selectedAnswer === question.correctIndex
                      ? (hi ? 'सही जवाब' : 'Correct answer')
                      : (hi ? 'इस बार नहीं' : 'Not quite')}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {hi ? question.explanationHi : question.explanation}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-ink">
                    {hi ? question.actionHi : question.action}
                  </p>
                </div>
              )}

              <div className="btn-group justify-between mt-7">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  {hi ? 'बंद करें' : 'Close'}
                </button>
                <button
                  type="button"
                  className="btn-primary"
                  disabled={selectedAnswer === undefined}
                  onClick={() => setQuestionIndex((index) => Math.min(index + 1, CYBER_SAFETY_QUIZ.length - 1))}
                >
                  {hi ? 'अगला सवाल' : 'Next question'} →
                </button>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
};
