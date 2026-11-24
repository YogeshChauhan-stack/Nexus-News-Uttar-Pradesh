import { db } from '../db';
import { POPULAR_NEWS_FEEDS, fetchRSSFeed, RawNewsItem } from './rssFetcher';
import { fetchNewsAPIOrg, fetchGNews } from './newsApiFetcher';
import { generateSlug } from './deduplicator';
import { SyncResult } from '../types';

export async function runNewsSync(options?: { forceDrafts?: boolean }): Promise<SyncResult[]> {
  const categories = await db.getCategories();
  const catMap = new Map<string, string>();
  categories.forEach(c => catMap.set(c.slug, c.id));

  const results: SyncResult[] = [];

  // 1. Process RSS Feeds
  for (const feed of POPULAR_NEWS_FEEDS) {
    const report: SyncResult = {
      source: feed.name,
      totalFetched: 0,
      saved: 0,
      skipped: 0,
      errors: []
    };

    try {
      const items = await fetchRSSFeed(feed);
      report.totalFetched = items.length;

      for (const item of items) {
        // Deduplication Check
        const isDupe = await db.isDuplicate(item.link, item.title);
        if (isDupe) {
          report.skipped++;
          continue;
        }

        const categoryId = catMap.get(item.categorySlug) || categories[0]?.id || 'cat-1';
        const slug = generateSlug(item.title);

        await db.createArticle({
          title: item.title,
          slug,
          summary: item.summary,
          content: item.content,
          featuredImage: item.imageUrl,
          sourceType: 'API',
          sourceName: item.sourceName,
          externalUrl: item.link,
          status: options?.forceDrafts ? 'DRAFT' : feed.defaultStatus,
          isBreaking: false,
          categoryId,
          district: item.district,
          pointers: item.pointers,
          publishedAt: item.publishedAt,
          tags: [feed.name, item.categorySlug.toUpperCase(), item.district ? item.district.toUpperCase() : 'UP']
        });

        report.saved++;
      }
    } catch (err: any) {
      report.errors.push(err.message || String(err));
    }

    results.push(report);
  }

  // 2. Process NewsAPI.org (if API key configured)
  if (process.env.NEWS_API_ORG_KEY) {
    const apiReport: SyncResult = {
      source: 'NewsAPI.org',
      totalFetched: 0,
      saved: 0,
      skipped: 0,
      errors: []
    };
    try {
      const apiItems = await fetchNewsAPIOrg('general');
      apiReport.totalFetched = apiItems.length;
      for (const item of apiItems) {
        const isDupe = await db.isDuplicate(item.link, item.title);
        if (isDupe) {
          apiReport.skipped++;
          continue;
        }
        const categoryId = catMap.get(item.categorySlug) || categories[0]?.id || 'cat-1';
        const slug = generateSlug(item.title);
        await db.createArticle({
          title: item.title,
          slug,
          summary: item.summary,
          content: item.content,
          featuredImage: item.imageUrl,
          sourceType: 'API',
          sourceName: item.sourceName,
          externalUrl: item.link,
          status: options?.forceDrafts ? 'DRAFT' : 'PUBLISHED',
          isBreaking: false,
          categoryId,
          publishedAt: item.publishedAt,
          tags: ['NewsAPI', item.categorySlug.toUpperCase()]
        });
        apiReport.saved++;
      }
    } catch (err: any) {
      apiReport.errors.push(err.message || String(err));
    }
    results.push(apiReport);
  }

  return results;
}
