import { z } from "zod";

/**
 * Schema para meta diária
 */
export const metaDiariaSchema = z.object({
  data: z.string(),
  peso: z.coerce.string(),
});

export type MetaDiaria = z.infer<typeof metaDiariaSchema>;

/**
 * Schema para compras do mês
 */
export const comprasMesSchema = z.object({
  total: z.coerce.string(),
  liquido: z.coerce.string(),
  preco_medio: z.coerce.string(),
  desconto: z.coerce.string(),
  media_diaria: z.coerce.string(),
  preco_sem_icms: z.coerce.string(),
  icms: z.coerce.string(),
  totaldiasuteis: z.coerce.string(),
  totalsabados: z.coerce.string(),
});

export type ComprasMes = z.infer<typeof comprasMesSchema>;

/**
 * Schema para performance de comprador
 */
export const compradorPerformanceSchema = z.object({
  nome: z.string().nullable(),
  atual: z.coerce.string(),
  ant: z.coerce.string(),
});

export type CompradorPerformance = z.infer<typeof compradorPerformanceSchema>;

/**
 * Schema para produto mais comprado
 */
export const produtoMaisCompradoSchema = z.object({
  produto: z.string().nullable(),
  mes_atual: z.coerce.string(),
  mes_anterior: z.coerce.string(),
});

export type ProdutoMaisComprado = z.infer<typeof produtoMaisCompradoSchema>;

/**
 * Schema para desconto mensal
 */
export const descontoMensalSchema = z.object({
  mes: z.string(),
  desconto: z.coerce.number(),
});

export type DescontoMensal = z.infer<typeof descontoMensalSchema>;
