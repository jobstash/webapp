import 'server-only';

import * as v from 'valibot';
import {
  nonEmptyStringSchema,
  nullableBooleanSchema,
  nullableNumberSchema,
  nullableStringSchema,
} from './schemas';

export const investorDto = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type InvestorDto = v.InferOutput<typeof investorDto>;

export const fundingRoundDto = v.object({
  id: nonEmptyStringSchema,
  date: v.number(),
  roundName: nullableStringSchema,
  raisedAmount: nullableNumberSchema,
});
export type FundingRoundDto = v.InferOutput<typeof fundingRoundDto>;

export const categoryDto = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
});
export type CategoryDto = v.InferOutput<typeof categoryDto>;

export const chainDto = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  logo: nullableStringSchema,
  normalizedName: nonEmptyStringSchema,
});
export type ChainDto = v.InferOutput<typeof chainDto>;

export const hackDto = v.object({
  id: nonEmptyStringSchema,
  defiId: v.string(),
  category: nullableStringSchema,
  fundsLost: nullableNumberSchema,
  issueType: nullableStringSchema,
  date: nullableNumberSchema,
  fundsReturned: nullableNumberSchema,
});
export type HackDto = v.InferOutput<typeof hackDto>;

export const auditDto = v.object({
  id: nonEmptyStringSchema,
  defiId: v.string(),
  name: nullableStringSchema,
  date: nullableNumberSchema,
  link: nullableStringSchema,
  techIssues: v.optional(v.nullable(v.number())),
});
export type AuditDto = v.InferOutput<typeof auditDto>;

export const orgInfoDto = v.object({
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
  aliases: v.array(nonEmptyStringSchema),
  community: v.array(nonEmptyStringSchema),
  ecosystems: v.array(nonEmptyStringSchema),
});
export type OrgInfoDto = v.InferOutput<typeof orgInfoDto>;

export const projectInfoDto = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
  website: nullableStringSchema,
  logo: nullableStringSchema,

  category: nullableStringSchema,
  isMainnet: v.optional(nullableBooleanSchema),
  tokenSymbol: nullableStringSchema,

  tvl: nullableNumberSchema,
  monthlyRevenue: nullableNumberSchema,
  monthlyVolume: nullableNumberSchema,
  monthlyFees: nullableNumberSchema,
  monthlyActiveUsers: nullableNumberSchema,

  chains: v.array(chainDto),
  hacks: v.array(hackDto),
  audits: v.array(auditDto),

  ecosystems: v.array(nonEmptyStringSchema),
  orgIds: v.array(nonEmptyStringSchema),
});
export type ProjectInfoDto = v.InferOutput<typeof projectInfoDto>;

export const projectMoreInfoDto = v.object({
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
export type ProjectMoreInfoDto = v.InferOutput<typeof projectMoreInfoDto>;

export const projectAllInfoDto = v.object({
  ...projectInfoDto.entries,
  ...projectMoreInfoDto.entries,
});
export type ProjectAllInfoDto = v.InferOutput<typeof projectAllInfoDto>;
