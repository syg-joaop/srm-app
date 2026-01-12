import { z } from "zod";

import { httpResponseSchema } from "./response.schema";

/**
 * Schema para erro HTTP
 */
export const httpErrorSchema = z.object({
  message: z.string(),
  status: z.number().int().optional(),
  statusCode: z.number().int().optional(),
  response: httpResponseSchema.optional(),
  data: z.unknown().optional(),
});

/**
 * Schema para erro de validação
 */
export const validationErrorSchema = z.object({
  message: z.string(),
  errors: z.array(
    z.object({
      field: z.string(),
      message: z.string(),
      code: z.string().optional(),
    }),
  ),
});

/**
 * Schema para erro de autenticação
 */
export const authErrorSchema = z.object({
  message: z.string(),
  code: z.enum(["UNAUTHORIZED", "FORBIDDEN", "TOKEN_EXPIRED", "INVALID_TOKEN"]),
});

// Tipos inferidos
export type HttpError = z.infer<typeof httpErrorSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
