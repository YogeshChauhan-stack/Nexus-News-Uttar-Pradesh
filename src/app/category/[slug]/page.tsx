import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { db } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import TrendingSidebar from '@/components/TrendingSidebar';

interface CategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const category = await db.getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category Not Found' };

  return {
    title: `${category.name} Headlines & Reports`,
    description: category.description || `Latest news and updates in ${category.name}`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const category = await db.getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const { articles } = await db.getArticles({
    categorySlug: params.slug,
    limit: 20
  });
  const trending = await db.getTrendingArticles(5);

  return (
    <div className="space-y-8">
      {/* Category Header */}
      <div className="border-b-2 border-neutral-900 pb-4">
        <span className="text-xs font-bold text-red-600 uppercase tracking-widest">
          Section Desk
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-editorial text-neutral-950 mt-1">
          {category.name}
        </h1>
        {category.description && (
          <p className="text-neutral-600 text-sm mt-2 max-w-3xl">
            {category.description}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Main Category Feed */}
        <div className="lg:col-span-8">
          {articles.length === 0 ? (
            <div className="bg-white rounded-lg border border-neutral-200 p-8 text-center text-neutral-500">
              No published articles in this section yet.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {articles.map(article => (
                <ArticleCard key={article.id} article={article} variant="grid" />
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4">
          <TrendingSidebar articles={trending} />
        </div>
      </div>
    </div>
  );
}
