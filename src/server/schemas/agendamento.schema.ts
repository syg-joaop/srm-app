import { z } from "zod";

/**
 * Schema Zod para Agendamento
 * Baseado em campos usados no config.ts
 */
export const schemaAgendamento = z
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

/**
 * Tipos inferidos
 */
export type Agendamento = z.infer<typeof schemaAgendamento>;

/**
 * Agendamento com campos adicionais para UI
 * Mantido para compatibilidade com componentes existentes
 */
export interface AgendamentoDetail extends Agendamento {
  label: string;
  value: string;
}
