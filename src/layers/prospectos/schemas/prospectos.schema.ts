import { z } from "zod";

import {
  createPaginatedSchema,
  parceiroBaseSchema,
  parceiroFiltersSchema,
  parceiroMapSchema,
} from "~/layers/common/schemas";

/**
 * Schema do Prospecto
 *
 * Estende o schema base de Parceiro.
 */

// =============================================================================
// SCHEMAS
// =============================================================================

export const prospectoSchema = parceiroBaseSchema;
export const prospectoItemSchema = parceiroBaseSchema;
export const prospectoResponseSchema = createPaginatedSchema(prospectoItemSchema);
export const prospectoFiltersSchema = parceiroFiltersSchema;
export const prospectoMapItemSchema = parceiroMapSchema;

// =============================================================================
// TIPOS
// =============================================================================

export type Prospecto = z.infer<typeof prospectoSchema>;
export type ProspectoItem = z.infer<typeof prospectoItemSchema>;
export type ProspectoFilters = z.infer<typeof prospectoFiltersSchema>;
export type ProspectoMapItem = z.infer<typeof prospectoMapItemSchema>;
