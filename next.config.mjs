/** @type {import('next').NextConfig} */
const isAndroidOrTermux = process.platform === 'android' || Boolean(process.env.TERMUX_VERSION);

const nextConfig = {
  reactStrictMode: true,
  // Only use wasm binary on Android/Termux environments where native SWC is unavailable
  ...(isAndroidOrTermux ? {
    experimental: {
      useWasmBinary: true
    }
  } : {}),
  // Security headers for production
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(self)' },
        ],
      },
    ];
  },
  images: {
    // Tighten these in production to specific CDN hostnames
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: '**' }
    ]
  }
};

export default nextConfig;
