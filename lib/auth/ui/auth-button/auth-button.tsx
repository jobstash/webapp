import { useLogin as usePrivyLogin, usePrivy } from '@privy-io/react-auth';

import { LOADING_LOGOUT_STATES } from '@/lib/auth/core/constants';
import { AUTH_QUERIES } from '@/lib/auth/core/queries';

import { WithQueryErrorBoundary } from '@/lib/shared/ui/with-query-error-boundary';

import { AuthButtonFallback } from './auth-button.fallback';
import { AuthButtonView } from './auth-button.view';

import { useAuthActorRef, useAuthSelector } from '@/lib/auth/providers';

interface Props {
  profileButton: React.ReactNode;
}

const AuthButtonInner = ({ profileButton }: Props) => {
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

  if (isAuthenticated && isAuthenticatedPrivy) {
    return <>{profileButton}</>;
  }

  const handleClick = () => {
    // Impossible state, but handle it just in case
    if (isAuthenticated) return;
    if (isAuthenticatedPrivy) {
      authActorRef.send({ type: 'LOGIN', redirectTo: '/profile' });
    } else {
      openPrivyModal();
    }
  };

  const isLoading = isLoadingLogout || !isReadyPrivy;
  const isInterruptedLogin = isAuthenticatedPrivy && !isAuthenticated;
  const text = isInterruptedLogin ? 'Continue Login' : 'Login / Signup';

  return <AuthButtonView text={text} isLoading={isLoading} onClick={handleClick} />;
};

export const AuthButton = ({ profileButton }: Props) => {
  return (
    <WithQueryErrorBoundary queryKey={AUTH_QUERIES.all} fallback={AuthButtonFallback}>
      <AuthButtonInner profileButton={profileButton} />
    </WithQueryErrorBoundary>
  );
};
