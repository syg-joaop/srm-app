import { useAuthStore } from "~/layers/login/stores/auth";
import type { FornecedorResponse } from "../types/fornecedores";

export const useFornecedorService = () => {
  const api = useMainApi(true);
  const authStore = useAuthStore();

  const fetchFornecedor = () => {
    return useAsyncData<FornecedorResponse>("fornecedor", () =>
      api("/sygecom/chameleon-mode/SRM_GET_FORNECEDORES", {
        method: "POST",
      }),
      {
        immediate: !!authStore.user?.token,
        lazy: true,
      }
    );
  };

  return {
    fetchFornecedor,
  };
};
