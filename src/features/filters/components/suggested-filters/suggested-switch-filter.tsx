'use client';

import { useQueryState } from 'nuqs';

import { SuggestedFilterLabelButton } from './suggested-filter-label-button';

interface Props {
  label: string;
  paramKey: string;
}

export const SuggestedSwitchFilter = ({ label, paramKey }: Props) => {
  const [, setFilterParam] = useQueryState(paramKey);

  // Nuqs will auto unsets this
  const toggleFilter = () => setFilterParam('true');

  return (
    <div className='flex overflow-hidden rounded-md'>
      <SuggestedFilterLabelButton
        label={label}
        paramKey={paramKey}
        onClick={toggleFilter}
      />
    </div>
  );
};
