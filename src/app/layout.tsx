import './globals.css';

import type { Metadata, Viewport } from 'next';

import { interTight } from '@/lib/fonts';
import { cn } from '@/lib/utils';
import { AppHeader } from '@/components/app-header/app-header';
import { RootProviders } from '@/components/providers/root-providers';

export const metadata: Metadata = {
  title: 'Crypto Native Jobs',
  description:
    'Explore crypto native jobs across the entire crypto ecosystem, powered by AI and enhanced by unique data insights as a public good.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-icon.png',
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
        <div className='mx-auto max-w-7xl px-2 pt-4'>{children}</div>
      </RootProviders>
    </body>
  </html>
);

export default RootLayout;
