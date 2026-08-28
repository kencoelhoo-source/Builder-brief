import React from 'react';
import { ArrowRight, BarChart3, FilePlus, Link2, Search, ShieldAlert } from 'lucide-react';
import type { Language } from '../types';
import hubHero from '../assets/hub-hero.jpg';

interface HomeHubProps {
  currentLang: Language;
  onReport: () => void;
  onTrack: () => void;
  canTrack: boolean;
  ackNumber?: string | null;
  onOpenScamAnalyzer: () => void;
  onOpenLinkChecker: () => void;
  onOpenDashboard: () => void;
}

export const HomeHub: React.FC<HomeHubProps> = ({
  currentLang,
  onReport,
  onTrack,
  canTrack,
  ackNumber,
  onOpenScamAnalyzer,
  onOpenLinkChecker,
  onOpenDashboard,
}) => {
  const hi = currentLang === 'hi';

  return (
    <div className="page-wrap page-stack hub">
      <figure className="hub-hero">
        <img
          src={hubHero}
          alt={hi ? 'सुबह के बाग में दो लोग साथ चल रहे हैं' : 'Two people walking together through a quiet morning park'}
        />
        <figcaption className="hub-hero-copy">
          <p className="crumb">{hi ? 'कवच' : 'Kavach'}</p>
          <h1>{hi ? 'आप अकेले नहीं हैं।' : 'You are not alone.'}</h1>
          <p className="lede">
            {hi
              ? 'पैसे गए हों या फेक प्रोफाइल बना हो — पहले 1930, फिर यहाँ रिपोर्ट या ट्रैक करें।'
              : 'If money left, or someone made a fake profile — call 1930 first, then report or track here.'}
          </p>
        </figcaption>
      </figure>

      <div className="hub-actions">
        <button type="button" className="hub-card" onClick={onReport}>
          <span className="hub-card-icon"><FilePlus size={22} /></span>
          <span className="hub-card-title">{hi ? 'शिकायत दर्ज करें' : 'Report a complaint'}</span>
          <span className="hub-card-meta">
            {hi
              ? 'रसीद, चैट की फोटो, या नंबर लिखें।'
              : 'A receipt photo, a chat photo, or the numbers from the SMS.'}
          </span>
          <span className="hub-card-foot">
            {hi ? 'शुरू करें' : 'Start'}
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="hub-card" onClick={onTrack}>
          <span className="hub-card-icon"><Search size={22} /></span>
          <span className="hub-card-title">{hi ? 'शिकायत ट्रैक करें' : 'Track a complaint'}</span>
          <span className="hub-card-meta">
            {canTrack
              ? hi
                ? `डेमो संदर्भ ${ackNumber}।`
                : `Demo reference ${ackNumber}.`
              : hi
                ? 'रिपोर्ट पूरी होने के बाद स्थिति यहीं दिखेगी।'
                : 'After you finish a report, its status shows up here.'}
          </span>
          <span className="hub-card-foot">
            {canTrack ? (hi ? 'स्थिति देखें' : 'See status') : (hi ? 'अभी कोई शिकायत नहीं' : 'No complaint yet')}
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="hub-card" onClick={onOpenScamAnalyzer}>
          <span className="hub-card-icon"><ShieldAlert size={22} /></span>
          <span className="hub-card-title">{hi ? 'AI स्कैम विश्लेषक' : 'AI scam analyzer'}</span>
          <span className="hub-card-meta">
            {hi
              ? 'SMS, ईमेल, WhatsApp या कॉल विवरण में ठगी के संकेत देखें।'
              : 'Check SMS, email, WhatsApp, or call descriptions for common scam signals.'}
          </span>
          <span className="hub-card-foot">
            {hi ? 'विश्लेषण करें' : 'Analyze'}
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="hub-card" onClick={onOpenLinkChecker}>
          <span className="hub-card-icon"><Link2 size={22} /></span>
          <span className="hub-card-title">{hi ? 'संदिग्ध लिंक चेकर' : 'Suspicious link checker'}</span>
          <span className="hub-card-meta">
            {hi
              ? 'URL खोले बिना domain, HTTPS और impersonation संकेत जांचें।'
              : 'Assess domain, HTTPS, and impersonation signals without opening the URL.'}
          </span>
          <span className="hub-card-foot">
            {hi ? 'लिंक जांचें' : 'Check link'}
            <ArrowRight size={16} />
          </span>
        </button>

        <button type="button" className="hub-card" onClick={onOpenDashboard}>
          <span className="hub-card-icon"><BarChart3 size={22} /></span>
          <span className="hub-card-title">{hi ? 'साइबर सुरक्षा डैशबोर्ड' : 'Cyber safety dashboard'}</span>
          <span className="hub-card-meta">
            {hi
              ? 'अपनी checks, analyses और छोटे सुरक्षा सुझाव देखें।'
              : 'View your checks, analyses, and concise safety recommendations.'}
          </span>
          <span className="hub-card-foot">
            {hi ? 'डैशबोर्ड देखें' : 'Open dashboard'}
            <ArrowRight size={16} />
          </span>
        </button>
      </div>

      <p className="hub-note">
        {hi ? 'राष्ट्रीय साइबर हेल्पलाइन ' : 'National cyber helpline '}
        <a className="btn-link" href="tel:1930">1930</a>
        {hi ? ' · आधिकारिक साइट नहीं।' : ' · not an official government site.'}
      </p>
    </div>
  );
};
