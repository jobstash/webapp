'use client';

import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import { useFilterIcon } from '@/lib/filters/hooks/use-filter-icon';

import { FilterDropdown } from '@/lib/filters/ui/filter-dropdown';

interface Props extends React.PropsWithChildren {
  config: FilterConfigSchema;
}

export const Dropdown = ({ config, children }: Props) => {
  const { icon } = useFilterIcon(config);
  return (
    <FilterDropdown
      label={config.label}
      classNames={{
        content: 'border-neutral-800 p-0',
        trigger:
          'h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted',
      }}
      icon={icon}
      withDropdownIcon={false}
    >
      {children}
    </FilterDropdown>
  );
};
