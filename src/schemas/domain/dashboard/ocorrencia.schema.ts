import { z } from "zod";

/**
 * Schema para dados de ocorrências dos últimos 12 meses
 */
export const ocorrencia12MesesSchema = z.object({
  atendimento_geral: z.coerce.string(),
  atendimento_periodo: z.coerce.string(),
  atendimento_ok: z.coerce.string(),
  atendimento_acompanhamento: z.coerce.string(),
  atendimento_pendente: z.coerce.string(),
  atendimento_vencido: z.coerce.string(),
});

export type Ocorrencia12Meses = z.infer<typeof ocorrencia12MesesSchema>;

/**
 * Schema para dados de ocorrências dos últimos 6 meses
 */
export const ocorrencia6MesesSchema = z.object({
  count: z.coerce.number(),
  data_inicial: z.string(),
  data_final: z.string(),
  mes_ano: z.string(),
  date_part: z.number(),
});

export type Ocorrencia6Meses = z.infer<typeof ocorrencia6MesesSchema>;
