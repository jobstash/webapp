import Link from 'next/link';

import { SearchHeader } from '@/features/search';

import { Brand } from './brand';
import { HeaderAuthButton } from './header-auth-button.lazy';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-40 flex justify-center border-b border-neutral-900 bg-background/40 backdrop-blur-lg'>
      <div className='w-full max-w-7xl'>
        <div className='flex h-16 items-center gap-3 px-2 lg:h-20 lg:gap-3'>
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
              Job Market Analytics
            </Link>
            <Link
              href='/developers'
              className='rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground'
            >
              Developer Ecosystem Analytics
            </Link>
          </nav>

          <div className='flex grow items-center lg:pl-3'>
            <SearchHeader />
          </div>

          <HeaderAuthButton />
        </div>

        <nav
          aria-label='Analytics navigation'
          className='grid grid-cols-2 border-t border-neutral-900 xl:hidden'
        >
          <Link
            href='/market'
            className='flex min-h-10 items-center justify-center border-r border-neutral-900 px-2 py-2 text-center text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:bg-card focus-visible:text-foreground focus-visible:outline-none sm:text-xs'
          >
            Job Market Analytics
          </Link>
          <Link
            href='/developers'
            className='flex min-h-10 items-center justify-center px-2 py-2 text-center text-[11px] font-semibold text-muted-foreground transition-colors hover:bg-card hover:text-foreground focus-visible:bg-card focus-visible:text-foreground focus-visible:outline-none sm:text-xs'
          >
            Developer Ecosystem Analytics
          </Link>
        </nav>
      </div>
    </header>
  );
};
