import { useLogin as usePrivyLogin, usePrivy } from '@privy-io/react-auth';

import { AUTH_QUERIES } from '@/lib/auth/core/queries';

import { WithQueryErrorBoundary } from '@/lib/shared/ui/with-query-error-boundary';

import { AuthButtonFallback } from './auth-button.fallback';
import { AuthButtonView } from './auth-button.view';

import { useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';

const LOADING_LOGOUT_STATES = ['loggingOutPrivy', 'loggingOutSession'] as const;

const AuthButtonInner = () => {
  const authActorRef = useAuthActorRef();
  const { isAuthenticated, isLoadingLogout } = useAuthSelector((snapshot) => {
    return {
      isAuthenticated: snapshot.matches('authenticated'),
      isLoadingLogout: LOADING_LOGOUT_STATES.some((state) => snapshot.matches(state)),
    };
  });

  const { login: openPrivyModal } = usePrivyLogin({
    onComplete: ({ wasAlreadyAuthenticated }) => {
      const redirectTo = wasAlreadyAuthenticated ? undefined : '/profile';
      authActorRef.send({ type: 'LOGIN', redirectTo });
    },
  });

  const { authenticated: isAuthenticatedPrivy, ready: isReadyPrivy } = usePrivy();

  const handleClick = () => {
    if (isAuthenticated) {
      authActorRef.send({ type: 'LOGOUT' });
    } else if (isAuthenticatedPrivy) {
      authActorRef.send({ type: 'LOGIN', redirectTo: '/profile' });
    } else {
      openPrivyModal();
    }
  };

  const isLoading = isLoadingLogout || !isReadyPrivy;
  const isInterruptedLogin = isAuthenticatedPrivy && !isAuthenticated;
  const text = isAuthenticated
    ? 'Logout'
    : isInterruptedLogin
      ? 'Continue Login'
      : 'Login / Signup';

  return <AuthButtonView text={text} isLoading={isLoading} onClick={handleClick} />;
};

export const AuthButton = () => {
  return (
    <WithQueryErrorBoundary queryKey={AUTH_QUERIES.all} fallback={AuthButtonFallback}>
      <AuthButtonInner />
    </WithQueryErrorBoundary>
  );
};
