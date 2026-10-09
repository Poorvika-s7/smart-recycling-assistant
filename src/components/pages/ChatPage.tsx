import { useState, useRef, useEffect, useCallback } from 'react';
import { MessageCircle, Send, Loader2, Sparkles, Info, Leaf, Mic, MicOff, Globe } from 'lucide-react';
import { sendChatMessage } from '@/lib/api';
import type { ChatMessage } from '@/lib/supabase';
import { LANGUAGES, getLanguageByCode } from '@/lib/languages';
import { isSpeechRecognitionSupported, createSpeechRecognition, startListening, type SpeechRecognitionLike } from '@/lib/speech';

const SUGGESTED_QUESTIONS = [
  'Is a plastic bottle recyclable?',
  'How do I dispose of an old phone?',
  'What can I do with glass jars?',
  'Can I compost food scraps?',
  'Where should I throw old batteries?',
];

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm the Smart Recycling Assistant. Ask me about any waste item — I can tell you if it's recyclable, how to dispose of it, and suggest reuse ideas. You can type or speak in English, Kannada, Hindi, and more. What would you like to know?",
      timestamp: new Date().toISOString(),
      source: 'fallback',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const speechSupported = isSpeechRecognitionSupported();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch {}
      }
    };
  }, []);

  const handleStartListening = useCallback(() => {
    setSpeechError(null);
    const recognition = createSpeechRecognition(language);
    if (!recognition) {
      setSpeechError('Speech recognition is not supported by your browser. Please type your message instead.');
      return;
    }

    recognitionRef.current = recognition;
    setIsListening(true);
    setInput('');

    startListening(recognition, {
      onResult: (result) => {
        if (result.isFinal) {
          setInput(result.transcript);
          setIsListening(false);
        } else {
          setInput(result.transcript);
        }
      },
      onError: (err) => {
        setSpeechError(err);
        setIsListening(false);
      },
      onEnd: () => {
        setIsListening(false);
      },
    });
  }, [language]);

  const handleStopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
    }
    setIsListening(false);
  }, []);

  const handleSend = async (messageText?: string) => {
    const text = (messageText ?? input).trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const { content, source } = await sendChatMessage(text, [...messages, userMessage], undefined, language);
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content,
        timestamp: new Date().toISOString(),
        source,
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const errorMsg = (err as Error)?.message || '';
      const isOffline = errorMsg.includes('Failed to fetch') || errorMsg.includes('empty response');
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: isOffline
          ? 'I could not reach the server. Please check your internet connection and try again.'
          : `Sorry, something went wrong: ${errorMsg}. Please try again.`,
        timestamp: new Date().toISOString(),
        source: 'fallback',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const showSuggestions = messages.length <= 1;
  const currentLang = getLanguageByCode(language);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm font-medium mb-3">
          <MessageCircle className="w-4 h-4" />
          AI Recycling Assistant
        </div>
        <h1 className="text-3xl font-bold text-gray-900">Chat with EcoBot</h1>
        <p className="mt-2 text-gray-600">
          Ask any recycling or waste disposal question in your language.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[60vh] min-h-[400px]">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slide-up`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user'
                    ? 'bg-emerald-600 text-white rounded-br-md'
                    : 'bg-gray-50 text-gray-800 rounded-bl-md border border-gray-100'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1.5">
                    {msg.source === 'ai' ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-blue-600">
                        <Sparkles className="w-3 h-3" />
                        AI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">
                        <Info className="w-3 h-3" />
                        Knowledge Base
                      </span>
                    )}
                  </div>
                )}
                <p className="text-sm whitespace-pre-line leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start animate-fade-in">
              <div className="bg-gray-50 rounded-2xl rounded-bl-md px-4 py-3 border border-gray-100">
                <div className="flex items-center gap-2 text-gray-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested questions */}
        {showSuggestions && !loading && (
          <div className="px-4 pb-3 border-t border-gray-50 pt-3">
            <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
              <Leaf className="w-3 h-3" />
              Try asking:
            </p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTED_QUESTIONS.map((q) => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className="px-3 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-sm border border-emerald-100 transition-colors"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Speech error */}
        {speechError && (
          <div className="px-4 pb-2 text-xs text-amber-600 flex items-center gap-1.5">
            <Info className="w-3 h-3" />
            {speechError}
          </div>
        )}

        {/* Input */}
        <div className="border-t border-gray-100 p-3">
          {/* Language selector + mic */}
          <div className="flex items-center gap-2 mb-2">
            <div className="relative">
              <button
                onClick={() => setShowLangDropdown(!showLangDropdown)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm text-gray-600 border border-gray-200 transition-colors"
              >
                <Globe className="w-4 h-4" />
                <span>{currentLang.flag}</span>
                <span className="hidden sm:inline">{currentLang.nativeLabel}</span>
              </button>
              {showLangDropdown && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowLangDropdown(false)} />
                  <div className="absolute bottom-full mb-1 left-0 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px] max-h-64 overflow-y-auto animate-fade-in">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => {
                          setLanguage(lang.code);
                          setShowLangDropdown(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 transition-colors flex items-center gap-2 ${
                          language === lang.code ? 'text-emerald-600 font-medium' : 'text-gray-700'
                        }`}
                      >
                        <span className="text-xs font-bold w-6">{lang.flag}</span>
                        <span>{lang.nativeLabel}</span>
                        <span className="text-xs text-gray-400 ml-auto">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {speechSupported && (
              <button
                onClick={isListening ? handleStopListening : handleStartListening}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                  isListening
                    ? 'bg-red-50 text-red-600 border-red-200 animate-pulse'
                    : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span className="hidden sm:inline">{isListening ? 'Stop' : 'Speak'}</span>
              </button>
            )}
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={isListening ? 'Listening...' : 'Type your question...'}
              disabled={loading || isListening}
              className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 outline-none transition-all text-sm text-gray-900"
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex-shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
