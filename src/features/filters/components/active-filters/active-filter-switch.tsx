'use client';

import { useTransition } from 'react';
import { useQueryState } from 'nuqs';

import { MappedFilterIcon } from '@/features/filters/components/mapped-filter-icon';

import { ActiveFilterTrigger } from './active-filter-trigger';

interface Props {
  label: string;
  paramKey: string;
}

export const ActiveFilterSwitch = ({ label, paramKey }: Props) => {
  const [, setFilterParam] = useQueryState(paramKey);
  const [isPending, startTransition] = useTransition();
  const onClose = () => {
    startTransition(() => {
      setFilterParam(null);
    });
  };

  return (
    <ActiveFilterTrigger
      isPending={isPending}
      label={label}
      icon={<MappedFilterIcon paramKey={paramKey} />}
      onClose={onClose}
    />
  );
};
