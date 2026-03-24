import type { NextConfig } from 'next';
import withPWA from 'next-pwa';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'aspiw.com' }],
        destination: 'https://travelphrase.aspiw.com/:path*',
        permanent: true,
      },
      {
        source: '/:path*',
        has: [{ type: 'host', value: 'www.aspiw.com' }],
        destination: 'https://travelphrase.aspiw.com/:path*',
        permanent: true,
      },
    ];
  },
};

export default withPWA({
  dest:           'public',
  register:       true,
  skipWaiting:    true,
  disable:        process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: { maxEntries: 10, maxAgeSeconds: 365 * 24 * 60 * 60 },
      },
    },
  ],
})(nextConfig);
