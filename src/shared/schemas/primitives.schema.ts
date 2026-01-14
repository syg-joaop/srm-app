import { z } from "zod";

// =============================================================================
// IDs
// =============================================================================

export const idSchema = z.number().int().positive();
export const uuidSchema = z.string().uuid();
export const optionalIdSchema = idSchema.optional();
export const flexibleIdSchema = z.coerce.number().int().positive();

// =============================================================================
// DATAS
// =============================================================================

export const dateTimeSchema = z.string().datetime();
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
export const timestampSchema = z.number().int().positive();
export const optionalDateTimeSchema = dateTimeSchema.optional();
export const flexibleDateSchema = z.coerce.date();

// =============================================================================
// TIPOS
// =============================================================================

export type Id = z.infer<typeof idSchema>;
export type Uuid = z.infer<typeof uuidSchema>;
export type OptionalId = z.infer<typeof optionalIdSchema>;
export type FlexibleId = z.infer<typeof flexibleIdSchema>;
export type DateTime = z.infer<typeof dateTimeSchema>;
export type DateString = z.infer<typeof dateSchema>;
export type Timestamp = z.infer<typeof timestampSchema>;
export type OptionalDateTime = z.infer<typeof optionalDateTimeSchema>;
export type FlexibleDate = z.infer<typeof flexibleDateSchema>;
