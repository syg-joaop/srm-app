import { z } from "zod";

// =============================================================================
// AMBIENTE
// =============================================================================

export const ambienteSchema = z.enum(["PROD", "HOMO", "DEV"]);

export const ambienteConfigSchema = z.object({
  ambiente: ambienteSchema,
  debug: z.boolean().default(false),
  apiTimeout: z.number().positive().default(300000),
});

// =============================================================================
// APP CONFIG
// =============================================================================

export const appConfigSchema = z.object({
  requestTimeout: z.number().positive().default(300000),
  ambiente: ambienteSchema.optional(),
});

export const runtimeConfigSchema = z.object({
  public: z.object({
    ambiente: ambienteSchema,
    apiUrl: z.string().url(),
    apiUrlHomol: z.string().url().optional(),
  }),
});

// =============================================================================
// TIPOS
// =============================================================================

export type Ambiente = z.infer<typeof ambienteSchema>;
export type AmbienteConfig = z.infer<typeof ambienteConfigSchema>;
export type AppConfig = z.infer<typeof appConfigSchema>;
export type RuntimeConfig = z.infer<typeof runtimeConfigSchema>;
