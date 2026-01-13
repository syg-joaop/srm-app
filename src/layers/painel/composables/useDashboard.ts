import { storeToRefs } from "pinia";

import { useApiConfig } from "~/composables/config";
import { useHttpClient } from "~/composables/http";
import { useAuthStore } from "~/stores/auth";

import { DASHBOARD_GRAPH_IDS } from "../constants/painel.constants";
import {
  dashboardApiResponseSchema,
  dashboardFiltersSchema,
  type DashboardFilters,
} from "../schemas/dashboard.schema";
import { useDashboardStore } from "../stores/dashboard";

/**
 * Composable principal do Dashboard
 *
 * Gerencia toda a lógica de busca e estado do dashboard.
 *
 * @example
 * ```ts
 * const { fetchDashboard, isLoading, error, stats, chartData } = useDashboard()
 *
 * const filters = ref({
 *   data_inicial: '2024-01-01',
 *   data_final: '2024-12-31',
 *   categoriaFornecedor: '12',
 *   filial: 'TODAS',
 *   mes_grafico: 'atual'
 * })
 *
 * await fetchDashboard(filters.value)
 * ```
 */
export const useDashboard = () => {
  const dashboardStore = useDashboardStore();
  const authStore = useAuthStore();
  const { getApiUrl } = useApiConfig();

  const isLoading = ref(false);
  const error = ref<Error | null>(null);

  /**
   * Busca dados do dashboard e atualiza a store
   *
   * @param filters - Filtros de busca
   */
  const fetchDashboard = async (filters: DashboardFilters) => {
    // Só busca se estiver autenticado
    if (!authStore.isAuthenticated) {
      dashboardStore.setDashboardData(null);
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      // Valida filtros
      const validFilters = dashboardFiltersSchema.parse(filters);

      // Monta query string
      const queryParams = new URLSearchParams({
        graficos: JSON.stringify(DASHBOARD_GRAPH_IDS),
        ...validFilters,
      });

      // Busca dados com validação automática
      const baseClient = useHttpClient(getApiUrl());
      const response = await baseClient.get<unknown>(
        `/dashboard/indicadores?${queryParams.toString()}`,
      );

      // Valida resposta completa (com envelope)
      const validatedResponse = dashboardApiResponseSchema.parse(response);

      // Extrai os dados do envelope e atualiza store
      dashboardStore.setDashboardData(validatedResponse.data);
    } catch (err) {
      error.value = err instanceof Error ? err : new Error("Erro ao buscar dashboard");
      console.error("[useDashboard] Erro ao buscar dados:", err);

      // Limpa store em caso de erro
      dashboardStore.setDashboardData(null);
    } finally {
      isLoading.value = false;
    }
  };

  // Expõe dados da store
  const {
    stats,
    comprasMes,
    comprasMesAnterior,
    compradorItems,
    produtosItems,
    aniversariantesItems,
    atendentesItems,
    chartData,
    atendimentosVencidos,
    isOcorrenciasPieEmpty,
    isOcorrenciasLineEmpty,
    isMetaDiariaEmpty,
    isDescontosEmpty,
    isProdutosBarEmpty,
  } = storeToRefs(dashboardStore);

  return {
    fetchDashboard,
    isLoading: readonly(isLoading),
    error: readonly(error),
    // Dados da store
    stats,
    comprasMes,
    comprasMesAnterior,
    compradorItems,
    produtosItems,
    aniversariantesItems,
    atendentesItems,
    chartData,
    atendimentosVencidos,
    isOcorrenciasPieEmpty,
    isOcorrenciasLineEmpty,
    isMetaDiariaEmpty,
    isDescontosEmpty,
    isProdutosBarEmpty,
  };
};
