import Link from 'next/link';

import { SearchHeader } from '@/features/search';

import { SearchToolsSlot } from './search-tools';
import { MobileNavigation } from './mobile-navigation';
import { Brand } from './brand';
import { HeaderAuthButton } from './header-auth-button.lazy';

export const AppHeader = () => {
  return (
    <header className='sticky top-0 z-40 flex justify-center border-b border-neutral-900 bg-background/40 backdrop-blur-lg'>
      <div className='w-full max-w-7xl'>
        <div className='flex h-16 items-center gap-3 px-2 lg:h-20 lg:gap-3'>
          <div className='hidden w-fit xl:block xl:w-48'>
            <Brand />
          </div>
          <MobileNavigation />

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

          <div className='flex min-w-0 grow items-center rounded-lg border border-border bg-card xl:border-0 xl:bg-transparent xl:pl-3'>
            <SearchHeader />
            <SearchToolsSlot />
          </div>

          <div className='hidden xl:block'>
            <HeaderAuthButton />
          </div>
        </div>
      </div>
    </header>
  );
};
