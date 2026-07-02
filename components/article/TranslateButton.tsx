'use client';

import { useState } from 'react';
import { Globe, ChevronDown, Loader2 } from 'lucide-react';

interface TranslateButtonProps {
  articleId: string;
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
}

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇬🇧', dir: 'ltr' },
  { code: 'ur', label: 'اردو', flag: '🇵🇰', dir: 'rtl' },
  { code: 'es', label: 'Español', flag: '🇪🇸', dir: 'ltr' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', dir: 'rtl' },
];

export default function TranslateButton({ articleId, currentLanguage, onLanguageChange }: TranslateButtonProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingLang, setLoadingLang] = useState('');

  const currentLang = LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  const handleTranslate = async (lang: typeof LANGUAGES[number]) => {
    if (lang.code === currentLanguage) { setOpen(false); return; }

    const cacheKey = `translate_${articleId}_${lang.code}`;
    const cached = localStorage.getItem(cacheKey);

    if (cached) {
      onLanguageChange(lang.code);
      document.documentElement.dir = lang.dir;
      setOpen(false);
      return;
    }

    setLoading(true);
    setLoadingLang(lang.code);

    try {
      const res = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ articleId, targetLang: lang.code }),
      });

      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        onLanguageChange(lang.code);
        document.documentElement.dir = lang.dir;
      }
    } catch {}
    setLoading(false);
    setLoadingLang('');
    setOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="btn-ghost text-[12px] px-3.5 py-2"
        disabled={loading}
      >
        {loading ? <Loader2 size={13} className="animate-spin" /> : <Globe size={13} />}
        <span>{currentLang.flag} {currentLang.label}</span>
        <ChevronDown size={11} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-full left-0 mt-2 glass-card py-1.5 z-50 min-w-[160px] animate-slide-down !rounded-xl overflow-hidden">
            <div className="px-3 py-2 border-b border-black/[0.04]">
              <p className="caption text-ink-5">Translate to</p>
            </div>
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleTranslate(lang)}
                disabled={loading && loadingLang === lang.code}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-medium transition-all duration-200 ${
                  currentLanguage === lang.code
                    ? 'bg-brand-red/5 text-brand-red'
                    : 'text-ink-3 hover:text-ink hover:bg-pearl/60'
                }`}
              >
                {loading && loadingLang === lang.code ? (
                  <Loader2 size={13} className="animate-spin" />
                ) : (
                  <span className="text-[15px]">{lang.flag}</span>
                )}
                <span>{lang.label}</span>
                {currentLanguage === lang.code && <span className="ml-auto text-brand-red text-[11px] font-bold">✓</span>}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
