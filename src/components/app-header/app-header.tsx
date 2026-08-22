import Link from 'next/link';

import { SearchHeader } from '@/features/search';

import { Brand } from './brand';
import { HeaderAuthButton } from './header-auth-button.lazy';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-40 flex justify-center border-b border-neutral-900 bg-background/40 backdrop-blur-lg'>
      <div className='flex h-16 w-full max-w-7xl items-center gap-3 px-2 lg:h-20 lg:gap-3'>
        <div className='w-fit xl:w-48'>
          <Brand />
        </div>

        <nav
          aria-label='Primary navigation'
          className='hidden items-center gap-1 xl:flex'
        >
          <Link
            href='/market'
            className='rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground'
          >
            Market
          </Link>
          <Link
            href='/developers'
            className='rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground'
          >
            Developers
          </Link>
        </nav>

        <div className='flex grow items-center lg:pl-3'>
          <SearchHeader />
        </div>

        <HeaderAuthButton />
      </div>
    </header>
  );
};
