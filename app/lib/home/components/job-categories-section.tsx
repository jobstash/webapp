import { JobSearchItems } from './job-search-items';

const PARAM = 'Category';

// TODO: Fetch from API
const ITEMS: { label: string; href: string }[] = [
  {
    label: 'Human Resources Jobs in Crypto',
    href: '/jobs?classifications=human_resources',
  },
  {
    label: 'Bizdev Jobs in Crypto',
    href: '/jobs?classifications=bizdev',
  },
  {
    label: 'Marketing Jobs in Crypto',
    href: '/jobs?classifications=marketing',
  },
  {
    label: 'Engineering Jobs in Crypto',
    href: '/jobs?classifications=engineering',
  },
  {
    label: 'Design Jobs in Crypto',
    href: '/jobs?classifications=design',
  },
  {
    label: 'Finance Jobs in Crypto',
    href: '/jobs?classifications=finance',
  },

  {
    label: 'Legal Jobs in Crypto',
    href: '/jobs?classifications=legal',
  },
  {
    label: 'Operations Jobs in Crypto',
    href: '/jobs?classifications=operations',
  },
  {
    label: 'Product Management Jobs in Crypto',
    href: '/jobs?classifications=product_management',
  },
  {
    label: 'Sales Jobs in Crypto',
    href: '/jobs?classifications=sales',
  },
  {
    label: 'Customer Support Jobs in Crypto',
    href: '/jobs?classifications=customer_support',
  },
  {
    label: 'Data Science Jobs in Crypto',
    href: '/jobs?classifications=data_science',
  },
  {
    label: 'IT Jobs in Crypto',
    href: '/jobs?classifications=it',
  },
  {
    label: 'Security Jobs in Crypto',
    href: '/jobs?classifications=security',
  },
  {
    label: 'Content Creation Jobs in Crypto',
    href: '/jobs?classifications=content_creation',
  },
];

// TODO: Fetch from API
const COUNTS = {
  jobs: 3062,
  organizations: 7425,
};

export const JobCategoriesSection = () => {
  return <JobSearchItems param={PARAM} items={ITEMS} counts={COUNTS} />;
};
