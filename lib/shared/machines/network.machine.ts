import { setup } from 'xstate';

import { checkNetworkActor } from '@/lib/shared/actors';

export const networkMachine = setup({
  actors: { checkNetworkActor },
}).createMachine({
  id: 'network',
  initial: 'checking',
  states: {
    checking: {
      invoke: {
        src: 'checkNetworkActor',
        onDone: { target: 'online' },
        onError: { target: 'offline' },
      },
    },
    online: { type: 'final' },
    offline: { type: 'final' },
  },
});
