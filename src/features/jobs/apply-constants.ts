export const APPLY_STATUS = {
  CAN_APPLY: 'can_apply',
  ALREADY_APPLIED: 'already_applied',
  INELIGIBLE: 'ineligible',
} as const;

export const APPLY_RESULT = {
  APPLIED: 'applied',
  ELIGIBLE: 'eligible',
  ALREADY_APPLIED: 'already_applied',
  INELIGIBLE: 'ineligible',
  NOT_FOUND: 'not_found',
  ERROR: 'error',
} as const;

export type MissingItem = 'resume' | 'socials' | 'linked_accounts';

interface StatusWithApplyUrl {
  applyUrl: string;
}

export type ApplyStatusResponse =
  | (StatusWithApplyUrl & { status: typeof APPLY_STATUS.CAN_APPLY })
  | (StatusWithApplyUrl & { status: typeof APPLY_STATUS.ALREADY_APPLIED })
  | { status: typeof APPLY_STATUS.INELIGIBLE; missing: MissingItem[] };

export type ApplyResponse =
  | { status: typeof APPLY_RESULT.APPLIED }
  | { status: typeof APPLY_RESULT.ELIGIBLE; applyUrl: string }
  | { status: typeof APPLY_RESULT.ALREADY_APPLIED }
  | { status: typeof APPLY_RESULT.INELIGIBLE; missing: MissingItem[] }
  | { status: typeof APPLY_RESULT.NOT_FOUND }
  | { status: typeof APPLY_RESULT.ERROR };
