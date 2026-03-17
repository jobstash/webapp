import 'server-only';

export type PillarCategory =
  | 'role'
  | 'skill'
  | 'location'
  | 'locationType'
  | 'commitment';

export interface PillarItem {
  category: PillarCategory;
  label: string;
  href: string;
}

export const fetchPillarItems = async (): Promise<PillarItem[]> => {
  // Mock data for pillar items - replace with actual API call when available
  return [
    // Roles - What you do
    { category: 'role', label: 'BizDev', href: '/cl-bizdev' },
    { category: 'role', label: 'Smart Contracts', href: '/cl-smartcontracts' },
    { category: 'role', label: 'Marketing', href: '/cl-backend' },

    // Skills - What you know
    { category: 'skill', label: 'TypeScript', href: '/t-typescript' },
    { category: 'skill', label: 'Solidity', href: '/t-solidity' },
    { category: 'skill', label: 'React', href: '/t-react' },

    // Locations - Where you work
    { category: 'location', label: 'London', href: '/l-london' },
    { category: 'location', label: 'New York', href: '/l-new-york' },
    { category: 'location', label: 'Singapore', href: '/l-singapore' },

    // Location Type - Work arrangement
    { category: 'locationType', label: 'Remote', href: '/lt-remote' },
    { category: 'locationType', label: 'Onsite', href: '/lt-onsite' },
    { category: 'locationType', label: 'Hybrid', href: '/lt-hybrid' },

    // Commitment - How you work
    { category: 'commitment', label: 'Full Time', href: '/co-fulltime' },
    { category: 'commitment', label: 'Part Time', href: '/co-parttime' },
    { category: 'commitment', label: 'Internship', href: '/co-internship' },
  ];
};
