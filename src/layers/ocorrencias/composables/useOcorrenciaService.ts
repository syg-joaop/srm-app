import { z } from "zod";

import { ocorrenciaResponseSchema, ocorrenciaFiltersSchema } from "../schemas/ocorrencias.schema";
import { buildPagedBody } from "~/utils/pagination";

type OcorrenciaResponse = z.infer<typeof ocorrenciaResponseSchema>;
type OcorrenciaFilters = z.infer<typeof ocorrenciaFiltersSchema>;

const OCORRENCIAS_LIST_ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_OCORRENCIAS";

export const useOcorrenciaService = () => {
  const fetchOcorrencias = useOfflineAsyncData<OcorrenciaResponse, OcorrenciaFilters>({
    key: "ocorrencias",
    endpoint: OCORRENCIAS_LIST_ENDPOINT,
    buildBody: buildPagedBody,
    homol: true,
    cacheTtl: 2 * 60 * 1000,
    schema: ocorrenciaResponseSchema,
  });

  return { fetchOcorrencias };
};
