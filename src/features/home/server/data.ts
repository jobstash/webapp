import 'server-only';

export type PillarCategory = 'role' | 'skill' | 'location' | 'commitment';

export interface PillarItem {
  category: PillarCategory;
  label: string;
  href: string;
}

export const fetchPillarItems = async (): Promise<PillarItem[]> => {
  // Mock data for pillar items - replace with actual API call when available
  return [
    // Roles - What you do
    { category: 'role', label: 'DevRel', href: '/cl-devrel' },
    { category: 'role', label: 'Business Dev', href: '/cl-bizdev' },
    { category: 'role', label: 'Frontend', href: '/cl-frontend' },

    // Skills - What you know
    { category: 'skill', label: 'TypeScript', href: '/t-typescript' },
    { category: 'skill', label: 'React', href: '/t-react' },
    { category: 'skill', label: 'Golang', href: '/t-golang' },

    // Locations - Where you work
    { category: 'location', label: 'USA', href: '/l-usa' },
    { category: 'location', label: 'China', href: '/l-china' },
    { category: 'location', label: 'Europe', href: '/l-europe' },

    // Commitment - How you work
    { category: 'commitment', label: 'Full-time', href: '/co-fulltime' },
    { category: 'commitment', label: 'Part-time', href: '/co-parttime' },
    { category: 'commitment', label: 'Internship', href: '/co-internship' },
  ];
};
