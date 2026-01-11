import { z } from "zod";

import {
  schemaFornecedor,
  schemaFornecedorItem,
  schemaFornecedorResponse,
  schemaListaFornecedores,
  schemaQueryFornecedor,
} from "~/server/schemas/fornecedores.schema";

export {
  schemaFornecedor,
  schemaFornecedorItem,
  schemaFornecedorResponse,
  schemaListaFornecedores,
  schemaQueryFornecedor,
};

export type {
  Fornecedor,
  FornecedorItem,
  FornecedorResponse,
  ListaFornecedores,
  QueryFornecedor,
} from "~/server/schemas/fornecedores.schema";

export const schemaFornecedorFilters = z
  .object({
    search: z.string().optional(),
    fantasia: z.string().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .passthrough();

export type FornecedorFilters = z.infer<typeof schemaFornecedorFilters>;

export const schemaFornecedorMapItem = schemaFornecedor
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

export type FornecedorMapItem = z.infer<typeof schemaFornecedorMapItem>;
