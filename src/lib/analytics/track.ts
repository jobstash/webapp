import type { GaEventParams } from './constants';

export const trackEvent = <E extends keyof GaEventParams>(
  event: E,
  params: GaEventParams[E],
): void => {
  if (typeof window === 'undefined') return;
  window.dataLayer?.push({ event, ...params });
};
