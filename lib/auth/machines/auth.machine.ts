import { QueryClient } from '@tanstack/react-query';
import { assign, setup } from 'xstate';

import { PERMISSIONS } from '@/lib/shared/core/constants';
import { UserSchema } from '@/lib/auth/core/schemas';

import {
  getPrivyTokenActor,
  getUserActor,
  logoutActor,
  syncSessionActor,
} from '@/lib/auth/actors';

interface LoginMachineContext {
  user: UserSchema | null;
  queryClient: QueryClient;
  privyToken: string | null;
  privyLogout: () => Promise<void>;
}

interface LoginMachineInput {
  queryClient: QueryClient;
  privyLogout: () => Promise<void>;
}

export const authMachine = setup({
  types: {
    context: {} as LoginMachineContext,
    input: {} as LoginMachineInput,
  },
  actors: {
    getPrivyTokenActor,
    getUserActor,
    syncSessionActor,
    logoutActor,
  },
}).createMachine({
  id: 'login',
  initial: 'gettingUser',
  context: ({ input }) => ({
    user: null,
    queryClient: input.queryClient,
    privyToken: null,
    privyLogout: input.privyLogout,
  }),
  states: {
    gettingUser: {
      invoke: {
        src: 'getUserActor',
        input: ({ context }) => ({ queryClient: context.queryClient }),
        onDone: {
          guard: ({ event }) =>
            !!event.output && event.output.permissions.includes(PERMISSIONS.USER),
          actions: assign({ user: ({ event }) => event.output }),
          target: 'authenticated',
        },
        onError: 'unauthenticated',
      },
    },
    unauthenticated: {
      on: {
        LOGIN: 'gettingPrivyToken',
      },
    },
    gettingPrivyToken: {
      invoke: {
        src: 'getPrivyTokenActor',
        onDone: {
          actions: assign({ privyToken: ({ event }) => event.output }),
          guard: ({ context }) => context.privyToken !== null,
          target: 'syncingSession',
        },
        onError: 'unauthenticated',
      },
    },
    syncingSession: {
      invoke: {
        src: 'syncSessionActor',
        input: ({ context }) => ({
          queryClient: context.queryClient,
          privyToken: context.privyToken!,
        }),
        onDone: 'gettingUser',
        onError: 'unauthenticated',
      },
    },
    authenticated: {
      on: {
        LOGOUT: {
          target: 'loggingOut',
        },
      },
    },
    loggingOut: {
      invoke: {
        src: 'logoutActor',
        input: ({ context }) => ({
          queryClient: context.queryClient,
          privyLogout: context.privyLogout,
        }),
        onDone: {
          target: 'unauthenticated',
          actions: assign({
            user: null,
            privyToken: null,
          }),
        },
      },
    },
  },
});
