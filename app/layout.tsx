import './globals.css';

import type { Metadata, Viewport } from 'next';
import Head from 'next/head';

import { grotesk, interTight } from '@/lib/shared/core/fonts';

import { RootProviders } from '@/lib/shared/providers/root-providers';

export const metadata: Metadata = {
  title: 'JobStash',
  description: 'Crypto Native Jobs',
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
    <html lang='en' suppressHydrationWarning>
      <Head>
        <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <body className={`${interTight.variable} ${grotesk.variable} antialiased`}>
        <RootProviders>{children}</RootProviders>
      </body>
    </html>
  );
}
