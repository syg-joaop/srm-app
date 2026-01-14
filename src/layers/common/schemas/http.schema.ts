import { z } from "zod";

// =============================================================================
// MÉTODOS E REQUISIÇÕES
// =============================================================================

export const httpMethodSchema = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);

export const httpRequestSchema = z.object({
  url: z.string(),
  method: httpMethodSchema,
  headers: z.record(z.string(), z.string()).optional(),
  data: z.unknown().optional(),
  params: z.record(z.string(), z.string()).optional(),
});

export const httpClientConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().positive().default(300000),
  headers: z.record(z.string(), z.string()).optional(),
});

// =============================================================================
// RESPOSTAS
// =============================================================================

export const httpResponseSchema = z.object({
  status: z.number().int(),
  statusText: z.string(),
  data: z.unknown(),
  headers: z.record(z.string(), z.string()),
});

export const successResponseSchema = z.object({
  success: z.literal(true),
  message: z.string().optional(),
  data: z.unknown().optional(),
});

export const errorResponseSchema = z.object({
  success: z.literal(false),
  message: z.string(),
  errors: z.array(z.string()).optional(),
  code: z.string().optional(),
});

// =============================================================================
// ERROS
// =============================================================================

export const httpErrorSchema = z.object({
  message: z.string(),
  status: z.number().int().optional(),
  statusCode: z.number().int().optional(),
  response: httpResponseSchema.optional(),
  data: z.unknown().optional(),
});

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

export const authErrorSchema = z.object({
  message: z.string(),
  code: z.enum(["UNAUTHORIZED", "FORBIDDEN", "TOKEN_EXPIRED", "INVALID_TOKEN"]),
});

// =============================================================================
// TIPOS
// =============================================================================

export type HttpMethod = z.infer<typeof httpMethodSchema>;
export type HttpRequest = z.infer<typeof httpRequestSchema>;
export type HttpClientConfig = z.infer<typeof httpClientConfigSchema>;
export type HttpResponse = z.infer<typeof httpResponseSchema>;
export type SuccessResponse = z.infer<typeof successResponseSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type HttpError = z.infer<typeof httpErrorSchema>;
export type ValidationError = z.infer<typeof validationErrorSchema>;
export type AuthError = z.infer<typeof authErrorSchema>;
