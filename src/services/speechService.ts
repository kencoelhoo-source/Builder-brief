import type { Language } from '../types';
import { isAppleTouchDevice } from '../utils/browser';

export interface SpeechRecognitionResultCallback {
  (transcript: string, isFinal: boolean): void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening = false;
  private finalTranscript = '';

  constructor() {
    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) return;

      this.recognition = new SpeechRecognition();
      const appleTouch = isAppleTouchDevice();
      // iOS Safari often throws or immediately ends with continuous + interimResults.
      this.recognition.continuous = !appleTouch;
      this.recognition.interimResults = !appleTouch;
      this.recognition.maxAlternatives = 1;
    } catch {
      this.recognition = null;
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    lang: Language,
    onResult: SpeechRecognitionResultCallback,
    onError?: (err: unknown) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Web Speech API is not supported in this browser.');
      return false;
    }

    try {
      if (this.isListening) this.stopListening();
      this.finalTranscript = '';
      this.recognition.lang = lang === 'hi' ? 'hi-IN' : 'en-IN';
      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) this.finalTranscript = `${this.finalTranscript} ${finalTranscript}`.trim();
        const combined = `${this.finalTranscript} ${interimTranscript}`.trim();
        onResult(combined, !!finalTranscript);
      };

      this.recognition.onerror = (event: any) => {
        if (onError) onError(event.error);
        this.isListening = false;
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (e) {
      this.isListening = false;
      if (onError) onError(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch {
        /* recognition may already have ended */
      }
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

let speechServiceInstance: SpeechService | null = null;

export const getSpeechService = (): SpeechService => {
  if (!speechServiceInstance) speechServiceInstance = new SpeechService();
  return speechServiceInstance;
};

/** Lazy so a constructor throw cannot white-screen the app at import. */
export const speechService = {
  isSupported: () => getSpeechService().isSupported(),
  startListening: (
    lang: Language,
    onResult: SpeechRecognitionResultCallback,
    onError?: (err: unknown) => void
  ) => getSpeechService().startListening(lang, onResult, onError),
  stopListening: () => getSpeechService().stopListening(),
  getIsListening: () => getSpeechService().getIsListening(),
};
