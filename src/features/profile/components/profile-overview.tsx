import { LinkedAccountsSection } from './linked-accounts-section';
import { ManualLinksSection } from './manual-links-section';
import { ProfileCard } from './profile-card';
import { ProfileSkills } from './profile-skills/profile-skills';
import { ProfileStrengthCard } from './profile-strength-card';
import { ResumeSection } from './resume-section';

export const ProfileOverview = () => (
  <div className='flex flex-col gap-4'>
    <div className='lg:hidden'>
      <ProfileStrengthCard />
    </div>
    <ProfileCard>
      <ManualLinksSection />
    </ProfileCard>
    <ProfileCard id='linked-accounts'>
      <LinkedAccountsSection />
    </ProfileCard>
    <ProfileCard>
      <ProfileSkills />
    </ProfileCard>
    <div className='lg:hidden'>
      <ResumeSection />
    </div>
  </div>
);
