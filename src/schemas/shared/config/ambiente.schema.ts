import { z } from "zod";

/**
 * Schema para ambientes da aplicação
 * - PROD: Produção
 * - HOMO: Homologação
 * - DEV: Desenvolvimento
 */
export const ambienteSchema = z.enum(["PROD", "HOMO", "DEV"]);

/**
 * Schema para configuração de ambiente
 */
export const ambienteConfigSchema = z.object({
  ambiente: ambienteSchema,
  debug: z.boolean().default(false),
  apiTimeout: z.number().positive().default(300000),
});

// Tipos inferidos
export type Ambiente = z.infer<typeof ambienteSchema>;
export type AmbienteConfig = z.infer<typeof ambienteConfigSchema>;
