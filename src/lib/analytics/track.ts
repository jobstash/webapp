import type { GaEventParams } from './constants';

export const trackEvent = <E extends keyof GaEventParams>(
  event: E,
  params: GaEventParams[E],
): void => {
  if (typeof window === 'undefined') return;

  // Never drop events fired before gtag.js loads: install the standard
  // stub that queues into dataLayer — gtag.js replays the queue on load.
  // (The previous `window.gtag?.()` silently discarded early clicks.)
  if (!window.gtag) {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
      // gtag.js requires the Arguments object itself, not an array
      // eslint-disable-next-line prefer-rest-params
      window.dataLayer?.push(arguments);
    };
  }

  window.gtag('event', event, params);
};
