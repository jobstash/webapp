import * as v from 'valibot'
import { nonEmptyStringSchema, nullableBooleanSchema, nullableNumberSchema, nullableStringSchema, tagSchema } from '~/lib/shared/core/schemas'

export const jobInfoTagsSchema = v.object({
  seniority: nullableStringSchema,
  minimumSalary: nullableNumberSchema,
  maximumSalary: nullableNumberSchema,
  salary: nullableNumberSchema,
  location: nullableStringSchema,
  locationType: nullableStringSchema,
  commitment: nullableStringSchema,
  paysInCrypto: nullableBooleanSchema,
  offersTokenAllocation: nullableBooleanSchema,
  salaryCurrency: nullableStringSchema,
  classification: nullableStringSchema,
})
export type JobInfoTagsSchema = v.InferOutput<typeof jobInfoTagsSchema>

const jobListItemProjectSchema = v.object({
  name: nonEmptyStringSchema,
  logo: nullableStringSchema,
  chains: v.array(nonEmptyStringSchema), // Chain logos
  infoTags: v.array(tagSchema),
  tvlTags: v.array(tagSchema),
  auditTags: v.array(tagSchema),
})

export const jobListItemSchema = v.object({
  id: nonEmptyStringSchema,
  title: nonEmptyStringSchema,
  url: nullableStringSchema,
  shortUUID: nonEmptyStringSchema,
  timestamp: v.number(),
  access: v.picklist(['public', 'protected']),
  infoTags: jobInfoTagsSchema,
  tags: v.array(tagSchema),
  promotion: v.object({
    isFeatured: v.boolean(),
    startDate: nullableNumberSchema,
    endDate: nullableNumberSchema,
  }),
  organization: v.nullable(v.object({
    name: nonEmptyStringSchema,
    logo: nullableStringSchema,
    projects: v.array(jobListItemProjectSchema),
    funding: v.object({
      date: nullableStringSchema,
      lastAmount: nullableStringSchema,
    }),
  })),
  project: v.nullable(jobListItemProjectSchema),
})

export type JobListItemSchema = v.InferOutput<typeof jobListItemSchema>
