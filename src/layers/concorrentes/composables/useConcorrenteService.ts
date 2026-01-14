import { createListService } from "~/composables/factories/createListService";
import { schemaPaginatedConcorrenteResponse } from "../schemas/concorrentes.schema";

import type { ConcorrenteFilters, PaginatedConcorrenteResponse } from "../schemas/concorrentes.schema";

const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_CONCORRENTES";

export const useConcorrenteService = () => {
  const { fetchList } = createListService<PaginatedConcorrenteResponse, ConcorrenteFilters>(ENDPOINT);
  return { fetchConcorrentes: fetchList };
};
