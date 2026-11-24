import React from 'react';
import Link from 'next/link';
import { Clock, ExternalLink } from 'lucide-react';
import { Article } from '@/lib/types';
import { calculateReadTime } from '@/lib/seo';
import { formatAmarUjalaHeadline } from '@/lib/districts';

interface ArticleCardProps {
  article: Article;
  variant?: 'grid' | 'compact' | 'minimal';
}

export default function ArticleCard({ article, variant = 'grid' }: ArticleCardProps) {
  const readTime = calculateReadTime(article.content || article.summary);
  const timeAgo = formatTimeAgo(article.publishedAt || article.createdAt);
  const { prefix, mainTitle } = formatAmarUjalaHeadline(article.title);

  if (variant === 'minimal') {
    return (
      <article className="border-b border-neutral-100 pb-3 group">
        <div className="flex items-center gap-2 text-[11px] text-neutral-500 mb-1">
          <span className="font-semibold text-red-600 uppercase">
            {article.category?.name || 'General'}
          </span>
          <span>•</span>
          <span>{timeAgo}</span>
        </div>
        <Link href={`/article/${article.slug}`}>
          <h4 className="font-editorial text-sm font-bold text-neutral-900 group-hover:text-red-600 transition leading-snug">
            <span className="text-red-600 font-black mr-1">{prefix}</span>
            <span>{mainTitle}</span>
          </h4>
        </Link>
      </article>
    );
  }

  if (variant === 'compact') {
    return (
      <article className="flex gap-4 group items-start border-b border-neutral-100 pb-4">
        {article.featuredImage && (
          <Link
            href={`/article/${article.slug}`}
            className="w-24 sm:w-28 h-20 sm:h-24 shrink-0 rounded overflow-hidden bg-neutral-100 relative"
          >
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
            />
          </Link>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-neutral-500 mb-1">
            <span className="font-semibold text-red-600 uppercase">
              {article.category?.name || 'News'}
            </span>
            <span>•</span>
            <span>{timeAgo}</span>
          </div>
          <Link href={`/article/${article.slug}`}>
            <h4 className="font-editorial text-sm sm:text-base font-bold text-neutral-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
              <span className="text-red-600 font-black mr-1">{prefix}</span>
              <span>{mainTitle}</span>
            </h4>
          </Link>
          <div className="mt-1 flex items-center gap-2 text-[11px] text-neutral-400">
            <span>By {article.sourceName}</span>
            {article.sourceType === 'API' && <ExternalLink className="w-2.5 h-2.5" />}
          </div>
        </div>
      </article>
    );
  }

  // Grid layout (default)
  return (
    <article className="group flex flex-col justify-between bg-white rounded-lg border border-neutral-200/80 overflow-hidden hover:shadow-md transition">
      <div>
        <Link href={`/article/${article.slug}`} className="block aspect-[16/10] overflow-hidden bg-neutral-100 relative">
          {article.featuredImage ? (
            <img
              src={article.featuredImage}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-200 text-xs text-neutral-400">
              No photo
            </div>
          )}
          <span className="absolute bottom-2 left-2 bg-neutral-900/80 backdrop-blur-sm text-white text-[11px] font-semibold uppercase px-2 py-0.5 rounded">
            {article.category?.name || 'Top News'}
          </span>
        </Link>

        <div className="p-4 space-y-2">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <span className="text-red-600 font-bold uppercase tracking-wider text-[11px]">
              {article.sourceType === 'API' ? article.sourceName : 'Staff Exclusive'}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {timeAgo}
            </span>
          </div>

          <Link href={`/article/${article.slug}`}>
            <h3 className="font-editorial font-bold text-lg text-neutral-900 group-hover:text-red-600 transition line-clamp-2 leading-snug">
              <span className="text-red-600 font-black mr-1.5">{prefix}</span>
              <span>{mainTitle}</span>
            </h3>
          </Link>

          <p className="text-xs text-neutral-600 line-clamp-2 leading-relaxed">
            {article.summary}
          </p>
        </div>
      </div>

      <div className="px-4 pb-4 pt-2 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400">
        <span>{readTime}</span>
        {article.sourceType === 'API' && (
          <span className="flex items-center gap-1 text-[11px] hover:text-neutral-700">
            <span>Wire</span>
            <ExternalLink className="w-3 h-3" />
          </span>
        )}
      </div>
    </article>
  );
}

function formatTimeAgo(dateString: string): string {
  try {
    const diff = (Date.now() - new Date(dateString).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  } catch {
    return 'Recently';
  }
}
