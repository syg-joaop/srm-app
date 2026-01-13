import {
  FILTROS_PADRAO,
  STATUS_OPTIONS,
  createFilterResetMap,
  type ProspectoFiltersLocal,
} from "../constants/prospecto.constants";

import type { FilterBadge } from "~/components/ui/UiFilterBadges.vue";

/**
 * Composable para gerenciar filtros de prospectos
 *
 * Encapsula toda a lógica de filtros, badges e reset.
 */
export function useProspectosFilters() {
  const search = ref("");
  const showFilters = ref(false);
  const filters = ref<ProspectoFiltersLocal>({ ...FILTROS_PADRAO });

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
    if (filters.value.fantasia) {
      badges.push({ key: "fantasia", label: "Fantasia", value: filters.value.fantasia });
    }
    if (filters.value.cidade) {
      badges.push({ key: "cidade", label: "Cidade", value: filters.value.cidade });
    }
    if (filters.value.status !== "todos") {
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
    fantasia: filters.value.fantasia,
    cidade: filters.value.cidade,
    status: filters.value.status,
    sortBy: filters.value.sortBy,
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
