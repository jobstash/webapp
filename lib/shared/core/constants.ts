export const FULL_PAGE_OVERLAYS = {
  SEARCH: 'SEARCH',
  MENU: 'MENU',
  FILTERS: 'FILTERS',
} as const;

export const APP_STATUS_KIND = {
  MAINTENANCE: 'MAINTENANCE',
  UPDATE_NUDGE: 'UPDATE_NUDGE',
  FORCE_RELOAD: 'FORCE_RELOAD',
  FORCE_LOGOUT: 'FORCE_LOGOUT',
} as const;
export type AppStatusKind = (typeof APP_STATUS_KIND)[keyof typeof APP_STATUS_KIND];

export const APP_STATUS_MESSAGE = {
  [APP_STATUS_KIND.MAINTENANCE]:
    'We are currently performing maintenance on the app. Please check back later.',
  [APP_STATUS_KIND.UPDATE_NUDGE]: 'A new version of the app is available.',
  [APP_STATUS_KIND.FORCE_RELOAD]:
    'A new version of the app is available. Please reload to continue.',
  [APP_STATUS_KIND.FORCE_LOGOUT]: 'We have updated the app. Please log in again.',
} as const;
export type AppStatusMessage =
  (typeof APP_STATUS_MESSAGE)[keyof typeof APP_STATUS_MESSAGE];
