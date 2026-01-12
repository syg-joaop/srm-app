import { z } from "zod";

/**
 * Schema para datas em formato ISO 8601
 */
export const dateTimeSchema = z.string().datetime();

/**
 * Schema para datas em formato YYYY-MM-DD
 */
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/**
 * Schema para timestamps Unix (segundos)
 */
export const timestampSchema = z.number().int().positive();

/**
 * Schema para datas opcionais
 */
export const optionalDateTimeSchema = dateTimeSchema.optional();

/**
 * Schema para datas que podem ser string ou Date (coerção)
 */
export const flexibleDateSchema = z.coerce.date();

// Tipos inferidos
export type DateTime = z.infer<typeof dateTimeSchema>;
export type DateString = z.infer<typeof dateSchema>;
export type Timestamp = z.infer<typeof timestampSchema>;
export type OptionalDateTime = z.infer<typeof optionalDateTimeSchema>;
export type FlexibleDate = z.infer<typeof flexibleDateSchema>;
