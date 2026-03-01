import { Suspense } from 'react';

import { LoaderIcon } from 'lucide-react';

import { LoginContent } from '@/features/auth/components/login-content';

const LoginFallback = () => (
  <div className='flex h-dvh flex-col items-center justify-center bg-background'>
    <LoaderIcon className='size-6 animate-spin text-muted-foreground' />
  </div>
);

const LoginPage = () => (
  <Suspense fallback={<LoginFallback />}>
    <LoginContent />
  </Suspense>
);

export default LoginPage;
