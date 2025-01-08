import * as v from 'valibot'

export const nonEmptyStringSchema = v.pipe(v.string(), v.nonEmpty())
export const nullableStringSchema = v.nullable(nonEmptyStringSchema)
export const nullableNumberSchema = v.nullable(v.number())
export const nullableBooleanSchema = v.nullable(v.boolean())

export const tagSchema = v.object({
  id: nonEmptyStringSchema,
  name: nonEmptyStringSchema,
  normalizedName: nonEmptyStringSchema,
})
export type TagSchema = v.InferOutput<typeof tagSchema>
