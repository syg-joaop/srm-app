import { z } from "zod";

/**
 * Schema Zod para Contato
 * Baseado em ParceiroContato de parceiro-detalhes.types.ts
 * e CONTATO_FIELDS do config.ts
 */
export const schemaContato = z
  .object({
    sequencia: z.string().optional(),
    nome: z.string().optional(),
    cargo: z.string().optional(),
    funcao: z.string().optional(),
    departamento: z.string().optional(),
    telefone: z.string().optional(),
    celular: z.string().optional(),
    email: z.string().optional(),
    tipo: z.string().optional(),
    principal: z.boolean().or(z.string()).optional(),
    observacao: z.string().optional(),
  })
  .passthrough();

/**
 * Tipos inferidos
 */
export type Contato = z.infer<typeof schemaContato>;

/**
 * Contato com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface ContatoDetail extends Contato {
  label: string;
  value: string;
}
