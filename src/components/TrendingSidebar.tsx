import React from 'react';
import Link from 'next/link';
import { TrendingUp, Eye } from 'lucide-react';
import { Article } from '@/lib/types';

export default function TrendingSidebar({ articles }: { articles: Article[] }) {
  if (!articles || articles.length === 0) return null;

  return (
    <aside className="bg-white rounded-lg border border-neutral-200 p-5 shadow-sm">
      <div className="flex items-center gap-2 pb-3 mb-4 border-b-2 border-red-600">
        <TrendingUp className="w-5 h-5 text-red-600" />
        <h3 className="font-editorial text-lg font-bold text-neutral-900 uppercase tracking-wide">
          Trending Now
        </h3>
      </div>

      <div className="space-y-4">
        {articles.map((art, index) => (
          <div key={art.id} className="flex items-start gap-3.5 group">
            <span className="font-black text-2xl sm:text-3xl font-editorial text-neutral-300 group-hover:text-red-600 transition leading-none shrink-0 w-6">
              {index + 1}
            </span>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-red-600 block mb-0.5">
                {art.category?.name || 'Top News'}
              </span>
              <Link href={`/article/${art.slug}`}>
                <h4 className="font-editorial text-sm font-bold text-neutral-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
                  {art.title}
                </h4>
              </Link>
              <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
                <span className="flex items-center gap-1">
                  <Eye className="w-3 h-3" />
                  {(art.viewsCount || 0).toLocaleString()} views
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
