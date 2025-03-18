import { Meta, StoryObj } from '@storybook/react';

import { createMock } from 'storybook-addon-module-mock';

import * as fetchJobListPageModule from '@/lib/jobs/server/data';

import { JobList } from '@/lib/jobs/ui/job-list';

import { fakeJobListQueryPage } from '@/lib/jobs/test-utils/fake-job-list-query-page';

const WrappedJobList = () => (
  <div className='w-full max-w-2xl space-y-8'>
    <JobList />
  </div>
);

const meta: Meta<typeof JobList> = {
  component: WrappedJobList,
};

export default meta;

type Story = StoryObj<typeof JobList>;

export const Loading: Story = {
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(fetchJobListPageModule, 'fetchJobListPage');
        mock.mockImplementation(async ({ page }) => {
          if (page === 2) {
            await new Promise((r) => setTimeout(r, 60_000));
          }
          return fakeJobListQueryPage({ page });
        });
        return [mock];
      },
    },
  },
};

export const OK: Story = {
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(fetchJobListPageModule, 'fetchJobListPage');
        mock.mockImplementation(async ({ page }) => {
          return fakeJobListQueryPage({ page });
        });
        return [mock];
      },
    },
  },
};

export const Fail: Story = {
  parameters: {
    moduleMock: {
      mock: () => {
        const mock = createMock(fetchJobListPageModule, 'fetchJobListPage');
        mock.mockImplementation(async ({ page }) => {
          // Notice page 3 will be missing from the data
          // that's because mapped action-result won't include page that errored
          if (page === 3) throw new Error('Failed to fetch jobs');

          // Add page info to title for visibility
          const fakeJobList = fakeJobListQueryPage({ page });
          return {
            ...fakeJobList,
            data: fakeJobList.data.map((job) => ({
              ...job,
              title: `${job.title} (page ${page})`,
            })),
          };
        });
        return [mock];
      },
    },
  },
};
