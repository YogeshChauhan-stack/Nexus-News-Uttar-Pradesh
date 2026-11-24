'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { MapPin } from 'lucide-react';
import { UP_DISTRICTS } from '@/lib/districts';

interface UPDistrictBarProps {
  activeDistrictId?: string;
}

export default function UPDistrictBar({ activeDistrictId = 'ghazipur' }: UPDistrictBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get('city') || activeDistrictId;

  const handleCityClick = (cityId: string) => {
    localStorage.setItem('nexus_user_city', cityId);
    document.cookie = `nexus_user_city=${cityId}; path=/; max-age=31536000; SameSite=Lax`;
    
    const url = new URL(window.location.href);
    if (cityId === 'all') {
      url.searchParams.delete('city');
    } else {
      url.searchParams.set('city', cityId);
    }
    window.location.href = url.toString();
  };

  const featuredDistricts = [
    { id: 'all', nameHindi: 'सभी उत्तर प्रदेश' },
    ...UP_DISTRICTS.filter(d => d.isPopular)
  ];

  return (
    <div className="bg-white border-b border-neutral-200/80 shadow-2xs py-2 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-3 overflow-x-auto no-scrollbar py-0.5">
        <div className="flex items-center gap-1.5 shrink-0 text-xs font-black uppercase text-red-600 border-r border-neutral-200 pr-3">
          <MapPin className="w-3.5 h-3.5" />
          <span>शहर चुनें:</span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {featuredDistricts.map(d => {
            const isActive = currentCity === d.id || (!currentCity && d.id === 'all');
            return (
              <button
                key={d.id}
                onClick={() => handleCityClick(d.id)}
                className={`text-xs px-3 py-1 rounded-full font-bold whitespace-nowrap transition ${
                  isActive
                    ? 'bg-red-600 text-white shadow-xs'
                    : 'bg-neutral-100 hover:bg-red-50 text-neutral-700 hover:text-red-600'
                }`}
              >
                {d.id === 'ghazipur' ? 'गाजीपुर (मरदह)' : d.nameHindi}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
