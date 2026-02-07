'use client';

import { ProfileCard } from './profile-card';
import { ProfileCompleteness } from './profile-completeness';
import { ProfileSkills } from './profile-skills/profile-skills';
import { ProfileSocials } from './profile-socials';
import { ProfileWalletCard } from './profile-wallet-card';

export const ProfileOverview = () => (
  <div className='flex flex-col gap-4'>
    <div className='lg:hidden'>
      <ProfileCompleteness />
    </div>
    <ProfileWalletCard />
    <ProfileCard>
      <ProfileSkills />
    </ProfileCard>
    <ProfileCard>
      <ProfileSocials />
    </ProfileCard>
  </div>
);
