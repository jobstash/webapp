import { assign, PromiseActorLogic, setup } from 'xstate';

import { PERMISSIONS } from '@/lib/shared/core/constants';
import type { UserSchema } from '@/lib/auth/core/schemas';

interface AuthMachineContext {
  privyToken: string | null;
  isLoggedIn: boolean;
}

type AuthMachineEvents =
  | {
      type: 'LOGIN';
    }
  | {
      type: 'LOGOUT';
    };

export const authMachine = setup({
  types: {
    context: {} as AuthMachineContext,
    events: {} as AuthMachineEvents,
  },
  actors: {
    getUser: {} as PromiseActorLogic<UserSchema | null>,
    getPrivyToken: {} as PromiseActorLogic<string>,
    logoutPrivy: {} as PromiseActorLogic<void>,
    logoutSession: {} as PromiseActorLogic<void>,
    syncSession: {} as PromiseActorLogic<void, { privyToken: string }>,
    navigate: {} as PromiseActorLogic<void, { path: string }>,
  },
  actions: {
    clearContext: assign({ privyToken: null }),
  },
  delays: {
    redirectDelay: 200,
  },
}).createMachine({
  id: 'auth',
  context: {
    privyToken: null,
    isLoggedIn: false,
  },
  initial: 'gettingUser',
  states: {
    gettingUser: {
      invoke: {
        src: 'getUser',
        onDone: [
          {
            target: 'authenticated',
            guard: ({ event }) =>
              !!event.output && event.output.permissions.includes(PERMISSIONS.USER),
            actions: assign({ isLoggedIn: true }),
          },
          {
            target: 'loggingOutPrivy',
          },
        ],
        onError: {
          target: 'loggingOutPrivy',
          actions: ({ event }) => console.log('getting user error', event.error),
          // TODO: add logs, sentry
        },
      },
    },
    loggingOutPrivy: {
      invoke: {
        src: 'logoutPrivy',
        onDone: [{ target: 'loggingOutSession' }],
        onError: {
          target: 'loggingOutSession',
          // TODO: add logs, sentry
        },
      },
    },
    loggingOutSession: {
      invoke: {
        src: 'logoutSession',
        onDone: { target: 'unauthenticated' },
        onError: {
          target: 'unauthenticated',
          // TODO: add logs, sentry
        },
      },
    },
    gettingPrivyToken: {
      invoke: {
        src: 'getPrivyToken',
        onDone: {
          target: 'syncingSession',
          guard: ({ event }) => !!event.output,
          actions: assign({ privyToken: ({ event }) => event.output }),
        },
        onError: {
          target: 'unauthenticated',
          // TODO: add logs, sentry
        },
      },
    },
    syncingSession: {
      invoke: {
        src: 'syncSession',
        input: ({ context }) => ({
          privyToken: context.privyToken!,
        }),
        onDone: {
          target: 'gettingUser',
        },
        onError: {
          target: 'loggingOutPrivy',
          // TODO: add logs, sentry
        },
      },
    },
    unauthenticated: {
      entry: ['clearContext'],
      on: {
        LOGIN: 'gettingPrivyToken',
      },
    },
    authenticated: {
      on: {
        LOGOUT: 'loggingOutPrivy',
      },
    },
  },
});
