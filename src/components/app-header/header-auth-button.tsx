import Link from 'next/link';
import { UserIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';

export const HeaderAuthButton = () => (
  <>
    <Button
      asChild
      size='icon'
      variant='secondary'
      aria-label='Get started'
      className='rounded-xl border border-neutral-800 lg:hidden'
    >
      <Link href='/onboarding'>
        <UserIcon className='size-5 text-muted-foreground' />
      </Link>
    </Button>
    <Button
      asChild
      size='lg'
      variant='secondary'
      className='hidden h-10 w-40 lg:block'
    >
      <Link href='/onboarding'>Get Started</Link>
    </Button>
  </>
);
