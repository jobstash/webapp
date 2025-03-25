import { Meta, StoryObj } from '@storybook/react';

import { createMock } from 'storybook-addon-module-mock';

import * as fetchJobListPageModule from '@/lib/jobs/server/data';

import Layout from './layout';
import HomePage from './page';

import { fakeJobListQueryPage } from '@/lib/jobs/test-utils/fake-job-list-query-page';

const meta: Meta<typeof HomePage> = {
  title: 'Home Page',
  component: HomePage,
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/',
      },
    },
  },
  decorators: [
    (Story) => (
      <Layout>
        <Story />
      </Layout>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof meta>;

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
          if (page === 2) throw new Error('Failed to fetch jobs');
          return fakeJobListQueryPage({ page });
        });
        return [mock];
      },
    },
  },
};
