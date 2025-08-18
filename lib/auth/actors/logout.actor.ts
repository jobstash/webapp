import type { QueryClient } from '@tanstack/react-query';
import { fromPromise } from 'xstate';

import { SHARED_QUERIES } from '@/lib/shared/core/query-keys';

import { logout } from '@/lib/auth/data';

interface Props {
  input: {
    privyLogout: () => Promise<void>;
    queryClient: QueryClient;
  };
}

export const logoutActor = fromPromise(async ({ input }: Props) => {
  try {
    await logout();
    await input.privyLogout();
    input.queryClient.clear();
    await input.queryClient.invalidateQueries({
      queryKey: SHARED_QUERIES.all,
    });
  } catch (error) {
    // TODO: add logs, sentry
    throw new Error(error instanceof Error ? error.message : 'Logout failed');
  }
});
