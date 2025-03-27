'use client';

import { useRouter } from 'next/navigation';

import { ArrowLeftIcon } from 'lucide-react';

import { Button } from '@/lib/shared/ui/base/button';
import { useHeaderStore } from '@/lib/filters/ui/header/store';

export const BackButton = () => {
  const router = useRouter();
  const setIsExpanded = useHeaderStore((state) => state.setIsExpanded);

  const onClick = () => {
    setIsExpanded(false);
    router.back();
  };

  return (
    <Button variant='secondary' size='icon' onClick={onClick}>
      <ArrowLeftIcon className='h-4 w-4' />
    </Button>
  );
};
