import { schemaProspectoResponse } from "../schemas/prospectos.schema";

import type { ProspectoFilters, ProspectoResponse } from "../schemas/prospectos.schema";

const PROSPECTOS_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_PROSPECTO";

export const useProspectoService = () => {
  const fetchProspectos = useOfflineAsyncData<ProspectoResponse, ProspectoFilters>({
    key: "prospectos",
    endpoint: PROSPECTOS_LIST_ENDPOINT,
    buildBody: buildPagedListBody,
    homol: true,
    cacheTtl: 5 * 60 * 1000,
    schema: schemaProspectoResponse,
  });

  return { fetchProspectos };
};
