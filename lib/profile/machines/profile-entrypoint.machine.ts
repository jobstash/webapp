import { assign, PromiseActorLogic, setup } from 'xstate';

import { ProfileCheckResultSchema } from '@/lib/profile/core/schemas';

interface ProfileEntrypointMachineContext {
  showCvUpload: boolean;
  showRequiredInfo: boolean;
  uploadErrorMessage: string | null;
  requiredInfoErrorMessage: string | null;
}

type ProfileEntrypointMachineEvents =
  | {
      type: 'SKIP_UPLOAD';
    }
  | {
      type: 'UPLOAD';
    }
  | {
      type: 'SUBMIT';
    }
  | {
      type: 'RETRY';
    };

export const profileEntrypointMachine = setup({
  types: {
    context: {} as ProfileEntrypointMachineContext,
    events: {} as ProfileEntrypointMachineEvents,
  },
  actors: {
    checkProfileEntry: {} as PromiseActorLogic<ProfileCheckResultSchema>,
    processCV: {} as PromiseActorLogic<ProfileCheckResultSchema>,
    processRequiredInfo: {} as PromiseActorLogic<void>,
  },
  actions: {
    updateContext: assign(
      ({ context }, params: Partial<ProfileEntrypointMachineContext>) => ({
        ...context,
        ...params,
      }),
    ),
  },
}).createMachine({
  id: 'profileEntrypoint',
  context: {
    showCvUpload: false,
    showRequiredInfo: false,
    uploadErrorMessage: null,
    requiredInfoErrorMessage: null,
  },
  initial: 'checkingProfile',
  states: {
    checkingProfile: {
      invoke: {
        src: 'checkProfileEntry',
        onDone: {
          target: 'decideNextStep',
          actions: {
            type: 'updateContext',
            params: ({ event }) => ({
              showCvUpload: event.output.showCvUpload,
              showRequiredInfo: event.output.showRequiredInfo,
            }),
          },
        },
        onError: {
          target: 'errorScreen',
          // TODO: add logs, sentry
        },
      },
    },
    decideNextStep: {
      always: [
        { target: 'uploadScreen', guard: ({ context }) => context.showCvUpload },
        {
          target: 'requiredInfoScreen',
          guard: ({ context }) => context.showRequiredInfo,
        },
        { target: 'ready' },
      ],
    },
    uploadScreen: {
      on: {
        SKIP_UPLOAD: {
          target: 'decideNextStep',
          actions: {
            type: 'updateContext',
            params: () => ({
              showCvUpload: false,
              showRequiredInfo: true,
            }),
          },
        },
        UPLOAD: 'processingCV',
      },
    },
    processingCV: {
      invoke: {
        src: 'processCV',
        onDone: {
          target: 'decideNextStep',
          actions: {
            type: 'updateContext',
            params: ({ event }) => ({
              uploadErrorMessage: null,
              showCvUpload: false,
              showRequiredInfo: event.output.showRequiredInfo,
            }),
          },
        },
        onError: {
          target: 'uploadScreen',
          actions: {
            type: 'updateContext',
            params: ({ event }) => ({
              uploadErrorMessage: event.error as string,
            }),
            // TODO: add logs, sentry
          },
        },
      },
    },
    requiredInfoScreen: {
      on: {
        SUBMIT: 'processingRequiredInfo',
      },
    },
    processingRequiredInfo: {
      invoke: {
        src: 'processRequiredInfo',
        onDone: {
          target: 'decideNextStep',
          actions: {
            type: 'updateContext',
            params: () => ({
              showRequiredInfo: false,
              requiredInfoErrorMessage: null,
            }),
          },
        },
        onError: {
          target: 'uploadScreen',
          actions: {
            type: 'updateContext',
            params: ({ event }) => ({
              requiredInfoErrorMessage: event.error as string,
            }),
            // TODO: add logs, sentry
          },
        },
      },
    },
    errorScreen: {
      on: {
        RETRY: 'checkingProfile',
      },
    },
    ready: {},
  },
});
