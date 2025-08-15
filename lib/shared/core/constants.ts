export const FULL_PAGE_OVERLAYS = {
  SEARCH: 'SEARCH',
  MENU: 'MENU',
  FILTERS: 'FILTERS',
} as const;

export const LS_KEYS = {
  CURRENT_VERSION: 'currentVersion',
} as const;
export type LsKeys = (typeof LS_KEYS)[keyof typeof LS_KEYS];

export const VERSION_CLIENT_ACTION = {
  NO_OP: 'NO_OP',
  MAINTENANCE: 'MAINTENANCE',
  UPDATE_NUDGE: 'UPDATE_NUDGE',
  FORCE_RELOAD: 'FORCE_RELOAD',
  FORCE_LOGOUT: 'FORCE_LOGOUT',
} as const;
export type AppStatusKind =
  (typeof VERSION_CLIENT_ACTION)[keyof typeof VERSION_CLIENT_ACTION];

export const VERSION_CLIENT_ACTION_MESSAGE = {
  [VERSION_CLIENT_ACTION.NO_OP]: 'No version change',
  [VERSION_CLIENT_ACTION.MAINTENANCE]:
    'We are currently performing maintenance on the app. Please check back later.',
  [VERSION_CLIENT_ACTION.UPDATE_NUDGE]: 'A new version of the app is available.',
  [VERSION_CLIENT_ACTION.FORCE_RELOAD]:
    'A new version of the app is available. Please reload to continue.',
  [VERSION_CLIENT_ACTION.FORCE_LOGOUT]: 'We have updated the app. Please log in again.',
} as const;
export type AppStatusMessage =
  (typeof VERSION_CLIENT_ACTION_MESSAGE)[keyof typeof VERSION_CLIENT_ACTION_MESSAGE];
