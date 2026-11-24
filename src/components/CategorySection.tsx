import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Category, Article } from '@/lib/types';
import ArticleCard from './ArticleCard';

interface CategorySectionProps {
  category: Category;
  articles: Article[];
}

export default function CategorySection({ category, articles }: CategorySectionProps) {
  if (!articles || articles.length === 0) return null;

  const [lead, ...others] = articles;

  return (
    <section className="my-10 pt-6 border-t-2 border-neutral-900">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-black font-editorial text-neutral-900 tracking-tight">
            {category.name}
          </h2>
          {category.description && (
            <p className="text-xs text-neutral-500 mt-0.5">{category.description}</p>
          )}
        </div>
        <Link
          href={`/category/${category.slug}`}
          className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 uppercase tracking-wider transition"
        >
          <span>More in {category.name}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Lead card in category */}
        <div className="md:col-span-6 lg:col-span-5">
          <ArticleCard article={lead} variant="grid" />
        </div>

        {/* Secondary items in category */}
        <div className="md:col-span-6 lg:col-span-7 flex flex-col justify-between divide-y divide-neutral-100">
          {others.slice(0, 3).map(art => (
            <div key={art.id} className="py-2.5 first:pt-0 last:pb-0">
              <ArticleCard article={art} variant="compact" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
