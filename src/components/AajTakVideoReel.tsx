import React from 'react';
import Link from 'next/link';
import { Play, Tv, ArrowRight } from 'lucide-react';
import { Article } from '@/lib/types';

export default function AajTakVideoReel({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  // Use up to 4 articles for the video reel
  const videoStories = articles.slice(0, 4);

  return (
    <section className="bg-aajtak-dark text-white rounded-xl p-5 sm:p-7 shadow-lg my-10 border border-neutral-800">
      <div className="flex items-center justify-between mb-6 border-b border-neutral-700/80 pb-3">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-6 bg-aajtak-red inline-block rounded-sm" />
          <h3 className="text-lg sm:text-xl font-black tracking-wide flex items-center gap-2">
            <Tv className="w-5 h-5 text-aajtak-red" />
            <span>आज तक वीडियो (Live Newsroom & Video Hub)</span>
          </h3>
        </div>
        <Link
          href="/category/technology"
          className="inline-flex items-center gap-1 text-xs font-bold text-aajtak-red hover:text-white uppercase transition tracking-wider"
        >
          <span>सभी वीडियो देखें</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {videoStories.map((item, index) => (
          <article key={item.id} className="group cursor-pointer space-y-2.5">
            <Link
              href={`/article/${item.slug}`}
              className="block relative aspect-[16/9] rounded-lg overflow-hidden bg-neutral-900 shadow-md"
            >
              {item.featuredImage ? (
                <img
                  src={item.featuredImage}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300 opacity-90 group-hover:opacity-100"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-neutral-800 text-neutral-500 text-xs">
                  Video Stream
                </div>
              )}

              {/* Centered Red Play Button */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/15 flex items-center justify-center transition">
                <div className="w-11 h-11 rounded-full bg-aajtak-red flex items-center justify-center text-white shadow-xl group-hover:scale-110 transition duration-300">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Duration Tag */}
              <span className="absolute bottom-2 right-2 bg-black/85 text-[10px] font-mono font-bold px-2 py-0.5 rounded text-neutral-200">
                0{index + 2}:45
              </span>

              {/* Category Pill */}
              <span className="absolute top-2 left-2 bg-aajtak-red text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded">
                {item.category?.name || 'Exclusive'}
              </span>
            </Link>

            <Link href={`/article/${item.slug}`}>
              <h4 className="text-xs sm:text-sm font-bold text-neutral-100 group-hover:text-aajtak-red transition line-clamp-2 leading-snug">
                {item.title}
              </h4>
            </Link>

            <div className="flex items-center gap-2 text-[11px] text-neutral-400">
              <span>{item.sourceName}</span>
              <span>•</span>
              <span>{(item.viewsCount || 0).toLocaleString()} views</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
