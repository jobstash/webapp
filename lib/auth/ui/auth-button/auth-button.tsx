import { useLogin as usePrivyLogin, usePrivy } from '@privy-io/react-auth';

import { AUTH_QUERIES } from '@/lib/auth/core/queries';

import { WithQueryErrorBoundary } from '@/lib/shared/ui/with-query-error-boundary';

import { AuthButtonFallback } from './auth-button.fallback';
import { AuthButtonView } from './auth-button.view';

import { useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';

const LOADING_STATES = [
  'gettingUser',
  'gettingPrivyToken',
  'syncingSession',
  'loggingOutPrivy',
  'loggingOutSession',
  'redirecting',
] as const;

const AuthButtonInner = () => {
  const { ready } = usePrivy();
  const authActorRef = useAuthActorRef();
  const { isLoading, isAuthenticated } = useAuthSelector((snapshot) => {
    return {
      isAuthenticated: snapshot.matches('authenticated'),
      isLoading: !ready || LOADING_STATES.some((state) => snapshot.matches(state)),
    };
  });

  const { login: openPrivyModal } = usePrivyLogin({
    onComplete: ({ wasAlreadyAuthenticated }) => {
      const redirectTo = wasAlreadyAuthenticated ? undefined : '/profile';
      authActorRef.send({ type: 'LOGIN', redirectTo });
    },
  });

  const handleClick = () => {
    if (isAuthenticated) {
      authActorRef.send({ type: 'LOGOUT' });
    } else {
      openPrivyModal();
    }
  };

  const text = isAuthenticated ? 'Logout' : 'Login / Signup';

  return <AuthButtonView text={text} isLoading={isLoading} onClick={handleClick} />;
};

export const AuthButton = () => {
  return (
    <WithQueryErrorBoundary queryKey={AUTH_QUERIES.all} fallback={AuthButtonFallback}>
      <AuthButtonInner />
    </WithQueryErrorBoundary>
  );
};
