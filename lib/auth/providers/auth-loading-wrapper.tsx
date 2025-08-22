import { useDebounce } from 'ahooks';

import { useAuthSelector } from './auth-machine.provider';

import { LoadingPage } from '@/lib/shared/pages/loading.page';

const LOADING_STATES = [
  'gettingUser',
  'gettingPrivyToken',
  'syncingSession',
  'loggingOutPrivy',
  'loggingOutSession',
] as const;

interface Props {
  isReadyPrivy: boolean;
}

export const AuthLoadingWrapper = ({
  children,
  isReadyPrivy,
}: React.PropsWithChildren<Props>) => {
  const isLoadingMachine = useAuthSelector((snapshot) => {
    return !isReadyPrivy || LOADING_STATES.some((state) => snapshot.matches(state));
  });

  const isLoading = useDebounce(isLoadingMachine, { wait: 300, leading: true });

  if (isLoading) return <LoadingPage />;
  return <>{children}</>;
};
