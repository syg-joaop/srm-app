import { z } from "zod";

export const atendimentoSchema = z
  .object({
    num: z.string().optional(),
    codcli: z.string().optional(),
    codfor: z.string().optional(),
    nome: z.string().optional(),
    data_oco: z.string().optional(),
    atendente: z.string().optional(),
    tipo_ate: z.string().optional(),
    situacao: z.string().optional(),
    status: z.string().optional(),
    data_pro: z.string().optional(),
    oco: z.string().optional(),
    solucao: z.string().optional(),
    usuario: z.string().optional(),
    data: z.string().optional(),
    hora: z.string().optional(),
    empresa: z.string().optional(),
    sr_recno: z.string().optional(),
    hora_oco: z.string().optional(),
    apelido: z.string().optional(),
    atendente_enc: z.string().optional(),
    user_diagnostico: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    problema: z.string().optional(),
    id: z.string().optional(),
    tipo: z.string().optional(),
    titulo: z.string().optional(),
    assunto: z.string().optional(),
    sintoma: z.string().optional(),
    data_atend: z.string().optional(),
    resultado: z.string().optional(),
    prioridade: z.string().optional(),
  })
  .passthrough();

export const parceiroAtendimentoSchema = z
  .object({
    id: z.string().optional(),
    nome: z.string().optional(),
    codfor: z.string().optional(),
  })
  .passthrough();

export const atendimentoResponseSchema = z
  .object({
    status: z.number().optional(),
    code: z.number().optional(),
    message: z.string().optional(),
    suggestion: z.string().optional(),
    data: z.object({
      page: z.number().optional(),
      size: z.number().optional(),
      totalItems: z.number().optional(),
      totalPages: z.number().optional(),
      items: z.array(atendimentoSchema).default([]),
    }),
  })
  .passthrough();

export const atendimentoFiltersSchema = z
  .object({
    search: z.string().optional(),
    atendente: z.string().optional(),
    situacao: z.string().optional(),
    formaAtendimento: z.string().optional(),
    status: z.string().optional(),
    ordenarPor: z.string().optional(),
  })
  .passthrough();

export const atendimentoDetailSchema = atendimentoSchema.extend({
  label: z.string().optional(),
  value: z.string().optional(),
});
