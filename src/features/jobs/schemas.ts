import { z } from 'zod';

import {
  mappedInfoTagSchema,
  nonEmptyStringSchema,
  nullableStringSchema,
} from '@/lib/schemas';
import { JOB_ITEM_BADGE } from '@/features/jobs/constants';

export const jobTagSchema = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  colorIndex: z.number().min(1).max(12),
});
export type JobTagSchema = z.infer<typeof jobTagSchema>;

export const jobFundingRoundSchema = z.object({
  roundName: nonEmptyStringSchema,
  amount: nullableStringSchema,
  date: nullableStringSchema,
  href: nonEmptyStringSchema,
});
export type JobFundingRoundSchema = z.infer<typeof jobFundingRoundSchema>;

export const jobInvestorSchema = z.object({
  name: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
});
export type JobInvestorSchema = z.infer<typeof jobInvestorSchema>;

export const jobOrganizationSchema = z.object({
  name: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
  websiteUrl: nullableStringSchema,
  location: nullableStringSchema,
  logo: nullableStringSchema,
  employeeCount: nullableStringSchema,
  fundingRounds: jobFundingRoundSchema.array(),
  investors: jobInvestorSchema.array(),
});
export type JobOrganizationSchema = z.infer<typeof jobOrganizationSchema>;

export const jobListItemSchema = z.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  href: nonEmptyStringSchema,
  applyUrl: nullableStringSchema,
  summary: nullableStringSchema,
  infoTags: mappedInfoTagSchema.array(),
  tags: jobTagSchema.array(),
  organization: jobOrganizationSchema.nullable(),
  timestampText: nonEmptyStringSchema,
  badge: z.nullable(
    z.enum(Object.values(JOB_ITEM_BADGE) as [string, ...string[]]),
  ),
});
export type JobListItemSchema = z.infer<typeof jobListItemSchema>;

export const jobListPageSchema = z.object({
  page: z.number(),
  total: z.number(),
  data: jobListItemSchema.array(),
});
export type JobListPageSchema = z.infer<typeof jobListPageSchema>;
