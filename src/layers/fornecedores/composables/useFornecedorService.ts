import { useAuthStore } from "~/stores/auth";
import type { FornecedorResponse, FornecedorFilters } from "../fornecedores.types";
import type { Ref } from "vue";

export const useFornecedorService = () => {
  const api = useMainApi(true);
  const authStore = useAuthStore();

  const fetchFornecedor = (
    page: Ref<number>,
    size: Ref<number>,
    filters: Ref<FornecedorFilters>,
  ) => {
    return useAsyncData<FornecedorResponse>(
      "fornecedores",
      async () => {
        const bodyParams: any = {
          page: page.value,
          size: size.value,
        };

        if (filters.value?.search) bodyParams.search = filters.value.search;
        if (filters.value?.fantasia) bodyParams.fantasia = filters.value.fantasia;
        if (filters.value?.cidade) bodyParams.cidade = filters.value.cidade;
        if (filters.value?.status && filters.value.status !== "todos") {
          bodyParams.status = filters.value.status;
        }
        if (filters.value?.sortBy) bodyParams.sortBy = filters.value.sortBy;

        return api("/sygecom/chameleon-mode/SRM_GET_FORNECEDORES", {
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

  return {
    fetchFornecedor,
  };
};
