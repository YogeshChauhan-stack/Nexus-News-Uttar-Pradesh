import React from 'react';
import { db } from '@/lib/db';
import ArticleCard from '@/components/ArticleCard';
import { Search } from 'lucide-react';

interface SearchPageProps {
  searchParams: { q?: string };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const query = searchParams.q || '';
  const { articles } = query
    ? await db.getArticles({ search: query, limit: 30 })
    : { articles: [] };

  return (
    <div className="space-y-6 max-w-5xl mx-auto py-4">
      <div className="border-b-2 border-neutral-900 pb-4">
        <h1 className="text-3xl font-black font-editorial text-neutral-950 flex items-center gap-3">
          <Search className="w-8 h-8 text-red-600" />
          <span>Search Archive</span>
        </h1>
        {query ? (
          <p className="text-sm text-neutral-600 mt-2">
            Found <strong>{articles.length}</strong> results matching &ldquo;{query}&rdquo;
          </p>
        ) : (
          <p className="text-sm text-neutral-600 mt-2">
            Enter keywords in the top search bar to query headlines, investigations, and wires.
          </p>
        )}
      </div>

      {articles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map(article => (
            <ArticleCard key={article.id} article={article} variant="grid" />
          ))}
        </div>
      ) : query ? (
        <div className="bg-white rounded-lg border border-neutral-200 p-12 text-center text-neutral-500">
          No stories matched your search query. Try broader keywords or browse by section.
        </div>
      ) : null}
    </div>
  );
}
