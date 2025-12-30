import { z } from "zod";

/**
 * Schema Zod para Favorecido
 * Baseado em campos usados no config.ts
 */
export const schemaFavorecido = z
  .object({
    id: z.string().optional(),
    nome: z.string().optional(),
    name: z.string().optional(),
    favorecido: z.string().optional(),
    tipo: z.string().optional(),
    documento: z.string().optional(),
    cpf: z.string().optional(),
    cnpj: z.string().optional(),
    observacao: z.string().optional(),
  })
  .passthrough();

/**
 * Tipos inferidos
 */
export type Favorecido = z.infer<typeof schemaFavorecido>;

/**
 * Favorecido com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface FavorecidoDetail extends Favorecido {
  label: string;
  value: string;
}
