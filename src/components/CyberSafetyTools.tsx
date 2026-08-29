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
        className="bg-card border border-line rounded-2xl w-full max-w-4xl max-h-[94vh] flex flex-col shadow-2xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cyber-safety-tools-title"
      >
        <header className="flex items-start justify-between gap-4 p-4 sm:p-5 border-b border-line bg-soft rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-soft text-ink border border-line flex items-center justify-center shrink-0">
              {activeTool === 'analyzer' && <AlertTriangle size={17} />}
              {activeTool === 'link' && <Link2 size={17} />}
              {activeTool === 'dashboard' && <BarChart3 size={17} />}
            </div>
            <div>
              <h2 id="cyber-safety-tools-title" className="text-lg font-bold">
                {activeTool === 'analyzer' && (hi ? 'AI स्कैम विश्लेषक' : 'AI Scam Analyzer')}
                {activeTool === 'link' && (hi ? 'संदिग्ध लिंक चेकर' : 'Suspicious Link Checker')}
                {activeTool === 'dashboard' && (hi ? 'साइबर सुरक्षा डैशबोर्ड' : 'Cyber Safety Dashboard')}
              </h2>
              <p className="text-xs text-muted">
                {activeTool === 'analyzer' && (hi ? 'SMS, WhatsApp, ईमेल या कॉल में साइबर ठगी के पैटर्न जांचें।' : 'Analyze SMS, WhatsApp, email, or call descriptions for fraud patterns.')}
                {activeTool === 'link' && (hi ? 'URL खोले बिना domain, SSL और impersonation संकेत जांचें।' : 'Assess domain, HTTPS, and impersonation signals without opening the URL.')}
                {activeTool === 'dashboard' && (hi ? 'अपनी checks, analyses और सुरक्षा स्कोरकार्ड देखें।' : 'View your checks, analyses, and personal safety recommendations.')}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="btn-icon !w-9 !h-9" aria-label={hi ? 'बंद करें' : 'Close'}>
            <X size={18} />
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-6">
          {activeTool === 'analyzer' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
              <div>
                <p className="eyebrow">{hi ? 'AI Cyber Scam Analyzer' : 'AI Cyber Scam Analyzer'}</p>
                <h3 className="text-2xl font-bold">{hi ? 'संदिग्ध संदेश पेस्ट करें' : 'Paste suspicious content'}</h3>
                <textarea
                  className="mt-4 w-full min-h-52 rounded-xl border border-line-strong bg-canvas p-4 text-base text-ink outline-none focus:border-ink"
                  value={scamText}
                  maxLength={5000}
                  onChange={(event) => setScamText(event.target.value)}
                  placeholder={
                    hi
                      ? 'SMS, WhatsApp, ईमेल, कॉल विवरण या बैंक/सरकारी दावा यहां पेस्ट करें...'
                      : 'Paste an SMS, WhatsApp message, email, call description, or bank/government claim...'
                  }
                />
                <div className="btn-group mt-4">
                  <button type="button" className="btn-primary" onClick={runScamAnalysis} disabled={!scamText.trim()}>
                    <Search size={17} />
                    {hi ? 'विश्लेषण करें' : 'Analyze'}
                  </button>
                </div>
              </div>

              <div className="notice">
                {scamResult ? (
                  <>
                    <p className="text-sm text-muted">{hi ? 'Risk Level' : 'Risk Level'}</p>
                    <p className={`mt-1 text-3xl font-bold ${riskClass(scamResult.riskLevel)}`}>{scamResult.riskLevel}</p>
                    <p className="mt-4 font-semibold">{hi ? 'क्यों संदिग्ध लग रहा है' : 'Why it looks suspicious'}</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted">
                      {scamResult.indicators.map((indicator) => <li key={indicator}>- {indicator}</li>)}
                    </ul>
                    <p className="mt-5 font-semibold">{hi ? 'Recommended Action' : 'Recommended Action'}</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted">
                      {scamResult.recommendedActions.map((action) => <li key={action}>- {action}</li>)}
                    </ul>
                    <p className="mt-5 text-xs text-muted">{scamResult.disclaimer}</p>
                    {scamResult.riskLevel !== 'LOW' && (
                      <p className="mt-3 text-sm font-semibold text-ink">
                        This message contains several characteristics commonly associated with phishing.
                      </p>
                    )}
                  </>
                ) : (
                  <p className="text-sm text-muted">
                    {hi
                      ? 'परिणाम यहां दिखाई देगा। यह निश्चित प्रमाण नहीं होगा, केवल जोखिम आकलन होगा।'
                      : 'Results will appear here. This will be a risk assessment, not a certainty claim.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTool === 'link' && (
            <div className="grid gap-5 lg:grid-cols-[1fr_0.85fr]">
              <div>
                <p className="eyebrow">{hi ? 'Suspicious Link Checker' : 'Suspicious Link Checker'}</p>
                <h3 className="text-2xl font-bold">{hi ? 'URL जांचें' : 'Check a URL'}</h3>
                <input
                  className="mt-4 w-full rounded-xl border border-line-strong bg-canvas p-4 text-base text-ink outline-none focus:border-ink"
                  value={linkInput}
                  maxLength={2048}
                  onChange={(event) => setLinkInput(event.target.value)}
                  placeholder="https://example.gov.in/status"
                />
                <p className="mt-3 text-sm text-muted">
                  {hi
                    ? 'यह टूल वेबसाइट को खोलता, लॉग इन करता, जानकारी भेजता या डाउनलोड नहीं करता।'
                    : 'This tool does not open, log in to, submit information to, or download from submitted websites.'}
                </p>
                <div className="btn-group mt-4">
                  <button type="button" className="btn-primary" onClick={runLinkCheck} disabled={!linkInput.trim()}>
                    <Search size={17} />
                    {hi ? 'लिंक जांचें' : 'Check link'}
                  </button>
                </div>
              </div>

              <div className="notice">
                {linkResult ? (
                  <>
                    <p className="text-sm text-muted">{hi ? 'Assessment' : 'Assessment'}</p>
                    <p className={`mt-1 text-3xl font-bold ${riskClass(linkResult.riskLevel)}`}>{linkResult.riskLevel}</p>
                    <p className="mt-4 text-xs text-muted break-all">{linkResult.normalizedUrl}</p>
                    <p className="mt-5 font-semibold">{hi ? 'Reasons' : 'Reasons'}</p>
                    <ul className="mt-2 space-y-2 text-sm text-muted">
                      {linkResult.reasons.map((reason) => <li key={reason}>- {reason}</li>)}
                    </ul>
                    <p className="mt-5 text-xs text-muted">{linkResult.disclaimer}</p>
                  </>
                ) : (
                  <p className="text-sm text-muted">
                    {hi
                      ? 'परिणाम यहां दिखाई देगा। सुरक्षित होने की 100% गारंटी कभी न मानें।'
                      : 'Results will appear here. Never treat any checker as a 100% safety guarantee.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {activeTool === 'dashboard' && (
            <div>
              <p className="eyebrow">{hi ? 'Cyber Safety Dashboard' : 'Cyber Safety Dashboard'}</p>
              <h3 className="text-2xl font-bold">{hi ? 'आपकी सुरक्षा गतिविधि' : 'Your cyber safety activity'}</h3>
              <div className="grid gap-4 md:grid-cols-3 mt-5">
                <div className="notice">
                  <p className="text-sm text-muted">{hi ? 'Cyber Safety Score' : 'Cyber Safety Score'}</p>
                  <p className="mt-1 text-4xl font-bold text-success">{score}</p>
                  <p className="mt-2 text-xs text-muted">
                    {hi
                      ? 'यह शिक्षा के लिए readiness score है, सुरक्षा की पूर्ण माप नहीं।'
                      : 'An educational readiness score, not an absolute measurement of security.'}
                  </p>
                </div>
                <div className="notice">
                  <p className="font-semibold">{hi ? 'Activity' : 'Activity'}</p>
                  <p className="mt-2 text-sm text-muted">{activity.scamAnalyses} scam analyses performed</p>
                  <p className="text-sm text-muted">{activity.linksChecked} links checked</p>
                  <p className="text-sm text-muted">{activity.securityChecksCompleted} security checks completed</p>
                </div>
                <div className="notice">
                  <p className="font-semibold">{hi ? 'Score contributors' : 'Score contributors'}</p>
                  <p className="mt-2 text-sm text-muted">40 baseline awareness points</p>
                  <p className="text-sm text-muted">Up to 30 points from analyzer/link activity</p>
                  <p className="text-sm text-muted">Up to 30 points from completed checks</p>
                </div>
              </div>

              <div className="grid gap-5 lg:grid-cols-[0.9fr_1fr] mt-6">
                <div className="notice">
                  <p className="font-semibold">{hi ? 'Security check' : 'Security check'}</p>
                  <p className="mt-2 text-sm text-muted">
                    {hi
                      ? 'जब आप अपने खाते की कोई सुरक्षा जांच पूरी करें तो इसे दर्ज करें।'
                      : 'Log a completed account safety check after you actually do one.'}
                  </p>
                  <button type="button" className="btn-secondary mt-4" onClick={completeSecurityCheck}>
                    <CheckCircle2 size={17} />
                    {hi ? 'चेक पूरा हुआ' : 'Mark check completed'}
                  </button>
                </div>
                <div className="notice">
                  <p className="font-semibold">{hi ? 'Recommendations' : 'Recommendations'}</p>
                  <ul className="mt-2 space-y-2 text-sm text-muted">
                    <li>- Enable two-factor authentication.</li>
                    <li>- Never share OTPs, UPI PINs, passwords, or CVV.</li>
                    <li>- Review account recovery settings.</li>
                    <li>- Avoid unexpected links and attachments.</li>
                    <li>- Verify government websites before entering personal information.</li>
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
