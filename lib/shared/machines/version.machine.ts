import { setup } from 'xstate';

import { VersionDataSchema } from '@/lib/shared/core/schemas';

import { checkVersionActor } from '@/lib/shared/actors';

export const versionMachine = setup({
  actors: { checkVersionActor },
  types: {
    output: {} as VersionDataSchema,
    events: {} as {
      type: 'xstate.done.actor.checkVersionActor';
      output: VersionDataSchema;
    },
  },
  guards: {
    isMaintenance: ({ event }) => event.output.clientAction === 'MAINTENANCE',
    isForceReload: ({ event }) => event.output.clientAction === 'FORCE_RELOAD',
    isForceLogout: ({ event }) => event.output.clientAction === 'FORCE_LOGOUT',
    isNudge: ({ event }) => event.output.clientAction === 'UPDATE_NUDGE',
    isUpToDate: ({ event }) => event.output.clientAction === 'NO_OP',
  },
}).createMachine({
  id: 'version',
  initial: 'checking',
  states: {
    checking: {
      invoke: {
        src: 'checkVersionActor',
        onDone: [
          { target: 'maintenance', guard: 'isMaintenance' },
          { target: 'forceReload', guard: 'isForceReload' },
          { target: 'forceLogout', guard: 'isForceLogout' },
          { target: 'nudge', guard: 'isNudge' },
          { target: 'upToDate', guard: 'isUpToDate' },
        ],
        onError: 'error',
      },
    },
    maintenance: { type: 'final' },
    forceReload: { type: 'final' },
    forceLogout: { type: 'final' },
    nudge: { type: 'final' },
    upToDate: { type: 'final' },
    error: { type: 'final' },
  },
});
