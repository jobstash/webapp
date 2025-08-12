import 'server-only';

import * as z from 'zod';

import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from './schemas';

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
  techIssues: z.optional(z.nullable(z.number())),
});
export type AuditDto = z.infer<typeof auditDto>;

export const tagDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type TagDto = z.infer<typeof tagDto>;

export const orgInfoDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  orgId: nonEmptyStringSchema,
  summary: nonEmptyStringSchema,
  location: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  logoUrl: nullableStringSchema,
  headcountEstimate: nullableNumberSchema,
  createdTimestamp: nullableNumberSchema,
  updatedTimestamp: nullableNumberSchema,
  discord: nullableStringSchema,
  website: nullableStringSchema,
  telegram: nullableStringSchema,
  github: nullableStringSchema,
  docs: nullableStringSchema,
  twitter: nullableStringSchema,
  aliases: z.array(nonEmptyStringSchema),
  ecosystems: z.array(nonEmptyStringSchema),
});
export type OrgInfoDto = z.infer<typeof orgInfoDto>;

export const projectInfoDto = z.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,

  category: nullableStringSchema,
  isMainnet: z.optional(nullableBooleanSchema),
  tokenSymbol: nullableStringSchema,

  tvl: nullableNumberSchema,
  monthlyRevenue: nullableNumberSchema,
  monthlyVolume: nullableNumberSchema,
  monthlyFees: nullableNumberSchema,
  monthlyActiveUsers: nullableNumberSchema,

  chains: z.array(chainDto),
  hacks: z.array(hackDto),
  audits: z.array(auditDto),

  ecosystems: z.array(nonEmptyStringSchema),
  orgIds: z.array(nonEmptyStringSchema),
});
export type ProjectInfoDto = z.infer<typeof projectInfoDto>;

export const projectMoreInfoDto = z.object({
  description: nullableStringSchema,
  github: nullableStringSchema,
  twitter: nullableStringSchema,
  discord: nullableStringSchema,
  telegram: nullableStringSchema,
  docs: nullableStringSchema,

  defiLlamaId: nullableStringSchema,
  defiLlamaSlug: nullableStringSchema,
  defiLlamaParent: nullableStringSchema,
});
export type ProjectMoreInfoDto = z.infer<typeof projectMoreInfoDto>;

export const projectAllInfoDto = z.object({
  ...projectInfoDto.shape,
  ...projectMoreInfoDto.shape,
});
export type ProjectAllInfoDto = z.infer<typeof projectAllInfoDto>;
