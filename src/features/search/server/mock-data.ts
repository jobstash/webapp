import type { SuggestionsResponse } from '../schemas';

const mockSuggestions: SuggestionsResponse = [
  {
    label: 'Jobs',
    items: [
      {
        id: 'j1',
        label: 'Senior Solidity Developer',
        href: '/jobs/senior-solidity',
      },
      {
        id: 'j2',
        label: 'React Frontend Engineer',
        href: '/jobs/react-frontend',
      },
      {
        id: 'j3',
        label: 'Smart Contract Auditor',
        href: '/jobs/smart-contract-auditor',
      },
      {
        id: 'j4',
        label: 'Full Stack Web3 Developer',
        href: '/jobs/fullstack-web3',
      },
      {
        id: 'j5',
        label: 'DeFi Protocol Engineer',
        href: '/jobs/defi-protocol-engineer',
      },
    ],
  },
  {
    label: 'Organizations',
    items: [
      { id: 'o1', label: 'Uniswap', href: '/organizations/uniswap' },
      { id: 'o2', label: 'Aave', href: '/organizations/aave' },
      { id: 'o3', label: 'Chainlink', href: '/organizations/chainlink' },
      { id: 'o4', label: 'OpenSea', href: '/organizations/opensea' },
      { id: 'o5', label: 'Compound', href: '/organizations/compound' },
    ],
  },
  {
    label: 'Tags',
    items: [
      { id: 't1', label: 'React', href: '/t/react' },
      { id: 't2', label: 'Solidity', href: '/t/solidity' },
      { id: 't3', label: 'DeFi', href: '/t/defi' },
      { id: 't4', label: 'TypeScript', href: '/t/typescript' },
      { id: 't5', label: 'Smart Contracts', href: '/t/smart-contracts' },
    ],
  },
];

export const filterMockSuggestions = (query: string): SuggestionsResponse => {
  if (!query.trim()) {
    return mockSuggestions;
  }

  const lowerQuery = query.toLowerCase();

  return mockSuggestions
    .map((group) => ({
      ...group,
      items: group.items.filter((item) =>
        item.label.toLowerCase().includes(lowerQuery),
      ),
    }))
    .filter((group) => group.items.length > 0);
};
