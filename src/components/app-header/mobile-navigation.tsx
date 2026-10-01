'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MenuIcon } from 'lucide-react';
import { useEligibility } from '@/hooks/use-eligibility';
import { JobstashLogo } from '@/components/jobstash-logo';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetTrigger,
  SheetClose,
} from '@/components/ui/sheet';

const browseLinks = [
  ['All jobs', '/'],
  ['Urgently hiring', '/urgently-hiring'],
  ['Crypto beginner jobs', '/crypto-beginner-jobs'],
  ['Fully remote jobs', '/lt-fully-remote'],
];
const reportLinks = [
  ['Job market analytics', '/market'],
  ['Developer ecosystem report', '/developers'],
];

export const MobileNavigation = () => {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isLoading } = useEligibility();
  const navLink = ([label, href]: string[]) => (
    <SheetClose asChild key={href}>
      <Link
        href={href}
        className='flex min-h-11 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none'
      >
        {label}
      </Link>
    </SheetClose>
  );
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type='button'
          aria-label='Open navigation'
          className='relative flex size-12 shrink-0 items-center justify-center rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none xl:hidden'
        >
          <JobstashLogo className='size-9' />
          <MenuIcon
            className='absolute right-0 bottom-0 size-4 rounded bg-background'
            aria-hidden
          />
        </button>
      </SheetTrigger>
      <SheetContent side='left' className='h-dvh w-full max-w-sm gap-0'>
        <SheetHeader className='border-b'>
          <SheetTitle>JobStash</SheetTitle>
          <SheetDescription className='sr-only'>
            Browse jobs, reports, and your account.
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label='Mobile navigation'
          className='min-h-0 flex-1 space-y-4 overflow-y-auto p-4'
        >
          <div>{browseLinks.map(navLink)}</div>
          <div className='border-t pt-4'>{reportLinks.map(navLink)}</div>
          {!isLoading && (
            <div className='border-t pt-4'>
              {(isAuthenticated
                ? [
                    ['Profile', '/profile'],
                    ['Settings', '/profile/settings'],
                  ]
                : [['Log in', '/login']]
              ).map(navLink)}
            </div>
          )}
          <div className='border-t pt-4 text-muted-foreground'>
            {[
              ['Privacy policy', '/privacy'],
              ['Terms of service', '/terms'],
            ].map(navLink)}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
};
