import { z } from "zod";

import { schemaVrpSummary } from "./vrp.schema";

// =============================================================================
// ROTA
// =============================================================================

const numberLike = z.union([z.number(), z.string()]);

export const schemaRotaProgresso = z
  .object({
    total: z.coerce.number().optional(),
    concluidos: z.coerce.number().optional(),
    em_andamento: z.coerce.number().optional(),
    reagendados: z.coerce.number().optional(),
    pendentes: z.coerce.number().optional(),
    percentual_conclusao: z.coerce.number().optional(),
  })
  .passthrough();

export const schemaRota = z
  .object({
    id: z.coerce.number(),
    codigo: z.coerce.number().optional(),
    tipo: z.string(),
    data_inicio: z.string().nullish(),
    data_fim: z.string().nullish(),
    usuario: z.string().nullish(),
    usuario_created: z.string().nullish(),
    id_usuario: z.coerce.number().optional(),
    id_usuario_created: z.coerce.number().optional(),
    status: z.string().optional(),
    observacao: z.string().nullish(),
    progresso: schemaRotaProgresso.optional(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
  })
  .passthrough();

export const schemaRotaResponse = z
  .object({
    message: z.string(),
    total: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    itens: z.coerce.number().optional(),
    total_pages: z.coerce.number().optional(),
    data: z.array(schemaRota),
  })
  .passthrough();

export const schemaRotaFilters = z
  .object({
    page: z.coerce.number().optional(),
    itens: z.coerce.number().optional(),
    status: z.string().optional(),
    data_inicio: z.string().optional(),
    data_fim: z.string().optional(),
  })
  .passthrough();

// =============================================================================
// ROTEIRO
// =============================================================================

export const schemaRoteiroEndereco = z
  .object({
    latitude: numberLike,
    longitude: numberLike,
    rua: z.string().nullish(),
    numero: z.string().nullish(),
    cidade: z.string().nullish(),
    bairro: z.string().nullish(),
    uf: z.string().nullish(),
    cep: z.string().nullish(),
  })
  .passthrough();

export const schemaRoteiroStatus = z
  .object({
    id: z.coerce.number().optional(),
    id_roteiro: z.coerce.number().optional(),
    status: z.string().optional(),
    id_usuario: z.coerce.number().optional(),
    usuario: z.string().optional(),
    observacao: z.string().nullish(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
  })
  .passthrough();

export const schemaRoteiro = z
  .object({
    id: z.coerce.number(),
    id_rota: z.coerce.number().optional(),
    id_checkin: z.coerce.number().optional(),
    nome: z.string().nullish(),
    codigo: z.coerce.number().optional(),
    sequencia: z.coerce.number().optional(),
    status: z.string().optional(),
    observacao: z.string().nullish(),
    endereco: schemaRoteiroEndereco.optional(),
    srm_status_roteiro: z.array(schemaRoteiroStatus).optional(),
    created_at: z.string().nullish(),
    updated_at: z.string().nullish(),
    deleted_at: z.string().nullish(),
  })
  .passthrough();

export const schemaRoteiroResponse = z
  .object({
    message: z.string(),
    total: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    itens: z.coerce.number().optional(),
    total_pages: z.coerce.number().optional(),
    data: z.array(schemaRoteiro),
  })
  .passthrough();

export const schemaRoteiroFilters = z
  .object({
    id_rota: z.coerce.number().optional(),
    id_usuario: z.coerce.number().optional(),
    page: z.coerce.number().optional(),
    itens: z.coerce.number().optional(),
  })
  .passthrough();

export const schemaCreateRoteiroPayload = z
  .object({
    nome: z.string(),
    id_rota: z.coerce.number(),
    codigo: z.coerce.number(),
    id_checkin: z.coerce.number().optional(),
    endereco: z
      .object({
        latitude: numberLike,
        longitude: numberLike,
        rua: z.string().optional(),
        numero: z.string().optional(),
        cidade: z.string().optional(),
        bairro: z.string().optional(),
        uf: z.string().optional(),
      })
      .passthrough(),
    observacao: z.string().optional(),
    sequencia: z.coerce.number().optional(),
    status: z.string().optional(),
  })
  .passthrough();

// =============================================================================
// SCHEMAS ESPECÍFICOS DO LAYER
// =============================================================================

export const schemaFornecedorRotaSimples = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export const schemaFornecedorParaRoteiro = schemaFornecedorRotaSimples.extend({
  codfor: z.union([z.string(), z.number()]).optional(),
});

export const schemaPolylineCache = z.object({
  polyline: z.string(),
  summary: schemaVrpSummary,
  timestamp: z.number(),
  ttl: z.number(),
});

// =============================================================================
// TIPOS
// =============================================================================

export type Rota = z.infer<typeof schemaRota>;
export type RotaResponse = z.infer<typeof schemaRotaResponse>;
export type RotaFilters = z.infer<typeof schemaRotaFilters>;
export type Roteiro = z.infer<typeof schemaRoteiro>;
export type RoteiroResponse = z.infer<typeof schemaRoteiroResponse>;
export type RoteiroFilters = z.infer<typeof schemaRoteiroFilters>;
export type CreateRoteiroPayload = z.infer<typeof schemaCreateRoteiroPayload>;
export type FornecedorRotaSimples = z.infer<typeof schemaFornecedorRotaSimples>;
export type FornecedorParaRoteiro = z.infer<typeof schemaFornecedorParaRoteiro>;
export type PolylineCache = z.infer<typeof schemaPolylineCache>;

export type {
  VrpLocation,
  VrpPlan,
  VrpRouteRequest,
  VrpRouteResponse,
  VrpRouteResponseFlat,
  VrpSummary,
  VrpTask,
  VrpVehicle,
  VrpWorkDay,
} from "./vrp.schema";
