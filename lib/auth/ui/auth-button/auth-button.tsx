import { useLogin as usePrivyLogin, usePrivy } from '@privy-io/react-auth';

import { AUTH_QUERIES } from '@/lib/auth/core/queries';

import { WithQueryErrorBoundary } from '@/lib/shared/ui/with-query-error-boundary';

import { AuthButtonFallback } from './auth-button.fallback';
import { AuthButtonView } from './auth-button.view';

import { AuthProvider, useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';
import { PrivyProvider } from '@/lib/shared/providers/privy-provider';

const LOADING_STATES = [
  'gettingUser',
  'gettingPrivyToken',
  'syncingSession',
  'initiatingLogout',
  'loggingOutPrivy',
  'loggingOutSession',
] as const;

const AuthButtonInner = () => {
  const { ready } = usePrivy();
  const authActorRef = useAuthActorRef();
  const { isLoading, isAuthenticated } = useAuthSelector((snapshot) => ({
    isAuthenticated: snapshot.matches('authenticated'),
    isLoading: !ready || LOADING_STATES.some(snapshot.matches),
  }));

  const { login: openPrivyModal } = usePrivyLogin({
    onComplete: () => {
      authActorRef.send({ type: 'LOGIN' });
    },
  });

  const handleClick = () => {
    if (isAuthenticated) {
      authActorRef.send({ type: 'LOGOUT' });
    } else {
      openPrivyModal();
    }
  };

  return <AuthButtonView isLoading={isLoading} onClick={handleClick} />;
};

export const AuthButton = () => {
  return (
    <PrivyProvider>
      <AuthProvider>
        <WithQueryErrorBoundary queryKey={AUTH_QUERIES.all} fallback={AuthButtonFallback}>
          <AuthButtonInner />
        </WithQueryErrorBoundary>
      </AuthProvider>
    </PrivyProvider>
  );
};
