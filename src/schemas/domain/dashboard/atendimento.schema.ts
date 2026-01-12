import { z } from "zod";

/**
 * Schema para atendimento/ocorrência
 */
export const atendimentoSchema = z.object({
  num: z.coerce.string(),
  codcli: z.coerce.string(),
  codfor: z.coerce.string(),
  nome: z.coerce.string(),
  data_oco: z.coerce.string(),
  atendente: z.coerce.string(),
  tipo_ate: z.coerce.string(),
  situacao: z.coerce.string(),
  status: z.coerce.string(),
  data_pro: z.coerce.string(),
  oco: z.coerce.string(),
  solucao: z.coerce.string(),
  usuario: z.coerce.string(),
  data: z.coerce.string(),
  hora: z.coerce.string(),
  empresa: z.coerce.string(),
  sr_recno: z.coerce.string(),
  hora_oco: z.coerce.string(),
  apelido: z.coerce.string(),
  atendente_enc: z.coerce.string(),
  user_diagnostico: z.coerce.string(),
  latitude: z.coerce.string().optional().nullable(),
  longitude: z.coerce.string().optional().nullable(),
  problema: z.string().nullable().optional(),
});

export type Atendimento = z.infer<typeof atendimentoSchema>;
