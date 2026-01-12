import { z } from "zod";

/**
 * Schema para resposta HTTP
 */
export const httpResponseSchema = z.object({
  status: z.number().int(),
  statusText: z.string(),
  data: z.unknown(),
  headers: z.record(z.string()),
});

/**
 * Schema para resposta de sucesso genérica
 */
export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

/**
 * Schema para resposta de erro genérica
 */
export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  code: z.string().optional(),
});

// Tipos inferidos
export type HttpResponse = z.infer<typeof httpResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
