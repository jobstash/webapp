import { QueryClient } from '@tanstack/react-query';
import { assign, setup } from 'xstate';

import { PermissionsSchema } from '@/lib/shared/core/schemas';
import { UserSchema } from '@/lib/auth/core/schemas';

import {
  getPrivyTokenActor,
  getUserActor,
  getUserCredentialsActor,
  logoutActor,
} from '@/lib/auth/actors';

interface LoginMachineContext {
  user: UserSchema | null;
  queryClient: QueryClient;
  privyToken: string | null;
  token: string | null;
  permissions: PermissionsSchema | null;
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
  actors: { getPrivyTokenActor, getUserActor, getUserCredentialsActor, logoutActor },
}).createMachine({
  id: 'login',
  initial: 'checkingUser',
  context: ({ input }) => ({
    user: null,
    queryClient: input.queryClient,
    privyToken: null,
    token: null,
    permissions: null,
    privyLogout: input.privyLogout,
  }),
  states: {
    checkingUser: {
      invoke: {
        src: 'getUserActor',
        input: ({ context }) => ({ queryClient: context.queryClient }),
        onDone: 'authenticated',
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
          target: 'gettingUserCredentials',
        },
        onError: 'unauthenticated',
      },
    },
    gettingUserCredentials: {
      invoke: {
        src: 'getUserCredentialsActor',
        input: ({ context }) => ({
          queryClient: context.queryClient,
          privyToken: context.privyToken!,
        }),
        onDone: {
          target: 'authenticated',
          actions: assign({
            token: ({ event }) => event.output.token,
            permissions: ({ event }) => event.output.permissions,
          }),
        },
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
            token: null,
            permissions: [],
          }),
        },
      },
    },
  },
});
