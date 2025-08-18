import { usePrivy } from '@privy-io/react-auth';

import { AuthButtonView } from './auth-button.view';

import { PrivyProvider } from '@/lib/shared/providers/privy-provider';

const AuthButtonInner = () => {
  const { ready } = usePrivy();
  const isLoading = !ready;
  return <AuthButtonView isLoading={isLoading} />;
};

export const AuthButton = () => {
  return (
    <PrivyProvider>
      <AuthButtonInner />
    </PrivyProvider>
  );
};
