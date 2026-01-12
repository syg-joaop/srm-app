import { z } from "zod";

import { ambienteSchema } from "./ambiente.schema";

/**
 * Schema para configuração completa da aplicação
 */
export const appConfigSchema = z.object({
  requestTimeout: z.number().positive().default(300000),
  ambiente: ambienteSchema.optional(),
});

/**
 * Schema para runtime config do Nuxt
 */
export const runtimeConfigSchema = z.object({
  public: z.object({
    ambiente: ambienteSchema,
    apiUrl: z.string().url(),
    apiUrlHomol: z.string().url().optional(),
  }),
});

// Tipos inferidos
export type AppConfig = z.infer<typeof appConfigSchema>;
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;
