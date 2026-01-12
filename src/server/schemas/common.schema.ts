import { z } from "zod";

/**
 * Schema helper para criar respostas paginadas padronizadas
 * Alinhado com a estrutura real das APIs do sistema SRM
 *
 * Todas as APIs retornam: status, code, message, suggestion + data com paginação
 *
 * @example
 * ```ts
 * const schemaUser = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 *
 * export const userResponseSchema = createPaginatedSchema(schemaUser, "userResponse");
 * export type UserResponse = z.infer<typeof userResponseSchema>;
 * ```
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
 * Schema base para responses de API
 * Inclui todos os campos retornados pelas APIs do sistema
 */
export const schemaApiResponse = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
  })
  .passthrough();

export const schemaApiFilters = z.object({}).passthrough() as z.ZodType<{
  [key: string]: z.ZodTypeAny;
}>;

export type ApiResponse = z.infer<typeof schemaApiResponse>;
export type ApiFilters = z.infer<typeof schemaApiFilters>;
