import { z } from "zod";

/**
 * Schema para métodos HTTP
 */
export const httpMethodSchema = z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]);

/**
 * Schema para requisição HTTP
 */
export const httpRequestSchema = z.object({
  url: z.string(),
  method: httpMethodSchema,
  headers: z.record(z.string()).optional(),
  data: z.unknown().optional(),
  params: z.record(z.string()).optional(),
});

/**
 * Schema para configuração de cliente HTTP
 */
export const httpClientConfigSchema = z.object({
  baseURL: z.string().url(),
  timeout: z.number().positive().default(300000),
  headers: z.record(z.string()).optional(),
});

// Tipos inferidos
export type HttpMethod = z.infer<typeof httpMethodSchema>;
export type HttpRequest = z.infer<typeof httpRequestSchema>;
export type HttpClientConfig = z.infer<typeof httpClientConfigSchema>;
