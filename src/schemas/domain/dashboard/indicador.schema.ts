import { z } from "zod";

/**
 * Schema para item de indicador do dashboard
 */
export const indicadorItemSchema = z.object({
  count: z.union([z.string(), z.number()]).transform((val) => Number(val)),
  tipo: z.string(),
});

export type IndicadorItem = z.infer<typeof indicadorItemSchema>;
