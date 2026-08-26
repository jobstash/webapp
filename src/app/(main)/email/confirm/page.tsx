import { Suspense } from 'react';

import { EmailPreferenceAction } from '@/features/profile/components/email-preference-action';

const ConfirmEmailPage = () => (
  <main className='mx-auto flex min-h-[65vh] max-w-lg items-center justify-center px-4'>
    <Suspense>
      <EmailPreferenceAction action='confirm' />
    </Suspense>
  </main>
);

export default ConfirmEmailPage;
