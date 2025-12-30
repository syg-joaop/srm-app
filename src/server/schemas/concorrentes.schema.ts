import { z } from "zod";

// Schema baseado na interface Concorrente existente
const schemaConcorrente = z
  .object({
    id: z.number(),
    nome: z.string(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    telefone: z.string().optional(),
    segmento: z.string().optional(),
    observacao: z.string().optional(),
    status: z.string().optional(),
  })
  .passthrough();

export const schemaPaginatedConcorrenteResponse = z
  .object({
    status: z.coerce.number().optional(),
    message: z.string().optional(),
    success: z.boolean().optional(),
    data: z.object({
      page: z.coerce.number().optional(),
      size: z.coerce.number().optional(),
      totalItems: z.coerce.number().optional(),
      totalPages: z.coerce.number().optional(),
      items: z.array(schemaConcorrente).default([]),
    }),
  })
  .passthrough();

export type PaginatedConcorrenteResponse = z.infer<typeof schemaPaginatedConcorrenteResponse>;
