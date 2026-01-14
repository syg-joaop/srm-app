import { z } from "zod";

/**
 * Schema para Favorecido
 */
export const favorecidoSchema = z
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

export type Favorecido = z.infer<typeof favorecidoSchema>;
