import type { Meta, StoryObj } from '@storybook/react';

import { JobListItem } from '@/lib/jobs/ui/job-list-item';

const meta: Meta<typeof JobListItem> = {
  component: JobListItem,
};

export default meta;

type Story = StoryObj<typeof JobListItem>;

export const Default: Story = {
  args: {
    job: {
      id: 'n61Cgw',
      title: 'Product Manager',
      url: 'https://p2porg.global.huntflow.io/vacancy/product-manager-re-staking-sol-ton-btc',
      timestamp: 1731931218292,
      access: 'public',
      infoTags: [
        {
          iconKey: 'seniority',
          label: 'Lead',
        },
        {
          iconKey: 'workMode',
          label: 'Remote',
        },
        {
          iconKey: 'location',
          label: 'Remote (European time zone)',
        },
        {
          iconKey: 'paysInCrypto',
          label: 'Pays in Crypto',
        },
        {
          iconKey: 'classification',
          label: 'Product',
        },
      ],
      tags: [
        {
          name: 'project management',
          normalizedName: 'project-management',
          colorIndex: 10,
        },
        {
          name: 'marketing',
          normalizedName: 'marketing',
          colorIndex: 2,
        },
        {
          name: 'B2B',
          normalizedName: 'b2b',
          colorIndex: 2,
        },
        {
          name: 'finance',
          normalizedName: 'finance',
          colorIndex: 7,
        },
        {
          name: 'planning',
          normalizedName: 'planning',
          colorIndex: 9,
        },
        {
          name: 'analytics',
          normalizedName: 'analytics',
          colorIndex: 10,
        },
        {
          name: 'product management',
          normalizedName: 'product-management',
          colorIndex: 4,
        },
        {
          name: 'Decentralized Technology',
          normalizedName: 'decentralized-technology',
          colorIndex: 6,
        },
      ],
      promotion: {
        isFeatured: false,
        endDate: null,
      },
      organization: {
        name: 'P2P.org',
        website: 'https://p2p.org',
        logo: 'https://www.google.com/s2/favicons?domain=p2p.org&sz=64',
        projects: [],
        funding: {
          lastDate: null,
          lastAmount: null,
        },
      },
      project: null,
    },
  },
};
