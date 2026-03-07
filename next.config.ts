import type { NextConfig } from 'next';
import withBundleAnalyzer from '@next/bundle-analyzer';
import { withSentryConfig } from '@sentry/nextjs';
import { z } from 'zod';

import packageJson from './package.json';

// Validate public env vars at build/dev start (never ships to client bundle)
z.object({
  NEXT_PUBLIC_FRONTEND_URL: z.url(),
  NEXT_PUBLIC_MW_URL: z.url(),
  NEXT_PUBLIC_PRIVY_APP_ID: z.string().min(1),
}).parse({
  NEXT_PUBLIC_FRONTEND_URL: process.env.NEXT_PUBLIC_FRONTEND_URL,
  NEXT_PUBLIC_MW_URL: process.env.NEXT_PUBLIC_MW_URL,
  NEXT_PUBLIC_PRIVY_APP_ID: process.env.NEXT_PUBLIC_PRIVY_APP_ID,
});

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['pdf-parse'],
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
          privy: {
            test: /[\\/]node_modules[\\/](@privy-io|@walletconnect|@coinbase[\\/]wallet-sdk|viem|ox|abitype|@headlessui|styled-components|@noble|multiformats|uint8arrays|@msgpack|blakejs)[\\/]/,
            name: 'privy-sdk',
            chunks: 'all',
            priority: 50,
            enforce: true,
          },
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

export default withSentryConfig(analyze(nextConfig), {
  org: 'jobstash',
  project: 'webapp',
  silent: !process.env.CI,
  authToken: process.env.SENTRY_AUTH_TOKEN,
  bundleSizeOptimizations: {
    excludeDebugStatements: true,
    excludeTracing: true,
    excludeReplayIframe: true,
    excludeReplayShadowDom: true,
    excludeReplayWorker: true,
  },
  sourcemaps: {
    deleteSourcemapsAfterUpload: true,
  },
  widenClientFileUpload: true,
});
