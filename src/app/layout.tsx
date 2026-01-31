import './globals.css';

import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';

import { interTight } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { RootProviders } from '@/components/providers/root-providers';
import { clientEnv } from '@/lib/env/client';

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.FRONTEND_URL),
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
  },
  openGraph: {
    siteName: 'JobStash',
    type: 'website',
    images: ['/jobstash-logo.png'],
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: clientEnv.ALLOW_INDEXING
    ? { index: true, follow: true }
    : { index: false, follow: false },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

type Props = Readonly<React.PropsWithChildren>;

const RootLayout = ({ children }: Props) => (
  <html lang='en' className={cn('dark', interTight.className)}>
    <body className='antialiased'>
      <RootProviders>{children}</RootProviders>
    </body>
    {clientEnv.GA_MEASUREMENT_ID && (
      <GoogleAnalytics gaId={clientEnv.GA_MEASUREMENT_ID} />
    )}
  </html>
);

export default RootLayout;
