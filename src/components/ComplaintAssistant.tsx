import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Loader2, MessageSquare, Mic, MicOff, Send, User, X, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { askChatAssistant, type ChatMessage } from '../services/chatAssistantService';
import { speechService } from '../services/speechService';

interface ComplaintAssistantProps {
  currentLang: Language;
}

const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;

export const ComplaintAssistant: React.FC<ComplaintAssistantProps> = ({ currentLang }) => {
  const isHindi = currentLang === 'hi';
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: generateId(),
      role: 'assistant',
      content: isHindi
        ? 'नमस्ते! मैं कवच साइबर सहायक हूँ। मुझे बताइए कि क्या हुआ (जैसे UPI फ्रॉड या फेक प्रोफाइल), मैं तुरंत कानूनी व शिकायत प्रक्रिया में आपकी मदद करूँगा।'
        : 'Hello! I am your Kavach Cyber Assistant. Tell me what happened (e.g. UPI fraud, impersonation, phishing), and I will guide you with emergency steps and legal drafts.',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const quickPrompts = useMemo(
    () =>
      isHindi
        ? [
            'UPI फ्रॉड हुआ है, पैसे कैसे रुकेंगे?',
            'Instagram पर फेक प्रोफाइल बनाई गई है',
            'बैंक से पैसे कट गए पर UTR नहीं मिला',
            'Sec 457 कोर्ट याचिका क्या है?',
          ]
        : [
            'I lost money via UPI fraud',
            'Fake profile / Harassment on Instagram',
            'How to issue a dual-bank freeze?',
            'How does Sec 457 court petition work?',
          ],
    [isHindi]
  );

  const handleSendMessage = async (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content || isSending) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
    };

    const updated = [...messages, userMsg];
    setMessages(updated);
    setInputText('');
    setIsSending(true);

    const botReply = await askChatAssistant(updated, currentLang);

    setMessages((prev) => [
      ...prev,
      {
        id: generateId(),
        role: 'assistant',
        content: botReply,
      },
    ]);
    setIsSending(false);
  };

  const handleToggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    const started = speechService.startListening(
      currentLang,
      (transcript, isFinal) => {
        const clean = transcript.trim();
        if (!clean) return;
        setInputText(clean);
        if (isFinal) {
          speechService.stopListening();
          setIsListening(false);
          void handleSendMessage(clean);
        }
      },
      (error) => {
        console.warn('Speech recognition warning:', error);
        setIsListening(false);
      }
    );

    setIsListening(started);
  };

  return (
    <div className={`complaint-assistant ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="assistant-panel" aria-label={isHindi ? 'शिकायत सहायक' : 'Complaint Assistant'}>
          <header className="assistant-header">
            <div className="assistant-title">
              <div className="assistant-avatar">
                <Bot size={18} />
              </div>
              <div>
                <h2>{isHindi ? 'कवच साइबर सहायक' : 'Kavach AI Assistant'}</h2>
                <p>{isHindi ? '24/7 आपातकालीन साइबर मार्गदर्शन' : '24/7 Citizen Cyber Guidance'}</p>
              </div>
            </div>
            <button
              type="button"
              className="assistant-close-btn"
              onClick={() => setIsOpen(false)}
              aria-label={isHindi ? 'सहायक बंद करें' : 'Close assistant'}
            >
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages">
            {messages.map((m) => (
              <div key={m.id} className={`assistant-msg ${m.role}`}>
                <div className="assistant-msg-icon">
                  {m.role === 'assistant' ? <Bot size={14} /> : <User size={14} />}
                </div>
                <div className="assistant-msg-bubble">
                  {m.content.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                  ))}
                </div>
              </div>
            ))}

            {isSending && (
              <div className="assistant-msg assistant">
                <div className="assistant-msg-icon">
                  <Bot size={14} />
                </div>
                <div className="assistant-msg-bubble assistant-loading">
                  <Loader2 size={15} className="animate-spin" />
                  <span>{isHindi ? 'सलाह तैयार हो रही है...' : 'Formulating guidance...'}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="assistant-quick-prompts">
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="assistant-prompt-pill"
                onClick={() => void handleSendMessage(prompt)}
                disabled={isSending}
              >
                <Sparkles size={11} className="shrink-0" />
                <span>{prompt}</span>
              </button>
            ))}
          </div>

          <form
            className="assistant-input-form"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSendMessage();
            }}
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isHindi ? 'अपनी शिकायत या सवाल लिखें...' : 'Ask a question or describe the incident...'}
              aria-label={isHindi ? 'शिकायत संदेश' : 'Complaint message'}
            />
            <div className="assistant-input-actions">
              <button
                type="button"
                className={`assistant-action-btn ${isListening ? 'is-recording' : ''}`}
                onClick={handleToggleVoice}
                title={isHindi ? 'आवाज़ से बोलें' : 'Voice input'}
                aria-label={isHindi ? 'आवाज़ से बोलें' : 'Voice input'}
              >
                {isListening ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              <button
                type="submit"
                className="assistant-action-btn assistant-send-btn"
                disabled={!inputText.trim() || isSending}
                title={isHindi ? 'भेजें' : 'Send'}
                aria-label={isHindi ? 'भेजें' : 'Send'}
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className="assistant-fab"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={isHindi ? 'कवच सहायक' : 'Kavach AI Help'}
      >
        {isOpen ? (
          <X size={20} />
        ) : (
          <>
            <MessageSquare size={19} />
            <span className="assistant-fab-label">{isHindi ? 'AI सहायता' : 'AI Help'}</span>
          </>
        )}
      </button>
    </div>
  );
};
