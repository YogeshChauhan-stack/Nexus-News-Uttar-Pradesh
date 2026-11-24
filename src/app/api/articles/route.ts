import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { generateSlug } from '@/lib/pipeline/deduplicator';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || undefined;
    const district = searchParams.get('district') || undefined;
    const priorityDistrict = searchParams.get('priorityDistrict') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;
    const isBreaking = searchParams.get('isBreaking') ? searchParams.get('isBreaking') === 'true' : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;
    const offset = searchParams.get('offset') ? parseInt(searchParams.get('offset')!) : undefined;

    const data = await db.getArticles({
      categorySlug: category,
      district,
      priorityDistrict,
      status,
      search,
      isBreaking,
      limit,
      offset
    });

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      title,
      summary,
      content,
      categoryId,
      featuredImage,
      isBreaking,
      isFeatured,
      status,
      tags,
      district,
      pointers,
      sourceName
    } = body;

    if (!title || !content || !categoryId) {
      return NextResponse.json({ error: 'Title, content, and category are required' }, { status: 400 });
    }

    const slug = generateSlug(title);
    const newArticle = await db.createArticle({
      title,
      slug,
      summary: summary || title.slice(0, 160),
      content,
      featuredImage: featuredImage || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&auto=format&fit=crop&q=80',
      sourceType: 'MANUAL',
      sourceName: sourceName || 'Nexus Editorial',
      status: status || 'PUBLISHED',
      isBreaking: !!isBreaking,
      isFeatured: !!isFeatured,
      district: district || undefined,
      pointers: pointers || undefined,
      authorId: 'user-admin',
      categoryId,
      publishedAt: status === 'PUBLISHED' ? new Date().toISOString() : '',
      tags: tags || ['Editorial']
    });

    return NextResponse.json(newArticle, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
