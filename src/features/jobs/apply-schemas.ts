import { z } from 'zod';

import { APPLY_RESULT, APPLY_STATUS } from '@/features/jobs/apply-constants';

const missingItemSchema = z.enum(['resume', 'socials', 'linked_accounts']);

const statusWithApplyUrlSchema = z.object({ applyUrl: z.string().url() });

export const applyStatusResponseSchema = z.discriminatedUnion('status', [
  statusWithApplyUrlSchema.extend({
    status: z.literal(APPLY_STATUS.CAN_APPLY),
  }),
  statusWithApplyUrlSchema.extend({
    status: z.literal(APPLY_STATUS.ALREADY_APPLIED),
  }),
  z.object({
    status: z.literal(APPLY_STATUS.INELIGIBLE),
    missing: missingItemSchema.array(),
  }),
]);

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
