import { NextResponse } from 'next/server';

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  const robots = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
Sitemap: ${siteUrl}/news-sitemap.xml
`;
  return new Response(robots, {
    headers: { 'Content-Type': 'text/plain' }
  });
}
