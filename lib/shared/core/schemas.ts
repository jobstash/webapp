import * as z from 'zod';

export const nonEmptyStringSchema = z.string().min(1);
export const nullableStringSchema = z.nullable(nonEmptyStringSchema);
export const optionalStringSchema = z.optional(nonEmptyStringSchema);
export const nullableNumberSchema = z.nullable(z.number());
export const nullableBooleanSchema = z.nullable(z.boolean());

export const mappedInfoTagSchema = z.object({
  iconKey: nonEmptyStringSchema,
  label: nonEmptyStringSchema,
  href: optionalStringSchema,
});
export type MappedInfoTagSchema = z.infer<typeof mappedInfoTagSchema>;

export const infiniteListPageSchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.object({
    page: z.number(),
    total: z.number(),
    data: z.array(itemSchema),
    hasNextPage: z.boolean(),
  });
export type InfiniteListPageSchema<T> = ReturnType<typeof infiniteListPageSchema<T>>;
