import { isRef, ref, type Ref } from "vue";
import { useAuthStore } from "~/stores/auth";
import type { DashboardApiResponse } from "../dashboard.types";

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
    "INDICADORES_DASHBOARD",
    "INDICADORES_DASHBOARD_COMPRADOR",
    "PROXIMOS_ATENDIMENTOS",
    "PROXIMOS_ATENDIMENTOS_NAO_ADMIN",
    "ATENDIMENTOS_VENCIDOS",
    "ATENDIMENTOS_VENCIDOS_NAO_ADMIN",
    "OCORRENCIAS_12_MESES",
    "OCORRENCIAS_12_MESES_NAO_ADMIN",
    "OCORRENCIAS_6_MESES",
    "OCORRENCIAS_6_MESES_NAO_ADMIN",
    "ANIVERSIANTES_FORNECEDORES",
    "ANIVERSIANTES_CONTATOS",
    "ATENDENTES",
    "META_DIARIA",
    "COMPRAS_MES",
    "COMPRAS_COMPRADOR",
    "PROD_MAIS_COMPRADOS_MES",
    "TOTAL_DESCONTOS",
  ];

  const fetchDashboard = (filters: Ref<DashboardFilters> | DashboardFilters) => {
    const filtersRef = isRef(filters) ? filters : ref(filters);

    return useAsyncData<DashboardApiResponse>(
      "dashboard-main-data",
      async () => {
        const response = await api("/dashboard/indicadores", {
          method: "GET",
          query: {
            graficos: JSON.stringify(idList),
            ...filtersRef.value,
          },
        });

        return (response as any)?.data ?? response;
      },
      {
        watch: [filtersRef],
        lazy: true,
        immediate: authStore.isAuthenticated,
      },
    );
  };

  return { fetchDashboard };
};
