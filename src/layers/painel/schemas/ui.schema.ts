import { z } from "zod";

/**
 * Schemas de UI para o Dashboard
 *
 * Estes schemas definem as estruturas de dados usadas
 * para renderização de componentes UI do dashboard.
 */

/**
 * Schema para item de resumo (métricas de compras)
 */
export const summaryItemSchema = z.object({
  label: z.string(),
  value: z.union([z.string(), z.number()]),
});

export type SummaryItem = z.infer<typeof summaryItemSchema>;

/**
 * Schema para item de stats de compras
 */
export const comprasMesItemSchema = z.object({
  total: z.coerce.string(),
  liquido: z.coerce.string(),
  preco_medio: z.coerce.string(),
  desconto: z.coerce.string(),
  media_diaria: z.coerce.string().optional(),
  preco_sem_icms: z.coerce.string().optional(),
  icms: z.coerce.string().optional(),
  totaldiasuteis: z.coerce.string().optional(),
  totalsabados: z.coerce.string().optional(),
});

export type ComprasMesItem = z.infer<typeof comprasMesItemSchema>;

/**
 * Schema para dados de gráficos
 */
export const chartDataSchema = z.object({
  ocorrenciasPie: z.array(
    z.object({
      value: z.number(),
      name: z.string(),
      itemStyle: z
        .object({
          color: z.string(),
        })
        .optional(),
    }),
  ),
  ocorrenciasLine: z.object({
    months: z.array(z.string()),
    values: z.array(z.number()),
  }),
  metaDiaria: z.object({
    days: z.array(z.string()),
    values: z.array(z.number()),
  }),
  descontos: z.object({
    months: z.array(z.string()),
    values: z.array(z.number()),
  }),
  produtosBar: z.object({
    names: z.array(z.string()),
    current: z.array(z.number()),
    previous: z.array(z.number()),
  }),
});

export type ChartData = z.infer<typeof chartDataSchema>;
