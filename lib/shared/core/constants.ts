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
export type VersionClientAction =
  (typeof VERSION_CLIENT_ACTION)[keyof typeof VERSION_CLIENT_ACTION];

export const PERMISSIONS = {
  USER: 'USER',
  ORG_OWNER: 'ORG_OWNER',
  ORG_MEMBER: 'ORG_MEMBER',
  ECOSYSTEM_MANAGER: 'ECOSYSTEM_MANAGER',
  // Data compatibility
  ADMIN: 'ADMIN',
  SUPER_ADMIN: 'SUPER_ADMIN',
  PROJECT_MANAGER: 'PROJECT_MANAGER',
} as const;
