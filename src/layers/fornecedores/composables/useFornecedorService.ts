import { z } from "zod";
import { createListService } from "~/composables/factories/createListService";
import { fornecedorFiltersSchema, fornecedorResponseSchema } from "../schemas/fornecedores.schema";

type FornecedorResponse = z.infer<typeof fornecedorResponseSchema>;
type FornecedorFilters = z.infer<typeof fornecedorFiltersSchema>;

const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_FORNECEDORES";

export const useFornecedorService = () => {
  const { fetchList } = createListService<FornecedorResponse, FornecedorFilters>(ENDPOINT);
  return { fetchFornecedor: fetchList };
};
