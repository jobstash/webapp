import './globals.css';

import type { Metadata } from 'next';
import { Inter_Tight, Space_Grotesk } from 'next/font/google';
import Head from 'next/head';

const interTight = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-inter-tight',
});

const grotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
});

export const metadata: Metadata = {
  title: 'JobStash',
  description: 'Crypto Native Jobs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <Head>
        <link rel='icon' type='image/png' href='/favicon-96x96.png' sizes='96x96' />
        <link rel='icon' type='image/svg+xml' href='/favicon.svg' />
        <link rel='shortcut icon' href='/favicon.ico' />
        <link rel='apple-touch-icon' href='/apple-touch-icon.png' sizes='180x180' />
        <link rel='manifest' href='/site.webmanifest' />
      </Head>
      <body className={`${interTight.variable} ${grotesk.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
