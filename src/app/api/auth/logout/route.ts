import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE_NAME } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const response = NextResponse.json({ success: true });
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}

export async function GET(request: NextRequest) {
  const url = new URL('/login', request.url);
  const response = NextResponse.redirect(url);
  response.cookies.delete(ADMIN_COOKIE_NAME);
  return response;
}
