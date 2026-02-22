import { Suspense } from 'react';

import { AuthGuard } from '@/features/auth/components/auth-guard';
import { LinkAccountContent } from '@/features/profile/components/link-account-content';

const LinkAccountPage = () => (
  <AuthGuard>
    <Suspense>
      <LinkAccountContent />
    </Suspense>
  </AuthGuard>
);

export default LinkAccountPage;
