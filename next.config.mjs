import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const isDev = process.env.NODE_ENV === 'development';

    // Build CSP dynamically based on environment
    const connectSrcUrls = [
      "'self'",
      'https://api-odonto.marciosager.com',
      'wss://api-odonto.marciosager.com',
      'https://*.ingest.sentry.io',
      'https://accounts.google.com'
    ];

    // Only allow localhost in development
    if (isDev) {
      connectSrcUrls.push('http://localhost:3001');
      connectSrcUrls.push('ws://localhost:3001');
    }

    // CSP for scripts - allow unsafe-inline for both dev and prod since Next.js
    // injects inline scripts and Google OAuth requires inline scripts to work
    const scriptSrc = isDev
      ? "'self' 'unsafe-inline' 'unsafe-eval' https://accounts.google.com https://www.gstatic.com"
      : "'self' 'unsafe-inline' https://accounts.google.com https://www.gstatic.com";

    const styleSrc = "'self' 'unsafe-inline' https://accounts.google.com"; // Tailwind + Google requires unsafe-inline

    const csp = `
      default-src 'self';
      script-src ${scriptSrc};
      style-src ${styleSrc};
      img-src 'self' data: https: blob:;
      font-src 'self' data:;
      connect-src ${connectSrcUrls.join(' ')};
      frame-src https://accounts.google.com;
      object-src 'none';
      base-uri 'self';
      form-action 'self';
      frame-ancestors 'none';
    `.replace(/\s+/g, ' ').trim();

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
            value: csp
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
