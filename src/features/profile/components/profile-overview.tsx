import { ProfileCard } from './profile-card';
import { ProfileIdentityCard } from './profile-identity-card';
import { ProfileSkills } from './profile-skills/profile-skills';
import { ProfileStrengthCard } from './profile-strength-card';
import { SuggestedJobsCard } from './suggested-jobs-card';

export const ProfileOverview = () => (
  <div className='flex flex-col gap-4'>
    <div className='lg:hidden'>
      <ProfileStrengthCard />
    </div>
    <ProfileIdentityCard />
    <ProfileCard>
      <ProfileSkills />
    </ProfileCard>
    <div className='lg:hidden'>
      <SuggestedJobsCard />
    </div>
  </div>
);
