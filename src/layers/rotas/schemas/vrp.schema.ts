import { z } from "zod";

import type { VrpRouteResponse } from "../types/rotas.types";

/**
 * Schemas Zod para validação de respostas da API VRP (Vehicle Routing Problem)
 * API externa de terceiros para roteirização
 */

// Schema para VrpSummary
const vrpSummarySchema = z.object({
  distance: z.object({
    meters: z.number(),
  }),
  time: z.object({
    duration: z.number(),
    traveling: z.number(),
  }),
});

// Schema para VrpSequenceItem
const vrpSequenceItemSchema = z.object({
  type: z.enum(["start", "job", "end"]),
  id: z.number(),
  location: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  time: z.object({
    arrival: z.number(), // Unix timestamp
    departure: z.number(),
    traveling: z.number(),
    complete: z.number(),
  }),
  distance: z.object({
    meters: z.number(),
  }),
});

// Schema para VrpRoute (dentro de VrpPlan)
const vrpRouteSchema = z.object({
  polyline: z.string(), // Encoded polyline string
  sequence: z.array(vrpSequenceItemSchema),
});

// Schema para VrpPlan
const vrpPlanSchema = z.object({
  vehicle: z.number(),
  route: vrpRouteSchema,
  summary: vrpSummarySchema,
});

// Schema para VrpWorkDay
const vrpWorkDaySchema = z.object({
  day: z.number(),
  plans: z.array(vrpPlanSchema),
});

// Schema principal para VrpRouteResponse
export const schemaVrpRouteResponse = z
  .object({
    response: z.object({
      workDays: z.array(vrpWorkDaySchema),
      unassignedTasks: z.array(z.number()),
      summary: vrpSummarySchema,
    }),
  })
  .passthrough();

/**
 * Schema alternativo para respostas que podem vir sem o wrapper "response"
 * Algumas versões da API podem retornar os dados diretamente
 */
export const schemaVrpRouteResponseFlat = z
  .object({
    workDays: z.array(vrpWorkDaySchema),
    unassignedTasks: z.array(z.number()),
    summary: vrpSummarySchema,
  })
  .passthrough();

/**
 * Função auxiliar para validação que tenta ambos os formatos
 * Normaliza a resposta para o formato esperado pelo código
 */
export const validateVrpResponse = (response: unknown): VrpRouteResponse => {
  // Tenta primeiro o formato com wrapper "response"
  const resultWithWrapper = schemaVrpRouteResponse.safeParse(response);
  if (resultWithWrapper.success) {
    return resultWithWrapper.data as VrpRouteResponse;
  }

  // Tenta o formato sem wrapper e converte para o formato com wrapper
  const resultFlat = schemaVrpRouteResponseFlat.safeParse(response);
  if (resultFlat.success) {
    // Converte o formato flat para o formato com wrapper
    return {
      response: {
        workDays: resultFlat.data.workDays,
        unassignedTasks: resultFlat.data.unassignedTasks,
        summary: resultFlat.data.summary,
      },
    } as VrpRouteResponse;
  }

  // Se nenhum funcionou, lança erro com detalhes
  const errorDetails = resultWithWrapper.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");
  throw new Error(`Falha na validação da API VRP: ${errorDetails}`);
};

export type VrpRouteResponseValidation = z.infer<typeof schemaVrpRouteResponse>;
export type VrpRouteResponseFlatValidation = z.infer<typeof schemaVrpRouteResponseFlat>;
