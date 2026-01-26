import 'server-only';

import { z } from 'zod';

import {
  nonEmptyStringSchema,
  nullableStringSchema,
  nullableNumberSchema,
} from '@/lib/schemas';

export const investorDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type InvestorDto = z.infer<typeof investorDto>;

export const fundingRoundDto = z.object({
  id: nonEmptyStringSchema,
  date: z.number(),
  roundName: nullableStringSchema,
  raisedAmount: nullableNumberSchema,
});
export type FundingRoundDto = z.infer<typeof fundingRoundDto>;

export const categoryDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
});
export type CategoryDto = z.infer<typeof categoryDto>;

export const chainDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  logo: nullableStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type ChainDto = z.infer<typeof chainDto>;

export const hackDto = z.object({
  id: nonEmptyStringSchema,
  defiId: z.string(),
  category: nullableStringSchema,
  fundsLost: nullableNumberSchema,
  issueType: nullableStringSchema,
  date: nullableNumberSchema,
  fundsReturned: nullableNumberSchema,
});
export type HackDto = z.infer<typeof hackDto>;

export const auditDto = z.object({
  id: nonEmptyStringSchema,
  defiId: z.string(),
  name: nullableStringSchema,
  date: nullableNumberSchema,
  link: nullableStringSchema,
  techIssues: nullableNumberSchema.optional(),
});
export type AuditDto = z.infer<typeof auditDto>;

export const tagDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type TagDto = z.infer<typeof tagDto>;
