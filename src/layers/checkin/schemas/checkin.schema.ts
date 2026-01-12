import { z } from "zod";

import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const checkinSchema = z
  .object({
    id: z.number().optional(),
    fornecedor: z.string().nullable().optional(),
    cidade: z.string().nullable().optional(),
    uf: z.string().nullable().optional(),
    data: z.string().nullable().optional(),
    responsavel: z.string().nullable().optional(),
    observacao: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    latitude: z.string().nullable().optional(),
    longitude: z.string().nullable().optional(),
    sr_recno: z.string().nullable().optional(),
    local: z.string().nullable().optional(),
    endereco: z.string().nullable().optional(),
    hora: z.string().nullable().optional(),
    usuario: z.string().nullable().optional(),
    codfor: z.string().nullable().optional(),
    fanta: z.string().nullable().optional(),
    situacao: z.string().nullable().optional(),
    latlong: z.boolean().optional(),
    lat_for: z.string().nullable().optional(),
    long_for: z.string().nullable().optional(),
    codcom: z.string().nullable().optional(),
    obs: z.string().nullable().optional(),
    nome_conco: z.string().nullable().optional(),
    fone: z.string().nullable().optional(),
    nome_pre: z.string().nullable().optional(),
  })
  .passthrough();

export const checkinFiltersSchema = z
  .object({
    search: z.string().optional(),
    fornecedor: z.string().optional(),
    responsavel: z.string().optional(),
    cidade: z.string().optional(),
  })
  .passthrough();

export const checkinResponseSchema = createPaginatedSchema(checkinSchema);

export const checkinDetailSchema = checkinSchema.extend({
  label: z.string().optional(),
  value: z.string().optional(),
});
