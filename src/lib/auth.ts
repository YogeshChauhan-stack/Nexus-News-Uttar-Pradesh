const SESSION_SECRET = process.env.ADMIN_SESSION_SECRET || process.env.CRON_SECRET_TOKEN || 'nexus-auth-session-key-2026';
export const ADMIN_COOKIE_NAME = 'nexus_admin_session';

async function getHmacHex(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signatureBuffer = await crypto.subtle.sign('HMAC', key, encoder.encode(data));
  return Array.from(new Uint8Array(signatureBuffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

export async function createAdminSessionToken(userIdentifier: string): Promise<string> {
  const timestamp = Date.now().toString();
  const payload = `${userIdentifier}:${timestamp}`;
  const hmacHex = await getHmacHex(payload, SESSION_SECRET);
  // Base64 encode for cookie safety
  const rawString = `${payload}:${hmacHex}`;
  if (typeof btoa === 'function') {
    return btoa(rawString);
  }
  return Buffer.from(rawString).toString('base64');
}

export async function verifyAdminSessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  try {
    let decoded = '';
    if (typeof atob === 'function') {
      decoded = atob(token);
    } else {
      decoded = Buffer.from(token, 'base64').toString('utf-8');
    }

    const parts = decoded.split(':');
    if (parts.length < 3) return false;

    const userIdentifier = parts[0];
    const timestampStr = parts[1];
    const signature = parts.slice(2).join(':');

    if (!userIdentifier) return false;

    const timestamp = parseInt(timestampStr, 10);
    // 7 days expiration
    const maxAgeMs = 7 * 24 * 60 * 60 * 1000;
    if (isNaN(timestamp) || Date.now() - timestamp > maxAgeMs) {
      return false;
    }

    const payload = `${userIdentifier}:${timestampStr}`;
    const expectedHmac = await getHmacHex(payload, SESSION_SECRET);

    return signature === expectedHmac;
  } catch {
    return false;
  }
}
