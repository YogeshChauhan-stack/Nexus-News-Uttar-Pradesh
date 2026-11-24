'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Zap, Flame, Briefcase } from 'lucide-react';
import { Article } from '@/lib/types';

interface TickerItem {
  id: string;
  type: 'news' | 'job';
  prefix: string;
  title: string;
  url: string;
}

export default function BreakingTicker({ initialBreaking }: { initialBreaking?: Article[] }) {
  const [items, setItems] = useState<TickerItem[]>([
    {
      id: 'default-job-1',
      type: 'job',
      prefix: 'सरकारी रिजल्ट',
      title: 'यूपी पुलिस कांस्टेबल 60,244 पद भर्ती एवं पीएसी ऑनलाइन फॉर्म प्रक्रिया जारी - अंतिम तिथि निकट',
      url: '/jobs'
    },
    {
      id: 'default-news-1',
      type: 'news',
      prefix: 'गाजीपुर अलर्ट',
      title: 'मरदह ब्लॉक के फेफरा गांव में नई सीसी सड़क व शुद्ध पेयजल पाइपलाइन परियोजना को हरी झंडी',
      url: '/?city=ghazipur'
    },
    {
      id: 'default-job-2',
      type: 'job',
      prefix: 'विदेश नौकरी',
      title: 'दुबई (UAE) एवं सऊदी अरब Neom प्रोजेक्ट में भारतीय नर्सों, तकनीकी सुपरवाइजरों की सीधी भर्ती',
      url: '/jobs'
    }
  ]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/breaking')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data) && data.length > 0) {
          const mappedArticles: TickerItem[] = data.map((art: Article) => ({
            id: art.id,
            type: 'news',
            prefix: art.district === 'ghazipur' ? 'गाजीपुर' : 'बड़ी खबर',
            title: art.title,
            url: `/article/${art.slug}`
          }));

          setItems(prev => [...mappedArticles, ...prev]);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (items.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % items.length);
    }, 5500);
    return () => clearInterval(interval);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const active = items[currentIndex];

  return (
    <div className="bg-[#1a1a1a] text-white border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-3 text-xs sm:text-sm">
        
        {/* Flash Label */}
        <div className="flex items-center gap-1.5 bg-[#E31E25] text-white px-2.5 py-0.5 rounded text-[11px] font-black tracking-wider uppercase shrink-0 shadow-xs">
          <Zap className="w-3.5 h-3.5 fill-current animate-pulse text-yellow-300" />
          <span>ब्रेकिंग न्यूज़</span>
        </div>

        {/* Current Active Item */}
        <div className="flex-1 truncate">
          <Link
            href={active.url}
            className="hover:underline text-neutral-200 hover:text-white transition font-medium flex items-center gap-2 truncate"
          >
            <span className="text-yellow-400 font-bold shrink-0">[{active.prefix}]:</span>
            <span className="truncate font-hindi">{active.title}</span>
          </Link>
        </div>

        {/* Counter & Next Button */}
        {items.length > 1 && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 shrink-0">
            <span className="font-mono text-[11px]">{currentIndex + 1}/{items.length}</span>
            <button
              onClick={() => setCurrentIndex(prev => (prev + 1) % items.length)}
              className="p-1 hover:text-white rounded hover:bg-white/10 transition"
              title="Next alert"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
