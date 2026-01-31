import { sendGAEvent } from '@next/third-parties/google';

import type { GaEventParams } from './constants';

export const trackEvent = <E extends keyof GaEventParams>(
  event: E,
  params: GaEventParams[E],
): void => {
  if (typeof window === 'undefined') return;
  sendGAEvent('event', event, params);
};
