import { createMachine } from 'xstate';

import { checkNetworkActor } from '@/lib/shared/actors';

export const networkMachine = createMachine({
  id: 'network',
  initial: 'checking',
  states: {
    checking: {
      invoke: {
        src: checkNetworkActor,
        onDone: 'online',
        onError: 'offline',
      },
    },
    online: { type: 'final' },
    offline: { type: 'final' },
  },
});
