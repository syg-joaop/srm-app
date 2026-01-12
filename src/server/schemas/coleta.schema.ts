import { z } from "zod";

import { createPaginatedSchema } from "./common.schema";

/**
 * Schema Zod para Coleta
 * Baseado em ParceiroColeta de parceiro-detalhes.types.ts
 * e campos usados no config.ts
 */
export const schemaColeta = z
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

/**
 * Response schema paginado para Coleta
 */
export const coletaResponseSchema = createPaginatedSchema(schemaColeta);

/**
 * Tipos inferidos
 */
export type Coleta = z.infer<typeof schemaColeta>;

/**
 * Coleta com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface ColetaDetail extends Coleta {
  label: string;
  value: string;
}
