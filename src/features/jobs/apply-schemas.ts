import { z } from 'zod';

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

const missingItemSchema = z.enum(['resume', 'socials', 'linked_accounts']);
export type MissingItem = z.infer<typeof missingItemSchema>;

export const applyStatusResponseSchema = z.discriminatedUnion('status', [
  z.object({
    status: z.literal(APPLY_STATUS.CAN_APPLY),
    applyUrl: z.string().url(),
  }),
  z.object({ status: z.literal(APPLY_STATUS.ALREADY_APPLIED) }),
  z.object({
    status: z.literal(APPLY_STATUS.INELIGIBLE),
    missing: missingItemSchema.array(),
  }),
]);
export type ApplyStatusResponse = z.infer<typeof applyStatusResponseSchema>;

export const applyRequestSchema = z.object({
  shortUUID: z.string().min(1),
});

export const applyResponseSchema = z.discriminatedUnion('status', [
  z.object({ status: z.literal(APPLY_RESULT.APPLIED) }),
  z.object({
    status: z.literal(APPLY_RESULT.ELIGIBLE),
    applyUrl: z.string().url(),
  }),
  z.object({ status: z.literal(APPLY_RESULT.ALREADY_APPLIED) }),
  z.object({
    status: z.literal(APPLY_RESULT.INELIGIBLE),
    missing: missingItemSchema.array(),
  }),
  z.object({ status: z.literal(APPLY_RESULT.NOT_FOUND) }),
  z.object({ status: z.literal(APPLY_RESULT.ERROR) }),
]);
export type ApplyResponse = z.infer<typeof applyResponseSchema>;
