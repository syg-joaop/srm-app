import { useAuthStore } from "~/stores/auth";
import type { OcorrenciaFilters, PaginatedOcorrenciaResponse } from "../ocorrencias.types";
import type { Ref } from "vue";

export const useOcorrenciaService = () => {
  const api = useMainApi(true);
  const authStore = useAuthStore();

  const fetchOcorrencias = (
    page: Ref<number>,
    size: Ref<number>,
    filters: Ref<OcorrenciaFilters>,
  ) => {
    return useAsyncData<PaginatedOcorrenciaResponse>(
      "ocorrencias",
      async () => {
        const bodyParams: Record<string, unknown> = {
          page: page.value,
          size: size.value,
          ...filters.value,
        };

        return api("/sygecom/chameleon-mode/SRM_GET_OCORRENCIAS", {
          method: "POST",
          body: bodyParams,
        });
      },
      {
        immediate: authStore.isAuthenticated,
        lazy: true,
        watch: [page, filters],
      },
    );
  };

  return { fetchOcorrencias };
};
