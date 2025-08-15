'use client';
import { useMachine } from '@xstate/react';

import { entrypointMachine } from '@/lib/shared/machines';

export const EntrypointPage = ({ children }: React.PropsWithChildren) => {
  const [state] = useMachine(entrypointMachine);

  if (state.matches('checkingNetwork') || state.matches('checkingVersion')) {
    return <p>TODO: Loading Page</p>;
  }

  if (state.matches('offline')) {
    return <p>TODO: Offline Page</p>;
  }

  if (state.matches('maintenance')) {
    return <p>TODO: Maintenance Page</p>;
  }

  if (state.matches('forceReload')) {
    return <p>TODO: Force Reload Page</p>;
  }

  if (state.matches('forceLogout')) {
    return <p>TODO: Force Logout Page</p>;
  }

  if (state.matches('updateNudge')) {
    return <p>TODO: Update Nudge Page</p>;
  }

  if (state.matches('error')) {
    return <p>TODO: Error Page</p>;
  }

  if (state.matches('ready')) {
    return (
      <>
        {state.context.showUpdateNudge && <p>TODO: Update Nudge Page</p>}
        {children}
      </>
    );
  }

  return <p>TODO: Unknown State</p>;
};
