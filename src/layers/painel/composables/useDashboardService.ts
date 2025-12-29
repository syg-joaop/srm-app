import { useAuthStore } from "~/stores/auth";
import type { DashboardApiResponse } from "./types/dashboard.types";
import { schemaDashboardApiResponse } from "../schemas/dashboard.schema";

type ApiDataWrapper<T> = { data: T };

interface DashboardFilters {
  data_inicial: string;
  data_final: string;
  data_inicial2: string;
  data_final2: string;
  categoriaFornecedor: string;
  filial: string;
  mes_grafico: string;
}

const DASHBOARD_INDICATORS_ENDPOINT = "/dashboard/indicadores";

const DASHBOARD_GRAPH_IDS = [
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
] as const;

const DASHBOARD_GRAPH_IDS_PARAM = JSON.stringify(DASHBOARD_GRAPH_IDS);

const unwrapApiData = <T>(response: T | ApiDataWrapper<T>): T => {
  if (typeof response === "object" && response !== null && "data" in response) {
    return (response as ApiDataWrapper<T>).data;
  }
  return response as T;
};

/**
 * Valida a resposta da API usando o schema Zod
 * Lança um erro detalhado se a validação falhar
 */
const validateDashboardResponse = (response: unknown): DashboardApiResponse => {
  const result = schemaDashboardApiResponse.safeParse(response);

  if (!result.success) {
    const errorMessage = result.error.errors
      .map((err) => `${err.path.join(".")}: ${err.message}`)
      .join(", ");
    throw new Error(`Falha na validação da API de Dashboard: ${errorMessage}`);
  }

  // Type assertion: o schema Zod garante que os dados estão corretos
  return result.data as DashboardApiResponse;
};

export const useDashboardService = () => {
  const api = useMainApi();
  const authStore = useAuthStore();

  const fetchDashboard = (filters: Ref<DashboardFilters> | DashboardFilters) => {
    const filtersRef = isRef(filters) ? filters : ref(filters);

    return useAsyncData<DashboardApiResponse>(
      "dashboard-main-data",
      async () => {
        const response = await api<ApiDataWrapper<DashboardApiResponse> | DashboardApiResponse>(
          DASHBOARD_INDICATORS_ENDPOINT,
          {
            method: "GET",
            query: {
              graficos: DASHBOARD_GRAPH_IDS_PARAM,
              ...filtersRef.value,
            },
          },
        );

        // Valida a resposta com o schema Zod
        const unwrappedResponse = unwrapApiData<DashboardApiResponse>(response);
        return validateDashboardResponse(unwrappedResponse);
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
