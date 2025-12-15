import React, { useState, useRef, useEffect, useCallback } from 'react';
import { GenerateTTSParams, HistoryItem, TTSStatus } from './types';
import { generateSpeech } from './services/geminiService';
import { decodeBase64, decodeAudioData } from './utils/audioUtils';
import VoiceSelector from './components/VoiceSelector';
import HistoryList from './components/HistoryList';
import { Wand2, Loader2, PlayCircle, PauseCircle, Volume2, AlertCircle, Globe } from 'lucide-react';
import { translations, detectLanguage, Language } from './utils/i18n';

// Using a custom hook for AudioContext to ensure it's handled correctly in React
const useAudioContext = () => {
  const contextRef = useRef<AudioContext | null>(null);

  const getContext = useCallback(() => {
    if (!contextRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      contextRef.current = new AudioContextClass({ sampleRate: 24000 });
    }
    // Resume context if it was suspended (browser policy)
    if (contextRef.current.state === 'suspended') {
      contextRef.current.resume();
    }
    return contextRef.current;
  }, []);

  return getContext;
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => detectLanguage());
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('Puck');
  const [status, setStatus] = useState<TTSStatus>(TTSStatus.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentAudio, setCurrentAudio] = useState<{ buffer: AudioBuffer | null, id: string | null }>({ buffer: null, id: null });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  
  const t = translations[lang];

  // Update HTML dir and lang attributes
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  // Audio playback refs
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const getAudioContext = useAudioContext();

  const stopAudio = useCallback(() => {
    if (audioSourceRef.current) {
      try {
        audioSourceRef.current.stop();
      } catch (e) {
        // Ignore if already stopped
      }
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    setIsPlaying(false);
  }, []);

  const playBuffer = useCallback(async (buffer: AudioBuffer, id: string) => {
    stopAudio();
    const ctx = getAudioContext();
    
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.connect(ctx.destination);
    
    source.onended = () => {
      setIsPlaying(false);
    };

    audioSourceRef.current = source;
    source.start(0);
    setIsPlaying(true);
    setCurrentAudio({ buffer, id });
  }, [getAudioContext, stopAudio]);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError(t.errorEmpty);
      return;
    }

    if (text.length > 5000) {
       setError(t.errorLong);
       return;
    }

    try {
      stopAudio();
      setStatus(TTSStatus.GENERATING);
      setError(null);

      const params: GenerateTTSParams = {
        text,
        voiceName: selectedVoice
      };

      const base64Audio = await generateSpeech(params);
      
      const ctx = getAudioContext();
      const rawBytes = decodeBase64(base64Audio);
      const audioBuffer = await decodeAudioData(rawBytes, ctx);

      const newItem: HistoryItem = {
        id: Date.now().toString(),
        text: text.length > 60 ? text.substring(0, 60) + '...' : text,
        voiceName: selectedVoice,
        timestamp: Date.now(),
        audioBuffer: audioBuffer,
        duration: audioBuffer.duration
      };

      setHistory(prev => [newItem, ...prev]);
      setStatus(TTSStatus.PLAYING);
      
      await playBuffer(audioBuffer, newItem.id);

    } catch (err: any) {
      setStatus(TTSStatus.ERROR);
      setError(err.message || t.errorGeneric);
    } finally {
      if (status === TTSStatus.GENERATING) {
          setStatus(TTSStatus.IDLE);
      }
    }
  };

  const handleHistoryPlay = (item: HistoryItem) => {
    if (currentAudio.id === item.id && isPlaying) {
      stopAudio();
    } else if (item.audioBuffer) {
      playBuffer(item.audioBuffer, item.id);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-2 rounded-lg">
              <Volume2 className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t.appTitle} <span className="text-indigo-600">AI</span></h1>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Language Switcher */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-sm font-medium text-slate-700"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{lang}</span>
              </button>
              
              {isLangMenuOpen && (
                <div className="absolute top-full mt-2 ltr:right-0 rtl:left-0 w-32 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50">
                   {['ar', 'en', 'fr'].map((l) => (
                     <button
                        key={l}
                        onClick={() => {
                          setLang(l as Language);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-start px-4 py-2 text-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors ${lang === l ? 'text-indigo-600 font-bold bg-indigo-50' : 'text-slate-700'}`}
                     >
                       {translations[l as Language].languageName}
                     </button>
                   ))}
                </div>
              )}
            </div>

            <span className="text-xs font-medium bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full hidden sm:inline-block">
              {t.beta}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        
        {/* Intro */}
        <div className="text-center space-y-2 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">{t.heroTitle}</h2>
          <p className="text-gray-500 text-lg">{t.heroSubtitle}</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden">
          <div className="p-6 md:p-8 space-y-8">
            
            {/* Input Section */}
            <div className="space-y-3">
              <label htmlFor="text-input" className="block text-sm font-semibold text-gray-700">
                {t.inputLabel}
              </label>
              <div className="relative">
                <textarea
                  id="text-input"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder={t.inputPlaceholder}
                  className="w-full h-40 p-4 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none text-lg leading-relaxed bg-slate-50 focus:bg-white"
                  dir="auto"
                />
                <div className={`absolute bottom-4 text-xs text-gray-400 font-medium ${lang === 'ar' ? 'left-4' : 'right-4'}`}>
                  {text.length} {t.charCount}
                </div>
              </div>
            </div>

            {/* Voice Selection */}
            <VoiceSelector 
              selectedVoice={selectedVoice} 
              onSelect={setSelectedVoice} 
              disabled={status === TTSStatus.GENERATING}
              t={t}
            />

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p>{error}</p>
              </div>
            )}

            {/* Action Button */}
            <div className="flex justify-end pt-4">
              <button
                onClick={handleGenerate}
                disabled={status === TTSStatus.GENERATING || !text.trim()}
                className={`
                  flex items-center gap-2 px-8 py-4 rounded-xl text-lg font-bold shadow-lg shadow-indigo-200
                  transition-all duration-300 transform active:scale-95
                  ${status === TTSStatus.GENERATING 
                    ? 'bg-indigo-400 cursor-wait text-white/80' 
                    : !text.trim()
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white hover:shadow-indigo-300 hover:-translate-y-1'
                  }
                `}
              >
                {status === TTSStatus.GENERATING ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    {t.generating}
                  </>
                ) : (
                  <>
                    <Wand2 className="w-6 h-6" />
                    {t.generate}
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Player Bar (if active) */}
          <div className={`
             bg-slate-900 text-white p-4 transition-all duration-500 ease-in-out
             ${currentAudio.buffer ? 'max-h-32 opacity-100' : 'max-h-0 opacity-0 overflow-hidden p-0'}
          `}>
             <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => {
                        if (currentAudio.buffer && currentAudio.id) {
                            if (isPlaying) stopAudio();
                            else playBuffer(currentAudio.buffer, currentAudio.id);
                        }
                    }}
                    className="hover:scale-110 transition-transform"
                  >
                    {isPlaying ? (
                        <PauseCircle className="w-12 h-12 text-indigo-400 fill-current bg-white rounded-full" />
                    ) : (
                        <PlayCircle className="w-12 h-12 text-indigo-400 fill-current bg-white rounded-full" />
                    )}
                  </button>
                  <div>
                    <div className="text-sm text-slate-400">{t.nowPlaying}</div>
                    <div className="font-semibold text-white">{t.currentAudio}</div>
                  </div>
                </div>
                
                {/* Simple Visualization Bars Animation when playing */}
                <div className="flex items-end gap-1 h-8">
                    {[...Array(8)].map((_, i) => (
                        <div 
                            key={i} 
                            className={`w-1 bg-indigo-500 rounded-t-sm transition-all duration-150 ${isPlaying ? 'animate-pulse' : 'h-2'}`}
                            style={{ 
                                height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                                animationDelay: `${i * 0.1}s` 
                            }}
                        />
                    ))}
                </div>
             </div>
          </div>
        </div>

        {/* History */}
        <HistoryList 
            history={history} 
            onPlay={handleHistoryPlay}
            currentlyPlayingId={isPlaying && currentAudio.id ? currentAudio.id : undefined}
            t={t}
            lang={lang}
        />

      </main>
      
      {/* Footer */}
      <footer className="text-center text-gray-400 py-8 text-sm">
        <p>{t.footer}</p>
      </footer>
    </div>
  );
}