// Re-exportar constantes compartilhadas
export {
  createFilterResetMap,
  FILTROS_PADRAO,
  type ParceiroFilterKey as FornecedorFilterKey,
  type ParceiroFiltersLocal as FornecedorFiltersLocal,
} from "~/shared/constants/parceiro.constants";
export { PAGINACAO_PADRAO } from "~/shared/constants/pagination.constants";
export { VIEW_MODE_OPTIONS, type ViewMode } from "~/shared/constants/ui.constants";

// Import direto para usar no CAMPO_LABELS
import { createCampoLabels } from "~/shared/constants/parceiro.constants";

// =============================================================================
// STATUS (ESPECÍFICO DE FORNECEDOR)
// =============================================================================

export const STATUS_FORNECEDOR = {
  ativo: { cor: "green", icone: "CheckCircle", label: "Ativo" },
  inativo: { cor: "red", icone: "XCircle", label: "Inativo" },
} as const;

export type StatusFornecedor = keyof typeof STATUS_FORNECEDOR;

export const getStatusCor = (status: string) =>
  STATUS_FORNECEDOR[status as StatusFornecedor]?.cor ?? "gray";

export const getStatusLabel = (status: string) =>
  STATUS_FORNECEDOR[status as StatusFornecedor]?.label ?? status;

// =============================================================================
// OPÇÕES DE FILTRO (ESPECÍFICAS DE FORNECEDOR)
// =============================================================================

export const STATUS_OPTIONS = [
  { label: "Todos", value: "todos" },
  { label: "Ativo", value: "ativo" },
  { label: "Inativo", value: "inativo" },
] as const;

export const ORDENACAO_OPTIONS = [
  { label: "Fornecedor", value: "fornecedor" },
  { label: "Cidade", value: "cidade" },
  { label: "Status", value: "status" },
  { label: "Sem carga +60 dias", value: "sem_carga" },
] as const;

// =============================================================================
// MAPEAMENTO DE CAMPOS (ESPECÍFICO DE FORNECEDOR)
// =============================================================================

/**
 * Mapeia os nomes abreviados da API para nomes legíveis na UI.
 * Use para documentação e tooltips.
 */
export const CAMPO_LABELS = createCampoLabels("Código do Fornecedor", "Tipo Fornecedor");
