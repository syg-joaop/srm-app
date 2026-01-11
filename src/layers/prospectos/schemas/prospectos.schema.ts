import { z } from "zod";

import {
  schemaProspectoItem,
  schemaProspectoResponse,
} from "~/server/schemas/prospectos.schema";

export { schemaProspectoItem, schemaProspectoResponse };

export type Prospecto = z.infer<typeof schemaProspectoItem>;
export type ProspectoResponse = z.infer<typeof schemaProspectoResponse>;

export const schemaProspectoFilters = z
  .object({
    search: z.string().optional(),
    fantasia: z.string().optional(),
    cidade: z.string().optional(),
    status: z.string().optional(),
    sortBy: z.string().optional(),
  })
  .passthrough();

export type ProspectoFilters = z.infer<typeof schemaProspectoFilters>;

export const schemaProspectoMapItem = schemaProspectoItem
  .pick({
    prospecto: true,
    fanta: true,
    status: true,
    cidade: true,
    ultima_interacao: true,
    latitude: true,
    longitude: true,
    latlong: true,
  })
  .passthrough();

export type ProspectoMapItem = z.infer<typeof schemaProspectoMapItem>;
