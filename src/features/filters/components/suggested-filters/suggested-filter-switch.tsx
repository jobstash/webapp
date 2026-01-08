'use client';

import { useTransition } from 'react';
import { useQueryState } from 'nuqs';

import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { SuggestedFilterTrigger } from './suggested-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
}

export const SuggestedFilterSwitch = ({ label, paramKey }: Props) => {
  const [, setFilterParam] = useQueryState(paramKey);
  const [isPending, startTransition] = useTransition();
  const toggleFilter = () => {
    startTransition(() => {
      setFilterParam('true');
    });
  };

  return (
    <SuggestedFilterTrigger
      isPending={isPending}
      label={label}
      icon={<MappedFilterIcon paramKey={paramKey} />}
      onClick={toggleFilter}
      disabled={isPending}
    />
  );
};
