import { z } from "zod";

import { createPaginatedSchema } from "./pagination.schema";

/**
 * Schema para Contato
 */
export const contatoSchema = z
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

export const contatoResponseSchema = createPaginatedSchema(contatoSchema);

export type Contato = z.infer<typeof contatoSchema>;
