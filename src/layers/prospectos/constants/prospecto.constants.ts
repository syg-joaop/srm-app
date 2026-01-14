// Import direto para usar no CAMPO_LABELS
import { createCampoLabels } from "~/shared/constants/parceiro.constants";

// Re-exportar constantes compartilhadas
export { PAGINACAO_PADRAO } from "~/shared/constants/pagination.constants";
export {
  createFilterResetMap,
  FILTROS_PADRAO,
  type ParceiroFilterKey as ProspectoFilterKey,
  type ParceiroFiltersLocal as ProspectoFiltersLocal,
} from "~/shared/constants/parceiro.constants";
export { VIEW_MODE_OPTIONS, type ViewMode } from "~/shared/constants/ui.constants";

// =============================================================================
// STATUS (ESPECÍFICO DE PROSPECTO)
// =============================================================================

export const STATUS_PROSPECTO = {
  ativo: { cor: "green", icone: "CheckCircle", label: "Ativo" },
  novo: { cor: "blue", icone: "UserPlus", label: "Novo" },
  inativo: { cor: "red", icone: "XCircle", label: "Inativo" },
} as const;

export type StatusProspecto = keyof typeof STATUS_PROSPECTO;

export const getStatusCor = (status: string) =>
  STATUS_PROSPECTO[status as StatusProspecto]?.cor ?? "gray";

export const getStatusLabel = (status: string) =>
  STATUS_PROSPECTO[status as StatusProspecto]?.label ?? status;

// =============================================================================
// OPÇÕES DE FILTRO (ESPECÍFICAS DE PROSPECTO)
// =============================================================================

export const STATUS_OPTIONS = [
  { label: "Todos", value: "todos" },
  { label: "Ativo", value: "ativo" },
  { label: "Novo", value: "novo" },
  { label: "Inativo", value: "inativo" },
] as const;

export const ORDENACAO_OPTIONS = [
  { label: "Fornecedor", value: "fornecedor" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Carga +60 dias", value: "sem_carga" },
] as const;

// =============================================================================
// MAPEAMENTO DE CAMPOS (ESPECÍFICO DE PROSPECTO)
// =============================================================================

/**
 * Mapeia os nomes abreviados da API para nomes legíveis na UI.
 */
export const CAMPO_LABELS = createCampoLabels("Código do Prospecto", "Tipo");

// =============================================================================
// CONFIG DO MAPA (ESPECÍFICO DE PROSPECTO)
// =============================================================================

export const MAP_STATUS_CONFIG = {
  ativo: { color: "#22c55e", label: "Ativo" },
  inativo: { color: "#ef4444", label: "Inativo" },
  novo: { color: "#3b82f6", label: "Novo" },
} as const;
