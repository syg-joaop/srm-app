import { z } from "zod";

import { createListService } from "~/composables/factories/createListService";
import { ocorrenciaResponseSchema, ocorrenciaFiltersSchema } from "../schemas/ocorrencias.schema";

type OcorrenciaResponse = z.infer<typeof ocorrenciaResponseSchema>;
type OcorrenciaFilters = z.infer<typeof ocorrenciaFiltersSchema>;

const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_OCORRENCIAS";

export const useOcorrenciaService = () => {
  const { fetchList } = createListService<OcorrenciaResponse, OcorrenciaFilters>(ENDPOINT);
  return { fetchOcorrencias: fetchList };
};
