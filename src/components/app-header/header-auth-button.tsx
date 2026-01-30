import Link from 'next/link';
import { UserIcon } from 'lucide-react';

import { PrimaryCTA } from '@/components/primary-cta';
import { Button } from '@/components/ui/button';

export const HeaderAuthButton = () => (
  <>
    <Button
      asChild
      size='icon'
      aria-label='Get hired'
      className='rounded-xl lg:hidden'
    >
      <Link href='/onboarding'>
        <UserIcon className='size-5' />
      </Link>
    </Button>
    <div className='hidden lg:block'>
      <PrimaryCTA asChild>
        <Link href='/onboarding'>Get Hired Now</Link>
      </PrimaryCTA>
    </div>
  </>
);
