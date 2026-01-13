import { z } from "zod";

/**
 * Schema para Agendamento
 */
export const agendamentoSchema = z
  .object({
    id: z.string().optional(),
    tipo: z.string().optional(),
    titulo: z.string().optional(),
    assunto: z.string().optional(),
    data: z.string().optional(),
    data_agend: z.string().optional(),
    hora: z.string().optional(),
    situacao: z.string().optional(),
    confirmado: z.boolean().or(z.string()).optional(),
    observacao: z.string().optional(),
  })
  .passthrough();

export type Agendamento = z.infer<typeof agendamentoSchema>;
