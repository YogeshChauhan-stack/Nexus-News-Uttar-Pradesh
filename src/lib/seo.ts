import { Article } from './types';

export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const text = content.replace(/<[^>]*>?/gm, '');
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

export function generateNewsArticleJsonLd(article: Article, siteUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.summary,
    'image': [article.featuredImage || `${siteUrl}/images/default-news.jpg`],
    'datePublished': article.publishedAt,
    'dateModified': article.updatedAt || article.publishedAt,
    'author': [
      {
        '@type': 'Person',
        'name': article.author?.name || article.sourceName || 'Nexus Staff',
        'url': siteUrl
      }
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'Nexus News',
      'logo': {
        '@type': 'ImageObject',
        'url': `${siteUrl}/logo.png`
      }
    },
    'mainEntityOfPage': {
      '@type': 'WebPage',
      '@id': `${siteUrl}/article/${article.slug}`
    }
  };
}
