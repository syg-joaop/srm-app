import { z } from "zod";

/**
 * Schemas Zod para validacao de respostas da API VRP (Vehicle Routing Problem)
 * API externa de terceiros para roteirizacao
 */
export const schemaVrpSummary = z.object({
  tasks: z.object({
    deliveries: z.number().optional(),
    catches: z.number().optional(),
    avgCosts: z.number().optional(),
    vehicles: z.number().optional(),
  }).optional(),
  tolls: z.object({
    counter: z.number().optional(),
    costs: z.number().optional(),
  }).optional(),
  fuel: z.object({
    liters: z.number().optional(),
    reloads: z.number().optional(),
    costs: z.number().optional(),
  }).optional(),
  distance: z.object({
    meters: z.number(),
    costs: z.number().optional(),
  }),
  time: z.object({
    preparation: z.number().optional(),
    duration: z.number(),
    traveling: z.number(),
    costs: z.number().optional(),
    firstTaskArrival: z.number().optional(),
    lastTaskArrival: z.number().optional(),
    departure: z.number().optional(),
    return: z.number().optional(),
    firstDeparture: z.number().optional(),
    lastReturn: z.number().optional(),
  }),
  volumes: z.object({
    initial: z.number().optional(),
    final: z.number().optional(),
  }).optional(),
  daysWorking: z.number().optional(),
}).passthrough();

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
  idx: z.number(),
  type: z.enum(["start", "job", "end"]),
  id: z.number().optional(),
  location: schemaVrpLocation,
  time: z.object({
    traveling: z.number(),
    arrival: z.number(),
    waiting: z.number(),
    prepared: z.number(),
    complete: z.number(),
    departure: z.number(),
  }),
  distance: z.object({
    meters: z.number(),
    costs: z.number().optional(),
  }),
  volumes: z.object({
    load: z.number(),
    unload: z.number(),
    before: z.number(),
    after: z.number(),
  }).optional(),
}).passthrough();

// Schema para VrpRoute (dentro de VrpPlan)
const vrpRouteSchema = z.object({
  polyline: z.string(),
  sequence: z.array(vrpSequenceItemSchema),
  tolls: z.array(z.any()).optional(),
  gasStations: z.array(z.any()).optional(),
}).passthrough();

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
  // Verifica se response é um objeto
  if (!response || typeof response !== "object") {
    throw new Error(
      `Falha na validacao da API VRP: resposta não é um objeto (tipo: ${typeof response})`
    );
  }

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

  // Log de ambos os erros para debug
  const wrapperErrors = resultWithWrapper.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");
  const flatErrors = resultFlat.error.errors
    .map((err) => `${err.path.join(".")}: ${err.message}`)
    .join(", ");

  throw new Error(
    `Falha na validacao da API VRP:\nCom wrapper: ${wrapperErrors}\nFlat: ${flatErrors}`
  );
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
