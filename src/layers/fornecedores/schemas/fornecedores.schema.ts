import { z } from "zod";

import {
  createPaginatedSchema,
  parceiroBaseSchema,
  parceiroFiltersSchema,
  parceiroMapSchema,
} from "~/layers/common/schemas";

/**
 * Schema do Fornecedor
 *
 * Estende o schema base de Parceiro.
 */

// =============================================================================
// SCHEMAS
// =============================================================================

export const fornecedorSchema = parceiroBaseSchema;
export const fornecedorItemSchema = parceiroBaseSchema;
export const fornecedorResponseSchema = createPaginatedSchema(fornecedorItemSchema);
export const fornecedorFiltersSchema = parceiroFiltersSchema;
export const fornecedorMapItemSchema = parceiroMapSchema;

export const fornecedorQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

// =============================================================================
// TIPOS
// =============================================================================

export type Fornecedor = z.infer<typeof fornecedorSchema>;
export type FornecedorItem = z.infer<typeof fornecedorItemSchema>;
export type FornecedorFilters = z.infer<typeof fornecedorFiltersSchema>;
export type FornecedorMapItem = z.infer<typeof fornecedorMapItemSchema>;
export type FornecedorQuery = z.infer<typeof fornecedorQuerySchema>;
