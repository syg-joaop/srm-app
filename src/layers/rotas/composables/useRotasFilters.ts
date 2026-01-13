import { STATUS_OPTIONS, STATUS_ROTA } from "../constants/rota.constants";

import type { RotaFilters } from "../schemas/rotas.schema";

/**
 * Composable para gerenciar filtros de rotas
 *
 * Encapsula lógica de data, status e geração de filtros para API.
 */
export function useRotasFilters(itemsPerPage: number) {
  const dataInicio = ref<Date | null>(null);
  const dataFim = ref<Date | null>(null);
  const status = ref<string | null>(null);
  const currentPage = ref(1);

  const hasActiveFilters = computed(() => dataInicio.value || dataFim.value || status.value);

  // Para usar no UiSelect
  const statusSelect = computed({
    get: () => status.value,
    set: (value: string | null) => {
      status.value = value;
    },
  });

  const statusOptions = computed(() =>
    STATUS_OPTIONS.map((opt) => ({ label: opt.label, value: opt.value })),
  );

  /**
   * Handler para mudança de período
   */
  const handleDateChange = (value: { start: Date | null; end: Date | null }) => {
    dataInicio.value = value.start;
    dataFim.value = value.end;
    currentPage.value = 1;
  };

  /**
   * Handler para mudança de status (toggle)
   */
  const handleStatusChange = (value: string | number | null | undefined) => {
    const statusValue =
      value === "" || value === null || value === undefined ? null : String(value);

    // Toggle: se selecionar o mesmo valor, limpa
    status.value = status.value === statusValue ? null : statusValue;
    currentPage.value = 1;
  };

  /**
   * Limpa todos os filtros
   */
  const clearAllFilters = () => {
    dataInicio.value = null;
    dataFim.value = null;
    status.value = null;
    currentPage.value = 1;
  };

  /**
   * Gera objeto de filtros para a API
   */
  const apiFilters = computed<RotaFilters>(() => {
    const filters: RotaFilters = {
      page: currentPage.value,
      itens: itemsPerPage,
    };

    if (dataInicio.value) {
      filters.data_inicio = dataInicio.value.toISOString().split("T")[0];
    }
    if (dataFim.value) {
      filters.data_fim = dataFim.value.toISOString().split("T")[0];
    }
    if (status.value) {
      filters.status = status.value;
    }

    return filters;
  });

  /**
   * Label do status ativo (para exibir no badge)
   */
  const statusLabel = computed(() => {
    if (!status.value) return null;
    return STATUS_ROTA[status.value as keyof typeof STATUS_ROTA]?.label ?? status.value;
  });

  return {
    dataInicio,
    dataFim,
    status,
    statusSelect,
    statusOptions,
    currentPage,
    hasActiveFilters,
    apiFilters,
    statusLabel,
    handleDateChange,
    handleStatusChange,
    clearAllFilters,
  };
}
