export interface SpeechRecognitionResult {
  transcript: string;
  isFinal: boolean;
}

export type SpeechRecognitionLike = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: any) => void) | null;
  onerror: ((event: any) => void) | null;
  onend: (() => void) | null;
  onstart: (() => void) | null;
};

const LANGUAGE_MAP: Record<string, string> = {
  en: 'en-US',
  kn: 'kn-IN',
  hi: 'hi-IN',
  ta: 'ta-IN',
  te: 'te-IN',
  ml: 'ml-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
};

export function getSpeechLangCode(lang: string): string {
  return LANGUAGE_MAP[lang] || 'en-US';
}

export function isSpeechRecognitionSupported(): boolean {
  if (typeof window === 'undefined') return false;
  return !!(window as any).SpeechRecognition || !!(window as any).webkitSpeechRecognition;
}

export function createSpeechRecognition(lang: string): SpeechRecognitionLike | null {
  const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SR) return null;

  const recognition = new SR();
  recognition.lang = getSpeechLangCode(lang);
  recognition.continuous = false;
  recognition.interimResults = true;
  return recognition;
}

export interface SpeechRecognitionHandler {
  onResult: (result: SpeechRecognitionResult) => void;
  onError: (error: string) => void;
  onEnd: () => void;
}

export function startListening(
  recognition: SpeechRecognitionLike,
  handler: SpeechRecognitionHandler
): void {
  recognition.onresult = (event: any) => {
    let interim = '';
    let final = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const transcript = event.results[i][0].transcript;
      if (event.results[i].isFinal) {
        final += transcript;
      } else {
        interim += transcript;
      }
    }
    if (final) {
      handler.onResult({ transcript: final, isFinal: true });
    } else if (interim) {
      handler.onResult({ transcript: interim, isFinal: false });
    }
  };

  recognition.onerror = (event: any) => {
    let msg = 'Speech recognition error';
    if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
      msg = 'Microphone permission was denied.';
    } else if (event.error === 'no-speech') {
      msg = 'No speech was detected. Please try again.';
    } else if (event.error === 'network') {
      msg = 'Network error during speech recognition.';
    }
    handler.onError(msg);
  };

  recognition.onend = () => {
    handler.onEnd();
  };

  recognition.start();
}
