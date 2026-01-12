import { z } from "zod";

import {
  fornecedorResponseSchema,
  fornecedorSchema,
  fornecedorFiltersSchema,
} from "../schemas/fornecedores.schema";

type Fornecedor = z.infer<typeof fornecedorSchema>;
type FornecedorResponse = z.infer<typeof fornecedorResponseSchema>;
type FornecedorFilters = z.infer<typeof fornecedorFiltersSchema>;

const FORNECEDORES_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES";
const FORNECEDORES_CREATE_ENDPOINT = "/sygecom/chameleon-mode/SRM_POST_FORNECEDOR";

export const useFornecedorService = () => {
  const fetchFornecedor = useOfflineAsyncData<FornecedorResponse, FornecedorFilters>({
    key: "fornecedores",
    endpoint: FORNECEDORES_LIST_ENDPOINT,
    buildBody: buildPagedListBody,
    homol: true,
    cacheTtl: 5 * 60 * 1000,
    schema: fornecedorResponseSchema,
  });

  const createFornecedor = useOfflineMutation<Partial<Fornecedor>>({
    entity: "fornecedor",
    endpoint: FORNECEDORES_CREATE_ENDPOINT,
    homol: true,
    cacheKeyPrefix: "fornecedores:",
  });

  return { fetchFornecedor, createFornecedor };
};
