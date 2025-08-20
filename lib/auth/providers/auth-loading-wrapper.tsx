import { usePrivy } from '@privy-io/react-auth';
import { useDebounce } from 'ahooks';

import { useAuthSelector } from './auth-machine.provider';

import { LoadingPage } from '@/lib/shared/pages';

const LOADING_STATES = [
  'gettingUser',
  'gettingPrivyToken',
  'syncingSession',
  'loggingOutPrivy',
  'loggingOutSession',
  'redirecting',
  'waitingRedirect',
] as const;

export const AuthLoadingWrapper = ({ children }: React.PropsWithChildren) => {
  const { ready } = usePrivy();
  const isLoadingMachine = useAuthSelector((snapshot) => {
    return !ready || LOADING_STATES.some((state) => snapshot.matches(state));
  });

  const isLoading = useDebounce(isLoadingMachine, { wait: 300, leading: true });

  if (isLoading) return <LoadingPage />;
  return <>{children}</>;
};
