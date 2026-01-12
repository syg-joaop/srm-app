import { z } from "zod";

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
 * Factory para criar schema de resposta paginada
 * @param dataSchema - Schema do tipo de dados da lista
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  });

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

// Tipos inferidos
export type PaginationParams = z.infer<typeof paginationParamsSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginatedResponse<T> = {
  data: T[];
  meta: PaginationMeta;
};
export type SimplePaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
};
