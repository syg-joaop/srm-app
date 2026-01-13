import { z } from "zod";

import { createPaginatedSchema } from "./pagination.schema";

/**
 * Schema para Coleta
 */
export const coletaSchema = z
  .object({
    ordem: z.string().optional(),
    numero: z.string().optional(),
    id: z.string().optional(),
    romaneio: z.string().optional(),
    datasai: z.string().optional(),
    datache: z.string().optional(),
    data: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    peso: z.number().or(z.string()).optional(),
    tot_cacamba: z.number().optional(),
    situacao: z.string().optional(),
    coletado: z.boolean().or(z.string()).optional(),
    fornecedor: z.string().optional(),
    sr: z.string().optional(),
    local: z.string().optional(),
    bairro: z.string().optional(),
    motorista: z.string().optional(),
    codfor: z.string().optional(),
    obs: z.string().optional(),
  })
  .passthrough();

export const coletaResponseSchema = createPaginatedSchema(coletaSchema);

export type Coleta = z.infer<typeof coletaSchema>;
