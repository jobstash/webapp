import './globals.css';

import type { Metadata, Viewport } from 'next';

import { nunitoSans } from '@/lib/fonts';
import Head from 'next/head';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

type Props = Readonly<React.PropsWithChildren>;

export default function RootLayout({ children }: Props) {
  return (
    <html lang='en'>
      <Head>
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <body className={cn('antialiased', nunitoSans.className)}>{children}</body>
    </html>
  );
}
