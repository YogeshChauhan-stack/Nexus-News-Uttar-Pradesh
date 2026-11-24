import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, Share2, ExternalLink, Calendar, ShieldCheck, Tag, ArrowLeft } from 'lucide-react';
import { db } from '@/lib/db';
import { calculateReadTime, generateNewsArticleJsonLd } from '@/lib/seo';
import { sanitizeHtml } from '@/lib/sanitize';
import ArticleCard from '@/components/ArticleCard';
import ArticleShareBar from '@/components/ArticleShareBar';

interface ArticlePageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await db.getArticleBySlug(params.slug);
  if (!article) return { title: 'Article Not Found' };

  return {
    title: article.title,
    description: article.summary,
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      images: article.featuredImage ? [{ url: article.featuredImage }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.summary,
      images: article.featuredImage ? [article.featuredImage] : [],
    }
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await db.getArticleBySlug(params.slug);
  if (!article) {
    notFound();
  }

  // Increment views in background
  db.incrementViews(article.slug).catch(() => {});

  const readTime = calculateReadTime(article.content || article.summary);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const articleUrl = `${siteUrl}/article/${article.slug}`;
  const jsonLd = generateNewsArticleJsonLd(article, siteUrl);

  // Fetch related articles in category
  const { articles: related } = await db.getArticles({
    categorySlug: article.category?.slug,
    limit: 4
  });
  const filteredRelated = related.filter(a => a.id !== article.id).slice(0, 3);

  const formattedDate = new Date(article.publishedAt || article.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <>
      {/* Inject NewsArticle Schema for Google Search Top Stories */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <article className="max-w-4xl mx-auto py-4">
        {/* Breadcrumb & Navigation */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-6">
          <Link href="/" className="inline-flex items-center gap-1 hover:text-red-600 transition font-medium">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Headlines
          </Link>
          {article.category && (
            <Link
              href={`/category/${article.category.slug}`}
              className="bg-neutral-100 hover:bg-neutral-200 text-neutral-800 px-2.5 py-1 rounded font-bold uppercase tracking-wider transition"
            >
              {article.category.name}
            </Link>
          )}
        </div>

        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black font-editorial text-neutral-950 leading-tight mb-4">
          {article.title}
        </h1>

        {/* Lead Summary */}
        <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed mb-6 font-medium border-l-2 border-red-600 pl-4">
          {article.summary}
        </p>

        {/* Metadata Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-neutral-200 text-xs text-neutral-600 mb-8">
          <div className="flex items-center gap-3">
            {article.author?.avatarUrl ? (
              <img
                src={article.author.avatarUrl}
                alt={article.author.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-red-100 text-red-700 font-bold flex items-center justify-center">
                {(article.author?.name || article.sourceName)[0]}
              </div>
            )}
            <div>
              <div className="font-bold text-neutral-900 text-sm">
                By {article.author?.name || article.sourceName}
              </div>
              <div className="text-neutral-500 flex items-center gap-2">
                <span>{article.sourceType === 'API' ? `Syndicated via ${article.sourceName}` : 'Staff Reporter'}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {readTime} min read
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-neutral-500">
            <Calendar className="w-4 h-4" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Share Bar — WhatsApp, Telegram, X, Copy */}
        <ArticleShareBar title={article.title} url={articleUrl} />

        {/* Featured Image */}
        {article.featuredImage && (
          <figure className="mb-8">
            <div className="overflow-hidden rounded-lg bg-neutral-100 aspect-[16/9] sm:aspect-[21/9]">
              <img
                src={article.featuredImage}
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
            <figcaption className="text-xs text-neutral-400 mt-2 text-right">
              Photo credit: {article.sourceName} / Nexus Image Library
            </figcaption>
          </figure>
        )}

        {/* API Sourced Story: Legal Compliance Banner */}
        {article.sourceType === 'API' && article.externalUrl && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
              <div className="space-y-2 flex-1">
                <h4 className="font-bold text-amber-900 text-sm">
                  Syndicated Wire Story — Legal Fair-Use Attribution
                </h4>
                <p className="text-xs text-amber-800 leading-relaxed">
                  This report has been aggregated from <strong>{article.sourceName}</strong> under news fair-use provisions. To read the complete investigative reporting and multimedia from the original publisher, please visit their direct coverage.
                </p>
                <div>
                  <a
                    href={article.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold uppercase px-3.5 py-1.5 rounded transition shadow-sm"
                  >
                    <span>Read Full Story at {article.sourceName}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Amar Ujala Style Key Highlights (Pointers) */}
        {article.pointers && article.pointers.length > 0 && (
          <div className="mb-8 p-4 sm:p-5 bg-red-50/60 rounded-xl border border-red-200/80">
            <h3 className="text-sm font-black font-hindi text-red-900 mb-2.5 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 bg-red-600 rounded-full inline-block"></span>
              <span>खास बातें (Key Highlights):</span>
            </h3>
            <ul className="space-y-2">
              {article.pointers.map((pointer, idx) => (
                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-800 font-hindi">
                  <span className="text-red-600 font-black">•</span>
                  <span className="leading-relaxed">{pointer}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Main Body Content — sanitized to prevent XSS */}
        <div
          className="article-content font-serif leading-relaxed text-neutral-800 mb-10"
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(article.content) }}
        />

        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-neutral-200 mb-8">
            <span className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
              <Tag className="w-3 h-3" /> Filed Under:
            </span>
            {article.tags.map(tag => (
              <span
                key={tag}
                className="text-xs bg-neutral-100 hover:bg-neutral-200 text-neutral-700 px-2.5 py-1 rounded transition"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Related Coverage */}
        {filteredRelated.length > 0 && (
          <section className="mt-12 pt-8 border-t-2 border-neutral-900">
            <h3 className="font-editorial text-xl font-bold text-neutral-900 uppercase tracking-wide mb-6">
              Related Coverage & Investigations
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {filteredRelated.map(rel => (
                <ArticleCard key={rel.id} article={rel} variant="grid" />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
