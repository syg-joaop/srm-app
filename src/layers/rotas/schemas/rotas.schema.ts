import { z } from "zod";

import {
  schemaCreateRoteiroPayload,
  schemaRota,
  schemaRotaFilters,
  schemaRotaResponse,
  schemaRoteiro,
  schemaRoteiroFilters,
  schemaRoteiroResponse,
} from "~/server/schemas/rotas.schema";

import { schemaVrpSummary } from "./vrp.schema";

export {
  schemaCreateRoteiroPayload,
  schemaRota,
  schemaRotaFilters,
  schemaRotaResponse,
  schemaRoteiro,
  schemaRoteiroFilters,
  schemaRoteiroResponse,
};

export type {
  Rota,
  RotaFilters,
  RotaResponse,
  Roteiro,
  RoteiroFilters,
  RoteiroResponse,
} from "~/server/schemas/rotas.schema";

export type CreateRoteiroPayload = z.infer<typeof schemaCreateRoteiroPayload>;

export const schemaFornecedorRotaSimples = z.object({
  name: z.string(),
  lat: z.number(),
  lng: z.number(),
});

export type FornecedorRotaSimples = z.infer<typeof schemaFornecedorRotaSimples>;

export const schemaFornecedorParaRoteiro = schemaFornecedorRotaSimples.extend({
  codfor: z.union([z.string(), z.number()]).optional(),
});

export type FornecedorParaRoteiro = z.infer<typeof schemaFornecedorParaRoteiro>;

export const schemaPolylineCache = z.object({
  polyline: z.string(),
  summary: schemaVrpSummary,
  timestamp: z.number(),
  ttl: z.number(),
});

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
