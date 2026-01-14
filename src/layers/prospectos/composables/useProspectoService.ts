import { z } from "zod";

import { createListService } from "~/composables/factories/createListService";
import { prospectoResponseSchema, prospectoFiltersSchema } from "../schemas/prospectos.schema";

type ProspectoResponse = z.infer<typeof prospectoResponseSchema>;
type ProspectoFilters = z.infer<typeof prospectoFiltersSchema>;

const ENDPOINT = "/sygecom/chameleon-mode/SRM_GET_PROSPECTO";

export const useProspectoService = () => {
  const { fetchList } = createListService<ProspectoResponse, ProspectoFilters>(ENDPOINT);
  return { fetchProspectos: fetchList };
};
