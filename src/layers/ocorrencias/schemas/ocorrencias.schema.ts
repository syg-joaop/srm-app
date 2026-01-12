import { z } from "zod";

import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const ocorrenciaSchema = z
  .object({
    id: z.number().optional(),
    titulo: z.string().optional(),
    fornecedor: z.string().optional(),
    dataCadastro: z.string().optional(),
    atendente: z.string().optional(),
    status: z
      .enum([
        "PENDENTE",
        "ACOMPANHAMENTO",
        "CONCLUIDA",
        "EM ACOMPANHAMENTO",
        "ATENDIMENTO OK",
        "Fechada",
        "pendente",
        "acompanhamento",
        "concluida",
      ])
      .optional(),
    proximoAtendimento: z.string().nullable().optional(),
    encaminhadoPara: z.string().nullable().optional(),
    diagnosticadoPor: z.string().nullable().optional(),
    formaAtendimento: z.string().nullable().optional(),
    situacao: z.string().nullable().optional(),
    num: z.string().nullable().optional(),
    codcli: z.string().nullable().optional(),
    codfor: z.string().nullable().optional(),
    nome: z.string().nullable().optional(),
    data_oco: z.string().nullable().optional(),
    tipo_ate: z.string().nullable().optional(),
    oco: z.string().nullable().optional(),
    solucao: z.string().nullable().optional(),
    usuario: z.string().nullable().optional(),
    data: z.string().nullable().optional(),
    data_pro: z.string().nullable().optional(),
    hora: z.string().nullable().optional(),
    empresa: z.string().nullable().optional(),
    sr_recno: z.string().nullable().optional(),
    hora_oco: z.string().nullable().optional(),
    apelido: z.string().nullable().optional(),
    atendente_enc: z.string().nullable().optional(),
    user_diagnostico: z.string().nullable().optional(),
    latitude: z.string().nullable().optional(),
    longitude: z.string().nullable().optional(),
    problema: z.string().nullable().optional(),
  })
  .passthrough();

export const ocorrenciaFiltersSchema = z
  .object({
    search: z.string().optional(),
    atendente: z.string().optional(),
    situacao: z.string().optional(),
    formaAtendimento: z.string().optional(),
    status: z.string().optional(),
    ordenarPor: z.string().optional(),
  })
  .passthrough();

export const ocorrenciaResponseSchema = createPaginatedSchema(ocorrenciaSchema);

export type OcorrenciaStatus =
  | "PENDENTE"
  | "ACOMPANHAMENTO"
  | "CONCLUIDA"
  | "EM ACOMPANHAMENTO"
  | "ATENDIMENTO OK"
  | "Fechada"
  | "pendente"
  | "acompanhamento"
  | "concluida";
