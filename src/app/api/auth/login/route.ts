import { NextRequest, NextResponse } from 'next/server';
import { createAdminSessionToken, ADMIN_COOKIE_NAME } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    const trimmedInput = (username || '').trim();
    let authenticatedUser: string | null = null;

    // 1. Try Supabase Auth first if input looks like an email and Supabase is configured
    if (supabase && trimmedInput.includes('@')) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: trimmedInput,
          password: password,
        });

        if (!error && data?.user) {
          const userMetaRole = data.user.user_metadata?.role;
          const appMetaRole = data.user.app_metadata?.role;

          // If role is defined, ensure it is 'admin' or 'editor'
          if (!userMetaRole && !appMetaRole) {
            // Default: Any user created in this project's Auth console has access
            authenticatedUser = data.user.email || trimmedInput;
          } else if (userMetaRole === 'admin' || appMetaRole === 'admin' || userMetaRole === 'editor') {
            authenticatedUser = data.user.email || trimmedInput;
          } else {
            return NextResponse.json(
              { error: 'Unauthorized: Admin role required' },
              { status: 403 }
            );
          }
        }
      } catch (sbErr) {
        console.warn('Supabase auth attempt failed, checking local credentials', sbErr);
      }
    }

    // 2. Fallback to local admin environment credentials
    const validUsername = process.env.ADMIN_USERNAME || 'admin';
    const validPassword = process.env.ADMIN_PASSWORD || 'nexus-admin-2026';

    if (!authenticatedUser) {
      if (trimmedInput === validUsername && password === validPassword) {
        authenticatedUser = validUsername;
      }
    }

    if (!authenticatedUser) {
      return NextResponse.json(
        { error: 'Invalid username, email, or password' },
        { status: 401 }
      );
    }

    const token = await createAdminSessionToken(authenticatedUser);
    const response = NextResponse.json({
      success: true,
      user: authenticatedUser,
    });

    // Set HTTP-only secure cookie for admin session (7 days)
    response.cookies.set({
      name: ADMIN_COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !request.url.startsWith('http://localhost'),
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err: any) {
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
