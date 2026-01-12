import { z } from "zod";

import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const prospectoSchema = z
  .object({
    codfor: z.union([z.string(), z.number()]).optional(),
    fornecedor: z.string().optional(),
    fanta: z.string().optional(),
    status: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    celular: z.string().optional(),
    tel3: z.string().optional(),
    data: z.string().optional(),
    fone: z.string().optional(),
    email: z.string().optional(),
    ende: z.string().optional(),
    categoria: z.string().optional(),
    oco2: z.string().optional(),
    tf: z.string().optional(),
    comp: z.string().optional(),
    ultima_carga: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    latlong: z.boolean().optional(),
  })
  .passthrough();

export const prospectoItemSchema = z
  .object({
    codfor: z.union([z.string(), z.number()]).optional(),
    fornecedor: z.string().optional(),
    fanta: z.string().optional(),
    status: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    celular: z.string().optional(),
    tel3: z.string().optional(),
    data: z.string().optional(),
    fone: z.string().optional(),
    email: z.string().optional(),
    ende: z.string().optional(),
    categoria: z.string().optional(),
    oco2: z.string().optional(),
    tf: z.string().optional(),
    comp: z.string().optional(),
    ultima_carga: z.string().optional(),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
    latlong: z.boolean().optional(),
  })
  .passthrough();

export const prospectoResponseSchema = createPaginatedSchema(prospectoItemSchema);

export const prospectoFiltersSchema = z
  .object({
    search: z.string().optional(),
    fantasia: z.string().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .passthrough();

export const prospectoMapItemSchema = prospectoItemSchema
  .pick({
    fornecedor: true,
    fanta: true,
    status: true,
    cidade: true,
    ultima_carga: true,
    latitude: true,
    longitude: true,
    latlong: true,
  })
  .passthrough();
