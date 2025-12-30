import { z } from "zod";

import { createPaginatedSchema } from "./common.schema";

/**
 * Schema Zod para Ocorrencia
 * Unifica os tipos de src/types/ocorrencias.ts e src/layers/ocorrencias/types/ocorrencias.types.ts
 */
export const schemaOcorrencia = z
  .object({
    id: z.number(),
    titulo: z.string().optional(),
    fornecedor: z.string(),
    dataCadastro: z.string().optional(),
    atendente: z.string(),
    status: z.enum(["pendente", "acompanhamento", "concluida"]),
    proximoAtendimento: z.string().optional(),
    encaminhadoPara: z.string().optional(),
    diagnosticadoPor: z.string().optional(),
    formaAtendimento: z.string().optional(),
    situacao: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para filtros de ocorrências
 */
export const schemaOcorrenciaFilters = z
  .object({
    search: z.string().optional(),
    atendente: z.string().optional(),
    situacao: z.string().optional(),
    formaAtendimento: z.string().optional(),
    status: z.string().optional(),
    ordenarPor: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para resposta paginada de ocorrências
 */
export const schemaPaginatedOcorrenciaResponse = createPaginatedSchema(
  schemaOcorrencia
);

/**
 * Tipos inferidos
 */
export type Ocorrencia = z.infer<typeof schemaOcorrencia>;
export type OcorrenciaFilters = z.infer<typeof schemaOcorrenciaFilters>;
export type PaginatedOcorrenciaResponse = z.infer<
  typeof schemaPaginatedOcorrenciaResponse
>;

/**
 * Tipo de status de ocorrência
 */
export type OcorrenciaStatus = "pendente" | "acompanhamento" | "concluida";
