'use client';

import React, { useState, useEffect } from 'react';
import { MapPin, Crosshair, Search, X, Check, ChevronDown } from 'lucide-react';
import { UP_DISTRICTS, District, getNearestUPDistrict } from '@/lib/districts';

interface LocationSelectorProps {
  currentDistrictId?: string;
  variant?: 'default' | 'strap';
}

export default function LocationSelector({ currentDistrictId = 'ghazipur', variant = 'default' }: LocationSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(currentDistrictId);
  const [search, setSearch] = useState('');
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check if user already has a saved district preference
    const saved = localStorage.getItem('nexus_user_city');
    if (saved && UP_DISTRICTS.some(d => d.id === saved)) {
      setSelectedId(saved);
      return;
    }

    // 2. First-time visit: silently auto-detect location via background IP API (zero permission popups)
    fetch('/api/location/detect')
      .then(res => res.json())
      .then(data => {
        if (data.district && data.district.id) {
          setSelectedId(data.district.id);
          localStorage.setItem('nexus_user_city', data.district.id);

          // If on homepage with no explicit city query param, reload to prioritize matching news
          const currentUrl = new URL(window.location.href);
          if (!currentUrl.searchParams.has('city') && window.location.pathname === '/') {
            currentUrl.searchParams.set('city', data.district.id);
            window.location.replace(currentUrl.toString());
          }
        }
      })
      .catch(() => {
        // Silently ignore if offline
      });
  }, []);

  const currentDistrict = UP_DISTRICTS.find(d => d.id === selectedId) || UP_DISTRICTS[0];

  const handleSelect = (districtId: string) => {
    setSelectedId(districtId);
    localStorage.setItem('nexus_user_city', districtId);
    document.cookie = `nexus_user_city=${districtId}; path=/; max-age=31536000; SameSite=Lax`;
    setIsOpen(false);
    
    // Smoothly reload page or update search params so news re-prioritizes
    const url = new URL(window.location.href);
    url.searchParams.set('city', districtId);
    window.location.href = url.toString();
  };

  const handleAutoDetect = () => {
    setIsLocating(true);
    setLocationStatus('आपकी लोकेशन खोजी जा रही है...');

    if (!('geolocation' in navigator)) {
      setLocationStatus('ब्राउज़र में जीपीएस उपलब्ध नहीं है।');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = getNearestUPDistrict(latitude, longitude);
        setLocationStatus(`निकटतम जिला मिला: ${nearest.nameHindi} (${nearest.nameEnglish})`);
        setTimeout(() => {
          handleSelect(nearest.id);
        }, 600);
      },
      (error) => {
        console.warn('Geolocation error:', error);
        // Fallback to IP Geolocation
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data.latitude && data.longitude) {
              const nearest = getNearestUPDistrict(data.latitude, data.longitude);
              setLocationStatus(`आईपी से पता चला: ${nearest.nameHindi}`);
              setTimeout(() => handleSelect(nearest.id), 600);
            } else {
              setLocationStatus('लोकेशन नहीं मिली, कृपया सूची से चुनें।');
              setIsLocating(false);
            }
          })
          .catch(() => {
            setLocationStatus('अनुमति अस्वीकृत। कृपया सूची से अपना शहर चुनें।');
            setIsLocating(false);
          });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const filteredDistricts = UP_DISTRICTS.filter(d => {
    const s = search.toLowerCase();
    return (
      d.nameHindi.toLowerCase().includes(s) ||
      d.nameEnglish.toLowerCase().includes(s) ||
      (d.subLocations && d.subLocations.some(sub => sub.toLowerCase().includes(s)))
    );
  });

  return (
    <>
      {/* Header Button Trigger */}
      {variant === 'strap' ? (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white/95 hover:text-white bg-white/10 hover:bg-white/20 transition border border-white/25 shadow-xs"
          title="मेरा शहर चुनें"
        >
          <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
          <span className="font-hindi tracking-wide font-bold">मेरा शहर</span>
          {currentDistrict && (
            <span className="text-[11px] text-yellow-300 font-semibold hidden sm:inline-block">
              ({currentDistrict.id === 'ghazipur' ? 'गाजीपुर • मरदह (फेफरा)' : currentDistrict.nameHindi})
            </span>
          )}
        </button>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold text-neutral-800 bg-neutral-100 hover:bg-red-50 hover:text-aajtak-red transition border border-neutral-200/80 shadow-xs group"
          title="अपना शहर चुनें (Select Your City)"
        >
          <MapPin className="w-3.5 h-3.5 text-aajtak-red shrink-0" />
          <span className="font-hindi">{currentDistrict.id === 'ghazipur' ? 'गाजीपुर (मरदह)' : currentDistrict.nameHindi}</span>
          <span className="text-[10px] text-neutral-400 group-hover:text-aajtak-red font-normal">
            (बदलें)
          </span>
          <ChevronDown className="w-3 h-3 text-neutral-400" />
        </button>
      )}

      {/* Modal Dialog */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col border border-neutral-200 overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-neutral-900 leading-tight">
                    अपना शहर / जिला चुनें
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    आपके शहर की प्राथमिकता के आधार पर खबरें दिखेंगी
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-700 rounded-full hover:bg-neutral-200/60 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Auto Detect Button */}
            <div className="p-4 border-b border-neutral-100 space-y-2">
              <button
                onClick={handleAutoDetect}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white text-xs font-bold py-2.5 px-4 rounded-lg shadow-sm transition disabled:opacity-60"
              >
                <Crosshair className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
                <span>{isLocating ? 'लोकेशन पहचानी जा रही है...' : '🎯 ऑटोमैटिक लोकेशन पता लगाएं (Auto Detect)'}</span>
              </button>
              {locationStatus && (
                <p className="text-[11px] text-center font-medium text-emerald-700 bg-emerald-50 py-1 rounded">
                  {locationStatus}
                </p>
              )}
            </div>

            {/* Search Input */}
            <div className="p-4 pb-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-2.5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="जिला खोजें (उदा: लखनऊ, कानपुर, वाराणसी...)"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-neutral-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
                />
              </div>
            </div>

            {/* Popular Districts */}
            {!search && (
              <div className="px-4 py-2">
                <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-2">
                  प्रमुख उत्तर प्रदेश शहर (Popular)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {UP_DISTRICTS.filter(d => d.isPopular).map(d => {
                    const isSelected = d.id === selectedId;
                    return (
                      <button
                        key={d.id}
                        onClick={() => handleSelect(d.id)}
                        className={`text-xs px-3 py-1.5 rounded-full font-bold transition flex items-center gap-1 ${
                          isSelected
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'bg-neutral-100 hover:bg-red-50 text-neutral-800 hover:text-red-600 border border-neutral-200'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3" />}
                        <span>{d.id === 'ghazipur' ? 'गाजीपुर (मरदह)' : d.nameHindi}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Full List */}
            <div className="p-4 pt-2 overflow-y-auto flex-1 divide-y divide-neutral-100">
              <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
                सभी जिले एवं क्षेत्र ({filteredDistricts.length})
              </span>
              {filteredDistricts.map(d => {
                const isSelected = d.id === selectedId;
                return (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(d.id)}
                    className={`w-full py-2.5 px-3 text-left flex items-center justify-between rounded-md transition text-xs ${
                      isSelected
                        ? 'bg-red-50 text-red-600 font-bold'
                        : 'text-neutral-700 hover:bg-neutral-50'
                    }`}
                  >
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">{d.nameHindi}</span>
                        <span className="text-neutral-400 text-[11px]">({d.nameEnglish})</span>
                        {d.id === 'ghazipur' && (
                          <span className="bg-red-100 text-red-700 text-[10px] font-bold px-1.5 py-0.5 rounded">
                            मरदह / फेफरा
                          </span>
                        )}
                      </div>
                      {d.subLocations && d.subLocations.length > 0 && (
                        <span className="text-[11px] text-neutral-500 mt-0.5">
                          ब्लॉक/गांव: {d.subLocations.join(', ')}
                        </span>
                      )}
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-red-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

          </div>
        </div>
      )}
    </>
  );
}
