import { z } from "zod";

// =============================================================================
// STATUS
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
// OPÇÕES DE FILTRO
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
 */
export const CAMPO_LABELS = {
  codfor: "Código do Prospecto",
  fanta: "Nome Fantasia",
  ende: "Endereço",
  comp: "Complemento",
  uf: "Estado",
  tel3: "Telefone 3",
  oco2: "Observação 2",
  tf: "Tipo",
  latlong: "Possui Coordenadas",
  ultima_carga: "Última Carga",
} as const;

// =============================================================================
// SCHEMAS E TIPOS
// =============================================================================

export const prospectoFiltersLocalSchema = z.object({
  fantasia: z.string(),
  cidade: z.string(),
  status: z.string(),
  sortBy: z.string(),
});

export type ProspectoFiltersLocal = z.infer<typeof prospectoFiltersLocalSchema>;

export const prospectoFilterKeySchema = z.enum(["search", "fantasia", "cidade", "status"]);

export type ProspectoFilterKey = z.infer<typeof prospectoFilterKeySchema>;

// =============================================================================
// RESET DE FILTROS
// =============================================================================

/**
 * Cria um objeto com funções de reset para cada filtro.
 */
export const createFilterResetMap = (
  filters: { value: ProspectoFiltersLocal },
  search: { value: string },
) => ({
  search: () => (search.value = ""),
  fantasia: () => (filters.value.fantasia = ""),
  cidade: () => (filters.value.cidade = ""),
  status: () => (filters.value.status = "todos"),
});

// =============================================================================
// CONFIG DO MAPA
// =============================================================================

export const MAP_STATUS_CONFIG = {
  ativo: { color: "#22c55e", label: "Ativo" },
  inativo: { color: "#ef4444", label: "Inativo" },
  novo: { color: "#3b82f6", label: "Novo" },
} as const;
