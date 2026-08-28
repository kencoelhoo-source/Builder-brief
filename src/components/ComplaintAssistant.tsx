import { useEffect, useMemo, useRef, useState } from 'react';
import { Bot, Loader2, MessageCircle, Mic, MicOff, Send, UserRound, X } from 'lucide-react';
import type { Language } from '../types';
import { askChatAssistant, type ChatMessage } from '../services/chatAssistantService';
import { speechService } from '../services/speechService';

interface ComplaintAssistantProps {
  currentLang: Language;
}

const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

export const ComplaintAssistant: React.FC<ComplaintAssistantProps> = ({ currentLang }) => {
  const hi = currentLang === 'hi';
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: createId(),
      role: 'assistant',
      content: hi
        ? 'नमस्ते। अपनी शिकायत कुछ शब्दों में बताइए, मैं आपको filing steps और सही contact number बताऊंगा।'
        : 'Hi. Tell me what happened, and I will guide you through filing steps and the right contact number.',
    },
  ]);
  const transcriptRef = useRef('');
  const messageListRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messageListRef.current?.scrollTo({
      top: messageListRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isSending]);

  const quickPrompts = useMemo(
    () =>
      hi
        ? ['UPI धोखाधड़ी हुई है', 'Instagram fake profile', 'पैसे वापस कैसे मिलेंगे?']
        : ['I lost money on UPI', 'Fake Instagram profile', 'How do I recover funds?'],
    [hi]
  );

  const sendMessage = async (content: string) => {
    const trimmed = content.trim();
    if (!trimmed || isSending) return;

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setIsSending(true);

    const reply = await askChatAssistant(nextMessages, currentLang);
    setMessages((items) => [...items, { id: createId(), role: 'assistant', content: reply }]);
    setIsSending(false);
  };

  const toggleVoice = () => {
    if (isListening) {
      speechService.stopListening();
      setIsListening(false);
      return;
    }

    transcriptRef.current = '';
    const started = speechService.startListening(
      currentLang,
      (transcript, isFinal) => {
        const cleanTranscript = transcript.trim();
        if (!cleanTranscript) return;
        transcriptRef.current = cleanTranscript;
        setInput(cleanTranscript);
        if (isFinal) {
          speechService.stopListening();
          setIsListening(false);
          void sendMessage(cleanTranscript);
        }
      },
      () => {
        setIsListening(false);
        setInput(
          hi
            ? 'Voice command इस browser में उपलब्ध नहीं है। कृपया message type करें।'
            : 'Voice command is not available in this browser. Please type your message.'
        );
      }
    );
    setIsListening(started);
  };

  return (
    <div className={`complaint-assistant ${isOpen ? 'is-open' : ''}`}>
      {isOpen && (
        <section className="assistant-panel" aria-label={hi ? 'शिकायत सहायक' : 'Complaint assistant'}>
          <header className="assistant-header">
            <div className="assistant-title">
              <span className="assistant-avatar" aria-hidden="true">
                <Bot size={18} />
              </span>
              <div>
                <h2>{hi ? 'शिकायत सहायक' : 'Complaint Assistant'}</h2>
                <p>{hi ? 'Filing steps, voice help, demo contacts' : 'Filing steps, voice help, demo contacts'}</p>
              </div>
            </div>
            <button
              type="button"
              className="assistant-icon-button"
              onClick={() => setIsOpen(false)}
              aria-label={hi ? 'सहायक बंद करें' : 'Close assistant'}
              title={hi ? 'बंद करें' : 'Close'}
            >
              <X size={18} />
            </button>
          </header>

          <div className="assistant-messages" ref={messageListRef}>
            {messages.map((message) => (
              <article key={message.id} className={`assistant-message ${message.role}`}>
                <span className="assistant-message-icon" aria-hidden="true">
                  {message.role === 'assistant' ? <Bot size={15} /> : <UserRound size={15} />}
                </span>
                <p>{message.content}</p>
              </article>
            ))}
            {isSending && (
              <article className="assistant-message assistant">
                <span className="assistant-message-icon" aria-hidden="true">
                  <Loader2 size={15} className="assistant-spin" />
                </span>
                <p>{hi ? 'जवाब तैयार हो रहा है...' : 'Preparing guidance...'}</p>
              </article>
            )}
          </div>

          <div className="assistant-prompts" aria-label={hi ? 'तेज प्रश्न' : 'Quick prompts'}>
            {quickPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void sendMessage(prompt)} disabled={isSending}>
                {prompt}
              </button>
            ))}
          </div>

          <form
            className="assistant-compose"
            onSubmit={(event) => {
              event.preventDefault();
              void sendMessage(input);
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder={hi ? 'अपनी शिकायत लिखें या बोलें...' : 'Type or speak your complaint...'}
              rows={2}
              aria-label={hi ? 'शिकायत संदेश' : 'Complaint message'}
            />
            <div className="assistant-compose-actions">
              <button
                type="button"
                className={`assistant-icon-button ${isListening ? 'is-live' : ''}`}
                onClick={toggleVoice}
                title={hi ? 'Voice command' : 'Voice command'}
                aria-label={hi ? 'Voice command' : 'Voice command'}
              >
                {isListening ? <MicOff size={18} /> : <Mic size={18} />}
              </button>
              <button
                type="submit"
                className="assistant-send-button"
                disabled={!input.trim() || isSending}
                title={hi ? 'भेजें' : 'Send'}
                aria-label={hi ? 'भेजें' : 'Send'}
              >
                {isSending ? <Loader2 size={18} className="assistant-spin" /> : <Send size={18} />}
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        className="assistant-launcher"
        onClick={() => setIsOpen((open) => !open)}
        aria-expanded={isOpen}
        aria-label={hi ? 'शिकायत सहायक खोलें' : 'Open complaint assistant'}
        title={hi ? 'शिकायत सहायक' : 'Complaint Assistant'}
      >
        {isOpen ? <X size={21} /> : <MessageCircle size={21} />}
        {!isOpen && <span className="assistant-launcher-label">{hi ? 'सहायता' : 'Help'}</span>}
        {!isOpen && (
          <span className="assistant-flag" aria-hidden="true">
            <span className="assistant-flag-chakra" />
          </span>
        )}
      </button>
    </div>
  );
};
