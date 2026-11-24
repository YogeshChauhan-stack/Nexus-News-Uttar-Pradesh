import { NextResponse } from 'next/server';
import { runNewsSync } from '@/lib/pipeline/syncWorker';

function checkAuth(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET_TOKEN;
  if (!cronSecret) return false; // must be set in production
  const authHeader = request.headers.get('authorization');
  return authHeader === `Bearer ${cronSecret}`;
}

export async function GET(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide Bearer token.' }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(request.url);
    const forceDrafts = searchParams.get('moderation') === 'draft';
    const results = await runNewsSync({ forceDrafts });
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  if (!checkAuth(request)) {
    return NextResponse.json({ error: 'Unauthorized. Provide Bearer token.' }, { status: 401 });
  }
  try {
    const body = await request.json().catch(() => ({}));
    const forceDrafts = body.moderation === 'draft';
    const results = await runNewsSync({ forceDrafts });
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      results
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
