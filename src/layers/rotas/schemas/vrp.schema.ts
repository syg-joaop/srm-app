import { z } from "zod";

/**
 * Schemas Zod para validacao de respostas da API VRP (Vehicle Routing Problem)
 * API externa de terceiros para roteirizacao
 */
export const schemaVrpSummary = z.object({
  distance: z.object({
    meters: z.number(),
  }),
  time: z.object({
    duration: z.number(),
    traveling: z.number(),
  }),
});

export const schemaVrpLocation = z.object({
  latitude: z.number(),
  longitude: z.number(),
});

export const schemaVrpTask = z.object({
  id: z.number(),
  type: z.enum(["catch-only", "delivery-only", "pickup-delivery"]),
  description: z.string(),
  duration: z.string(),
  location: schemaVrpLocation,
});

export const schemaVrpVehicle = z.object({
  id: z.number(),
  description: z.string(),
  maxJobs: z.number(),
  avgSpeed: z.number(),
  location: z.object({
    start: schemaVrpLocation,
    end: schemaVrpLocation,
  }),
  work: z.object({
    start: z.string(),
    end: z.string(),
  }),
});

export const schemaVrpRouteRequest = z.object({
  timezone: z.string(),
  maxDaysWorking: z.number(),
  vehicles: z.array(schemaVrpVehicle),
  tasks: z.array(schemaVrpTask),
});

// Schema para VrpSequenceItem
const vrpSequenceItemSchema = z.object({
  type: z.enum(["start", "job", "end"]),
  id: z.number(),
  location: schemaVrpLocation,
  time: z.object({
    arrival: z.number(),
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
  polyline: z.string(),
  sequence: z.array(vrpSequenceItemSchema),
});

export const schemaVrpPlan = z.object({
  vehicle: z.number(),
  route: vrpRouteSchema,
  summary: schemaVrpSummary,
});

export const schemaVrpWorkDay = z.object({
  day: z.number(),
  plans: z.array(schemaVrpPlan),
});

export const schemaVrpRouteResponse = z
  .object({
    response: z.object({
      workDays: z.array(schemaVrpWorkDay),
      unassignedTasks: z.array(z.number()),
      summary: schemaVrpSummary,
    }),
  })
  .passthrough();

export const schemaVrpRouteResponseFlat = z
  .object({
    workDays: z.array(schemaVrpWorkDay),
    unassignedTasks: z.array(z.number()),
    summary: schemaVrpSummary,
  })
  .passthrough();

/**
 * Funcao auxiliar para validacao que tenta ambos os formatos
 * Normaliza a resposta para o formato esperado pelo codigo
 */
export const validateVrpResponse = (response: unknown): VrpRouteResponse => {
  const resultWithWrapper = schemaVrpRouteResponse.safeParse(response);
  if (resultWithWrapper.success) {
    return resultWithWrapper.data as VrpRouteResponse;
  }

  const resultFlat = schemaVrpRouteResponseFlat.safeParse(response);
  if (resultFlat.success) {
    return {
      response: {
        workDays: resultFlat.data.workDays,
        unassignedTasks: resultFlat.data.unassignedTasks,
        summary: resultFlat.data.summary,
      },
    } as VrpRouteResponse;
  }

  const errorDetails = resultWithWrapper.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");
  throw new Error(`Falha na validacao da API VRP: ${errorDetails}`);
};

export type VrpLocation = z.infer<typeof schemaVrpLocation>;
export type VrpTask = z.infer<typeof schemaVrpTask>;
export type VrpVehicle = z.infer<typeof schemaVrpVehicle>;
export type VrpRouteRequest = z.infer<typeof schemaVrpRouteRequest>;
export type VrpSummary = z.infer<typeof schemaVrpSummary>;
export type VrpPlan = z.infer<typeof schemaVrpPlan>;
export type VrpWorkDay = z.infer<typeof schemaVrpWorkDay>;
export type VrpRouteResponse = z.infer<typeof schemaVrpRouteResponse>;
export type VrpRouteResponseFlat = z.infer<typeof schemaVrpRouteResponseFlat>;
export type VrpRouteResponseValidation = VrpRouteResponse;
export type VrpRouteResponseFlatValidation = VrpRouteResponseFlat;
