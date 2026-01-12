import { z } from "zod";

/**
 * Schema para IDs numéricos inteiros positivos
 */
export const idSchema = z.number().int().positive();

/**
 * Schema para UUIDs
 */
export const uuidSchema = z.string().uuid();

/**
 * Schema para IDs opcionais
 */
export const optionalIdSchema = idSchema.optional();

/**
 * Schema para IDs que podem ser string ou number (coerção)
 */
export const flexibleIdSchema = z.coerce.number().int().positive();

// Tipos inferidos
export type Id = z.infer<typeof idSchema>;
export type Uuid = z.infer<typeof uuidSchema>;
export type OptionalId = z.infer<typeof optionalIdSchema>;
export type FlexibleId = z.infer<typeof flexibleIdSchema>;
