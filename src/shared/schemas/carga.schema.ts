import { z } from "zod";

import { createPaginatedSchema } from "./pagination.schema";

/**
 * Schema para Carga
 */
export const cargaSchema = z
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

export const cargaResponseSchema = createPaginatedSchema(cargaSchema);

export type Carga = z.infer<typeof cargaSchema>;
