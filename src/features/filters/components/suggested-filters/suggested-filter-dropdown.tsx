import { FilterDropdown } from '@/features/filters/components/filter-dropdown';
import { filterIconMap } from '@/features/filters/components/filter-icon-map';

interface Props extends React.PropsWithChildren {
  label: string;
  paramKey: string;
}

export const SuggestedFilterDropdown = ({
  label,
  paramKey,
  children,
}: Props) => {
  const icon = filterIconMap[paramKey];
  return (
    <FilterDropdown
      label={label}
      classNames={{
        content: 'border-neutral-800 p-0',
        trigger:
          'h-7 items-center gap-1.5 border border-dashed bg-sidebar text-muted-foreground/80 hover:bg-muted',
      }}
      icon={icon}
      withDropdownIcon={false}
      truncateLabel={false}
    >
      {children}
    </FilterDropdown>
  );
};
