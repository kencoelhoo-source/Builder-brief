import React, { useMemo, useState } from 'react';
import { AlertTriangle, BarChart3, CheckCircle2, Link2, Search, X } from 'lucide-react';
import type { Language } from '../types';
import {
  analyzeScamContent,
  calculateCyberSafetyScore,
  checkSuspiciousLink,
  getCyberSafetyActivity,
  updateCyberSafetyActivity,
  type LinkCheckResult,
  type ScamAnalysisResult,
} from '../services/cyberSafetyService';

export type CyberSafetyTool = 'analyzer' | 'link' | 'dashboard';

interface CyberSafetyToolsProps {
  currentLang: Language;
  initialTool: CyberSafetyTool;
  onClose: () => void;
}

const riskClass = (risk: string) => {
  if (risk.includes('CRITICAL') || risk.includes('HIGH')) return 'text-danger';
  if (risk.includes('MEDIUM') || risk.includes('SUSPICIOUS')) return 'text-[#8c5e0c]';
  return 'text-success';
};

export const CyberSafetyTools: React.FC<CyberSafetyToolsProps> = ({
  currentLang,
  initialTool,
  onClose,
}) => {
  const hi = currentLang === 'hi';
  const activeTool = initialTool;
  const [scamText, setScamText] = useState('');
  const [scamResult, setScamResult] = useState<ScamAnalysisResult | null>(null);
  const [linkInput, setLinkInput] = useState('');
  const [linkResult, setLinkResult] = useState<LinkCheckResult | null>(null);
  const [activity, setActivity] = useState(getCyberSafetyActivity);

  const score = useMemo(() => calculateCyberSafetyScore(activity), [activity]);

  const runScamAnalysis = () => {
    const trimmed = scamText.trim();
    if (!trimmed) return;
    setScamResult(analyzeScamContent(trimmed));
    setActivity(updateCyberSafetyActivity('scamAnalyses'));
  };

  const runLinkCheck = () => {
    const trimmed = linkInput.trim();
    if (!trimmed) return;
    setLinkResult(checkSuspiciousLink(trimmed));
    setActivity(updateCyberSafetyActivity('linksChecked'));
  };

  const completeSecurityCheck = () => {
    setActivity(updateCyberSafetyActivity('securityChecksCompleted'));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn">
      <section
        className="bg-card border border-line-strong rounded-2xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cyber-safety-tools-title"
      >
        <header className="flex items-center justify-between gap-4 px-4 py-3.5 sm:px-5 sm:py-4 border-b border-line bg-soft">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-card text-ink border border-line flex items-center justify-center shrink-0 shadow-2xs">
              {activeTool === 'analyzer' && <AlertTriangle size={17} />}
              {activeTool === 'link' && <Link2 size={17} />}
              {activeTool === 'dashboard' && <BarChart3 size={17} />}
            </div>
            <div className="min-w-0">
              <h2 id="cyber-safety-tools-title" className="text-sm sm:text-base font-extrabold text-ink leading-tight m-0 p-0 truncate">
                {activeTool === 'analyzer' && (hi ? 'AI स्कैम विश्लेषक' : 'AI Scam Analyzer')}
                {activeTool === 'link' && (hi ? 'संदिग्ध लिंक चेकर' : 'Suspicious Link Checker')}
                {activeTool === 'dashboard' && (hi ? 'साइबर सुरक्षा डैशबोर्ड' : 'Cyber Safety Dashboard')}
              </h2>
              <p className="text-[11px] sm:text-xs text-muted truncate mt-0.5">
                {activeTool === 'analyzer' && (hi ? 'संदिग्ध संदेशों में धोखाधड़ी के संकेत पहचानें।' : 'Analyze SMS, WhatsApp, email, or call descriptions for fraud.')}
                {activeTool === 'link' && (hi ? 'बिना खोले डोमेन व HTTPS सुरक्षा जांचें।' : 'Assess domain, HTTPS, and impersonation signals safely.')}
                {activeTool === 'dashboard' && (hi ? 'अपनी सुरक्षा गतिविधियां व स्कोर देखें।' : 'View your checks, analyses, and personal safety recommendations.')}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon !w-8 !h-8 shrink-0 cursor-pointer" aria-label={hi ? 'बंद करें' : 'Close'}>
            <X size={16} />
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-5">
          {activeTool === 'analyzer' && (
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-ink">{hi ? 'संदिग्ध संदेश पेस्ट करें' : 'Paste suspicious content'}</h3>
                <textarea
                  className="mt-2 w-full min-h-32 sm:min-h-36 flex-1 rounded-xl border border-line-strong bg-canvas p-3 text-sm text-ink outline-none focus:border-ink resize-y"
                  value={scamText}
                  maxLength={5000}
                  onChange={(event) => setScamText(event.target.value)}
                  placeholder={
                    hi
                      ? 'SMS, WhatsApp संदेश, ईमेल या बैंक/सरकारी दावा यहां पेस्ट करें...'
                      : 'Paste an SMS, WhatsApp message, email, call description, or bank claim...'
                  }
                />
                <button
                  type="button"
                  className="btn-primary mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2"
                  onClick={runScamAnalysis}
                  disabled={!scamText.trim()}
                >
                  <Search size={15} />
                  <span>{hi ? 'विश्लेषण करें' : 'Analyze'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-line bg-card flex flex-col justify-center">
                {scamResult ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{hi ? 'जोखिम स्तर' : 'Risk Level'}</p>
                    <p className={`mt-0.5 text-2xl font-extrabold ${riskClass(scamResult.riskLevel)}`}>{scamResult.riskLevel}</p>
                    <p className="mt-3 text-xs font-bold text-ink">{hi ? 'संदिग्ध संकेत' : 'Why it looks suspicious'}</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted">
                      {scamResult.indicators.map((indicator) => <li key={indicator}>• {indicator}</li>)}
                    </ul>
                    <p className="mt-3 text-xs font-bold text-ink">{hi ? 'सुझाया गया कदम' : 'Recommended Action'}</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted">
                      {scamResult.recommendedActions.map((action) => <li key={action}>• {action}</li>)}
                    </ul>
                    <p className="mt-3 text-[11px] text-muted">{scamResult.disclaimer}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-muted">
                    <p className="font-semibold text-ink/80">{hi ? 'परिणाम यहां दिखाई देगा' : 'Analysis results will appear here'}</p>
                    <p className="mt-1 text-[11px]">{hi ? 'यह एक जोखिम मूल्यांकन है, निश्चित प्रमाण नहीं।' : 'This is a risk assessment, not an absolute claim.'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTool === 'link' && (
            <div className="grid gap-4 md:grid-cols-[1fr_1fr]">
              <div className="flex flex-col">
                <h3 className="text-sm font-extrabold text-ink">{hi ? 'URL दर्ज करें' : 'Enter URL to inspect'}</h3>
                <input
                  className="mt-2 w-full rounded-xl border border-line-strong bg-canvas p-3 text-sm text-ink outline-none focus:border-ink"
                  value={linkInput}
                  maxLength={2048}
                  onChange={(event) => setLinkInput(event.target.value)}
                  placeholder="https://example.gov.in/status"
                />
                <p className="mt-2 text-[11px] text-muted">
                  {hi
                    ? 'यह टूल लिंक को खोले बिना केवल डोमेन और सुरक्षा प्रमाणपत्रों का सुरक्षित विश्लेषण करता है।'
                    : 'Analyzes domain signals safely without opening or visiting the destination.'}
                </p>
                <button
                  type="button"
                  className="btn-primary mt-3 w-full sm:w-auto inline-flex items-center justify-center gap-2"
                  onClick={runLinkCheck}
                  disabled={!linkInput.trim()}
                >
                  <Search size={15} />
                  <span>{hi ? 'लिंक जांचें' : 'Check link'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl border border-line bg-card flex flex-col justify-center">
                {linkResult ? (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-muted">{hi ? 'मूल्यांकन' : 'Assessment'}</p>
                    <p className={`mt-0.5 text-2xl font-extrabold ${riskClass(linkResult.riskLevel)}`}>{linkResult.riskLevel}</p>
                    <p className="mt-2 text-xs text-muted break-all font-mono">{linkResult.normalizedUrl}</p>
                    <p className="mt-3 text-xs font-bold text-ink">{hi ? 'कारण' : 'Reasons'}</p>
                    <ul className="mt-1.5 space-y-1 text-xs text-muted">
                      {linkResult.reasons.map((reason) => <li key={reason}>• {reason}</li>)}
                    </ul>
                    <p className="mt-3 text-[11px] text-muted">{linkResult.disclaimer}</p>
                  </div>
                ) : (
                  <div className="text-center py-6 text-xs text-muted">
                    <p className="font-semibold text-ink/80">{hi ? 'लिंक जांच परिणाम यहां दिखेगा' : 'Link analysis will appear here'}</p>
                    <p className="mt-1 text-[11px]">{hi ? 'किसी भी चेकर को 100% सुरक्षा गारंटी न मानें।' : 'Never treat any checker as a 100% safety guarantee.'}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTool === 'dashboard' && (
            <div>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="p-3.5 rounded-xl border border-line bg-card shadow-2xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{hi ? 'सुरक्षा स्कोर' : 'Cyber Safety Score'}</p>
                  <p className="mt-1 text-3xl font-extrabold text-emerald-600 dark:text-emerald-400">{score}</p>
                  <p className="mt-1 text-[11px] text-muted">
                    {hi ? 'शिक्षा व तैयारी स्कोर' : 'Readiness indicator'}
                  </p>
                </div>
                <div className="p-3.5 rounded-xl border border-line bg-card shadow-2xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{hi ? 'गतिविधि' : 'Activity'}</p>
                  <p className="mt-1 text-xs text-muted">{activity.scamAnalyses} scam analyses</p>
                  <p className="text-xs text-muted">{activity.linksChecked} links checked</p>
                  <p className="text-xs text-muted">{activity.securityChecksCompleted} checks completed</p>
                </div>
                <div className="p-3.5 rounded-xl border border-line bg-card shadow-2xs">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{hi ? 'अंक योगदान' : 'Score factors'}</p>
                  <p className="mt-1 text-xs text-muted">40 base awareness</p>
                  <p className="text-xs text-muted">Up to 30 from activity</p>
                  <p className="text-xs text-muted">Up to 30 from checks</p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-[0.9fr_1fr] mt-3.5">
                <div className="p-3.5 rounded-xl border border-line bg-card shadow-2xs">
                  <p className="text-xs font-bold text-ink">{hi ? 'सुरक्षा जांच दर्ज करें' : 'Security check'}</p>
                  <p className="mt-1 text-xs text-muted">
                    {hi ? 'अपने खाते की जांच पूरी करने पर रिकॉर्ड करें।' : 'Log an account check after you do one.'}
                  </p>
                  <button type="button" className="btn-secondary !py-2 !px-3 text-xs mt-3 inline-flex items-center gap-1.5" onClick={completeSecurityCheck}>
                    <CheckCircle2 size={14} />
                    <span>{hi ? 'चेक पूरा हुआ' : 'Mark check completed'}</span>
                  </button>
                </div>
                <div className="p-3.5 rounded-xl border border-line bg-card shadow-2xs">
                  <p className="text-xs font-bold text-ink">{hi ? 'महत्वपूर्ण टिप्स' : 'Key recommendations'}</p>
                  <ul className="mt-1.5 space-y-1 text-xs text-muted">
                    <li>• Enable two-factor authentication (2FA).</li>
                    <li>• Never share OTPs, UPI PINs, or CVV.</li>
                    <li>• Review account recovery options regularly.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};
