import { assign, setup } from 'xstate';

import { VERSION_CLIENT_ACTION } from '@/lib/shared/core/constants';

import { checkNetworkActor, checkVersionActor } from '@/lib/shared/actors';

interface EntrypointMachineContext {
  showUpdateNudge: boolean;
}

export const entrypointMachine = setup({
  types: {
    context: {} as EntrypointMachineContext,
  },
  actors: {
    checkNetworkActor,
    checkVersionActor,
  },
}).createMachine({
  id: 'entrypoint',
  context: {
    showUpdateNudge: false,
  },
  initial: 'checkingNetwork',
  states: {
    checkingNetwork: {
      invoke: {
        src: 'checkNetworkActor',
        onDone: 'checkingVersion',
        onError: 'offline',
      },
    },
    checkingVersion: {
      invoke: {
        src: 'checkVersionActor',
        onDone: [
          {
            target: 'maintenance',
            guard: ({ event }) =>
              event.output.clientAction === VERSION_CLIENT_ACTION.MAINTENANCE,
          },
          {
            target: 'updateNudge',
            guard: ({ event }) =>
              event.output.clientAction === VERSION_CLIENT_ACTION.UPDATE_NUDGE,
            actions: assign({
              showUpdateNudge: true,
            }),
          },
          {
            target: 'forceReload',
            guard: ({ event }) =>
              event.output.clientAction === VERSION_CLIENT_ACTION.FORCE_RELOAD,
          },
          {
            target: 'forceLogout',
            guard: ({ event }) =>
              event.output.clientAction === VERSION_CLIENT_ACTION.FORCE_LOGOUT,
          },
          {
            target: 'ready',
            guard: ({ event }) =>
              event.output.clientAction === VERSION_CLIENT_ACTION.NO_OP,
          },
          {
            target: 'error',
          },
        ],
        onError: 'error',
      },
    },
    offline: { type: 'final' },
    maintenance: { type: 'final' },
    forceReload: { type: 'final' },
    forceLogout: { type: 'final' },
    updateNudge: { type: 'final' },
    ready: { type: 'final' },
    error: { type: 'final' },
  },
});
