import type { DashboardApiResponse } from "../types/dashboard";

interface DashboardFilters {
  data_inicial: string;
  data_final: string;
  data_inicial2: string;
  data_final2: string;
  categoriaFornecedor: string;
  filial: string;
  mes_grafico: string;
}

export const useDashboardService = () => {
  const api = useMainApi();
  const authStore = useAuthStore();

  const idList = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
  ];

  /**
   * Hook para buscar dados do dashboard.
   * @param filters Refs reativas ou objeto estático com filtros
   */
  const fetchDashboard = (
    filters: Ref<DashboardFilters> | DashboardFilters
  ) => {
    const filtersRef = toRef(filters);

    return useAsyncData<DashboardApiResponse>(
      "dashboard-main-data",
      () =>
        api("/dashboard/indicadores", {
          method: "GET",
          query: {
            id_list: JSON.stringify(idList),
            ...filtersRef.value,
          },
        }),
      {
        // Recarrega automaticamente se os filtros mudarem
        watch: [filtersRef],
        // Não bloqueia a navegação inicial (lazy loading)
        lazy: true,
        // Garante que só execute se o usuário estiver logado
        immediate: !!authStore.user?.token,
      }
    );
  };

  return {
    fetchDashboard,
  };
};
