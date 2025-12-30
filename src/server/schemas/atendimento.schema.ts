import { z } from "zod";

import { createPaginatedSchema } from "./common.schema";

/**
 * Schema Zod para Atendimento
 * Baseado em ParceiroAtendimento de parceiro-detalhes.types.ts
 * e campos usados no config.ts
 */
export const schemaAtendimento = z
  .object({
    num: z.string().optional(),
    id: z.string().optional(),
    oco: z.string().optional(),
    tipo: z.string().optional(),
    titulo: z.string().optional(),
    assunto: z.string().optional(),
    sintoma: z.string().optional(),
    problema: z.string().optional(),
    data: z.string().optional(),
    data_oco: z.string().optional(),
    data_pro: z.string().optional(),
    data_atend: z.string().optional(),
    atendente: z.string().optional(),
    atendente_enc: z.string().optional(),
    situacao: z.string().optional(),
    status: z.string().optional(),
    resultado: z.string().optional(),
    prioridade: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para dados de parceiro em atendimento
 */
export const schemaParceiroAtendimento = z
  .object({
    id: z.string().optional(),
    nome: z.string().optional(),
    codfor: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para resposta paginada de atendimentos
 */
export const schemaPaginatedAtendimentoResponse = createPaginatedSchema(
  schemaAtendimento
);

/**
 * Tipos inferidos
 */
export type Atendimento = z.infer<typeof schemaAtendimento>;
export type ParceiroAtendimento = z.infer<typeof schemaParceiroAtendimento>;
export type PaginatedAtendimentoResponse = z.infer<
  typeof schemaPaginatedAtendimentoResponse
>;

/**
 * Atendimento com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface AtendimentoDetail extends Atendimento {
  label: string;
  value: string;
}
