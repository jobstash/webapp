import { Divider } from '@/lib/shared/ui/divider';

import { AdvancedFiltersToggle } from './advanced-filters-toggle';
import { ApplyButton } from './apply-button';
import { FiltersProvider } from './context';
import { FiltersContent } from './filters-content';

// const dummyData = {
//   basicFilters: ['Publish Date', 'Work Mode', 'Salary'],
//   jobFilters: [
//     'Commitment',
//     'Seniority',
//     'Web3 Beginner',
//     'Salary',
//     'Skills',
//     'Category',
//   ],
//   orgFilters: ['Names', 'Employee Count', 'Investors', 'Funding Rounds'],
//   projectFilters: ['Names', 'Chains', 'TVL', 'Audits', 'Hacks'],
// };

export const FiltersAside = () => {
  return (
    <FiltersProvider>
      <div className='flex w-full flex-1 flex-col overflow-hidden rounded-2xl border border-neutral-800/50 bg-sidebar p-4'>
        <div className='-mr-2 flex items-center justify-between'>
          <span className='font-medium'>Filters</span>
          <AdvancedFiltersToggle />
        </div>
        <FiltersContent />
        <Divider />
        <ApplyButton />
      </div>
    </FiltersProvider>
  );
};
