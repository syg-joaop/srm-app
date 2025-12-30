import { z } from "zod";

/**
 * Schema helper para criar respostas paginadas padronizadas
 *
 * @example
 * ```ts
 * const schemaUser = z.object({
 *   id: z.number(),
 *   name: z.string(),
 * });
 *
 * export const schemaPaginatedUserResponse = createPaginatedSchema(schemaUser);
 * export type PaginatedUserResponse = z.infer<typeof schemaPaginatedUserResponse>;
 * ```
 */
export function createPaginatedSchema<T extends z.ZodTypeAny>(itemSchema: T) {
  return z
    .object({
      status: z.coerce.number().optional(),
      message: z.string().optional(),
      success: z.boolean().optional(),
      data: z.object({
        page: z.coerce.number().optional(),
        size: z.coerce.number().optional(),
        totalItems: z.coerce.number().optional(),
        totalPages: z.coerce.number().optional(),
        items: z.array(itemSchema).default([]),
      }),
    })
    .passthrough();
}

/**
 * Schema base para responses de API
 */
export const schemaApiResponse = z
  .object({
    status: z.coerce.number().optional(),
    message: z.string().optional(),
    success: z.boolean().optional(),
  })
  .passthrough();

export type ApiResponse = z.infer<typeof schemaApiResponse>;
