import { z } from "zod";

// =============================================================================
// PAGINAÇÃO - Schemas para respostas paginadas da API
// =============================================================================

/**
 * Schema para parâmetros de paginação
 */
export const paginationParamsSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * Schema para metadados de paginação
 */
export const paginationMetaSchema = z.object({
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  limit: z.number().int().positive(),
  totalPages: z.number().int().nonnegative(),
  hasNextPage: z.boolean().optional(),
  hasPrevPage: z.boolean().optional(),
});

/**
 * Factory para criar schema de resposta paginada (formato padrão)
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  });

/**
 * Factory para criar schema de resposta paginada (formato API SRM)
 * Alinhado com a estrutura real das APIs do sistema
 */
export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .object({
      status: z.number().optional(),
      code: z.number().optional(),
      message: z.string().optional(),
      suggestion: z.string().optional(),
      data: z.object({
        page: z.number().optional(),
        size: z.number().optional(),
        totalItems: z.number().optional(),
        totalPages: z.number().optional(),
        items: z.array(itemSchema).default([]),
      }),
    })
    .passthrough();
}

/**
 * Schema alternativo para APIs que retornam paginação diferente
 */
export const simplePaginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    items: z.array(dataSchema),
    total: z.number().int().nonnegative(),
    page: z.number().int().positive(),
    pageSize: z.number().int().positive(),
  });

// =============================================================================
// TIPOS
// =============================================================================

export type PaginationParams = z.infer<typeof paginationParamsSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = { data: T[]; meta: PaginationMeta };
export type SimplePaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
