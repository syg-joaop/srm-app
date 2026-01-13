import { z } from "zod";

/**
 * Constantes para o módulo de Fornecedores
 *
 * Centraliza configurações de status, opções de filtros e valores padrão.
 */

// =============================================================================
// STATUS
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
// OPÇÕES DE FILTRO
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

export const VIEW_MODE_OPTIONS = [
  { label: "Lista", value: "list", icon: "List" },
  { label: "Mapa", value: "map", icon: "Map" },
] as const;

export type ViewMode = "list" | "map";

// =============================================================================
// VALORES PADRÃO
// =============================================================================

export const FILTROS_PADRAO = {
  fantasia: "",
  cidade: "",
  status: "todos",
  sortBy: "fornecedor",
} as const;

export const PAGINACAO_PADRAO = {
  page: 1,
  itemsPerPage: 50,
} as const;

// =============================================================================
// MAPEAMENTO DE CAMPOS (API -> UI)
// =============================================================================

/**
 * Mapeia os nomes abreviados da API para nomes legíveis na UI.
 * Use para documentação e tooltips.
 */
export const CAMPO_LABELS = {
  codfor: "Código do Fornecedor",
  fanta: "Nome Fantasia",
  ende: "Endereço",
  comp: "Complemento",
  uf: "Estado",
  tel3: "Telefone 3",
  oco2: "Observação 2",
  tf: "Tipo Fornecedor",
  latlong: "Possui Coordenadas",
  ultima_carga: "Última Carga",
} as const;

// =============================================================================
// SCHEMAS E TIPOS
// =============================================================================

export const fornecedorFiltersLocalSchema = z.object({
  fantasia: z.string(),
  cidade: z.string(),
  status: z.string(),
  sortBy: z.string(),
});

export type FornecedorFiltersLocal = z.infer<typeof fornecedorFiltersLocalSchema>;

export const fornecedorFilterKeySchema = z.enum(["search", "fantasia", "cidade", "status"]);

export type FornecedorFilterKey = z.infer<typeof fornecedorFilterKeySchema>;

// =============================================================================
// RESET DE FILTROS
// =============================================================================

/**
 * Cria um objeto com funções de reset para cada filtro.
 * Uso: FILTER_RESET_MAP[key]?.()
 */
export const createFilterResetMap = (
  filters: { value: FornecedorFiltersLocal },
  search: { value: string },
) => ({
  search: () => (search.value = ""),
  fantasia: () => (filters.value.fantasia = ""),
  cidade: () => (filters.value.cidade = ""),
  status: () => (filters.value.status = "todos"),
});
