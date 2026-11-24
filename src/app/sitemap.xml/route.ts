import { db } from '@/lib/db';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const { articles } = await db.getArticles({ limit: 1000 });
  const categories = await db.getCategories();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}</loc>
    <changefreq>always</changefreq>
    <priority>1.0</priority>
  </url>
  ${categories.map(c => `
  <url>
    <loc>${siteUrl}/category/${c.slug}</loc>
    <changefreq>hourly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
  ${articles.map(a => `
  <url>
    <loc>${siteUrl}/article/${a.slug}</loc>
    <lastmod>${new Date(a.updatedAt || a.publishedAt || a.createdAt).toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
    }
  });
}
