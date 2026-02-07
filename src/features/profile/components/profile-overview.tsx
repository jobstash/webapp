import { ProfileCard } from './profile-card';
import { ProfileCompleteness } from './profile-completeness';
import { ProfileIdentityCard } from './profile-identity-card';
import { ProfileSkills } from './profile-skills/profile-skills';

export const ProfileOverview = () => (
  <div className='flex flex-col gap-4'>
    <div className='lg:hidden'>
      <ProfileCompleteness />
    </div>
    <ProfileIdentityCard />
    <ProfileCard>
      <ProfileSkills />
    </ProfileCard>
  </div>
);
