import './globals.css';

import type { Metadata, Viewport } from 'next';

import { interTight } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { AppHeader } from '@/components/app-header/app-header';
import { AppFooter } from '@/components/app-footer/app-footer';
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
      <RootProviders header={<AppHeader />}>
        <main className='mx-auto max-w-7xl px-2 pt-4'>{children}</main>
      </RootProviders>
      <AppFooter />
    </body>
  </html>
);

export default RootLayout;
