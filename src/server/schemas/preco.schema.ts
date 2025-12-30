import { z } from "zod";

/**
 * Schema Zod para Preco
 * Baseado em ParceiroPreco de parceiro-detalhes.types.ts
 * e campos usados no config.ts
 */
export const schemaPreco = z
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

/**
 * Tipos inferidos
 */
export type Preco = z.infer<typeof schemaPreco>;

/**
 * Preço com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface PrecoDetail extends Preco {
  label: string;
  value: string;
}
