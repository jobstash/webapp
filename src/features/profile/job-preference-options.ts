export interface PreferenceOption {
  label: string;
  value: string;
}

const options = (values: readonly string[]): PreferenceOption[] =>
  values.map((value) => ({ label: value, value }));

export const ROLE_PRIORITY_OPTIONS = options([
  'Compensation',
  'Mission',
  'Technical ownership',
  'Career growth',
  'Team quality',
  'Work-life balance',
  'Remote flexibility',
  'Product impact',
  'Learning',
  'Stability',
  'Early-stage company',
  'Open source',
]);

export const JOB_CATEGORY_OPTIONS = options([
  'Accounting',
  'AI',
  'Auditing',
  'Backend',
  'Business Development',
  'Community',
  'Customer Support',
  'Cybersecurity',
  'Data Science',
  'Design',
  'DevOps',
  'Developer Relations',
  'Engineering',
  'Engineering Management',
  'Events',
  'Finance',
  'Forward Deployed Engineer',
  'Frontend',
  'Fullstack',
  'Growth',
  'Human Resources',
  'Legal',
  'Management',
  'Marketing',
  'Operations',
  'Partnerships',
  'People',
  'Product',
  'Product Management',
  'Project Management',
  'Research',
  'Sales',
  'Smart Contracts',
  'Technical Writing',
  'Trading',
  'Other',
]);

export const SENIORITY_OPTIONS = options([
  'Intern',
  'Junior',
  'Senior',
  'Lead',
  'Head',
]);

export const SKILL_OPTIONS = options([
  'TypeScript',
  'JavaScript',
  'React',
  'Next.js',
  'Node.js',
  'Python',
  'Go',
  'Rust',
  'Solidity',
  'Java',
  'C++',
  'SQL',
  'PostgreSQL',
  'GraphQL',
  'AWS',
  'GCP',
  'Docker',
  'Kubernetes',
  'Terraform',
  'EVM',
  'Ethereum',
  'Solana',
  'Smart contracts',
  'DeFi',
  'Machine learning',
  'Data analysis',
  'Product management',
  'Project management',
  'Marketing',
  'Sales',
]);

export const INDUSTRY_OPTIONS = options([
  'Crypto',
  'Blockchain',
  'DeFi',
  'Fintech',
  'AI',
  'Infrastructure',
  'Developer tools',
  'Security',
  'Payments',
  'Trading',
  'Gaming',
  'Consumer',
  'Enterprise',
  'SaaS',
  'Open source',
]);

export const COMMITMENT_OPTIONS = options([
  'Full Time',
  'Part Time',
  'Contract',
  'Freelance',
  'Internship',
  'Temporary',
]);

export const FUNDING_STAGE_OPTIONS = options([
  'Bootstrapped',
  'Pre-Seed',
  'Seed',
  'Series A',
  'Series B',
  'Series C',
  'Series D+',
  'Profitable',
  'Public',
]);

export const CURRENCY_OPTIONS = options([
  'USD',
  'EUR',
  'GBP',
  'CHF',
  'CAD',
  'AUD',
  'SGD',
  'AED',
  'USDC',
  'USDT',
  'BTC',
  'ETH',
]);

export const LANGUAGE_OPTIONS = options([
  'English',
  'Spanish',
  'French',
  'German',
  'Portuguese',
  'Dutch',
  'Italian',
  'Polish',
  'Ukrainian',
  'Russian',
  'Turkish',
  'Arabic',
  'Hindi',
  'Mandarin Chinese',
  'Japanese',
  'Korean',
]);

export const WORK_MODE_OPTIONS: PreferenceOption[] = [
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
  { label: 'On-site', value: 'onsite' },
];
