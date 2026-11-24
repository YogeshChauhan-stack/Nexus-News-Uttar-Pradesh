'use client';

import React, { useState, useEffect } from 'react';
import { ChevronUp, Sun, Moon, ALargeSmall } from 'lucide-react';

export default function FloatingTools() {
  const [showTop, setShowTop] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'md' | 'lg'>('md');
  const [fontMenuOpen, setFontMenuOpen] = useState(false);

  // Back-to-top visibility
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Persist dark mode
  useEffect(() => {
    const saved = localStorage.getItem('nexus_dark') === '1';
    setDarkMode(saved);
    document.documentElement.classList.toggle('dark', saved);
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem('nexus_dark', next ? '1' : '0');
    document.documentElement.classList.toggle('dark', next);
  };

  // Font size classes applied globally to <body>
  const fontSizeMap = { sm: 'text-sm', md: 'text-base', lg: 'text-lg' };
  useEffect(() => {
    const saved = (localStorage.getItem('nexus_font') as 'sm' | 'md' | 'lg') || 'md';
    setFontSize(saved);
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    document.body.classList.add(fontSizeMap[saved]);
  }, []);

  const cycleFontSize = (size: 'sm' | 'md' | 'lg') => {
    setFontSize(size);
    localStorage.setItem('nexus_font', size);
    document.body.classList.remove('text-sm', 'text-base', 'text-lg');
    document.body.classList.add(fontSizeMap[size]);
    setFontMenuOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col items-center gap-2">
      {/* Back to Top */}
      {showTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="ऊपर जाएं"
          className="w-10 h-10 rounded-full bg-red-600 hover:bg-red-700 text-white shadow-lg flex items-center justify-center transition active:scale-95"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
      )}

      {/* Font Size Menu */}
      <div className="relative">
        {fontMenuOpen && (
          <div className="absolute bottom-12 right-0 flex flex-col gap-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 rounded-xl shadow-xl p-2 min-w-[80px] text-center animate-in slide-in-from-bottom-2">
            {(['sm', 'md', 'lg'] as const).map((s) => (
              <button
                key={s}
                onClick={() => cycleFontSize(s)}
                className={`text-xs font-bold py-1.5 px-3 rounded-lg transition ${
                  fontSize === s
                    ? 'bg-red-600 text-white'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200'
                }`}
              >
                {s === 'sm' ? 'A−' : s === 'md' ? 'A' : 'A+'}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setFontMenuOpen(!fontMenuOpen)}
          aria-label="फ़ॉन्ट साइज"
          className="w-10 h-10 rounded-full bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-white hover:border-red-500 shadow-lg flex items-center justify-center transition"
          title="Font Size"
        >
          <ALargeSmall className="w-4.5 h-4.5" />
        </button>
      </div>

      {/* Dark Mode Toggle */}
      <button
        onClick={toggleDark}
        aria-label="डार्क मोड"
        className="w-10 h-10 rounded-full bg-white dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-yellow-300 hover:border-red-500 shadow-lg flex items-center justify-center transition"
        title="Dark Mode"
      >
        {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
      </button>
    </div>
  );
}
