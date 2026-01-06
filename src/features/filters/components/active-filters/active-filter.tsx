import { type FilterConfigSchema } from '@/features/filters/schemas';
import { type FilterKind, FILTER_KIND } from '@/features/filters/constants';

import { ActiveFilterLabelButton } from './active-filter-label-button';
import { ActiveFilterDropdown } from './active-filter-dropdown';

interface Props {
  config: FilterConfigSchema;
}

export const ActiveFilter = ({ config }: Props) => {
  const hasDropdown = dropdownFilterKinds.has(config.kind);
  return (
    <div className='flex overflow-hidden rounded-md'>
      <ActiveFilterLabelButton
        label={config.label}
        paramKey={config.paramKey}
        hasDropdown={hasDropdown}
      />
      {hasDropdown && (
        <>
          <div className='flex items-center bg-secondary'>
            <div className='h-4 w-px bg-neutral-600/60'></div>
          </div>
          <ActiveFilterDropdown config={config} />
        </>
      )}
    </div>
  );
};

const dropdownFilterKinds = new Set<FilterKind>([
  FILTER_KIND.CHECKBOX,
  FILTER_KIND.SINGLE_SELECT,
  FILTER_KIND.MULTI_SELECT,
  FILTER_KIND.RADIO,
]);
