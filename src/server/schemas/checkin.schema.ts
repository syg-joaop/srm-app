import { z } from "zod";

import { createPaginatedSchema } from "./common.schema";

/**
 * Schema Zod para Checkin
 * Unifica os tipos de src/types/checkin.types.ts e src/layers/checkin/types/checkin.types.ts
 * Mantém a estrutura do schema existente (campos snake_case) que é usado pela API
 */
export const schemaCheckin = z
  .object({
    id: z.number(),
    fornecedor: z.string(),
    cidade: z.string().optional(),
    estado: z.string().optional(),
    dataCheckin: z.string().optional(),
    responsavel: z.string().optional(),
    observacao: z.string().optional(),
    status: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    // Campos adicionais do tipo antigo (para compatibilidade)
    sr_recno: z.string().optional(),
    local: z.string().optional(),
    endereco: z.string().optional(),
    data: z.string().optional(),
    hora: z.string().optional(),
    usuario: z.string().optional(),
    codfor: z.string().optional(),
    fanta: z.string().optional(),
    situacao: z.string().optional(),
    uf: z.string().optional(),
    latlong: z.boolean().optional(),
    lat_for: z.string().optional(),
    long_for: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para filtros de check-ins
 */
export const schemaCheckinFilters = z
  .object({
    search: z.string().optional(),
  })
  .passthrough();

/**
 * Schema para resposta paginada de check-ins
 */
export const schemaPaginatedCheckinResponse = createPaginatedSchema(
  schemaCheckin
);

/**
 * Tipos inferidos
 */
export type Checkin = z.infer<typeof schemaCheckin>;
export type CheckinFilters = z.infer<typeof schemaCheckinFilters>;
export type PaginatedCheckinResponse = z.infer<
  typeof schemaPaginatedCheckinResponse
>;

/**
 * Check-in com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface CheckinDetail extends Checkin {
  label: string;
  value: string;
}
