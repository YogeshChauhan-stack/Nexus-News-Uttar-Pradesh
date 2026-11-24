import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';
import { Article } from '@/lib/types';
import { formatAmarUjalaHeadline } from '@/lib/districts';

interface CityNewsSectionProps {
  districtNameHindi: string;
  articles: Article[];
}

export default function CityNewsSection({ districtNameHindi, articles }: CityNewsSectionProps) {
  if (!articles || articles.length === 0) return null;

  return (
    <section className="bg-red-50/50 border border-red-200/80 rounded-xl p-5 sm:p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-red-600 text-white flex items-center justify-center shadow-xs">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-editorial text-lg sm:text-xl font-black text-neutral-900">
              आपके शहर ({districtNameHindi}) की ताज़ा ख़बरें
            </h3>
            <p className="text-[11px] text-neutral-500">
              आपकी चुनी हुई लोकेशन के अनुसार प्राथमिकता से प्रदर्शित
            </p>
          </div>
        </div>

        <Link
          href={`/category/uttar-pradesh`}
          className="text-xs font-bold text-red-600 hover:text-red-700 flex items-center gap-1 uppercase"
        >
          <span>पूरा यूपी &rarr;</span>
        </Link>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {articles.slice(0, 4).map((art) => {
          const { prefix, mainTitle } = formatAmarUjalaHeadline(art.title);
          return (
            <div
              key={art.id}
              className="bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col group"
            >
              <Link href={`/article/${art.slug}`} className="block relative aspect-video overflow-hidden">
                <img
                  src={art.featuredImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=800&auto=format&fit=crop&q=80'}
                  alt={art.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                  {districtNameHindi}
                </span>
              </Link>
              <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                <Link href={`/article/${art.slug}`}>
                  <h4 className="font-editorial text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                    <span className="text-red-600 font-black mr-1">{prefix}</span>
                    <span>{mainTitle}</span>
                  </h4>
                </Link>
                <div className="pt-1 text-[11px] text-neutral-400 flex items-center justify-between border-t border-neutral-100">
                  <span className="truncate max-w-[120px]">{art.sourceName}</span>
                  <span className="text-red-600 font-bold hover:underline">पढ़ें &rarr;</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
