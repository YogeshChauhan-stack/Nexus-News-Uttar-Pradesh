'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Sliders, Menu, X, Crown, Briefcase } from 'lucide-react';
import { Category } from '@/lib/types';
import LocationSelector from './LocationSelector';

interface HeaderProps {
  categories: Category[];
}

export default function Header({ categories }: HeaderProps) {
  const router = useRouter();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [liveTime, setLiveTime] = useState('');

  // Live IST clock — ticks every second
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setLiveTime(now.toLocaleTimeString('hi-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZone: 'Asia/Kolkata',
      }));
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  const currentDate = new Date().toLocaleDateString('hi-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className="bg-white border-b border-neutral-200">
      {/* 1. Top Utility Bar */}
      <div className="border-b border-neutral-100 bg-neutral-50/80 text-xs text-neutral-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <span className="font-semibold text-neutral-800">{currentDate}</span>
            <span className="hidden sm:inline-block text-neutral-300">|</span>
            <span className="hidden sm:flex items-center gap-1.5 text-emerald-700 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
              24x7 लाइव न्यूज़ नेटवर्क
            </span>
            {/* Live IST Clock */}
            {liveTime && (
              <>
                <span className="hidden md:inline-block text-neutral-300">|</span>
                <span className="hidden md:flex items-center gap-1 font-mono font-bold text-[#E31E25] tabular-nums text-[11px]">
                  🕐 {liveTime} IST
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-3.5">
            <Link
              href="/jobs"
              className="inline-flex items-center gap-1 font-bold text-red-600 hover:text-red-700 transition"
            >
              <Briefcase className="w-3.5 h-3.5 text-red-600" />
              <span>जॉब अलर्ट्स & रिजल्ट्स</span>
            </Link>

            <span className="text-neutral-300">|</span>

            <Link
              href="/admin"
              prefetch={false}
              className="inline-flex items-center gap-1 font-semibold text-neutral-700 hover:text-red-600 transition"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Editorial CMS</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Main Branding Row (Logo + Tagline + Live TV) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="inline-flex items-center gap-3 group">
            <img
              src="/images/nexus-news-up-logo.png"
              alt="Nexus News UP - उत्तर प्रदेश"
              className="h-12 sm:h-16 w-auto object-contain rounded-md shadow-sm border border-neutral-200/60 transition group-hover:scale-[1.02]"
            />
            <div className="hidden md:block border-l border-neutral-200 pl-3.5">
              <span className="block text-xs font-bold uppercase tracking-wider text-neutral-500">
                Official Digital Network
              </span>
              <span className="block text-sm font-black text-red-600">
                उत्तर प्रदेश का विश्वसनीय न्यूज़ चैनल
              </span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/category/world"
            className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-sm transition animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-white"></span>
            <span>LIVE TV</span>
          </Link>
        </div>
      </div>

      {/* 3. Amar Ujala Style Dark Navigation Strap */}
      <nav className="bg-[#262626] text-white border-b border-neutral-800 shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-0 sm:px-4 flex items-center justify-between h-11 sm:h-12">
          {/* Left Block: [≡ Hamburger] + [होम (Red)] + [👑 Emblem] + Categories */}
          <div className="flex items-center h-full overflow-x-auto no-scrollbar">
            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="px-3 sm:px-4 h-full flex items-center justify-center text-white hover:bg-black/30 transition shrink-0 border-r border-neutral-700/60"
              aria-label="Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Red 'होम' Button */}
            <Link
              href="/"
              className="bg-[#E31E25] hover:bg-[#c81a20] text-white font-black px-4 sm:px-5 h-full flex items-center justify-center text-sm font-hindi shrink-0 transition tracking-wide"
            >
              होम
            </Link>

            {/* Golden Crown Emblem Badge */}
            <Link
              href="/"
              className="px-3 sm:px-3.5 h-full flex items-center justify-center bg-black/40 hover:bg-black/60 border-r border-neutral-700/60 shrink-0 transition"
              title="Nexus News UP Special"
            >
              <div className="flex items-center gap-1 text-yellow-400 font-black">
                <Crown className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-white text-xs font-bold font-hindi">नेक्सस</span>
              </div>
            </Link>

            {/* Category Links */}
            <ul className="flex items-center h-full text-xs sm:text-sm font-semibold tracking-wide whitespace-nowrap">
              <li>
                <Link
                  href="/category/world"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi"
                >
                  देश
                </Link>
              </li>
              <li>
                <Link
                  href="/category/uttar-pradesh"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi font-bold"
                >
                  शहर और राज्य
                </Link>
              </li>
              <li>
                <Link
                  href="/category/politics"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi"
                >
                  चुनाव
                </Link>
              </li>
              <li>
                <Link
                  href="/category/world"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition gap-1.5"
                >
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="font-bold">LIVE</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/category/business"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi"
                >
                  कारोबार
                </Link>
              </li>
              <li>
                <Link
                  href="/jobs"
                  className="px-3 sm:px-4 h-full flex items-center text-amber-300 hover:text-white hover:bg-black/20 transition font-hindi font-bold gap-1 bg-white/5"
                >
                  <Briefcase className="w-3.5 h-3.5 text-amber-400" />
                  <span>नौकरी & करियर</span>
                </Link>
              </li>
              <li className="hidden md:block">
                <Link
                  href="/category/culture"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi"
                >
                  मनोरंजन
                </Link>
              </li>
              <li className="hidden lg:block">
                <Link
                  href="/category/technology"
                  className="px-3 sm:px-4 h-full flex items-center text-neutral-200 hover:text-white hover:bg-black/20 transition font-hindi"
                >
                  साइंस व टेक
                </Link>
              </li>
            </ul>
          </div>

          {/* Right Block: [📍 मेरा शहर] + [🔍 Search] */}
          <div className="flex items-center gap-2 px-3 shrink-0 h-full">
            <LocationSelector variant="strap" />

            <div className="border-l border-neutral-700/60 h-6 mx-1"></div>

            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-1.5 sm:p-2 text-neutral-300 hover:text-white hover:bg-black/20 rounded-md transition"
              title="खोजें (Search)"
            >
              {searchOpen ? <X className="w-4 h-4 sm:w-5 sm:h-5" /> : <Search className="w-4 h-4 sm:w-5 sm:h-5" />}
            </button>
          </div>
        </div>

        {/* Dropdown Search Box */}
        {searchOpen && (
          <div className="border-t border-neutral-700/80 bg-[#1f1f1f] px-4 py-3 animate-in slide-in-from-top-1">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <input
                type="text"
                autoFocus
                placeholder="ताज़ा ख़बरें खोजें... (उदा: लखनऊ, योगी आदित्यनाथ, बजट, कानपुर)"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 text-xs sm:text-sm bg-neutral-800 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:border-red-500"
              />
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-lg text-xs font-bold uppercase transition shrink-0"
              >
                खोजें
              </button>
            </form>
          </div>
        )}
      </nav>

      {/* 4. Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-4 pb-6 space-y-3 shadow-lg animate-in slide-in-from-top-2">
          <div className="pb-3 border-b border-neutral-100 flex items-center justify-between">
            <span className="text-xs font-bold text-neutral-500 uppercase">नेविगेशन मेनू</span>
            <LocationSelector />
          </div>

          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-bold text-red-600 bg-red-50"
            >
              होम
            </Link>
            <Link
              href="/category/world"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              देश
            </Link>
            <Link
              href="/category/uttar-pradesh"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              शहर और राज्य (उत्तर प्रदेश)
            </Link>
            <Link
              href="/category/politics"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              चुनाव
            </Link>
            <Link
              href="/category/business"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              कारोबार
            </Link>
            <Link
              href="/jobs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-bold text-amber-800 bg-amber-50 hover:bg-amber-100 flex items-center justify-between"
            >
              <span>💼 सरकारी नौकरी & करियर केंद्र</span>
              <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-black">NEW</span>
            </Link>
            <Link
              href="/category/culture"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              मनोरंजन
            </Link>
            <Link
              href="/category/technology"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 px-3 rounded-md font-semibold text-neutral-800 hover:bg-neutral-50"
            >
              साइंस व टेक
            </Link>
          </div>

          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between">
            <Link
              href="/admin"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs font-bold text-red-600 hover:underline"
            >
              Editorial CMS Console &rarr;
            </Link>
            <Link
              href="/admin/sync"
              prefetch={false}
              onClick={() => setMobileMenuOpen(false)}
              className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded border border-red-200"
            >
              Sync Feeds
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
