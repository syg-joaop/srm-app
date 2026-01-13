import { z } from "zod";

// =============================================================================
// STATUS
// =============================================================================

export const STATUS_ROTA = {
  pendente: {
    cor: "var(--color-text-muted)",
    label: "Pendente",
    activeClass: "bg-[var(--color-hover)] text-[var(--color-text)]",
  },
  em_andamento: {
    cor: "var(--color-primary)",
    label: "Em Andamento",
    activeClass:
      "bg-[var(--color-primary-soft)] text-[var(--color-primary)] border-[var(--color-primary-border)]",
  },
  completa: {
    cor: "var(--color-status-finalizado)",
    label: "Completa",
    activeClass: "bg-[var(--color-success-soft)] text-[var(--color-success)]",
  },
} as const;

export type StatusRota = keyof typeof STATUS_ROTA;

export const getStatusCor = (status: string) => STATUS_ROTA[status as StatusRota]?.cor ?? "gray";
export const getStatusLabel = (status: string) =>
  STATUS_ROTA[status as StatusRota]?.label ?? status;

// =============================================================================
// OPÇÕES DE FILTRO
// =============================================================================

export const STATUS_OPTIONS = [
  { label: "Todas", value: "" },
  { label: "Pendente", value: "pendente" },
  { label: "Em Andamento", value: "em_andamento" },
  { label: "Completa", value: "completa" },
] as const;

// =============================================================================
// VALORES PADRÃO
// =============================================================================

export const PAGINACAO_PADRAO = {
  page: 1,
  itemsPerPage: 10,
} as const;

// =============================================================================
// ORDENAÇÃO
// =============================================================================

export const sortFieldSchema = z.enum(["codigo", "progresso", "status"]);
export type SortField = z.infer<typeof sortFieldSchema>;

export const sortOrderSchema = z.enum(["asc", "desc"]);
export type SortOrder = z.infer<typeof sortOrderSchema>;

/**
 * Mapeamento para extrair valor de ordenação de uma rota.
 * Evita switch/case disperso no código.
 */
export const SORT_VALUE_EXTRACTORS = {
  codigo: (rota: { codigo?: number }) => rota.codigo ?? 0,
  progresso: (rota: { progresso?: { percentual_conclusao?: number } }) =>
    rota.progresso?.percentual_conclusao ?? 0,
  status: (rota: { status?: string }) => rota.status ?? "",
} as const;
