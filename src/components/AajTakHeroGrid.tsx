import React from 'react';
import Link from 'next/link';
import { Flame, Clock, Radio, ChevronRight } from 'lucide-react';
import { Article } from '@/lib/types';
import { calculateReadTime } from '@/lib/seo';

interface AajTakHeroGridProps {
  leadStory: Article;
  sideStories: Article[];
}

export default function AajTakHeroGrid({ leadStory, sideStories }: AajTakHeroGridProps) {
  if (!leadStory) return null;

  const leadReadTime = calculateReadTime(leadStory.content || leadStory.summary);
  const leadTimeAgo = formatTimeAgo(leadStory.publishedAt || leadStory.createdAt);

  // Generate 2-3 bullet points from summary for Aaj Tak signature style
  const summaryBullets = leadStory.summary
    ? leadStory.summary
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.trim().length > 15)
        .slice(0, 3)
    : [leadStory.title];

  return (
    <section className="bg-white rounded-xl border border-neutral-200/90 shadow-sm overflow-hidden mb-8">
      {/* Aaj Tak Style Section Flag */}
      <div className="bg-gradient-to-r from-aajtak-red to-aajtak-darkRed px-4 sm:px-6 py-2.5 flex items-center justify-between text-white">
        <div className="flex items-center gap-2">
          <span className="w-2 h-5 bg-white rounded-sm inline-block" />
          <h2 className="text-base sm:text-lg font-black tracking-wide uppercase flex items-center gap-1.5">
            <span>प्रमुख समाचार</span>
            <span className="text-xs font-semibold text-neutral-200">/ TOP HEADLINES</span>
          </h2>
        </div>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="hidden sm:inline">LIVE WIRE ACTIVE</span>
        </div>
      </div>

      <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* 1. Main Lead Hero Story (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <Link
            href={`/article/${leadStory.slug}`}
            className="block relative aspect-[16/9] rounded-lg overflow-hidden group bg-neutral-100 shadow-inner"
          >
            {leadStory.featuredImage ? (
              <img
                src={leadStory.featuredImage}
                alt={leadStory.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
                No image
              </div>
            )}

            {/* Breaking badge in Aaj Tak Crimson */}
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-aajtak-red text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
                <Flame className="w-3.5 h-3.5 fill-current" />
                <span>बड़ी ख़बर / BREAKING</span>
              </span>
              <span className="bg-black/75 backdrop-blur-sm text-white text-xs font-bold uppercase px-2.5 py-1 rounded">
                {leadStory.category?.name || 'Top Story'}
              </span>
            </div>
          </Link>

          <div className="space-y-2.5">
            <Link href={`/article/${leadStory.slug}`}>
              <h3 className="text-2xl sm:text-3xl font-black font-editorial text-neutral-950 hover:text-aajtak-red transition leading-tight">
                {leadStory.title}
              </h3>
            </Link>

            {/* Aaj Tak Signature Bulleted Standfirst */}
            <div className="bg-neutral-50/90 border-l-4 border-aajtak-red p-3.5 rounded-r-lg space-y-1.5 text-xs sm:text-sm text-neutral-700">
              {summaryBullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-aajtak-red font-black text-sm leading-tight">•</span>
                  <p className="line-clamp-2 leading-relaxed">{bullet}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-neutral-500 pt-1 border-t border-neutral-100">
              <div className="flex items-center gap-2">
                <span className="font-bold text-aajtak-navy uppercase tracking-wider">
                  {leadStory.sourceName}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {leadTimeAgo}
                </span>
              </div>
              <span className="text-neutral-400">{leadReadTime} min read</span>
            </div>
          </div>
        </div>

        {/* 2. Side Stack (5 cols) - 4 Compact Aaj Tak Stories */}
        <div className="lg:col-span-5 divide-y divide-neutral-200">
          <div className="pb-2 mb-2 border-b border-neutral-200 flex items-center justify-between">
            <span className="text-xs font-black text-aajtak-navy uppercase tracking-wider">
              ताज़ा अपडेट्स (Latest Stream)
            </span>
            <span className="text-[11px] text-neutral-400">1-4 of {sideStories.length}</span>
          </div>

          {sideStories.slice(0, 4).map((story, index) => (
            <article key={story.id} className="py-3 first:pt-0 last:pb-0 flex items-start gap-3.5 group">
              <Link
                href={`/article/${story.slug}`}
                className="w-24 sm:w-28 h-20 shrink-0 rounded-md overflow-hidden bg-neutral-100 relative shadow-sm"
              >
                {story.featuredImage ? (
                  <img
                    src={story.featuredImage}
                    alt={story.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-neutral-400">
                    News
                  </div>
                )}
                <span className="absolute bottom-1 left-1 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                  #{index + 1}
                </span>
              </Link>

              <div className="flex-1 min-w-0">
                <span className="text-[10px] font-bold uppercase tracking-wider text-aajtak-navy block mb-0.5">
                  {story.category?.name || 'DESK'}
                </span>
                <Link href={`/article/${story.slug}`}>
                  <h4 className="text-xs sm:text-sm font-bold text-neutral-900 group-hover:text-aajtak-red transition line-clamp-2 leading-snug">
                    {story.title}
                  </h4>
                </Link>
                <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                  <span>{formatTimeAgo(story.publishedAt || story.createdAt)}</span>
                  <span>•</span>
                  <span className="truncate">{story.sourceName}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function formatTimeAgo(dateString: string): string {
  try {
    const diff = Math.floor((Date.now() - new Date(dateString).getTime()) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recent';
  }
}
