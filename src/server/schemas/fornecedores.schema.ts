import { z } from "zod";

export const schemaFornecedor = z
  .object({
    codfor: z.string().or(z.number()), // Aceita string ou numero, backend as vezes manda numero
    fornecedor: z.string(),
    fanta: z.string().optional(),
    status: z.string().optional(),
    cidade: z.string().optional(),
    uf: z.string().optional(),
    celular: z.string().optional(),
    tel3: z.string().optional(),
    data: z.string().optional(),
    fone: z.string().optional(),
    email: z.string().email().optional().or(z.string()), // Aceita string vazia ou email invalido se vier do legacy
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

export const schemaListaFornecedores = z.object({
  data: z.array(schemaFornecedor),
  total: z.number().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const schemaQueryFornecedor = z.object({
  page: z.coerce.number().optional().default(1),
  limit: z.coerce.number().optional().default(10),
  search: z.string().optional(),
  status: z.string().optional(),
});

export type Fornecedor = z.infer<typeof schemaFornecedor>;
export type ListaFornecedores = z.infer<typeof schemaListaFornecedores>;
export type QueryFornecedor = z.infer<typeof schemaQueryFornecedor>;
