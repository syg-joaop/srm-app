import { z } from "zod";

import { createPaginatedSchema } from "~/layers/common/schemas";

// =============================================================================
// SCHEMAS
// =============================================================================

export const schemaConcorrente = z
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

export const schemaConcorrenteFilters = z
  .object({
    search: z.string().optional(),
  })
  .passthrough();

export const schemaPaginatedConcorrenteResponse = createPaginatedSchema(schemaConcorrente);

// =============================================================================
// TIPOS
// =============================================================================

export type Concorrente = z.infer<typeof schemaConcorrente>;
export type ConcorrenteFilters = z.infer<typeof schemaConcorrenteFilters>;
export type PaginatedConcorrenteResponse = z.infer<typeof schemaPaginatedConcorrenteResponse>;
