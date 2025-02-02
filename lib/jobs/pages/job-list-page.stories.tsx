import { Meta, StoryObj } from '@storybook/react';

import { MOCK_RESPONSE_RESULT } from '@/lib/shared/testutils/core';

import { JobListPage } from '@/lib/jobs/pages/job-list-page';
import { fakeJobListQueryPage } from '@/lib/jobs/test-utils/fake-job-list-query-page';
import { mockJobListResponse } from '@/lib/jobs/test-utils/mock-job-list-response';

const meta: Meta<typeof JobListPage> = {
  component: JobListPage,
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/jobs',
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof JobListPage>;

export const EmptyFirstPage: Story = {
  args: {
    ssrData: [],
  },
};

export const ErrorFirstPage: Story = {
  args: {
    ssrData: fakeJobListQueryPage({ page: 1 }).data,
  },
  parameters: {
    msw: {
      handlers: [
        mockJobListResponse({
          result: MOCK_RESPONSE_RESULT.ERROR,
        }),
      ],
    },
  },
};
