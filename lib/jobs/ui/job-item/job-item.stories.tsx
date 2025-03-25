import type { Meta, StoryObj } from '@storybook/react';

import { JobItem } from '@/lib/jobs/ui/job-item/job-item';

const meta: Meta<typeof JobItem> = {
  component: JobItem,
};

export default meta;

type Story = StoryObj<typeof JobItem>;

export const Default: Story = {
  parameters: {
    design: {
      type: 'figma',
      url: 'https://www.figma.com/design/6tx4TVjW8hA8Fg5bZe5Wm4/Jobstash-website?node-id=4509-127100&t=u6u2uqfmyjXjHeao-4',
    },
  },
  args: {
    job: {
      id: 'n61Cgw',
      title: 'Product Manager',
      url: 'https://p2porg.global.huntflow.io/vacancy/product-manager-re-staking-sol-ton-btc',
      timestampText: 'last month',
      summary: 'We are looking for a Product Manager to join our team.',
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
      organization: {
        name: 'P2P.org',
        website: 'https://p2p.org',
        logo: 'https://www.google.com/s2/favicons?domain=p2p.org&sz=64',
        infoTags: [],
        location: 'Remote',
      },
      projects: [],
      promotionEndDate: null,
      hasGradientBorder: false,
      isUrgentlyHiring: false,
      badge: null,
    },
  },
};
