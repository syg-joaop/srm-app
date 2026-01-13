import { z } from "zod";

import { dateTimeSchema, idSchema } from "~/layers/common/schemas/primitives.schema";

/**
 * Schema para Parceiro (domínio)
 */
export const parceiroSchema = z.object({
  id: idSchema,
  nome: z.string().min(1),
  razaoSocial: z.string().optional(),
  cnpj: z.string().optional(),
  cpf: z.string().optional(),
  email: z.string().email().optional(),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  ativo: z.boolean().default(true),
  tipo: z.enum(["FORNECEDOR", "CLIENTE", "PROSPECTO"]).optional(),
  createdAt: dateTimeSchema.optional(),
  updatedAt: dateTimeSchema.optional(),
});

/**
 * Schema para criação de Parceiro
 */
export const createParceiroSchema = parceiroSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

/**
 * Schema para atualização de Parceiro
 */
export const updateParceiroSchema = createParceiroSchema.partial();

// Tipos inferidos
export type Parceiro = z.infer<typeof parceiroSchema>;
export type CreateParceiro = z.infer<typeof createParceiroSchema>;
export type UpdateParceiro = z.infer<typeof updateParceiroSchema>;
