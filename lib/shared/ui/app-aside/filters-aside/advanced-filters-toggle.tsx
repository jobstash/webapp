'use client';

import { ListFilterIcon, XIcon } from 'lucide-react';

import { cn } from '@/lib/shared/utils';

import { Button } from '@/lib/shared/ui/base/button';

import { useFiltersContext } from './context';

export const AdvancedFiltersToggle = () => {
  const { isAdvancedFiltersOpen: isOpen, toggleAdvancedFilters: toggle } =
    useFiltersContext();

  const Icon = isOpen ? XIcon : ListFilterIcon;
  const variant = isOpen ? 'outline' : 'ghost';
  const className = cn('text-xs', {
    'border border-transparent text-muted-foreground': !isOpen,
  });

  return (
    <div className=''>
      <Button size='xs' variant={variant} className={className} onClick={toggle}>
        Advanced Filters
        <Icon className='size-3' />
      </Button>
    </div>
  );
};
