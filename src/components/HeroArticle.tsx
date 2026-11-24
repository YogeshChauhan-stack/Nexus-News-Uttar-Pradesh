import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink, Flame } from 'lucide-react';
import { Article } from '@/lib/types';
import { calculateReadTime } from '@/lib/seo';

export default function HeroArticle({ article }: { article: Article }) {
  const readTime = calculateReadTime(article.content || article.summary);
  const timeAgo = formatTimeAgo(article.publishedAt || article.createdAt);

  return (
    <article className="group relative border-b border-neutral-200 pb-8 lg:border-b-0 lg:pb-0">
      <Link href={`/article/${article.slug}`} className="block overflow-hidden rounded-lg mb-4 bg-neutral-100 aspect-[16/9] relative">
        {article.featuredImage ? (
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-neutral-400">
            No image available
          </div>
        )}

        <div className="absolute top-3 left-3 flex items-center gap-2">
          {article.isBreaking && (
            <span className="bg-red-600 text-white text-xs font-black uppercase px-2.5 py-1 rounded shadow-md flex items-center gap-1 animate-pulse">
              <Flame className="w-3.5 h-3.5" /> Breaking
            </span>
          )}
          <span className="bg-black/80 backdrop-blur-sm text-white text-xs font-semibold uppercase px-2.5 py-1 rounded">
            {article.category?.name || 'Top Story'}
          </span>
        </div>
      </Link>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-neutral-500 font-medium">
          <span className="text-red-600 font-bold uppercase tracking-wider">
            {article.sourceType === 'API' ? `Wire: ${article.sourceName}` : 'Exclusive'}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timeAgo}
          </span>
          <span>•</span>
          <span>{readTime} min read</span>
        </div>

        <Link href={`/article/${article.slug}`}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-editorial text-neutral-900 group-hover:text-red-600 transition leading-tight">
            {article.title}
          </h2>
        </Link>

        <p className="text-neutral-600 text-sm sm:text-base leading-relaxed line-clamp-3">
          {article.summary}
        </p>

        <div className="pt-2 flex items-center justify-between text-xs text-neutral-500 border-t border-neutral-100">
          <span className="font-medium text-neutral-800">
            By {article.author?.name || article.sourceName}
          </span>
          {article.sourceType === 'API' && article.externalUrl && (
            <span className="flex items-center gap-1 text-neutral-400">
              Syndicated Story <ExternalLink className="w-3 h-3" />
            </span>
          )}
        </div>
      </div>
    </article>
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
