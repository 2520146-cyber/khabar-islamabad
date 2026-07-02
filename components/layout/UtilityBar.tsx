'use client';

import { useEffect, useState } from 'react';
import { format } from 'date-fns';
import type { WeatherData, PrayerTimes } from '@/lib/weather';

export default function UtilityBar() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTimes | null>(null);
  const [currentLang, setCurrentLang] = useState('en');
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  useEffect(() => {
    fetch('/api/weather').then((r) => r.json()).then(setWeather).catch(() => {});
    fetch('/api/prayer-times').then((r) => r.json()).then(setPrayerTimes).catch(() => {});
    const cookie = document.cookie.split(';').find((c) => c.trim().startsWith('preferred_lang='));
    if (cookie) setCurrentLang(cookie.split('=')[1]);
  }, []);

  const switchLang = (lang: string) => {
    document.cookie = `preferred_lang=${lang};path=/;max-age=31536000`;
    setCurrentLang(lang);
    document.documentElement.dir = lang === 'ur' || lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const languages = [
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'ur', label: 'UR', flag: '🇵🇰' },
    { code: 'es', label: 'ES', flag: '🇪🇸' },
    { code: 'ar', label: 'AR', flag: '🇸🇦' },
  ];

  return (
    <div className="bg-ink hidden md:block noise-overlay" style={{ background: 'var(--gradient-dark)' }}>
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 h-[30px] flex items-center justify-between relative z-10">
        {/* Left */}
        <div className="flex items-center gap-3 text-[10.5px] font-medium tracking-[0.02em]">
          <span className="text-white/70 font-semibold">{today}</span>
          {prayerTimes && (
            <>
              <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
              <span className="hidden lg:flex items-center gap-2 text-white/40">
                <span>Fajr {prayerTimes.fajr}</span>
                <span className="w-[2px] h-[2px] rounded-full bg-white/10" />
                <span>Zuhr {prayerTimes.zuhr}</span>
                <span className="w-[2px] h-[2px] rounded-full bg-white/10" />
                <span>Asr {prayerTimes.asr}</span>
                <span className="w-[2px] h-[2px] rounded-full bg-white/10" />
                <span>Maghrib {prayerTimes.maghrib}</span>
                <span className="w-[2px] h-[2px] rounded-full bg-white/10" />
                <span>Isha {prayerTimes.isha}</span>
              </span>
            </>
          )}
          {weather && weather.temperature > 0 && (
            <>
              <span className="w-[3px] h-[3px] rounded-full bg-white/15" />
              <span className="text-white/50">Islamabad {weather.temperature}°C {weather.icon}</span>
            </>
          )}
          <span className="w-[3px] h-[3px] rounded-full bg-white/15 hidden xl:block" />
          <span className="hidden xl:flex items-center gap-2 text-white/35">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/60" /> Gold ₨23,840/g
          </span>
          <span className="w-[3px] h-[3px] rounded-full bg-white/15 hidden xl:block" />
          <span className="hidden xl:inline text-white/35">$ 278.40</span>
        </div>

        {/* Right — language */}
        <div className="flex items-center gap-0.5">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => switchLang(lang.code)}
              className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold tracking-[0.1em] transition-all duration-200 ${
                currentLang === lang.code
                  ? 'bg-white/15 text-white shadow-[0_0_8px_rgba(255,255,255,0.1)]'
                  : 'text-white/25 hover:text-white/50 hover:bg-white/5'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
