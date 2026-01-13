import { z } from "zod";

import { createPaginatedSchema } from "./pagination.schema";

/**
 * Schema para Preço
 */
export const precoSchema = z
  .object({
    status: z.string().optional(),
    codpro: z.string().optional(),
    subcod: z.string().optional(),
    produto: z.string().optional(),
    descricao: z.string().optional(),
    tipo: z.string().optional(),
    preco: z.number().or(z.string()).optional(),
    valor: z.number().or(z.string()).optional(),
    unidade: z.string().optional(),
    embalagem: z.string().optional(),
    tabela: z.string().optional(),
    validade: z.string().optional(),
    moeda: z.string().optional(),
  })
  .passthrough();

export const precoResponseSchema = createPaginatedSchema(precoSchema);

export type Preco = z.infer<typeof precoSchema>;
