import { AuthGuard } from '@/features/auth/components/auth-guard';
import { ProfileContent } from '@/features/profile/components/profile-content';

export default function ProfilePage() {
  return (
    <AuthGuard>
      <ProfileContent />
    </AuthGuard>
  );
}
