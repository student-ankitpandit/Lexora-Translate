import { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Square, Languages, Volume2, AlertCircle, Snail, Bookmark, BookmarkCheck, History, Trash2, ArrowRightLeft, Copy, Check, Sun, Moon } from 'lucide-react';
import './index.css';

interface TranslationItem {
  id: string;
  sourceText: string;
  translatedText: string;
  romanization?: string;
  sourceLang: string;
  targetLang: string;
  timestamp: number;
}
// A comprehensive list of supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'af', name: 'Afrikaans' },
  { code: 'sq', name: 'Albanian' },
  { code: 'am', name: 'Amharic' },
  { code: 'ar', name: 'Arabic' },
  { code: 'hy', name: 'Armenian' },
  { code: 'az', name: 'Azerbaijani' },
  { code: 'eu', name: 'Basque' },
  { code: 'be', name: 'Belarusian' },
  { code: 'bn', name: 'Bengali' },
  { code: 'bs', name: 'Bosnian' },
  { code: 'bg', name: 'Bulgarian' },
  { code: 'ca', name: 'Catalan' },
  { code: 'ceb', name: 'Cebuano' },
  { code: 'ny', name: 'Chichewa' },
  { code: 'zh-CN', name: 'Chinese (Simplified)' },
  { code: 'zh-TW', name: 'Chinese (Traditional)' },
  { code: 'co', name: 'Corsican' },
  { code: 'hr', name: 'Croatian' },
  { code: 'cs', name: 'Czech' },
  { code: 'da', name: 'Danish' },
  { code: 'nl', name: 'Dutch' },
  { code: 'en', name: 'English' },
  { code: 'eo', name: 'Esperanto' },
  { code: 'et', name: 'Estonian' },
  { code: 'tl', name: 'Filipino' },
  { code: 'fi', name: 'Finnish' },
  { code: 'fr', name: 'French' },
  { code: 'fy', name: 'Frisian' },
  { code: 'gl', name: 'Galician' },
  { code: 'ka', name: 'Georgian' },
  { code: 'de', name: 'German' },
  { code: 'el', name: 'Greek' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'ht', name: 'Haitian Creole' },
  { code: 'ha', name: 'Hausa' },
  { code: 'haw', name: 'Hawaiian' },
  { code: 'iw', name: 'Hebrew' },
  { code: 'hi', name: 'Hindi' },
  { code: 'hmn', name: 'Hmong' },
  { code: 'hu', name: 'Hungarian' },
  { code: 'is', name: 'Icelandic' },
  { code: 'ig', name: 'Igbo' },
  { code: 'id', name: 'Indonesian' },
  { code: 'ga', name: 'Irish' },
  { code: 'it', name: 'Italian' },
  { code: 'ja', name: 'Japanese' },
  { code: 'jw', name: 'Javanese' },
  { code: 'kn', name: 'Kannada' },
  { code: 'kk', name: 'Kazakh' },
  { code: 'km', name: 'Khmer' },
  { code: 'ko', name: 'Korean' },
  { code: 'ku', name: 'Kurdish (Kurmanji)' },
  { code: 'ky', name: 'Kyrgyz' },
  { code: 'lo', name: 'Lao' },
  { code: 'la', name: 'Latin' },
  { code: 'lv', name: 'Latvian' },
  { code: 'lt', name: 'Lithuanian' },
  { code: 'lb', name: 'Luxembourgish' },
  { code: 'mk', name: 'Macedonian' },
  { code: 'mg', name: 'Malagasy' },
  { code: 'ms', name: 'Malay' },
  { code: 'ml', name: 'Malayalam' },
  { code: 'mt', name: 'Maltese' },
  { code: 'mi', name: 'Maori' },
  { code: 'mr', name: 'Marathi' },
  { code: 'mn', name: 'Mongolian' },
  { code: 'my', name: 'Myanmar (Burmese)' },
  { code: 'ne', name: 'Nepali' },
  { code: 'no', name: 'Norwegian' },
  { code: 'ps', name: 'Pashto' },
  { code: 'fa', name: 'Persian' },
  { code: 'pl', name: 'Polish' },
  { code: 'pt', name: 'Portuguese' },
  { code: 'pa', name: 'Punjabi' },
  { code: 'ro', name: 'Romanian' },
  { code: 'ru', name: 'Russian' },
  { code: 'sm', name: 'Samoan' },
  { code: 'gd', name: 'Scots Gaelic' },
  { code: 'sr', name: 'Serbian' },
  { code: 'st', name: 'Sesotho' },
  { code: 'sn', name: 'Shona' },
  { code: 'sd', name: 'Sindhi' },
  { code: 'si', name: 'Sinhala' },
  { code: 'sk', name: 'Slovak' },
  { code: 'sl', name: 'Slovenian' },
  { code: 'so', name: 'Somali' },
  { code: 'es', name: 'Spanish' },
  { code: 'su', name: 'Sundanese' },
  { code: 'sw', name: 'Swahili' },
  { code: 'sv', name: 'Swedish' },
  { code: 'tg', name: 'Tajik' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'th', name: 'Thai' },
  { code: 'tr', name: 'Turkish' },
  { code: 'uk', name: 'Ukrainian' },
  { code: 'ur', name: 'Urdu' },
  { code: 'uz', name: 'Uzbek' },
  { code: 'vi', name: 'Vietnamese' },
  { code: 'cy', name: 'Welsh' },
  { code: 'xh', name: 'Xhosa' },
  { code: 'yi', name: 'Yiddish' },
  { code: 'yo', name: 'Yoruba' },
  { code: 'zu', name: 'Zulu' }
].sort((a, b) => a.name.localeCompare(b.name));

function App() {
  const [word, setWord] = useState('');
  const [translatedWord, setTranslatedWord] = useState('');
  const [romanization, setRomanization] = useState('');
  const [sourceLang, setSourceLang] = useState('en');
  const [targetLang, setTargetLang] = useState('ru');
  const [isSlowMode, setIsSlowMode] = useState(false);
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('lexora_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    localStorage.setItem('lexora_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  const [history, setHistory] = useState<TranslationItem[]>(() => {
    const saved = localStorage.getItem('lexora_history');
    return saved ? JSON.parse(saved) : [];
  });
  const [savedItems, setSavedItems] = useState<TranslationItem[]>(() => {
    const saved = localStorage.getItem('lexora_saved');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeTab, setActiveTab] = useState<'translate' | 'history' | 'saved'>('translate');

  useEffect(() => {
    localStorage.setItem('lexora_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('lexora_saved', JSON.stringify(savedItems));
  }, [savedItems]);

  const handleSwapLanguages = () => {
    setSourceLang(targetLang);
    setTargetLang(sourceLang);
    if (translatedWord) {
      setWord(translatedWord);
      setTranslatedWord('');
      setRomanization('');
    }
  };

  const toggleSaveCurrent = () => {
    if (!translatedWord) return;
    
    const isSaved = savedItems.some(i => i.translatedText === translatedWord && i.sourceText === word);
    
    if (isSaved) {
      setSavedItems(prev => prev.filter(i => !(i.translatedText === translatedWord && i.sourceText === word)));
    } else {
      setSavedItems(prev => [{
        id: Date.now().toString(),
        sourceText: word,
        translatedText: translatedWord,
        romanization,
        sourceLang,
        targetLang,
        timestamp: Date.now()
      }, ...prev]);
    }
  };

  const isCurrentSaved = savedItems.some(i => i.translatedText === translatedWord && i.sourceText === word);
  
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    if (!translatedWord) return;
    try {
      await navigator.clipboard.writeText(translatedWord);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };
  
  const [isPlayingOriginal, setIsPlayingOriginal] = useState(false);
  const [isPlayingTranslated, setIsPlayingTranslated] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState('');
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleTranslate = async () => {
    if (!word.trim()) {
      setError('Please enter text to translate');
      return;
    }

    setError('');
    setIsTranslating(true);
    
    try {
      // Using an undocumented Google Translate endpoint that supports all languages
      // Adding &dt=t (translation) and &dt=rm (romanization)
      const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&dt=rm&q=${encodeURIComponent(word)}`);
      
      if (!res.ok) throw new Error('Translation failed');
      
      const data = await res.json();
      
      let resultText = '';
      let resultRomanization = '';

      data[0].forEach((item: any) => {
        if (item[0]) {
          resultText += item[0];
        } else if (item[2]) {
          resultRomanization += item[2];
        }
      });

      setTranslatedWord(resultText);
      setRomanization(resultRomanization);

      // Add to history
      const newItem: TranslationItem = {
        id: Date.now().toString(),
        sourceText: word,
        translatedText: resultText,
        romanization: resultRomanization,
        sourceLang,
        targetLang,
        timestamp: Date.now()
      };
      setHistory(prev => {
        // Don't add duplicate if it's exactly the same as the last item
        if (prev.length > 0 && prev[0].sourceText === word && prev[0].targetLang === targetLang) {
          return prev;
        }
        return [newItem, ...prev].slice(0, 50); // Keep last 50
      });
    } catch (err) {
      console.error(err);
      setError('Failed to translate text. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const playAudio = async (textToPlay: string, langCode: string, isTranslated: boolean) => {
    if (!textToPlay.trim()) {
      setError('Nothing to pronounce');
      return;
    }
    
    setError('');

    // Stop currently playing audio if it exists
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      
      if ((isTranslated && isPlayingTranslated) || (!isTranslated && isPlayingOriginal)) {
        setIsPlayingOriginal(false);
        setIsPlayingTranslated(false);
        return;
      }
    }

    setIsPlayingOriginal(false);
    setIsPlayingTranslated(false);
    isTranslated ? setIsPlayingTranslated(true) : setIsPlayingOriginal(true);

    try {
      const safeText = textToPlay.slice(0, 200); 
      
      // Hit our Vercel Serverless Function in production, or local Bun proxy in dev
      const baseUrl = import.meta.env.PROD ? '/api/tts' : 'http://localhost:8000/tts';
      const url = `${baseUrl}?text=${encodeURIComponent(safeText)}&lang=${langCode}&slow=${isSlowMode}`;
      
      const audio = new Audio(url);
      
      // Enforce slow mode on the client side to ensure it works instantly 
      // without needing to re-fetch or restart the backend.
      if (isSlowMode) {
        audio.playbackRate = 0.65;
        audio.preservesPitch = true;
      }
      
      audio.onended = () => {
        setIsPlayingTranslated(false);
        setIsPlayingOriginal(false);
      };
      
      audio.onerror = () => {
        setIsPlayingTranslated(false);
        setIsPlayingOriginal(false);
        setError('Failed to play audio stream from server.');
      };

      audioRef.current = audio;
      await audio.play();
      
    } catch (e) {
      console.error('Playback error', e);
      setIsPlayingTranslated(false);
      setIsPlayingOriginal(false);
      setError('Audio playback failed. Ensure the backend server is running.');
    }
  };

  return (
    <div className="app-container">
      <div className="glass-card">
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <h1>Lexora</h1>
              <span style={{ fontSize: '1.25rem', color: '#a855f7', fontWeight: 500, letterSpacing: '0.5px', opacity: 0.9 }}>Translate</span>
            </div>
            <p style={{ marginTop: '0.25rem' }}>Instantly translate text and master perfect pronunciation in over 130 languages.</p>
          </div>
          
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            style={{ 
              background: 'rgba(168, 85, 247, 0.1)', 
              border: '1px solid rgba(168, 85, 247, 0.2)', 
              borderRadius: '12px', 
              padding: '0.75rem', 
              color: '#a855f7', 
              cursor: 'pointer', 
              transition: 'all 0.2s', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center' 
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.2)';
              e.currentTarget.style.color = 'var(--text-color)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
              e.currentTarget.style.color = '#a855f7';
            }}
            title="Toggle Theme"
          >
            {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </div>

        <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '1.5rem' }}>
          <button 
            onClick={() => setActiveTab('translate')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: activeTab === 'translate' ? '#a855f7' : '#94a3b8', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'translate' ? '2px solid #a855f7' : '2px solid transparent', fontWeight: activeTab === 'translate' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
          >
            <Languages size={18} /> Translate
          </button>
          <button 
            onClick={() => setActiveTab('saved')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: activeTab === 'saved' ? '#a855f7' : '#94a3b8', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'saved' ? '2px solid #a855f7' : '2px solid transparent', fontWeight: activeTab === 'saved' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
          >
            <Bookmark size={18} /> Saved ({savedItems.length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{ flex: 1, background: 'transparent', border: 'none', color: activeTab === 'history' ? '#a855f7' : '#94a3b8', padding: '1rem', cursor: 'pointer', borderBottom: activeTab === 'history' ? '2px solid #a855f7' : '2px solid transparent', fontWeight: activeTab === 'history' ? 600 : 400, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'all 0.2s ease' }}
          >
            <History size={18} /> History
          </button>
        </div>

        {activeTab === 'translate' && (
          <>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'stretch' }}>
          
          {/* Left Column (Source) */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              id="source-lang"
              className="select-input"
              value={sourceLang}
              onChange={(e) => setSourceLang(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={`src-${lang.code}`} value={lang.code}>{lang.name}</option>
              ))}
            </select>
            
            <div style={{ position: 'relative', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <textarea
                id="word-input"
                className="text-input"
                style={{ flex: 1, minHeight: '180px', resize: 'none', paddingBottom: '3.5rem' }}
                placeholder="e.g. Hello, how are you?"
                value={word}
                onChange={(e) => {
                  setWord(e.target.value);
                  setError('');
                }}
              />
              <button
                className="icon-button"
                style={{ position: 'absolute', bottom: '12px', right: '12px', background: 'rgba(168, 85, 247, 0.1)', border: 'none', color: '#a855f7', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '40px', height: '40px', borderRadius: '50%', transition: 'all 0.2s' }}
                onClick={() => playAudio(word, sourceLang, false)}
                title="Listen to original text"
              >
                {isPlayingOriginal ? <Square size={18} fill="currentColor" /> : <Volume2 size={18} />}
              </button>
            </div>

            <button 
              className="translate-btn" 
              style={{ marginTop: 0 }}
              onClick={handleTranslate}
              disabled={!word.trim() || isTranslating}
            >
              {isTranslating ? 'Translating...' : <><Languages size={20} style={{marginRight: '8px'}} /> Translate</>}
            </button>
          </div>

          {/* Center Swap Button */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem 0' }}>
            <button
              onClick={handleSwapLanguages}
              style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: '1px solid rgba(255, 255, 255, 0.1)', 
                color: '#a855f7', 
                borderRadius: '50%', 
                width: '48px', 
                height: '48px', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
              title="Swap Languages"
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168, 85, 247, 0.15)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
            >
              <ArrowRightLeft size={20} />
            </button>
          </div>

          {/* Right Column (Target) */}
          <div style={{ flex: '1 1 300px', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <select
              id="target-lang"
              className="select-input"
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
            >
              {SUPPORTED_LANGUAGES.map((lang) => (
                <option key={`tgt-${lang.code}`} value={lang.code}>{lang.name}</option>
              ))}
            </select>

            <div className="translation-result" style={{ flex: 1, minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'stretch', justifyContent: 'space-between', padding: '1.25rem', margin: 0 }}>
              {translatedWord ? (
                <>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', overflowY: 'auto' }}>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '1.4rem', fontWeight: 500 }}>{translatedWord}</p>
                    {romanization && (
                      <p style={{ margin: 0, fontSize: '1.1rem', color: '#cbd5e1', fontWeight: 300 }}>
                        {romanization}
                      </p>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                    <button
                      style={{ 
                        background: isSlowMode ? 'rgba(139, 92, 246, 0.2)' : 'transparent',
                        color: isSlowMode ? '#a78bfa' : '#94a3b8',
                        border: 'none',
                        borderRadius: '8px',
                        padding: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onClick={() => setIsSlowMode(!isSlowMode)}
                      title={isSlowMode ? "Slow Mode: ON" : "Slow Mode: OFF"}
                      onMouseEnter={(e) => { if (!isSlowMode) e.currentTarget.style.color = 'white' }}
                      onMouseLeave={(e) => { if (!isSlowMode) e.currentTarget.style.color = '#94a3b8' }}
                    >
                      <Snail size={20} />
                    </button>

                    <button
                      style={{ background: 'transparent', border: 'none', color: isCurrentSaved ? '#a855f7' : '#94a3b8', padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={toggleSaveCurrent}
                      title={isCurrentSaved ? "Remove from Saved" : "Save Translation"}
                      onMouseEnter={(e) => { if (!isCurrentSaved) e.currentTarget.style.color = 'white' }}
                      onMouseLeave={(e) => { if (!isCurrentSaved) e.currentTarget.style.color = '#94a3b8' }}
                    >
                      {isCurrentSaved ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
                    </button>

                    <button
                      style={{ background: 'transparent', border: 'none', color: isCopied ? '#22c55e' : '#94a3b8', padding: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
                      onClick={handleCopy}
                      title="Copy Translation"
                      onMouseEnter={(e) => { if (!isCopied) e.currentTarget.style.color = 'white' }}
                      onMouseLeave={(e) => { if (!isCopied) e.currentTarget.style.color = '#94a3b8' }}
                    >
                      {isCopied ? <Check size={20} /> : <Copy size={20} />}
                    </button>

                    <button 
                      style={{ 
                        background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                        border: 'none',
                        borderRadius: '50%',
                        width: '40px',
                        height: '40px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(99, 102, 241, 0.4)'
                      }}
                      onClick={() => playAudio(translatedWord, targetLang, true)}
                      title="Play Translation"
                    >
                      {isPlayingTranslated ? <Square fill="currentColor" size={16} /> : <Play fill="currentColor" size={18} style={{ marginLeft: '2px' }} />}
                    </button>
                  </div>
                </>
              ) : (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                   Translation will appear here
                </div>
              )}
            </div>
          </div>
        </div>
        </>
        )}

        {activeTab !== 'translate' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {(activeTab === 'history' ? history : savedItems).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#64748b' }}>
                <p>No {activeTab} items yet.</p>
              </div>
            ) : (
              (activeTab === 'history' ? history : savedItems).map(item => (
                <div key={item.id} style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 500, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                      {SUPPORTED_LANGUAGES.find(l => l.code === item.sourceLang)?.name} → {SUPPORTED_LANGUAGES.find(l => l.code === item.targetLang)?.name}
                    </span>
                    <button 
                      onClick={() => {
                        if (activeTab === 'history') setHistory(h => h.filter(i => i.id !== item.id));
                        if (activeTab === 'saved') setSavedItems(s => s.filter(i => i.id !== item.id));
                      }}
                      style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: 0.7 }}
                      title="Delete"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p style={{ margin: '0 0 0.5rem 0', color: '#cbd5e1', fontSize: '1rem' }}>{item.sourceText}</p>
                  <p style={{ margin: '0 0 0.25rem 0', fontWeight: 600, fontSize: '1.25rem', color: '#fff' }}>{item.translatedText}</p>
                  {item.romanization && <p style={{ margin: 0, color: '#a855f7', fontSize: '0.9rem' }}>{item.romanization}</p>}
                  
                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <button 
                        onClick={() => playAudio(item.translatedText, item.targetLang, true)}
                        style={{ background: 'rgba(168, 85, 247, 0.1)', border: 'none', color: '#a855f7', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500, transition: 'background 0.2s' }}
                      >
                        <Volume2 size={16} /> Listen
                    </button>
                    {activeTab === 'history' && (
                      <button 
                        onClick={() => {
                           if (!savedItems.some(i => i.id === item.id)) {
                             setSavedItems(prev => [item, ...prev]);
                           }
                        }}
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: 'none', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 500 }}
                      >
                        <Bookmark size={16} /> Save
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}
      </div>

      <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
        <a 
          href="https://github.com/student-ankitpandit/Lexora-Translate" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--text-color)', textDecoration: 'none', opacity: 0.6, transition: 'opacity 0.2s' }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '0.6'}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.2c3-.3 6-1.5 6-6.5a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 5 3 6.2 6 6.5a4.8 4.8 0 0 0-1 3.2v4"></path></svg>
          <span style={{ fontSize: '0.95rem', fontWeight: 500, letterSpacing: '0.5px' }}>View on GitHub</span>
        </a>
      </div>
    </div>
  );
}

export default App;
