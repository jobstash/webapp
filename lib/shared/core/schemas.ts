import * as z from 'zod';

import { APP_STATUS_KIND } from '@/lib/shared/core/constants';

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

export const genericResponseSchema = z.object({
  success: z.boolean(),
  message: nonEmptyStringSchema,
});
export type GenericResponseSchema = z.infer<typeof genericResponseSchema>;

export const optionalDataResponseSchema = <T>(itemSchema: z.ZodSchema<T>) =>
  z.discriminatedUnion('success', [
    z.object({
      success: z.literal(false),
      message: nonEmptyStringSchema,
    }),
    z.object({
      success: z.literal(true),
      message: nonEmptyStringSchema,
      data: itemSchema,
    }),
  ]);
export type OptionalDataResponseSchema<T> = ReturnType<
  typeof optionalDataResponseSchema<T>
>;

export const checkAppStatusResponseSchema = optionalDataResponseSchema(
  z.object({
    kind: z.enum(APP_STATUS_KIND),
  }),
);
export type CheckAppStatusResponseSchema = z.infer<typeof checkAppStatusResponseSchema>;
