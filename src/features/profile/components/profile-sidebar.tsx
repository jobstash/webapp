import { ProfileStrengthCard } from './profile-strength-card';
import { SuggestedJobsCard } from './suggested-jobs-card';

export const ProfileSidebar = () => (
  <nav className='flex flex-col gap-4'>
    <ProfileStrengthCard />
    <SuggestedJobsCard />
  </nav>
);
