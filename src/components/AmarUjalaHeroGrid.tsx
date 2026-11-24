import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, MapPin, ChevronRight, Zap } from 'lucide-react';
import { Article } from '@/lib/types';
import { formatAmarUjalaHeadline } from '@/lib/districts';

interface AmarUjalaHeroGridProps {
  leadArticle: Article;
  secondaryArticles: Article[];
  userDistrictHindi?: string;
}

export default function AmarUjalaHeroGrid({
  leadArticle,
  secondaryArticles,
  userDistrictHindi
}: AmarUjalaHeroGridProps) {
  if (!leadArticle) return null;

  const { prefix: leadPrefix, mainTitle: leadTitle } = formatAmarUjalaHeadline(leadArticle.title);

  // Use provided pointers or generate fallback takeaways
  const pointers = leadArticle.pointers && leadArticle.pointers.length > 0
    ? leadArticle.pointers
    : [
        `${leadArticle.summary.slice(0, 80)}...`,
        'प्रशासन और संबंधित सुरक्षा एजेंसियों द्वारा विशेष सतर्कता।',
        'स्थानीय स्तर पर घटनाक्रम पर विस्तृत रिपोर्ट जल्द जारी की जाएगी।'
      ];

  return (
    <section className="space-y-4">
      {/* Section Subheading Banner */}
      <div className="flex items-center justify-between border-b-2 border-red-600 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-ping inline-block" />
          <h2 className="text-xl sm:text-2xl font-black font-editorial text-neutral-900 tracking-tight flex items-center gap-2">
            <span>प्रमुख समाचार (Top Stories)</span>
            {userDistrictHindi && (
              <span className="text-xs bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-full font-bold">
                📍 {userDistrictHindi} प्राथमिकता
              </span>
            )}
          </h2>
        </div>
        <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest hidden sm:inline-block">
          24x7 ग्राउंड रिपोर्ट
        </span>
      </div>

      {/* Main 68 / 32 Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column (68% / 8 cols): Big Amar Ujala Lead Story with Pointers */}
        <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition">
          <Link href={`/article/${leadArticle.slug}`} className="block relative aspect-video w-full overflow-hidden group">
            <img
              src={leadArticle.featuredImage || 'https://images.unsplash.com/photo-1548013146-72479768bada?w=1200&auto=format&fit=crop&q=80'}
              alt={leadArticle.title}
              className="w-full h-full object-cover group-hover:scale-102 transition duration-500"
            />
            {leadArticle.isBreaking && (
              <span className="absolute top-4 left-4 bg-red-600 text-white text-xs font-black px-3 py-1 rounded shadow-md uppercase tracking-wider flex items-center gap-1.5 animate-pulse">
                <Zap className="w-3.5 h-3.5" />
                <span>बड़ी खबर</span>
              </span>
            )}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent p-4 sm:p-6 text-white lg:hidden">
              <span className="text-red-400 font-black mr-2">{leadPrefix}</span>
              <h3 className="font-editorial text-lg sm:text-xl font-black leading-snug">
                {leadTitle}
              </h3>
            </div>
          </Link>

          <div className="p-5 sm:p-6 space-y-4">
            {/* Desktop Headline with Red District Prefix */}
            <div className="hidden lg:block">
              <Link href={`/article/${leadArticle.slug}`}>
                <h3 className="font-editorial text-2xl sm:text-3xl font-black text-neutral-950 hover:text-red-600 transition leading-snug">
                  <span className="text-red-600 font-black mr-2.5 inline-block">{leadPrefix}</span>
                  <span>{leadTitle}</span>
                </h3>
              </Link>
            </div>

            {/* Amar Ujala 3 Bullet Points (पॉइंटर्स) Standfirst Block */}
            <div className="bg-neutral-50/80 border-l-4 border-red-600 p-4 rounded-r-lg space-y-2">
              <span className="text-[11px] font-black uppercase text-red-600 tracking-wider flex items-center gap-1">
                <span>महत्वपूर्ण बिंदु (Key Takeaways)</span>
              </span>
              <ul className="space-y-1.5 text-xs sm:text-sm text-neutral-700 font-medium">
                {pointers.map((pt, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-red-600 font-bold shrink-0 mt-0.5">&bull;</span>
                    <span className="leading-relaxed">{pt}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Byline / Source bar */}
            <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs text-neutral-500">
              <div className="flex items-center gap-3">
                <span className="font-bold text-neutral-800">{leadArticle.sourceName}</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>आज का ताज़ा समाचार</span>
                </span>
              </div>
              <Link
                href={`/article/${leadArticle.slug}`}
                className="text-red-600 font-bold text-xs hover:underline flex items-center gap-1"
              >
                <span>पूरी खबर पढ़ें</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Column (32% / 4 cols): 4 Secondary Regional Story Cards */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-neutral-100 px-3 py-2 rounded-lg flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-neutral-800">
              अन्य प्रमुख खबरें
            </span>
            <span className="text-[10px] text-neutral-500">अपडेटेड</span>
          </div>

          <div className="divide-y divide-neutral-200/80 bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-sm">
            {secondaryArticles.map((art, idx) => {
              const { prefix, mainTitle } = formatAmarUjalaHeadline(art.title);
              return (
                <div key={art.id || idx} className="p-3.5 hover:bg-neutral-50 transition group">
                  <Link href={`/article/${art.slug}`} className="flex gap-3 items-start">
                    <div className="w-24 h-20 sm:w-28 sm:h-22 shrink-0 rounded-lg overflow-hidden bg-neutral-100 relative">
                      <img
                        src={art.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=500&auto=format&fit=crop&q=80'}
                        alt={art.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-editorial text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-red-600 transition line-clamp-3 leading-snug">
                        <span className="text-red-600 font-black mr-1">{prefix}</span>
                        <span>{mainTitle}</span>
                      </h4>
                      <div className="mt-1.5 flex items-center gap-2 text-[11px] text-neutral-400">
                        <span className="truncate max-w-[100px]">{art.sourceName}</span>
                        <span>&bull;</span>
                        <span>ताज़ा</span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
