import { z } from "zod";

import { createPaginatedSchema } from "./common.schema";

/**
 * Schema Zod para Carga
 * Baseado em ParceiroCarga de parceiro-detalhes.types.ts
 * e CARGA_FIELDS do config.ts
 */
export const schemaCarga = z
  .object({
    boleto: z.string().optional(),
    numero: z.string().optional(),
    data_peso: z.string().nullable().optional(),
    data_entrega: z.string().nullable().optional(),
    data_carga: z.string().optional(),
    hora_peso: z.array(z.string()).optional(),
    fornecedor: z.string().optional(),
    count: z.number().or(z.string()).optional(),
    produto: z.string().or(z.array(z.string())).optional(),
    unidade: z.array(z.string()).optional(),
    quantidade: z.number().optional(),
    situacao: z.string().optional(),
    status: z.string().optional(),
    liquido_total: z.number().optional(),
    liquido_unitario: z.array(z.string()).optional(),
    valor_total: z.number().optional(),
    valor_unitario: z.array(z.string()).optional(),
    peso: z.number().or(z.string()).optional(),
  })
  .passthrough();

/**
 * Response schema paginado para Carga
 */
export const cargaResponseSchema = createPaginatedSchema(schemaCarga);

/**
 * Tipos inferidos
 */
export type Carga = z.infer<typeof schemaCarga>;

/**
 * Carga com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface CargaDetail extends Carga {
  label: string;
  value: string;
}
