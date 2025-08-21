import type { ProfileInfoDto } from '@/lib/profile/core/dtos';
import type { ProfileInfoSchema } from '@/lib/profile/core/schemas';

export const toProfileInfo = (dto: ProfileInfoDto): ProfileInfoSchema => {
  return {
    cvLink: null,
    name: getProfileName(dto),
    avatar: dto.githubAvatar || getDefaultAvatar(dto.wallet),
    location: null,
    preferredContact: null,
    isAvailableForWork: dto.availableForWork || false,
    preferredWorkMode: null,
    expectedSalary: null,
    linkedAccounts: null,
    skills: [],
    showcases: [],
  };
};

const getDefaultAvatar = (seed: string) =>
  `https://api.dicebear.com/9.x/identicon/svg?seed=${seed}`;

const formatWallet = (wallet: string) => wallet.slice(0, 6) + '...' + wallet.slice(-4);

const getProfileName = (dto: ProfileInfoDto): string => {
  return (
    [
      dto.name,
      dto.linkedAccounts.github,
      dto.linkedAccounts.email,
      dto.linkedAccounts.google,
      dto.linkedAccounts.twitter,
      dto.linkedAccounts.telegram,
      ...dto.linkedAccounts.wallets.map(formatWallet),
    ]
      .filter(Boolean)
      .at(0) || 'Anon'
  );
};
