import { z } from "zod";

/**
 * Schema para performance de atendente
 */
export const atendentePerformanceSchema = z.object({
  setor: z.coerce.string(),
  nomefun: z.coerce.string(),
  usuario: z.coerce.string(),
  sr_recno: z.coerce.string(),
  email: z.boolean(),
  iduser: z.coerce.string(),
  codven: z.coerce.string(),
  codcom: z.coerce.string(),
  codcla: z.coerce.string(),
  codcatfor: z.coerce.string(),
  atendimento_geral: z.coerce.string(),
  atendimento_periodo: z.coerce.string(),
  atendimento_ok: z.coerce.string(),
  atendimento_acompanhamento: z.coerce.string(),
  atendimento_pendente: z.coerce.string(),
  atendimento_vencido: z.coerce.string(),
});

export type AtendentePerformance = z.infer<typeof atendentePerformanceSchema>;
