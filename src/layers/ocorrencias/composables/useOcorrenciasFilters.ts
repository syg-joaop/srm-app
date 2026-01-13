import {
  FILTROS_PADRAO,
  SITUACAO_OPTIONS,
  STATUS_OPTIONS,
  createFilterResetMap,
  type OcorrenciaFiltersLocal,
} from "../constants/ocorrencia.constants";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

/**
 * Composable para gerenciar filtros de ocorrências
 *
 * Encapsula toda a lógica de filtros, badges e reset.
 */
export function useOcorrenciasFilters() {
  const search = ref("");
  const showFilters = ref(false);
  const filters = ref<OcorrenciaFiltersLocal>({ ...FILTROS_PADRAO });

  // Contagem de filtros ativos (exclui search que é separado)
  const totalFiltrosAtivos = computed(
    () =>
      Object.entries(filters.value).filter(
        ([key, value]) => value !== FILTROS_PADRAO[key as keyof typeof FILTROS_PADRAO],
      ).length,
  );

  const hasActiveFilters = computed(() => search.value || totalFiltrosAtivos.value > 0);

  // Gera badges para os filtros ativos
  const filterBadges = computed<FilterBadge[]>(() => {
    const badges: FilterBadge[] = [];

    if (search.value) {
      badges.push({ key: "search", label: "Busca", value: search.value });
    }
    if (filters.value.atendente) {
      badges.push({ key: "atendente", label: "Atendente", value: filters.value.atendente });
    }
    if (filters.value.situacao) {
      const situacaoOption = SITUACAO_OPTIONS.find((s) => s.value === filters.value.situacao);
      badges.push({
        key: "situacao",
        label: "Situação",
        value: situacaoOption?.label || filters.value.situacao,
      });
    }
    if (filters.value.status) {
      const statusOption = STATUS_OPTIONS.find((s) => s.value === filters.value.status);
      badges.push({
        key: "status",
        value: statusOption?.label || filters.value.status,
        variant: "primary",
      });
    }

    return badges;
  });

  // Mapa de reset usando objeto ao invés de switch
  const resetMap = createFilterResetMap(filters, search);

  const removeFilter = (key: string) => resetMap[key as keyof typeof resetMap]?.();

  const clearAllFilters = () => {
    search.value = "";
    Object.assign(filters.value, FILTROS_PADRAO);
  };

  // Computed para usar com o service
  const apiFilters = computed(() => ({
    search: search.value,
    atendente: filters.value.atendente,
    situacao: filters.value.situacao,
    formaAtendimento: filters.value.formaAtendimento,
    status: filters.value.status,
    ordenarPor: filters.value.ordenarPor,
  }));

  return {
    search,
    filters,
    showFilters,
    totalFiltrosAtivos,
    hasActiveFilters,
    filterBadges,
    apiFilters,
    removeFilter,
    clearAllFilters,
  };
}
