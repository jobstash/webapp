import './globals.css';

import type { Metadata, Viewport } from 'next';
import Script from 'next/script';

import { interTight } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { RootProviders } from '@/components/providers/root-providers';
import { clientEnv } from '@/lib/env/client';

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.FRONTEND_URL),
  title: {
    default: 'JobStash — Crypto Native Jobs',
    template: '%s | JobStash',
  },
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
    {/* afterInteractive (not lazyOnload): job pages are SEO landing pages
        and early Apply clicks must not be lost while GA idles */}
    {clientEnv.GA_MEASUREMENT_ID && (
      <>
        <Script
          id='_next-ga-init'
          strategy='afterInteractive'
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer=window.dataLayer||[];
              window.gtag=window.gtag||function(){dataLayer.push(arguments);};
              gtag('js',new Date());
              gtag('config','${clientEnv.GA_MEASUREMENT_ID}');
            `,
          }}
        />
        <Script
          id='_next-ga'
          src={`https://www.googletagmanager.com/gtag/js?id=${clientEnv.GA_MEASUREMENT_ID}`}
          strategy='afterInteractive'
        />
      </>
    )}
  </html>
);

export default RootLayout;
