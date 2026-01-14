/**
 * Parceiro Constants - Constantes compartilhadas para Fornecedores e Prospectos
 *
 * Estas constantes são compartilhadas entre os módulos de fornecedores e prospectos
 * pois ambos possuem estrutura e comportamento similares.
 */

import { z } from "zod";

// =============================================================================
// FILTROS PADRÃO
// =============================================================================

export const FILTROS_PADRAO = {
  fantasia: "",
  cidade: "",
  status: "todos",
  sortBy: "fornecedor",
} as const;

export type FiltrosPadrao = typeof FILTROS_PADRAO;

// =============================================================================
// SCHEMA DE FILTROS LOCAL
// =============================================================================

export const parceiroFiltersLocalSchema = z.object({
  fantasia: z.string(),
  cidade: z.string(),
  status: z.string(),
  sortBy: z.string(),
});

export type ParceiroFiltersLocal = z.infer<typeof parceiroFiltersLocalSchema>;

export const parceiroFilterKeySchema = z.enum(["search", "fantasia", "cidade", "status"]);

export type ParceiroFilterKey = z.infer<typeof parceiroFilterKeySchema>;

// =============================================================================
// RESET DE FILTROS
// =============================================================================

/**
 * Cria um objeto com funções de reset para cada filtro de parceiro.
 * Uso: FILTER_RESET_MAP[key]?.()
 */
export const createFilterResetMap = (
  filters: { value: ParceiroFiltersLocal },
  search: { value: string },
) => ({
  search: () => (search.value = ""),
  fantasia: () => (filters.value.fantasia = ""),
  cidade: () => (filters.value.cidade = ""),
  status: () => (filters.value.status = "todos"),
});

// =============================================================================
// MAPEAMENTO DE CAMPOS (API -> UI)
// =============================================================================

/**
 * Mapeia os nomes abreviados da API para nomes legíveis na UI.
 * Use para documentação e tooltips.
 *
 * @param tipoLabel - "Código do Fornecedor" ou "Código do Prospecto"
 * @param tipoNome - "Tipo Fornecedor" ou "Tipo"
 */
export const createCampoLabels = (tipoLabel: string, tipoNome: string) => ({
  codfor: tipoLabel,
  fanta: "Nome Fantasia",
  ende: "Endereço",
  comp: "Complemento",
  uf: "Estado",
  tel3: "Telefone 3",
  oco2: "Observação 2",
  tf: tipoNome,
  latlong: "Possui Coordenadas",
  ultima_carga: "Última Carga",
}) as const;
