import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()'
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: blob:; font-src 'self' data:; connect-src 'self' https://api-odonto.marciosager.com http://localhost:3001 https://*.ingest.sentry.io; frame-src https://accounts.google.com; object-src 'none'; base-uri 'self'"
          }
        ]
      }
    ]
  }
}

const config = withNextIntl(nextConfig);

// Sentry wrapping - dynamic import to avoid build failure when @sentry/nextjs is not installed
let finalConfig = config;
try {
  if (process.env.NEXT_PUBLIC_SENTRY_DSN) {
    const { withSentryConfig } = await import('@sentry/nextjs');
    finalConfig = withSentryConfig(config, {
      silent: true,
      disableSourceMapUpload: !process.env.SENTRY_AUTH_TOKEN,
    });
  }
} catch {
  // @sentry/nextjs not installed - skip Sentry wrapping
}

export default finalConfig;
