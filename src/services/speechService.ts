import type { Language } from '../types';

export interface SpeechRecognitionResultCallback {
  (transcript: string, isFinal: boolean): void;
}

export class SpeechService {
  private recognition: any = null;
  private isListening = false;

  constructor() {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  public isSupported(): boolean {
    return this.recognition !== null;
  }

  public startListening(
    lang: Language,
    onResult: SpeechRecognitionResultCallback,
    onError?: (err: any) => void
  ): boolean {
    if (!this.recognition) {
      if (onError) onError('Web Speech API is not supported in this browser.');
      return false;
    }

    try {
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

        const combined = finalTranscript || interimTranscript;
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
      if (onError) onError(e);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public getIsListening(): boolean {
    return this.isListening;
  }
}

export const speechService = new SpeechService();
