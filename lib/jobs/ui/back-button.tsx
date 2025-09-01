'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';

export const BackButton = () => {
  const router = useRouter();

  return (
    <Button variant='secondary' size='icon' onClick={router.back}>
      <ArrowLeftIcon className='h-4 w-4' />
    </Button>
  );
};
