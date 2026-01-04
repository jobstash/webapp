import { Meta, StoryObj } from '@storybook/react';

import { createMock } from 'storybook-addon-module-mock';

import { FILTER_KIND } from '@/lib/filters/core/constants';
import { FilterConfigSchema } from '@/lib/filters/core/schemas';

import * as fetchFilterConfigsModule from '@/lib/filters/data/fetch-filter-configs';

import { FiltersAside } from '@/lib/filters/ui/filters-aside/filters-aside';
import { FiltersAsideSkeleton } from '@/lib/filters/ui/filters-aside/skeleton';

const fakeFilterConfigs: FilterConfigSchema[] = [
  {
    kind: FILTER_KIND.SINGLE_SELECT,
    position: 1,
    label: 'Publication Date',
    paramKey: 'publicationDate',
    analytics: { id: 'publicationDate', name: 'Publication Date' },
    isSuggested: true,
    options: [
      { label: 'Today', value: 'today' },
      { label: 'This Week', value: 'thisWeek' },
      { label: 'This Month', value: 'thisMonth' },
      { label: 'This Year', value: 'thisYear' },
    ],
  },
  {
    kind: FILTER_KIND.SINGLE_SELECT,
    position: 2,
    label: 'Seniority',
    paramKey: 'seniority',
    analytics: { id: 'seniority', name: 'Seniority' },
    isSuggested: true,
    options: [
      { label: 'Junior', value: 'junior' },
      { label: 'Mid', value: 'mid' },
      { label: 'Senior', value: 'senior' },
    ],
  },
  {
    kind: FILTER_KIND.SINGLE_SELECT,
    position: 3,
    label: 'Work Mode',
    paramKey: 'locations',
    analytics: { id: 'workMode', name: 'Work Mode' },
    isSuggested: true,
    options: [
      { label: 'Remote', value: 'remote' },
      { label: 'Hybrid', value: 'hybrid' },
      { label: 'On-site', value: 'onsite' },
    ],
  },
  {
    kind: FILTER_KIND.MULTI_SELECT,
    position: 4,
    label: 'Skills',
    paramKey: 'tags',
    analytics: { id: 'tags', name: 'Skills' },
    isSuggested: true,
    options: [
      { label: 'React', value: 'react' },
      { label: 'TypeScript', value: 'typescript' },
      { label: 'Node.js', value: 'nodejs' },
    ],
  },
  {
    kind: FILTER_KIND.MULTI_SELECT,
    position: 5,
    label: 'Investors',
    paramKey: 'investors',
    analytics: { id: 'investors', name: 'Investors' },
    isSuggested: true,
    options: [
      { label: 'Andreessen Horowitz', value: 'a16z' },
      { label: 'Paradigm', value: 'paradigm' },
      { label: 'Coinbase Ventures', value: 'coinbase-ventures' },
    ],
  },
  {
    kind: FILTER_KIND.MULTI_SELECT,
    position: 6,
    label: 'Organizations',
    paramKey: 'organizations',
    analytics: { id: 'organizations', name: 'Organizations' },
    isSuggested: true,
    options: [
      { label: 'Ethereum Foundation', value: 'ethereum-foundation' },
      { label: 'Consensys', value: 'consensys' },
      { label: 'Chainlink', value: 'chainlink' },
    ],
  },
];

const StoryWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className='w-68'>{children}</div>
);

const WrappedFiltersAside = () => (
  <StoryWrapper>
    <FiltersAside />
  </StoryWrapper>
);

const meta: Meta<typeof FiltersAside> = {
  component: WrappedFiltersAside,
};

export default meta;

type Story = StoryObj<typeof FiltersAside>;

export const Default: Story = {
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(fetchFilterConfigsModule, 'fetchFilterConfigs');
        mock.mockImplementation(async () => fakeFilterConfigs);
        return [mock];
      },
    },
  },
};

export const Loading: Story = {
  render: () => (
    <StoryWrapper>
      <FiltersAsideSkeleton />
    </StoryWrapper>
  ),
};
