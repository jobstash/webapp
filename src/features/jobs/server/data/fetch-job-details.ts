import 'server-only';

import {
  type JobDetailsSchema,
  type SimilarJobSchema,
} from '@/features/jobs/schemas';
import { type MappedInfoTagSchema } from '@/lib/schemas';

// Mock data for development - replace with actual API call later
const createMockJobDetails = (id: string): JobDetailsSchema => ({
  id,
  title: 'Senior Solidity Developer',
  href: `/senior-solidity-developer-uniswap/${id}`,
  applyUrl: 'https://jobs.lever.co/uniswap/example',
  summary:
    'Build the future of decentralized finance with cutting-edge smart contract development.',
  infoTags: [
    { iconKey: 'posted', label: '2 days ago' },
    { iconKey: 'seniority', label: 'Senior', href: '/?seniority=senior' },
    { iconKey: 'salary', label: 'Salary: $150k - $200k' },
    { iconKey: 'location', label: 'Remote', href: '/?location=remote' },
    {
      iconKey: 'commitment',
      label: 'Full-Time',
      href: '/?commitment=full-time',
    },
    {
      iconKey: 'paysInCrypto',
      label: 'Pays in Crypto',
      href: '/?paysInCrypto=true',
    },
  ] as MappedInfoTagSchema[],
  tags: [
    { id: '1', name: 'Solidity', normalizedName: 'solidity', colorIndex: 5 },
    {
      id: '2',
      name: 'TypeScript',
      normalizedName: 'typescript',
      colorIndex: 9,
    },
    { id: '3', name: 'React', normalizedName: 'react', colorIndex: 8 },
    { id: '4', name: 'Ethereum', normalizedName: 'ethereum', colorIndex: 10 },
    { id: '5', name: 'Hardhat', normalizedName: 'hardhat', colorIndex: 3 },
  ],
  organization: {
    name: 'Uniswap',
    href: '/?organizations=uniswap',
    websiteUrl: 'https://uniswap.org',
    location: 'New York, USA',
    logo: 'https://www.google.com/s2/favicons?sz=64&domain=uniswap.org',
    employeeCount: '150',
    fundingRounds: [
      {
        roundName: 'Series B',
        amount: '$165M',
        date: 'Oct 2022',
        href: '/?fundingRounds=series-b',
      },
      {
        roundName: 'Series A',
        amount: '$11M',
        date: 'Aug 2020',
        href: '/?fundingRounds=series-a',
      },
    ],
    investors: [
      { name: 'a16z', href: '/?investors=a16z' },
      { name: 'Paradigm', href: '/?investors=paradigm' },
      {
        name: 'Union Square Ventures',
        href: '/?investors=union-square-ventures',
      },
    ],
  },
  timestampText: '2 days ago',
  badge: 'Featured',
  description: `
    <p>We are looking for a Senior Solidity Developer to join our team and help build the next generation of decentralized finance protocols.</p>
    <p>You will work on cutting-edge DeFi protocols, designing and implementing smart contracts that handle billions of dollars in value. This is an opportunity to shape the future of finance.</p>
    <p>Our team is fully remote and values autonomy, creativity, and technical excellence.</p>
  `,
  requirements: [
    '5+ years of software development experience',
    '2+ years of Solidity development experience',
    'Strong understanding of EVM and smart contract security',
    'Experience with DeFi protocols (AMMs, lending, derivatives)',
    'Familiarity with testing frameworks like Foundry or Hardhat',
    'Excellent communication skills',
  ],
  responsibilities: [
    'Design and implement smart contracts for new protocol features',
    'Conduct thorough code reviews and security audits',
    'Collaborate with frontend team on contract integration',
    'Mentor junior developers and contribute to engineering culture',
    'Stay current with latest developments in blockchain security',
  ],
  benefits: [
    'Competitive salary paid in crypto or fiat',
    'Generous token allocation',
    'Fully remote work with flexible hours',
    'Unlimited PTO',
    'Health, dental, and vision insurance',
    'Annual team retreats',
    'Learning and development budget',
  ],
  similarJobs: [
    {
      id: 'sim1',
      title: 'Smart Contract Engineer',
      href: '/smart-contract-engineer-aave/sim1',
      salaryText: '$140k - $180k',
      location: 'Remote',
      companyName: 'Aave',
      companyLogo: 'https://www.google.com/s2/favicons?sz=64&domain=aave.com',
    },
    {
      id: 'sim2',
      title: 'Blockchain Developer',
      href: '/blockchain-developer-compound/sim2',
      salaryText: '$130k - $170k',
      location: 'San Francisco',
      companyName: 'Compound',
      companyLogo:
        'https://www.google.com/s2/favicons?sz=64&domain=compound.finance',
    },
    {
      id: 'sim3',
      title: 'Protocol Engineer',
      href: '/protocol-engineer-makerdao/sim3',
      salaryText: '$160k - $200k',
      location: 'Remote',
      companyName: 'MakerDAO',
      companyLogo:
        'https://www.google.com/s2/favicons?sz=64&domain=makerdao.com',
    },
  ] as SimilarJobSchema[],
});

interface FetchJobDetailsProps {
  id: string;
}

export const fetchJobDetails = async ({
  id,
}: FetchJobDetailsProps): Promise<JobDetailsSchema | null> => {
  // TODO: Replace with actual API call
  // const url = `${clientEnv.MW_URL}/jobs/details/${id}`;
  // const response = await fetch(url, { cache: 'force-cache', next: { revalidate: 3600 } });
  // if (!response.ok) { if (response.status === 404) return null; throw new Error(...); }
  // const json = await response.json();
  // const parsed = jobDetailsResponseDto.safeParse(json);
  // return dtoToJobDetails(parsed.data.data, parsed.data.similarJobs);

  // For now, return mock data
  return createMockJobDetails(id);
};
