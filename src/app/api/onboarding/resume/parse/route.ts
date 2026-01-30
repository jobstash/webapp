import type { PopularTagItem } from '@/features/onboarding/schemas';
import {
  acquireConcurrentSlot,
  checkFilename,
  checkMagicBytes,
  checkOrigin,
  checkRateLimit,
  computeFileHash,
  getCachedResult,
  getClientIp,
  releaseConcurrentSlot,
  runGuards,
  setCachedResult,
} from '@/lib/server/guards';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const ACCEPTED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]);

const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_SKILLS: PopularTagItem[] = [
  { id: 'typescript', name: 'TypeScript', normalizedName: 'typescript' },
  { id: 'solidity', name: 'Solidity', normalizedName: 'solidity' },
  { id: 'react', name: 'React', normalizedName: 'react' },
  { id: 'next-js', name: 'Next.js', normalizedName: 'next-js' },
  { id: 'rust', name: 'Rust', normalizedName: 'rust' },
  { id: 'go', name: 'Go', normalizedName: 'go' },
  { id: 'python', name: 'Python', normalizedName: 'python' },
  {
    id: 'smart-contracts',
    name: 'Smart Contracts',
    normalizedName: 'smart-contracts',
  },
  { id: 'defi', name: 'DeFi', normalizedName: 'defi' },
  { id: 'nfts', name: 'NFTs', normalizedName: 'nfts' },
  { id: 'web3-js', name: 'Web3.js', normalizedName: 'web3-js' },
  { id: 'ethers-js', name: 'Ethers.js', normalizedName: 'ethers-js' },
  { id: 'hardhat', name: 'Hardhat', normalizedName: 'hardhat' },
  { id: 'foundry', name: 'Foundry', normalizedName: 'foundry' },
  { id: 'graphql', name: 'GraphQL', normalizedName: 'graphql' },
  { id: 'node-js', name: 'Node.js', normalizedName: 'node-js' },
  { id: 'postgresql', name: 'PostgreSQL', normalizedName: 'postgresql' },
  { id: 'mongodb', name: 'MongoDB', normalizedName: 'mongodb' },
  { id: 'docker', name: 'Docker', normalizedName: 'docker' },
  { id: 'kubernetes', name: 'Kubernetes', normalizedName: 'kubernetes' },
  { id: 'aws', name: 'AWS', normalizedName: 'aws' },
  { id: 'terraform', name: 'Terraform', normalizedName: 'terraform' },
  {
    id: 'security-auditing',
    name: 'Security Auditing',
    normalizedName: 'security-auditing',
  },
  { id: 'tokenomics', name: 'Tokenomics', normalizedName: 'tokenomics' },
];

const getRandomSkills = (count: number): PopularTagItem[] =>
  [...MOCK_SKILLS].sort(() => Math.random() - 0.5).slice(0, count);

export const POST = async (request: Request): Promise<Response> => {
  const ip = getClientIp(request);

  const preCheck = await runGuards(
    () => checkOrigin(request),
    () => checkRateLimit(ip),
    () => acquireConcurrentSlot(ip),
  );
  if (preCheck) return preCheck;

  try {
    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      return Response.json({ error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file');

    if (!file || !(file instanceof File)) {
      return Response.json(
        { error: 'Missing or invalid file' },
        { status: 400 },
      );
    }

    if (!ACCEPTED_MIME_TYPES.has(file.type)) {
      return Response.json(
        { error: 'Unsupported file type. Accepted: PDF, DOC, DOCX' },
        { status: 400 },
      );
    }

    if (file.size === 0) {
      return Response.json({ error: 'File is empty' }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: 'File too large. Maximum size is 10MB' },
        { status: 400 },
      );
    }

    const filenameCheck = checkFilename(file.name);
    if (filenameCheck) return filenameCheck;

    const buffer = await file.arrayBuffer();

    const magicCheck = checkMagicBytes(buffer);
    if (magicCheck) return magicCheck;

    const hash = computeFileHash(buffer);
    const cached = getCachedResult(hash);
    if (cached) return cached;

    // TODO: Replace with actual resume parsing
    await delay(1500);

    const skills = getRandomSkills(Math.floor(Math.random() * 4) + 5);
    const result = Response.json({ fileName: file.name, skills });
    setCachedResult(hash, result);

    return result;
  } finally {
    releaseConcurrentSlot(ip);
  }
};
