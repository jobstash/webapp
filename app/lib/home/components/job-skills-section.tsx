import { JobSearchItems } from './job-search-items';

const PARAM = 'Skill';

// TODO: Fetch from API
const ITEMS = [
  { label: 'Proof Of Concept', href: '/jobs?tags=proof-of-concept' },
  { label: 'Digital Interfaces', href: '/jobs?tags=digital-interfaces' },
  { label: 'Snapchain', href: '/jobs?tags=snapchain' },
  { label: 'Frames', href: '/jobs?tags=frames' },
  { label: 'Onchain Wallets', href: '/jobs?tags=onchain-wallets' },
  { label: 'WAN', href: '/jobs?tags=wan' },
  { label: 'Microsoft Intune', href: '/jobs?tags=microsoft-intune' },
  { label: 'Software Support', href: '/jobs?tags=software-support' },
  { label: 'Data Driven', href: '/jobs?tags=data-driven' },
  { label: 'Data Presentation', href: '/jobs?tags=data-presentation' },
  { label: 'Leads', href: '/jobs?tags=leads' },
  { label: 'Inbound Inquiries', href: '/jobs?tags=inbound-inquiries' },
  { label: 'Discovery', href: '/jobs?tags=discovery' },
  { label: 'Clients', href: '/jobs?tags=clients' },
  { label: 'Senior Team Members', href: '/jobs?tags=senior-team-members' },
  { label: 'Partnership Discussions', href: '/jobs?tags=partnership-discussions' },
  { label: 'Developments', href: '/jobs?tags=developments' },
  { label: 'Team Meetings', href: '/jobs?tags=team-meetings' },
  { label: 'Strategic Discussions', href: '/jobs?tags=strategic-discussions' },
  { label: 'Decentralized Web3 Ecosystem', href: '/jobs?tags=decentralized-web3-ecosystem' },
  { label: 'Ethereum Layer 2 Solutions', href: '/jobs?tags=ethereum-layer-2-solutions' },
  { label: 'Customer Facing Roles', href: '/jobs?tags=customer-facing-roles' },
  { label: 'Product Adoption', href: '/jobs?tags=product-adoption' },
  { label: 'Asset Tokenization', href: '/jobs?tags=asset-tokenization' },
  { label: 'Blogging', href: '/jobs?tags=blogging' },
  { label: 'Prince2', href: '/jobs?tags=prince2' },
  { label: 'SDET', href: '/jobs?tags=sdet' },
  { label: 'Secure Software Development', href: '/jobs?tags=secure-software-development' },
  { label: 'Dune Analytics', href: '/jobs?tags=dune-analytics' },
  { label: 'Etherscan', href: '/jobs?tags=etherscan' },
  { label: 'TLS', href: '/jobs?tags=tls' },
  { label: 'Digital Content', href: '/jobs?tags=digital-content' },
  { label: 'DeFi Ecosystem', href: '/jobs?tags=defi-ecosystem' },
  { label: 'Godot', href: '/jobs?tags=godot' },
  { label: 'Gameplay Engineering', href: '/jobs?tags=gameplay-engineering' },
  { label: 'Inventory Management', href: '/jobs?tags=inventory-management' },
  { label: 'Cisco Meraki', href: '/jobs?tags=cisco-meraki' },
  { label: 'Zoom', href: '/jobs?tags=zoom' },
  { label: 'Team Management', href: '/jobs?tags=team-management' },
  { label: 'Investment Strategies', href: '/jobs?tags=investment-strategies' },
  { label: 'Jotai', href: '/jobs?tags=jotai' },
  { label: 'Influencer Marketing', href: '/jobs?tags=influencer-marketing' },
  { label: 'Cloud Native', href: '/jobs?tags=cloud-native' },
];

// TODO: Fetch from API
const COUNTS = {
  jobs: 3062,
  organizations: 7425,
};

export const JobSkillsSection = () => {
  return <JobSearchItems param={PARAM} items={ITEMS} counts={COUNTS} />;
};
