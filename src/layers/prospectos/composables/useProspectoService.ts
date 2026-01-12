import { z } from "zod";

import { prospectoResponseSchema, prospectoFiltersSchema } from "../schemas/prospectos.schema";

type ProspectoResponse = z.infer<typeof prospectoResponseSchema>;
type ProspectoFilters = z.infer<typeof prospectoFiltersSchema>;

const PROSPECTOS_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_PROSPECTO";

export const useProspectoService = () => {
  const fetchProspectos = useOfflineAsyncData<ProspectoResponse, ProspectoFilters>({
    key: "prospectos",
    endpoint: PROSPECTOS_LIST_ENDPOINT,
    buildBody: buildPagedListBody,
    homol: true,
    cacheTtl: 5 * 60 * 1000,
    schema: prospectoResponseSchema,
  });

  return { fetchProspectos };
};
