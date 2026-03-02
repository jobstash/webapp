import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';

import packageJson from './package.json';

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse'],
  productionBrowserSourceMaps: !!process.env.SENTRY_AUTH_TOKEN,
  env: {
    NEXT_PUBLIC_APP_VERSION: packageJson.version,
  },
  reactCompiler: true,
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks?.cacheGroups,
          ui: {
            test: /[\\/]src[\\/]components[\\/]ui[\\/]/,
            name: 'ui-components',
            chunks: 'all',
            priority: 40,
            enforce: true,
          },
        },
      };
    }
    return config;
  },
  images: {
    qualities: [25, 50, 75, 100],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.google.com',
      },
    ],
  },
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 1,
    staticGenerationMinPagesPerWorker: 13000,
  },
  redirects: async () => [
    {
      source: '/jobs',
      destination: '/',
      permanent: true,
    },
  ],
};

const analyze = withBundleAnalyzer({
  enabled: process.env.ANALYZE_BUNDLE === 'true',
});

export default analyze(nextConfig);
