import type { ConcorrenteFilters, PaginatedConcorrenteResponse } from "../concorrentes.types";

const CONCORRENTES_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_CONCORRENTES";

export const useConcorrenteService = () => {
  const fetchConcorrentes = useOfflineAsyncData<
    PaginatedConcorrenteResponse,
    ConcorrenteFilters
  >({
    key: "concorrentes",
    endpoint: CONCORRENTES_LIST_ENDPOINT,
    buildBody: buildPagedBody,
    homol: true,
    cacheTtl: 10 * 60 * 1000,
  });

  return { fetchConcorrentes };
};
