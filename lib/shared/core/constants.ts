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
