import { ContactSection } from './contact-section';
import { ProfileCard } from './profile-card';
import { ProfileSkills } from './profile-skills/profile-skills';
import { ProfileStrengthCard } from './profile-strength-card';
import { SocialsSection } from './socials-section';

export const ProfileOverview = () => (
  <div className='flex flex-col gap-4'>
    <div className='lg:hidden'>
      <ProfileStrengthCard />
    </div>
    <ProfileCard>
      <ContactSection />
    </ProfileCard>
    <ProfileCard>
      <SocialsSection />
    </ProfileCard>
    <ProfileCard>
      <ProfileSkills />
    </ProfileCard>
  </div>
);
