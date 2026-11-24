import { NextRequest, NextResponse } from 'next/server';
import { getNearestUPDistrict, UP_DISTRICTS } from '@/lib/districts';

export async function GET(request: NextRequest) {
  try {
    // 1. Check if user already has a saved cookie
    const existingCookie = request.cookies.get('nexus_user_city')?.value;
    if (existingCookie && UP_DISTRICTS.some(d => d.id === existingCookie)) {
      const match = UP_DISTRICTS.find(d => d.id === existingCookie)!;
      return NextResponse.json({ district: match, source: 'cookie' });
    }

    // 2. Extract Client IP address from standard proxy headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    let clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : realIp || '';

    // Check for local development or private networks
    const isLocal =
      !clientIp ||
      clientIp === '127.0.0.1' ||
      clientIp === '::1' ||
      clientIp.startsWith('192.168.') ||
      clientIp.startsWith('10.') ||
      clientIp.startsWith('172.16.');

    let detectedDistrict = UP_DISTRICTS.find(d => d.id === 'ghazipur') || UP_DISTRICTS[0]; // Default: Ghazipur (Purvanchal)

    if (!isLocal) {
      try {
        const ipRes = await fetch(
          `http://ip-api.com/json/${clientIp}?fields=status,city,regionName,lat,lon`,
          {
            signal: AbortSignal.timeout(3500)
          }
        );
        if (ipRes.ok) {
          const ipData = await ipRes.json();
          if (ipData.status === 'success' && ipData.lat && ipData.lon) {
            detectedDistrict = getNearestUPDistrict(ipData.lat, ipData.lon);
          }
        }
      } catch (err) {
        // Fallback to default Lucknow gracefully
      }
    }

    const response = NextResponse.json({
      district: detectedDistrict,
      source: isLocal ? 'default_capital' : 'ip_geolocation'
    });

    // Set 1-year cookie so future requests immediately know user's district
    response.cookies.set({
      name: 'nexus_user_city',
      value: detectedDistrict.id,
      path: '/',
      maxAge: 60 * 60 * 24 * 365, // 1 year
      sameSite: 'lax'
    });

    return response;
  } catch (err: any) {
    return NextResponse.json({
      district: UP_DISTRICTS[0],
      source: 'fallback',
      error: err.message
    });
  }
}
