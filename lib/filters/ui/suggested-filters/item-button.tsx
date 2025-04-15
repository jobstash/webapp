'use client';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useFilterIcon } from '@/lib/filters/hooks/use-filter-icon';

import { Button, ButtonProps } from '@/lib/shared/ui/base/button';

interface Props extends ButtonProps {
  config: FilterConfigSchema;
}

export const ItemButton = ({ config, ...props }: Props) => {
  const { icon } = useFilterIcon(config);
  return (
    <Button
      size='xs'
      className='h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted'
      {...props}
    >
      {icon}
      {config.label}
    </Button>
  );
};
