import { useAuthStore } from "~/stores/auth";
import type { ConcorrenteFilters, PaginatedConcorrenteResponse } from "../concorrentes.types";
import type { Ref } from "vue";

export const useConcorrenteService = () => {
  const api = useMainApi(true);
  const authStore = useAuthStore();

  const fetchConcorrentes = (
    page: Ref<number>,
    size: Ref<number>,
    filters: Ref<ConcorrenteFilters>,
  ) => {
    return useAsyncData<PaginatedConcorrenteResponse>(
      "concorrentes",
      async () => {
        const bodyParams: Record<string, unknown> = {
          page: page.value,
          size: size.value,
          ...filters.value,
        };

        return api("/sygecom/chameleon-mode/SRM_GET_CONCORRENTES", {
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

  return { fetchConcorrentes };
};
