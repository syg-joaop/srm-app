import { z } from "zod";

import { createPaginatedSchema } from "~/server/schemas/common.schema";

export const fornecedorSchema = z
  .object({
    codfor: z.union([z.string(), z.number()]),
    fornecedor: z.string(),
    fanta: z.string().optional(),
    status: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    celular: z.string().optional(),
    tel3: z.string().optional(),
    data: z.string().optional(),
    fone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
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

export const fornecedorQuerySchema = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export const fornecedorItemSchema = z
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

export const fornecedorResponseSchema = createPaginatedSchema(fornecedorItemSchema);

export const fornecedorFiltersSchema = z
  .object({
    search: z.string().optional(),
    fantasia: z.string().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .passthrough();

export const fornecedorMapItemSchema = fornecedorSchema
  .pick({
    fornecedor: true,
    cidade: true,
    ultima_carga: true,
    status: true,
    latitude: true,
    longitude: true,
    latlong: true,
    fanta: true,
  })
  .passthrough();
